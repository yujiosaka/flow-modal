import { describe, expect, it } from 'bun:test';
import { LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import ms from 'ms';

import { durationProperty, queryParentElement } from '../src/decorators.js';
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
