import { beforeEach, describe, expect, it } from 'bun:test';
import ms from 'ms';

import { FlowBadge } from '../../src/components/flow-badge.js';
import { FlowModal } from '../../src/components/flow-modal.js';
import { FlowStep } from '../../src/components/flow-step.js';
import {
  FlowBadgeActivatedEvent,
  FlowBadgeClickedEvent,
  FlowBadgeDeactivatedEvent,
  FlowBadgeHiddenEvent,
  FlowBadgeShownEvent,
  FlowBadgeTickedEvent,
} from '../../src/events.js';
import { FlowModalError } from '../../src/index.js';

describe('FlowBadge', () => {
  let modal: FlowModal;
  let step: FlowStep;
  let badge: FlowBadge;

  beforeEach(() => {
    modal = document.createElement('flow-modal') as FlowModal;
    step = document.createElement('flow-step') as FlowStep;
    badge = document.createElement('flow-badge') as FlowBadge;
  });

  it("throws error when it's not a child of flow-step", async () => {
    document.body.appendChild(badge);

    let error: unknown;
    try {
      await badge.updateComplete;
    } catch (err) {
      error = err;
    }

    expect(error).toBeInstanceOf(FlowModalError);
  });

  it('forces slot to "badge" even if the user sets it differently', async () => {
    step.appendChild(badge);
    modal.appendChild(step);
    document.body.appendChild(modal);

    expect(badge.getAttribute('slot')).toBe('badge');

    badge.setAttribute('slot', 'invalid-slot');

    expect(badge.getAttribute('slot')).toBe('badge');
  });

  it('becomes activated when flowbadgeactivated is dispatched', async () => {
    step.appendChild(badge);
    modal.appendChild(step);
    document.body.appendChild(modal);

    await modal.updateComplete;
    await step.updateComplete;
    await badge.updateComplete;

    badge.dispatchEvent(new FlowBadgeActivatedEvent({ initial: true }));

    expect(badge.active).toBe(true);
    expect(badge.visible).toBe(false);
  });

  it('becomes invisible when flowbadgedeactivated is dispatched', async () => {
    step.appendChild(badge);
    modal.appendChild(step);
    document.body.appendChild(modal);

    await modal.updateComplete;
    await step.updateComplete;
    await badge.updateComplete;

    badge.dispatchEvent(new FlowBadgeActivatedEvent({ initial: false }));
    badge.dispatchEvent(new FlowBadgeShownEvent());
    badge.dispatchEvent(new FlowBadgeDeactivatedEvent());

    expect(badge.active).toBe(false);
    expect(badge.visible).toBe(false);
  });

  it('shows a hint when flowbadgeshown is dispatched', async () => {
    badge.setAttribute('hint-text', 'Check out our offer!');

    step.appendChild(badge);
    modal.appendChild(step);
    document.body.appendChild(modal);

    await modal.updateComplete;
    await step.updateComplete;
    await badge.updateComplete;

    badge.dispatchEvent(new FlowBadgeActivatedEvent({ initial: true }));
    badge.dispatchEvent(new FlowBadgeShownEvent());

    await modal.updateComplete;
    await step.updateComplete;
    await badge.updateComplete;

    const hint = badge.shadowRoot!.querySelector('.hint')!;
    expect(hint.className).toContain('hint--visible');
    expect(badge.active).toBe(true);
    expect(badge.visible).toBe(true);
  });

  it('does not show a hint without hint-text attribute', async () => {
    step.appendChild(badge);
    modal.appendChild(step);
    document.body.appendChild(modal);

    await modal.updateComplete;
    await step.updateComplete;
    await badge.updateComplete;

    badge.dispatchEvent(new FlowBadgeActivatedEvent({ initial: true }));
    badge.dispatchEvent(new FlowBadgeShownEvent());

    await modal.updateComplete;
    await step.updateComplete;
    await badge.updateComplete;

    const hint = badge.shadowRoot!.querySelector('.hint')!;
    expect(hint).toBeNull();
    expect(badge.active).toBe(true);
    expect(badge.visible).toBe(true);
  });

  it('does not show a badge text without button-text and button-count-down-format attribute', async () => {
    step.appendChild(badge);
    modal.appendChild(step);
    document.body.appendChild(modal);

    await modal.updateComplete;
    await step.updateComplete;
    await badge.updateComplete;

    badge.dispatchEvent(new FlowBadgeActivatedEvent({ initial: false }));
    badge.dispatchEvent(new FlowBadgeShownEvent());
    badge.dispatchEvent(new FlowBadgeTickedEvent({ remainingTime: ms('60s') }));

    await modal.updateComplete;
    await step.updateComplete;
    await badge.updateComplete;

    const buttonText = badge.shadowRoot!.querySelector('.button__text-content')!;
    expect(buttonText).toBeNull();
  });

  it('shows a badge text with button-text attribute', async () => {
    badge.setAttribute('button-text', 'Click me!');

    step.appendChild(badge);
    modal.appendChild(step);
    document.body.appendChild(modal);

    await modal.updateComplete;
    await step.updateComplete;
    await badge.updateComplete;

    badge.dispatchEvent(new FlowBadgeActivatedEvent({ initial: false }));
    badge.dispatchEvent(new FlowBadgeShownEvent());

    await modal.updateComplete;
    await step.updateComplete;
    await badge.updateComplete;

    const buttonText = badge.shadowRoot!.querySelector('.button__text-content')!;
    expect(buttonText.textContent).toContain('Click me!');
  });

  it('shows a countdown with button-count-down-format attribute', async () => {
    badge.setAttribute('button-count-down-format', 'mm:ss');

    step.appendChild(badge);
    modal.appendChild(step);
    document.body.appendChild(modal);

    await modal.updateComplete;
    await step.updateComplete;
    await badge.updateComplete;

    badge.dispatchEvent(new FlowBadgeActivatedEvent({ initial: false }));
    badge.dispatchEvent(new FlowBadgeShownEvent());

    await modal.updateComplete;
    await step.updateComplete;
    await badge.updateComplete;

    let buttonText = badge.shadowRoot!.querySelector('.button__text-content')!;
    expect(buttonText).toBeNull();

    badge.dispatchEvent(new FlowBadgeTickedEvent({ remainingTime: ms('60s') }));

    await modal.updateComplete;
    await step.updateComplete;
    await badge.updateComplete;

    buttonText = badge.shadowRoot!.querySelector('.button__text-content')!;

    expect(buttonText.textContent).toContain('01:00');
  });

  it('hides the badge when button is clicked', async () => {
    step.appendChild(badge);
    modal.appendChild(step);
    document.body.appendChild(modal);

    await modal.updateComplete;
    await step.updateComplete;
    await badge.updateComplete;

    const flowBadgeClickedEvents: FlowBadgeClickedEvent[] = [];
    badge.addEventListener(FlowBadgeClickedEvent.type, event => {
      flowBadgeClickedEvents.push(event as FlowBadgeClickedEvent);
    });

    const flowBadgeHiddenEvents: FlowBadgeHiddenEvent[] = [];
    step.addEventListener(FlowBadgeHiddenEvent.type, event => {
      flowBadgeHiddenEvents.push(event as FlowBadgeHiddenEvent);
    });

    badge.dispatchEvent(new FlowBadgeActivatedEvent({ initial: false }));
    badge.dispatchEvent(new FlowBadgeShownEvent());

    await modal.updateComplete;
    await step.updateComplete;
    await badge.updateComplete;

    const buttonWrapper = badge.shadowRoot!.querySelector('.button')!;
    buttonWrapper.dispatchEvent(new window.MouseEvent('click'));

    await modal.updateComplete;
    await step.updateComplete;
    await badge.updateComplete;

    expect(flowBadgeClickedEvents.length).toBe(1);
    expect(flowBadgeClickedEvents[0].detail.area).toBe('button');
    expect(flowBadgeHiddenEvents.length).toBe(1);
    expect(badge.visible).toBe(false);
  });
});
