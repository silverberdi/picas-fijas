import { randomBytes } from 'node:crypto';
import type { OnlineMode, PublicRules } from './protocol.js';

export type ReservationState = 'queued' | 'offered' | 'cancelled' | 'matched';
export type OfferState = 'offered' | 'accepted_by_one' | 'confirmed' | 'expired' | 'cancelled' | 'entered_human';
export interface PublicReservation { id: string; participant: string; mode: OnlineMode; rules: PublicRules; key: string; sequence: number; state: ReservationState; createdAt: number; }
export interface PublicRoom { id: string; mode: OnlineMode; rules: PublicRules; state: 'queued' | 'offered'; }
export interface PublicOffer { id: string; reservationIds: readonly [string, string]; state: OfferState; createdAt: number; deadline: number; accepted: readonly string[]; humanRoomId?: string; }
export interface PublicTransition { offer: PublicOffer; reservationIds: readonly [string, string]; humanRoomId?: string; }

const modes = new Set<OnlineMode>(['duel', 'race']);
const reservationToken = () => `pub_${randomBytes(12).toString('base64url')}`;
const canonicalRules = (rules: PublicRules) => `${rules.length}:${rules.repeats ? 1 : 0}:${rules.maxAttempts ?? 'none'}:${rules.timeSeconds ?? 'none'}`;
const validRules = (rules: PublicRules) => Number.isInteger(rules.length) && rules.length >= 3 && rules.length <= 6 && typeof rules.repeats === 'boolean' && (rules.maxAttempts === null || (Number.isInteger(rules.maxAttempts) && rules.maxAttempts > 0)) && (rules.timeSeconds === null || (Number.isInteger(rules.timeSeconds) && rules.timeSeconds > 0));

export function publicRulesKey(mode: OnlineMode, rules: PublicRules) { return `${mode}|${canonicalRules(rules)}`; }
export function validatePublicReservation(input: unknown): input is { mode: OnlineMode; rules: PublicRules } {
  if (!input || typeof input !== 'object') return false;
  const value = input as { mode?: OnlineMode; rules?: PublicRules };
  return modes.has(value.mode as OnlineMode) && Boolean(value.rules) && validRules(value.rules!);
}

export class PublicMatchRegistry {
  private sequence = 0;
  private readonly reservations = new Map<string, PublicReservation>();
  private readonly participantReservations = new Map<string, string>();
  private readonly offers = new Map<string, PublicOffer>();
  private readonly idempotent = new Map<string, unknown>();
  private readonly humanRooms = new Set<string>();
  constructor(private readonly offerTtlMs = 20_000, private readonly now: () => number = () => Date.now()) {}

  reserve(participant: string, mode: OnlineMode, rules: PublicRules, idempotencyKey: string, at = this.now()): PublicReservation {
    const prior = this.idempotent.get(`reserve:${participant}:${idempotencyKey}`) as PublicReservation | undefined;
    if (prior) return prior;
    if (!modes.has(mode) || !validRules(rules)) throw new Error('La configuración pública no es válida.');
    const existingId = this.participantReservations.get(participant);
    if (existingId) return this.reservations.get(existingId)!;
    const reservation: PublicReservation = { id: reservationToken(), participant, mode, rules: { ...rules }, key: publicRulesKey(mode, rules), sequence: ++this.sequence, state: 'queued', createdAt: at };
    this.reservations.set(reservation.id, reservation); this.participantReservations.set(participant, reservation.id); this.idempotent.set(`reserve:${participant}:${idempotencyKey}`, reservation); return reservation;
  }

  list() { return [...this.reservations.values()].filter((item) => item.state === 'queued').sort((a, b) => a.sequence - b.sequence).map(({ id, mode, rules }) => ({ id, mode, rules: { ...rules }, state: 'queued' as const } satisfies PublicRoom)); }
  cancel(reservationId: string, participant: string, idempotencyKey: string) { const key = `cancel:${participant}:${idempotencyKey}`; const prior = this.idempotent.get(key) as PublicReservation | undefined; if (prior) return prior; const reservation = this.reservations.get(reservationId); if (!reservation || reservation.participant !== participant) return undefined; if (reservation.state === 'queued') reservation.state = 'cancelled'; this.participantReservations.delete(participant); this.idempotent.set(key, reservation); return reservation; }
  disconnect(participant: string, idempotencyKey = 'disconnect') { const reservationId = this.participantReservations.get(participant); return reservationId ? this.cancel(reservationId, participant, idempotencyKey) : undefined; }

  match(at = this.now()): PublicOffer | undefined {
    const queued = [...this.reservations.values()].filter((item) => item.state === 'queued').sort((a, b) => a.sequence - b.sequence);
    for (const first of queued) { const second = queued.find((candidate) => candidate.id !== first.id && candidate.key === first.key && candidate.sequence > first.sequence); if (!second) continue; first.state = 'offered'; second.state = 'offered'; const offer: PublicOffer = { id: reservationToken(), reservationIds: [first.id, second.id], state: 'offered', createdAt: at, deadline: at + this.offerTtlMs, accepted: [] }; this.offers.set(offer.id, offer); return offer; }
    return undefined;
  }
  getOffer(offerId: string, at = this.now()) { const offer = this.offers.get(offerId); if (offer && offer.state !== 'confirmed' && offer.state !== 'expired' && at >= offer.deadline) offer.state = 'expired'; return offer; }
  accept(offerId: string, participant: string, idempotencyKey: string, at = this.now()): PublicTransition | undefined {
    const key = `accept:${offerId}:${participant}:${idempotencyKey}`; const prior = this.idempotent.get(key) as PublicTransition | undefined; if (prior) return prior;
    const offer = this.getOffer(offerId, at); if (!offer || offer.state === 'expired' || offer.state === 'cancelled' || offer.state === 'entered_human') return undefined;
    const reservation = offer.reservationIds.map((id) => this.reservations.get(id)!); const allowed = reservation.some((item) => item.participant === participant); if (!allowed || at >= offer.deadline) { offer.state = 'expired'; return undefined; }
    if (!offer.accepted.includes(participant)) offer.accepted = [...offer.accepted, participant];
    if (offer.accepted.length === 1) offer.state = 'accepted_by_one';
    if (offer.accepted.length === 2) { offer.state = 'confirmed'; const transition = { offer: { ...offer, accepted: [...offer.accepted] }, reservationIds: offer.reservationIds }; this.idempotent.set(key, transition); return transition; }
    const transition = { offer: { ...offer, accepted: [...offer.accepted] }, reservationIds: offer.reservationIds }; this.idempotent.set(key, transition); return transition;
  }
  reject(offerId: string, participant: string, idempotencyKey: string) { const offer = this.offers.get(offerId); if (!offer || !offer.reservationIds.some((id) => this.reservations.get(id)?.participant === participant)) return undefined; offer.state = 'cancelled'; for (const id of offer.reservationIds) { const reservation = this.reservations.get(id); if (reservation) { reservation.state = 'cancelled'; this.participantReservations.delete(reservation.participant); } } this.idempotent.set(`reject:${offerId}:${participant}:${idempotencyKey}`, offer); return offer; }
  enterHuman(offerId: string, participant: string, idempotencyKey: string) { const key = `enter:${offerId}:${participant}:${idempotencyKey}`; const prior = this.idempotent.get(key) as PublicTransition | undefined; if (prior) return prior; const offer = this.offers.get(offerId); if (!offer || (offer.state !== 'confirmed' && offer.state !== 'entered_human') || !offer.reservationIds.some((id) => this.reservations.get(id)?.participant === participant)) return undefined; if (!offer.humanRoomId) { offer.humanRoomId = `human_${randomBytes(10).toString('base64url')}`; this.humanRooms.add(offer.humanRoomId); for (const id of offer.reservationIds) { const reservation = this.reservations.get(id); if (reservation) { reservation.state = 'matched'; this.participantReservations.delete(reservation.participant); } } offer.state = 'entered_human'; } const transition = { offer: { ...offer, accepted: [...offer.accepted] }, reservationIds: offer.reservationIds, humanRoomId: offer.humanRoomId }; this.idempotent.set(key, transition); return transition; }
  expire(at = this.now()) { for (const offer of this.offers.values()) if (offer.state === 'offered' || offer.state === 'accepted_by_one') if (at >= offer.deadline) { offer.state = 'expired'; for (const id of offer.reservationIds) { const reservation = this.reservations.get(id); if (reservation) { reservation.state = 'queued'; } } } }
  metrics() { return { queued: [...this.reservations.values()].filter((item) => item.state === 'queued').length, activeOffers: [...this.offers.values()].filter((item) => item.state === 'offered' || item.state === 'accepted_by_one').length }; }
}
