import { createHash } from 'node:crypto';
import type { IncomingMessage, Server as HttpServer } from 'node:http';
import type { Socket } from 'node:net';
import { parseCommand, type OnlineCommand } from './protocol.js';
import { RoomRegistry } from './rooms.js';
import type { OnlineConfig } from './config.js';

function acceptKey(key: string) { return createHash('sha1').update(`${key}258EAFA5-E914-47DA-95CA-C5AB0DC85B11`).digest('base64'); }
function frame(payload: string) { const body = Buffer.from(payload); const head = body.length < 126 ? Buffer.from([0x81, body.length]) : body.length < 65536 ? Buffer.from([0x81, 126, body.length >> 8, body.length & 255]) : Buffer.from([0x81, 127, 0, 0, 0, 0, body.length >>> 24, body.length >>> 16, body.length >>> 8, body.length & 255]); return Buffer.concat([head, body]); }
function unframe(buffer: Buffer) { if (buffer.length < 2) return; const masked = Boolean(buffer[1] & 0x80); let length = buffer[1] & 127; let offset = 2; if (length === 126) { if (buffer.length < 4) return; length = buffer.readUInt16BE(2); offset = 4; } else if (length === 127) { if (buffer.length < 10 || buffer.readUInt32BE(2) !== 0) return; length = buffer.readUInt32BE(6); offset = 10; } if (!masked || buffer.length < offset + 4 + length) return; const mask = buffer.subarray(offset, offset + 4); const data = buffer.subarray(offset + 4, offset + 4 + length); const output = Buffer.alloc(length); for (let index = 0; index < length; index += 1) output[index] = data[index] ^ mask[index % 4]; return output.toString('utf8'); }

export function attachWebSocket(server: HttpServer, registry: RoomRegistry, config: OnlineConfig) {
  const onUpgrade = (request: IncomingMessage, socket: Socket) => {
    const origin = request.headers.origin;
    if (origin && !config.allowedOrigins.includes(origin)) { socket.write('HTTP/1.1 403 Forbidden\r\n\r\n'); socket.destroy(); return; }
    const key = request.headers['sec-websocket-key']; if (typeof key !== 'string') { socket.destroy(); return; }
    socket.write(`HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ${acceptKey(key)}\r\n\r\n`);
    let buffer = Buffer.alloc(0); let roomCode: string | undefined; let participantCredential: string | undefined; let windowStarted = Date.now(); let count = 0;
    socket.on('data', (chunk: Buffer) => { buffer = Buffer.concat([buffer, chunk]); if (buffer.length > config.maxMessageBytes + 32) { socket.write(frame(JSON.stringify({ accepted: false, error: { code: 'PAYLOAD_TOO_LARGE', message: 'Mensaje demasiado grande.', recoverable: true } }))); socket.end(); return; } const text = unframe(buffer); if (!text) return; buffer = Buffer.alloc(0); if (Date.now() - windowStarted >= 1000) { windowStarted = Date.now(); count = 0; } if (++count > config.messagesPerSecond) { socket.write(frame(JSON.stringify({ accepted: false, error: { code: 'RATE_LIMITED', message: 'Demasiados mensajes.', recoverable: true } }))); return; } let parsed: unknown; try { parsed = JSON.parse(text); } catch { socket.write(frame(JSON.stringify({ accepted: false, error: { code: 'INVALID_MESSAGE', message: 'JSON inválido.', recoverable: true } }))); return; } const command = parseCommand(parsed); if ('code' in command) { socket.write(frame(JSON.stringify({ accepted: false, error: command }))); return; } const value = command as OnlineCommand;
      if (value.type === 'create') { const mode = value.payload.mode; if (mode !== 'duel' && mode !== 'race') { socket.write(frame(JSON.stringify({ accepted: false, error: { code: 'INVALID_MESSAGE', message: 'Modalidad inválida.', recoverable: true } }))); return; } const room = registry.create(mode); roomCode = room.code; const response = room.handle({ ...value, type: 'join', payload: { ...value.payload, roomCode } }, undefined); participantCredential = response.credential; socket.write(frame(JSON.stringify({ ...response, roomCode }))); return; }
      const suppliedCredential = value.type === 'reconnect' ? value.payload.credential : participantCredential; const room = roomCode ? registry.get(roomCode) : (value.payload.roomCode ? registry.get(value.payload.roomCode) : undefined) ?? (value.type === 'reconnect' ? registry.findByCredential(suppliedCredential) : undefined); if (!room) { socket.write(frame(JSON.stringify({ accepted: false, error: { code: 'ROOM_NOT_FOUND', message: 'Sala no disponible.', recoverable: true } }))); return; } if (value.type === 'join') roomCode = value.payload.roomCode; const response = room.handle(value, suppliedCredential); if (response.credential) participantCredential = response.credential; if (value.type === 'reconnect' && response.accepted) { participantCredential = suppliedCredential; roomCode = response.snapshot?.room.code ?? roomCode; } socket.write(frame(JSON.stringify(response)));
    });
    socket.on('error', () => socket.destroy());
    socket.on('close', () => { if (roomCode && participantCredential) registry.get(roomCode)?.disconnect(participantCredential); });
  };
  server.on('upgrade', onUpgrade);
  return () => server.off('upgrade', onUpgrade);
}
