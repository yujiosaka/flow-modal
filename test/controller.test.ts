import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import { TimerController } from '../src/controllers';

@customElement('test-element')
class TestElement extends LitElement {}

const element = document.createElement('test-element') as TestElement;

describe('TimerController', () => {
  let tickCount = 0;
  let timerController: TimerController;

  beforeEach(() => {
    tickCount = 0;
    timerController = new TimerController(element, 0, () => {
      tickCount++;
    });

    timerController.start();
  });

  afterEach(() => {
    timerController.stop();
  });

  test('calls onTick periodically', async () => {
    await new Promise(resolve => setTimeout(resolve, 10));

    expect(tickCount).toBeGreaterThanOrEqual(2);
  });

  test('stops calling onTick after stop is called', async () => {
    await new Promise(resolve => setTimeout(resolve, 10));

    timerController.stop();
    const tickCountAfterStop = tickCount;

    await new Promise(resolve => setTimeout(resolve, 10));

    expect(tickCount).toBe(tickCountAfterStop);
  });

  test('stops on hostDisconnected', async () => {
    await new Promise(resolve => setTimeout(resolve, 10));

    timerController.hostDisconnected();
    const tickCountAfterStop = tickCount;

    await new Promise(resolve => setTimeout(resolve, 10));

    expect(tickCount).toBe(tickCountAfterStop);
  });
});
