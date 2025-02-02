import { FlowModalError } from './errors';

const ALLOWED_STORAGES = ['local', 'session', 'cookie', 'memory'];

export type Storage = 'local' | 'session' | 'cookie' | 'memory';

/**
 * Asserts that the input is an array of allowed Storage tokens.
 * Returns the input as Storage[] if valid; otherwise, throws an error.
 */
export function assertStorages(input: Array<unknown>): asserts input is Array<Storage> {
  input.forEach(token => {
    if (typeof token !== 'string' || !ALLOWED_STORAGES.includes(token as Storage)) {
      throw new FlowModalError(`Invalid storage identifier: ${token}`);
    }
  });
}

/**
 * Asserts that the event is of the expected type.
 */
export function assertEventType<T extends Event>(event: Event, type: string): asserts event is T {
  if (event.type !== type) {
    throw new FlowModalError(`Expected event type to be ${type}`);
  }
}
