import { describe, expect, it } from 'bun:test';
import { LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import ms from 'ms';

import { durationProperty, queryParentElement, stringArrayProperty } from '../src/decorators.js';
import { FlowModalError } from '../src/errors.js';

describe('queryParentElement', () => {
  @customElement('query-parent-element-test')
  class QueryParentElementTest extends LitElement {
    @queryParentElement()
    parent: HTMLElement | null = null;
  }

  it('queries the parent element', async () => {
    const parent = document.createElement('div');
    const child = document.createElement('query-parent-element-test') as QueryParentElementTest;
    parent.appendChild(child);
    document.body.appendChild(parent);
    await child.updateComplete;

    expect(child.parent).toBe(parent);
  });
});

describe('durationProperty', () => {
  @customElement('duration-property-test')
  class DurationPropertyTest extends LitElement {
    @durationProperty()
    duration: number | null = null;
  }

  it('parses valid duration', async () => {
    const element = document.createElement('duration-property-test') as DurationPropertyTest;
    element.setAttribute('duration', '2h');
    document.body.appendChild(element);
    await element.updateComplete;

    expect(element.duration).toBe(ms('2h'));
  });

  it('throws FlowModalError for valid duration', async () => {
    const element = document.createElement('duration-property-test') as DurationPropertyTest;

    let error: unknown;
    try {
      element.setAttribute('duration', 'invalid-duration');
    } catch (err) {
      error = err;
    }
    expect(error).toBeInstanceOf(FlowModalError);
  });
});

describe('stringArrayProperty', () => {
  @customElement('string-array-test')
  class StringArrayTest extends LitElement {
    @stringArrayProperty()
    myArray: string[] = [];
  }

  it('parses a comma-separated string into an array', async () => {
    const element = document.createElement('string-array-test') as StringArrayTest;
    element.setAttribute('myArray', 'one,two, three');
    document.body.appendChild(element);
    await element.updateComplete;
    expect(element.myArray).toEqual(['one', 'two', 'three']);
  });

  it('returns the default value if attribute is not set', async () => {
    const element = document.createElement('string-array-test') as StringArrayTest;
    element.myArray = ['default'];
    document.body.appendChild(element);
    await element.updateComplete;
    expect(element.myArray).toEqual(['default']);
  });

  it('supports a custom separator', async () => {
    @customElement('custom-separator-element')
    class CustomSeparatorElement extends LitElement {
      @stringArrayProperty({ separator: ';' })
      items: string[] = [];
    }
    const el = document.createElement('custom-separator-element') as CustomSeparatorElement;
    el.setAttribute('items', 'a; b; c');
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.items).toEqual(['a', 'b', 'c']);
  });
});
