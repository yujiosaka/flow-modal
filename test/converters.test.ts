import { describe, expect, it } from 'bun:test';
import ms from 'ms';

import { createDurationConverter } from '../src/converters.js';
import { FlowModalError } from '../src/errors.js';

describe('createDurationConverter', () => {
  const converter = createDurationConverter('test-duration');

  it('parses valid duration strings', () => {
    expect(converter.fromAttribute?.('30m')).toBe(ms('30m'));
  });

  it('throws FlowModalError for invalid strings', () => {
    expect(() => converter.fromAttribute?.('invalid-duration')).toThrow(FlowModalError);
  });
});
