import { beforeEach, describe, expect, it } from 'bun:test';

import { FlowModal } from '../../src/components/flow-modal.js';
import { FlowStep } from '../../src/components/flow-step.js';
import {
  FlowModalStartedEvent,
  FlowStepActivatedEvent,
  FlowStepClickedEvent,
  FlowStepDeactivatedEvent,
  FlowStepHiddenEvent,
  FlowStepShownEvent,
} from '../../src/events.js';
import { FlowModalError } from '../../src/index.js';

describe('FlowStep', () => {
  let modal: FlowModal;
  let step: FlowStep;

  beforeEach(() => {
    modal = document.createElement('flow-modal') as FlowModal;
    step = document.createElement('flow-step') as FlowStep;
  });

  it("throws error when it's not a child of flow-modal", async () => {
    step.setAttribute('ready', 'true');
    document.body.appendChild(step);

    let error: unknown;
    try {
      await step.updateComplete;
    } catch (err) {
      error = err;
    }

    expect(error).toBeInstanceOf(FlowModalError);
  });

  it('forces slot to "step" even if the user sets it differently', async () => {
    modal.appendChild(step);
    document.body.appendChild(modal);

    await modal.updateComplete;
    await step.updateComplete;

    expect(step.getAttribute('slot')).toBe('step');

    step.setAttribute('slot', 'invalid-slot');

    expect(step.getAttribute('slot')).toBe('step');
  });

  it('becomes activated when flowstepactivated is dispatched', async () => {
    modal.appendChild(step);
    document.body.appendChild(modal);

    await modal.updateComplete;
    await step.updateComplete;

    const flowModalStartedEvents: FlowModalStartedEvent[] = [];
    modal.addEventListener(FlowModalStartedEvent.type, event => {
      flowModalStartedEvents.push(event as FlowModalStartedEvent);
    });

    step.dispatchEvent(new FlowStepActivatedEvent({ initial: false }));

    expect(flowModalStartedEvents.length).toBe(1);
    expect(flowModalStartedEvents[0].detail.initial).toBe(false);
    expect(step.active).toBe(true);
    expect(step.visible).toBe(false);
  });

  it('becomes deactivated when flowstepdeactivated is dispatched', async () => {
    modal.appendChild(step);
    document.body.appendChild(modal);

    await modal.updateComplete;
    await step.updateComplete;

    step.dispatchEvent(new FlowStepActivatedEvent({ initial: true }));
    step.dispatchEvent(new FlowStepDeactivatedEvent());

    expect(step.active).toBe(false);
    expect(step.visible).toBe(false);
  });

  it('becomes visible when flowstepactivated is dispatched with initial = true', async () => {
    modal.appendChild(step);
    document.body.appendChild(modal);

    await modal.updateComplete;
    await step.updateComplete;

    const flowStepShownEvents: FlowStepShownEvent[] = [];
    modal.addEventListener(FlowStepShownEvent.type, event => {
      flowStepShownEvents.push(event as FlowStepShownEvent);
    });

    step.dispatchEvent(new FlowStepActivatedEvent({ initial: true }));

    expect(flowStepShownEvents.length).toBe(1);
    expect(step.active).toBe(true);
    expect(step.visible).toBe(true);
  });

  it('hides the modal content when hideModal is called', async () => {
    modal.appendChild(step);
    document.body.appendChild(modal);

    await modal.updateComplete;
    await step.updateComplete;

    const flowStepHiddenEvents: FlowStepHiddenEvent[] = [];
    step.addEventListener(FlowStepHiddenEvent.type, event => {
      flowStepHiddenEvents.push(event as FlowStepHiddenEvent);
    });

    step.dispatchEvent(new FlowStepActivatedEvent({ initial: true }));
    step.hideModal();

    expect(flowStepHiddenEvents.length).toBe(1);
    expect(step.active).toBe(true);
    expect(step.visible).toBe(false);
  });

  it('hides the modal when backdrop is clicked', async () => {
    step.setAttribute('ready', 'true');
    step.setAttribute('backdrop', 'true');
    modal.appendChild(step);
    document.body.appendChild(modal);

    await modal.updateComplete;
    await step.updateComplete;

    const flowStepClickedEvents: FlowStepClickedEvent[] = [];
    step.addEventListener(FlowStepClickedEvent.type, event => {
      flowStepClickedEvents.push(event as FlowStepClickedEvent);
    });

    const flowStepHiddenEvents: FlowStepHiddenEvent[] = [];
    step.addEventListener(FlowStepHiddenEvent.type, event => {
      flowStepHiddenEvents.push(event as FlowStepHiddenEvent);
    });

    await modal.updateComplete;
    await step.updateComplete;

    const backdrop = step.shadowRoot!.querySelector('.backdrop')!;
    backdrop.dispatchEvent(new window.MouseEvent('click'));

    expect(flowStepClickedEvents.length).toBe(1);
    expect(flowStepClickedEvents[0].detail.area).toBe('backdrop');
    expect(flowStepHiddenEvents.length).toBe(1);
    expect(step.active).toBe(true);
    expect(step.visible).toBe(false);
  });

  it('does not have backdrop without backdrop attribute', async () => {
    modal.appendChild(step);
    document.body.appendChild(modal);

    await modal.updateComplete;
    await step.updateComplete;

    step.dispatchEvent(new FlowStepActivatedEvent({ initial: true }));
    const backdrop = step.shadowRoot!.querySelector('.backdrop')!;

    expect(backdrop).toBeNull();
    expect(step.active).toBe(true);
    expect(step.visible).toBe(true);
  });

  it('does not have hide button without hide-button-icon attribute', async () => {
    modal.appendChild(step);
    document.body.appendChild(modal);

    await modal.updateComplete;
    await step.updateComplete;

    step.dispatchEvent(new FlowStepActivatedEvent({ initial: true }));
    const hideButton = step.shadowRoot!.querySelector('.modal__hide-button-content')!;

    expect(hideButton).toBeNull();
    expect(step.active).toBe(true);
    expect(step.visible).toBe(true);
  });

  it('hides the modal when hide button is clicked', async () => {
    step.setAttribute('hide-button-icon', 'close');
    modal.appendChild(step);
    document.body.appendChild(modal);

    await modal.updateComplete;
    await step.updateComplete;

    const flowStepClickedEvents: FlowStepClickedEvent[] = [];
    step.addEventListener(FlowStepClickedEvent.type, event => {
      flowStepClickedEvents.push(event as FlowStepClickedEvent);
    });

    const flowStepHiddenEvents: FlowStepHiddenEvent[] = [];
    step.addEventListener(FlowStepHiddenEvent.type, event => {
      flowStepHiddenEvents.push(event as FlowStepHiddenEvent);
    });

    step.dispatchEvent(new FlowStepActivatedEvent({ initial: true }));
    const hideButton = step.shadowRoot!.querySelector('.modal__hide-button-content')!;
    hideButton.dispatchEvent(new window.MouseEvent('click'));

    expect(flowStepClickedEvents.length).toBe(1);
    expect(flowStepClickedEvents[0].detail.area).toBe('hide-icon');
    expect(flowStepHiddenEvents.length).toBe(1);
    expect(step.active).toBe(true);
    expect(step.visible).toBe(false);
  });

  it('does nothing when the modal content is clicked', async () => {
    modal.appendChild(step);
    document.body.appendChild(modal);

    await modal.updateComplete;
    await step.updateComplete;

    const flowStepClicked: FlowStepClickedEvent[] = [];
    step.addEventListener(FlowStepClickedEvent.type, event => {
      flowStepClicked.push(event as FlowStepClickedEvent);
    });

    step.dispatchEvent(new FlowStepActivatedEvent({ initial: true }));
    const content = step.shadowRoot!.querySelector('.modal__content')!;
    content.dispatchEvent(new window.MouseEvent('click'));

    expect(flowStepClicked.length).toBe(1);
    expect(flowStepClicked[0].detail.area).toBe('content');
    expect(step.active).toBe(true);
    expect(step.visible).toBe(true);
  });

  it('becomes visible when flowstepshown is dispatched', async () => {
    step.setAttribute('ready', 'true');
    modal.appendChild(step);
    document.body.appendChild(modal);

    await modal.updateComplete;
    await step.updateComplete;

    const flowStepShownEvents: FlowStepShownEvent[] = [];
    step.addEventListener(FlowStepShownEvent.type, evt => {
      flowStepShownEvents.push(evt as FlowStepShownEvent);
    });

    step.hideModal();
    step.dispatchEvent(new FlowStepShownEvent());

    expect(flowStepShownEvents.length).toBe(1);
    expect(step.active).toBe(true);
    expect(step.visible).toBe(true);
  });
});
