export interface OnlineConfig {
  allowedOrigins: readonly string[];
  maxMessageBytes: number;
  messagesPerSecond: number;
  roomTtlMs: number;
  maxParticipants: 2;
  port: number;
  raceDurationSeconds: number;
  disconnectGraceMs: number;
}

export const DEFAULT_ONLINE_CONFIG: OnlineConfig = {
  allowedOrigins: ['http://127.0.0.1:4200', 'http://localhost:4200'],
  maxMessageBytes: 16 * 1024,
  messagesPerSecond: 20,
  roomTtlMs: 15 * 60 * 1000,
  maxParticipants: 2,
  port: 0,
  raceDurationSeconds: 180,
  disconnectGraceMs: 60 * 1000,
};

function positive(value: number, fallback: number): number {
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : fallback;
}

export function readOnlineConfig(env: NodeJS.ProcessEnv = process.env): OnlineConfig {
  const origins = env.ALLOWED_ORIGINS?.split(',').map((origin) => origin.trim()).filter(Boolean);
  return {
    ...DEFAULT_ONLINE_CONFIG,
    allowedOrigins: origins?.length ? origins : DEFAULT_ONLINE_CONFIG.allowedOrigins,
    maxMessageBytes: positive(Number(env.MAX_MESSAGE_BYTES), DEFAULT_ONLINE_CONFIG.maxMessageBytes),
    messagesPerSecond: positive(Number(env.MESSAGES_PER_SECOND), DEFAULT_ONLINE_CONFIG.messagesPerSecond),
    roomTtlMs: positive(Number(env.ROOM_TTL_MS), DEFAULT_ONLINE_CONFIG.roomTtlMs),
    port: Number.isInteger(Number(env.PORT)) && Number(env.PORT) >= 0 ? Number(env.PORT) : 0,
    raceDurationSeconds: positive(Number(env.RACE_DURATION_SECONDS), DEFAULT_ONLINE_CONFIG.raceDurationSeconds),
    disconnectGraceMs: positive(Number(env.DISCONNECT_GRACE_MS), DEFAULT_ONLINE_CONFIG.disconnectGraceMs),
    maxParticipants: 2,
  };
}
