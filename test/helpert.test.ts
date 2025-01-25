import { beforeEach, describe, expect, test } from 'bun:test';

import { addEventListeners } from '../src/helpers';

describe('addEventListeners', () => {
  let element: HTMLElement;

  beforeEach(() => {
    element = document.createElement('div');
  });

  test('registers and unregisters a single event listener', () => {
    let called = false;
    const handler = () => {
      called = true;
    };

    const removeListeners = addEventListeners(element, [{ type: 'click', handler }]);

    element.dispatchEvent(new Event('click'));

    expect(called).toBe(true);

    called = false;
    removeListeners();

    element.dispatchEvent(new Event('click'));

    expect(called).toBe(false);
  });

  test('registers and unregisters multiple event listeners', () => {
    let count = 0;
    const handler1 = () => {
      count += 1;
    };
    const handler2 = () => {
      count += 10;
    };

    const removeListeners = addEventListeners(element, [
      { type: 'click', handler: handler1 },
      { type: 'dblclick', handler: handler2 },
    ]);

    element.dispatchEvent(new Event('click'));
    element.dispatchEvent(new Event('dblclick'));

    expect(count).toBe(11);

    removeListeners();
    count = 0;

    element.dispatchEvent(new Event('click'));
    element.dispatchEvent(new Event('dblclick'));

    expect(count).toBe(0);
  });
});
