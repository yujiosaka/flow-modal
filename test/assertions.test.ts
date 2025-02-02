import { describe, expect, it } from 'bun:test';

import { FlowModalError } from '../src';
import { assertEventType, assertStorages } from '../src/assertions';

describe('assertStorages', () => {
  it('does not throw error when storages are valid', () => {
    expect(() => {
      assertStorages(['local', 'session', 'cookie', 'memory']);
    }).not.toThrow();
  });

  it('throws error if an element is not a string', () => {
    expect(() => assertStorages([42])).toThrow(FlowModalError);
  });

  it('throw error for an invalid storage token', () => {
    expect(() => assertStorages(['invalid'])).toThrow(FlowModalError);
  });
});

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
    }).toThrow(FlowModalError);
  });
});
