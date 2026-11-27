export type MetricName = 'sessions' | 'rooms' | 'searches' | 'rejections' | 'reconnections' | 'errors' | 'limits';
export type OperationalEvent = { category: MetricName; result: 'accepted' | 'rejected' | 'expired' | 'error'; at: number };

/** In-memory, bounded, anonymous operational counters. It intentionally accepts no request data. */
export class OperationalMetrics {
  private readonly counters = new Map<string, number>();
  private readonly events: OperationalEvent[] = [];
  constructor(private readonly retentionMs = 60 * 60 * 1000, private readonly now: () => number = () => Date.now()) {}
  record(category: MetricName, result: OperationalEvent['result'], at = this.now()) {
    this.cleanup(at);
    const key = `${category}.${result}`;
    this.counters.set(key, (this.counters.get(key) ?? 0) + 1);
    this.events.push({ category, result, at });
  }
  cleanup(at = this.now()) {
    const cutoff = at - this.retentionMs;
    while (this.events[0] && this.events[0].at < cutoff) {
      const event = this.events.shift()!;
      const key = `${event.category}.${event.result}`;
      const value = (this.counters.get(key) ?? 1) - 1;
      if (value > 0) this.counters.set(key, value); else this.counters.delete(key);
    }
  }
  snapshot(at = this.now()) { this.cleanup(at); return Object.fromEntries(this.counters); }
  size() { return this.events.length; }
}

export class SlidingWindow {
  private readonly entries: number[] = [];
  constructor(private readonly limit: number, private readonly windowMs: number, private readonly now: () => number = () => Date.now()) {}
  allow(at = this.now()) {
    while (this.entries[0] !== undefined && this.entries[0] <= at - this.windowMs) this.entries.shift();
    if (this.entries.length >= this.limit) return false;
    this.entries.push(at);
    return true;
  }
  clear(at = this.now()) { while (this.entries[0] !== undefined && this.entries[0] <= at - this.windowMs) this.entries.shift(); }
}
