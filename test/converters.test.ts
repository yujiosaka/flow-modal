import { describe, expect, it } from 'bun:test';
import ms from 'ms';

import { createDurationConverter, createStringArrayConverter } from '../src/converters.js';
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

describe('createStringArrayConverter', () => {
  const converter = createStringArrayConverter();

  it('converts a comma-separated string into an array', () => {
    const result = converter.fromAttribute?.('local,cookie,memory');
    expect(result).toEqual(['local', 'cookie', 'memory']);
  });

  it('trims spaces from each token', () => {
    const result = converter.fromAttribute?.('local, cookie , memory ');
    expect(result).toEqual(['local', 'cookie', 'memory']);
  });

  it('returns an empty array for an empty string', () => {
    const result = converter.fromAttribute?.('');
    expect(result).toEqual([]);
  });

  it('uses a custom separator', () => {
    const semicolonConverter = createStringArrayConverter(';');
    const result = semicolonConverter.fromAttribute?.('local; cookie;memory');
    expect(result).toEqual(['local', 'cookie', 'memory']);
  });

  it('converts an array back to an attribute string', () => {
    const array = ['local', 'cookie', 'memory'];
    const result = converter.toAttribute?.(array);
    expect(result).toEqual('local,cookie,memory');
  });
});
