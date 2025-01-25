import { describe, expect, it } from 'bun:test';

import { assertEventType } from '../src/events.js';

describe('assertEventType', () => {
  it('does not throw error when the event type matches', () => {
    const event = new CustomEvent('some-event-type');
    expect(() => {
      assertEventType<CustomEvent>(event, 'some-event-type');
    }).not.toThrow();
  });

  it('throws error with the correct error message', () => {
    const event = new CustomEvent('some-event-type');
    expect(() => {
      assertEventType<CustomEvent>(event, 'wrong-event-type');
    }).toThrow(Error);
  });
});
