export type OnlineClientState = 'connecting' | 'connected' | 'reconnecting' | 'closed' | 'rejected';
export interface OnlineMessage { protocolVersion: 'v1'; commandId: string; accepted: boolean; stateVersion?: number; roomCode?: string; credential?: string; snapshot?: unknown; error?: { code: string; message: string; recoverable: boolean }; }
export class OnlineClient {
  state: OnlineClientState = 'closed'; private socket: WebSocket | undefined; private sequence = 0;
  constructor(private readonly url: string, private readonly onMessage: (message: OnlineMessage) => void, private readonly onState: (state: OnlineClientState) => void = () => {}) {}
  connect() { this.state = 'connecting'; this.onState(this.state); this.socket = new WebSocket(this.url); this.socket.onopen = () => { this.state = 'connected'; this.onState(this.state); }; this.socket.onmessage = (event) => this.onMessage(JSON.parse(event.data) as OnlineMessage); this.socket.onclose = () => { this.state = 'closed'; this.onState(this.state); }; this.socket.onerror = () => { this.state = 'rejected'; this.onState(this.state); }; }
  command(type: string, payload: Record<string, unknown> = {}) { if (!this.socket || this.socket.readyState !== WebSocket.OPEN) throw new Error('La conexión no está lista.'); const commandId = `web-${++this.sequence}`; this.socket.send(JSON.stringify({ protocolVersion: 'v1', commandId, idempotencyKey: commandId, type, payload })); return commandId; }
  close() { this.socket?.close(1000, 'client-close'); }
}
