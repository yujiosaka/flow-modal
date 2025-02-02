import type { ComplexAttributeConverter } from 'lit';
import ms from 'ms';

import { FlowModalError } from './errors.js';

/**
 * Creates a duration converter for Lit properties.
 */
export function createDurationConverter(attribute: string): ComplexAttributeConverter<number, ms.StringValue> {
  return {
    fromAttribute(value: ms.StringValue): number {
      const parsed = ms(value);
      if (parsed === undefined) {
        throw new FlowModalError(`"${attribute}" is invalid. Expected a valid duration string (e.g., "30m", "1h").`);
      }
      return parsed;
    },
  };
}

/**
 * Creates a string array converter for Lit properties.
 */
export function createStringArrayConverter(separator: string = ','): ComplexAttributeConverter<string[], string> {
  return {
    fromAttribute(value: string): string[] {
      return value
        .split(separator)
        .map(item => item.trim())
        .filter(item => !!item.length);
    },
    toAttribute(value: string[]): string {
      return value.join(separator);
    },
  };
}
