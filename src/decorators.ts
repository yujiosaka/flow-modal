import type { PropertyDeclaration, ReactiveElement } from 'lit';
import { property } from 'lit/decorators.js';
import ms from 'ms';

import { createDurationConverter, createStringArrayConverter } from './converters.js';

type Interface<T> = { [K in keyof T]: T[K] };

type QueryParentElementDecorator<C extends Interface<ReactiveElement>, V extends Element> = (
  value: ClassAccessorDecoratorTarget<C, V>,
  context: ClassAccessorDecoratorContext<C, V>,
) => ClassAccessorDecoratorResult<C, V>;

/**
 * A helper decorator to query the parent element.
 * It returns the immediate parent element.
 */
export function queryParentElement(): PropertyDecorator {
  return function (target: object, propertyKey: string | symbol): QueryParentElementDecorator<ReactiveElement, Element> {
    return Object.defineProperty(target, propertyKey, {
      get(this: ReactiveElement): Element | null {
        return this.parentElement;
      },
      set(this: ReactiveElement): void {},
      enumerable: true,
      configurable: true,
    }) as QueryParentElementDecorator<ReactiveElement, Element>;
  };
}

/**
 * A decorator to define a duration property that automatically converts a duration string
 * (e.g., "30m") to a number (milliseconds).
 */
export function durationProperty(options: PropertyDeclaration<number, ms.StringValue> = {}): PropertyDecorator {
  return function (target: object, propertyKey: string | symbol): void {
    const attribute = typeof options.attribute === 'string' ? options.attribute : String(propertyKey);

    const converter = createDurationConverter(attribute);
    property({ ...options, attribute, converter })(target, propertyKey);
  };
}

/**
 * A decorator to define a string array property that automatically converts a
 * separated string (by default comma‑separated) into an array.
 */
export function stringArrayProperty(
  options: Partial<PropertyDeclaration<string[], string>> & { separator?: string } = {},
): PropertyDecorator {
  return (target: object, propertyKey: string | symbol) => {
    const separator = options.separator ?? ',';
    const converter = createStringArrayConverter(separator);
    property({ ...options, converter })(target, propertyKey);
  };
}
