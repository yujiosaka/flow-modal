import { beforeEach, describe, expect, it } from 'bun:test';

import { FlowModal } from '../../src/components/flow-modal.js';
import { FlowStep } from '../../src/components/flow-step.js';
import {
  FlowModalEvaluatedEvent,
  FlowModalStartedEvent,
  FlowModalTimedOutEvent,
  FlowStepStartedEvent,
} from '../../src/events.js';
import { FlowModalError } from '../../src/index.js';

describe('FlowModal', () => {
  let modal: FlowModal;
  let step1: FlowStep;
  let step2: FlowStep;

  beforeEach(() => {
    modal = document.createElement('flow-modal') as FlowModal;
    step1 = document.createElement('flow-step') as FlowStep;
    step2 = document.createElement('flow-step') as FlowStep;
  });

  it('does not activate steps if `deactivated` is set to true', async () => {
    modal.setAttribute('deactivated', 'true');
    step1.setAttribute('ready', 'true');
    modal.appendChild(step1);
    document.body.appendChild(modal);

    await modal.updateComplete;
    await step1.updateComplete;

    expect(modal.active).toBe(false);
    expect(modal.visible).toBe(false);
    expect(modal.activatedStepIndex).toBe(null);
    expect(step1.active).toBe(false);

    modal.deactivated = false;

    await modal.updateComplete;
    await step1.updateComplete;

    expect(modal.active).toBe(true);
    expect(modal.visible).toBe(true);
    expect(modal.activatedStepIndex).toBe(0);
    expect(step1.active).toBe(true);
  });

  it('activates the following step when the previous step is skippable', async () => {
    const step2 = document.createElement('flow-step') as FlowStep;

    step1.setAttribute('ready', 'true');
    step1.setAttribute('skippable', 'true');
    step2.setAttribute('ready', 'true');

    modal.appendChild(step1);
    modal.appendChild(step2);
    document.body.appendChild(modal);

    await modal.updateComplete;
    await step1.updateComplete;
    await step2.updateComplete;

    expect(modal.active).toBe(true);
    expect(modal.visible).toBe(true);
    expect(modal.activatedStepIndex).toBe(1);
    expect(step1.active).toBe(false);
    expect(step2.active).toBe(true);
  });

  it('stores and restore activated step on reload', async () => {
    step1.setAttribute('ready', 'true');
    step2.setAttribute('ready', 'true');

    modal.appendChild(step1);
    modal.appendChild(step2);
    document.body.appendChild(modal);

    await modal.updateComplete;
    await step1.updateComplete;
    await step2.updateComplete;

    expect(modal.active).toBe(true);
    expect(modal.visible).toBe(true);
    expect(modal.activatedStepIndex).toBe(0);
    expect(step1.active).toBe(true);
    expect(step2.active).toBe(false);

    modal.remove();
    modal = document.createElement('flow-modal') as FlowModal;
    step1 = document.createElement('flow-step') as FlowStep;
    step2 = document.createElement('flow-step') as FlowStep;

    step1.setAttribute('ready', 'false');
    step2.setAttribute('ready', 'true');
    modal.appendChild(step1);
    modal.appendChild(step2);
    document.body.appendChild(modal);

    await modal.updateComplete;
    await step1.updateComplete;
    await step2.updateComplete;

    expect(modal.active).toBe(true);
    expect(modal.visible).toBe(true);
    expect(modal.activatedStepIndex).toBe(1);
    expect(step1.active).toBe(false);
    expect(step2.active).toBe(true);
  });

  it('throws error when a flow-step has a timeoutDuration > storageDuration', async () => {
    modal.setAttribute('storage-duration', '1m');
    step1.setAttribute('timeout-duration', '2m');
    modal.appendChild(step1);
    document.body.appendChild(modal);

    let error: unknown;
    try {
      await modal.updateComplete;
      await step1.updateComplete;
    } catch (err) {
      error = err;
    }

    expect(error).toBeInstanceOf(FlowModalError);
  });

  it('activates flow-step when flowmodalstarted is dispatched', async () => {
    const step = document.createElement('flow-step') as FlowStep;

    step.setAttribute('ready', 'true');
    modal.appendChild(step);
    document.body.appendChild(modal);

    await modal.updateComplete;
    await step.updateComplete;

    const flowStepStartedEvents: FlowStepStartedEvent[] = [];
    step.addEventListener(FlowStepStartedEvent.type, event => {
      flowStepStartedEvents.push(event as FlowStepStartedEvent);
    });

    modal.dispatchEvent(new FlowModalStartedEvent({ initial: true }));

    expect(flowStepStartedEvents.length).toBe(1);
    expect(flowStepStartedEvents[0].detail.startedAt).toBeNumber();
  });

  it('dispatches flowmodaltimedout when a step times out', async () => {
    step1.setAttribute('timeout-duration', '0s');
    step1.setAttribute('ready', 'true');

    modal.appendChild(step1);
    document.body.appendChild(modal);

    await modal.updateComplete;
    await step1.updateComplete;

    const flowModalTimedOutEvents: FlowModalTimedOutEvent[] = [];
    modal.addEventListener(FlowModalTimedOutEvent.type, event => {
      flowModalTimedOutEvents.push(event as FlowModalTimedOutEvent);
    });

    modal.dispatchEvent(new FlowModalStartedEvent({ initial: true }));

    expect(flowModalTimedOutEvents.length).toBe(1);
    expect(modal.active).toBe(false);
    expect(modal.visible).toBe(false);
    expect(modal.activatedStepIndex).toBe(null);
    expect(step1.active).toBe(false);

    modal.remove();
    modal = document.createElement('flow-modal') as FlowModal;
    step1 = document.createElement('flow-step') as FlowStep;

    step1.setAttribute('ready', 'true');
    modal.appendChild(step1);
    document.body.appendChild(modal);

    await modal.updateComplete;
    await step1.updateComplete;

    expect(modal.active).toBe(false);
    expect(modal.visible).toBe(false);
    expect(modal.activatedStepIndex).toBe(null);
    expect(step1.active).toBe(false);
  });

  it('dispatches flowmodalevaluated when the ready step is updated', async () => {
    const flowModalEvaluatedEvents: FlowModalEvaluatedEvent[] = [];
    modal.addEventListener(FlowModalEvaluatedEvent.type, event => {
      flowModalEvaluatedEvents.push(event as FlowModalEvaluatedEvent);
    });

    modal.appendChild(step1);
    document.body.appendChild(modal);

    await modal.updateComplete;
    await step1.updateComplete;

    expect(modal.active).toBe(false);
    expect(modal.visible).toBe(false);
    expect(modal.activatedStepIndex).toBe(null);
    expect(step1.active).toBe(false);

    step1.setAttribute('ready', 'true');

    await modal.updateComplete;
    await step1.updateComplete;

    expect(flowModalEvaluatedEvents.length).toBe(1);
    expect(modal.active).toBe(true);
    expect(modal.visible).toBe(true);
    expect(modal.activatedStepIndex).toBe(0);
    expect(step1.active).toBe(true);
  });

  it('refreshes state', async () => {
    const step2 = document.createElement('flow-step') as FlowStep;

    step1.setAttribute('ready', 'true');
    step2.setAttribute('ready', 'true');

    modal.appendChild(step1);
    modal.appendChild(step2);
    document.body.appendChild(modal);

    await modal.updateComplete;
    await step1.updateComplete;

    expect(modal.active).toBe(true);
    expect(modal.visible).toBe(true);
    expect(modal.activatedStepIndex).toBe(0);
    expect(step1.active).toBe(true);
    expect(step2.active).toBe(false);

    modal.refreshState(false);

    expect(modal.active).toBe(true);
    expect(modal.visible).toBe(true);
    expect(modal.activatedStepIndex).toBe(1);
    expect(step1.active).toBe(false);
    expect(step2.active).toBe(true);

    modal.refreshState(true);

    expect(modal.active).toBe(true);
    expect(modal.visible).toBe(true);
    expect(modal.activatedStepIndex).toBe(0);
    expect(step1.active).toBe(true);
    expect(step2.active).toBe(false);
  });
});
