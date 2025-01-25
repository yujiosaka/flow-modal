/**
 * The event detail for FlowModalStartedEvent, indicating whether the
 * flow is starting initially or being reactivated.
 */
export type FlowModalStartedEventDetail = {
  initial: boolean;
};

/**
 * Dispatched when a FlowModal is started.
 */
export class FlowModalStartedEvent extends CustomEvent<FlowModalStartedEventDetail> {
  static type = 'flowmodalstarted';

  constructor(detail: FlowModalStartedEventDetail) {
    super(FlowModalStartedEvent.type, {
      detail,
      bubbles: true,
      composed: true,
    });
  }
}

/**
 * Dispatched when the FlowModal times out.
 */
export class FlowModalTimedOutEvent extends CustomEvent<never> {
  static type = 'flowmodaltimedout';

  constructor() {
    super(FlowModalTimedOutEvent.type, {
      bubbles: true,
      composed: true,
    });
  }
}

/**
 * Dispatched when the FlowModal is evaluated.
 */
export class FlowModalEvaluatedEvent extends CustomEvent<never> {
  static type = 'flowmodalevaluated';

  constructor() {
    super(FlowModalEvaluatedEvent.type, {
      bubbles: true,
      composed: true,
    });
  }
}

/**
 * The event detail for FlowStepActivatedEvent.
 */
export type FlowStepActivatedEventDetail = {
  initial: boolean;
};

/**
 * Dispatched when a FlowStep is activated.
 */
export class FlowStepActivatedEvent extends CustomEvent<FlowStepActivatedEventDetail> {
  static type = 'flowstepactivated';

  constructor(detail: FlowStepActivatedEventDetail) {
    super(FlowStepActivatedEvent.type, {
      detail,
      bubbles: true,
      composed: true,
    });
  }
}

/**
 * Dispatched when a FlowStep is deactivated.
 */
export class FlowStepDeactivatedEvent extends CustomEvent<never> {
  static type = 'flowstepdeactivated';

  constructor() {
    super(FlowStepDeactivatedEvent.type, {
      bubbles: true,
      composed: true,
    });
  }
}

/**
 * Dispatched when a FlowStep's modal content becomes shown.
 */
export class FlowStepShownEvent extends CustomEvent<never> {
  static type = 'flowstepshown';

  constructor() {
    super(FlowStepShownEvent.type, {
      bubbles: true,
      composed: true,
    });
  }
}

/**
 * Dispatched when a FlowStep's modal content becomes hidden.
 */
export class FlowStepHiddenEvent extends CustomEvent<never> {
  static type = 'flowstephidden';

  constructor() {
    super(FlowStepHiddenEvent.type, {
      bubbles: true,
      composed: true,
    });
  }
}

/**
 * The event detail for FlowStepStartedEvent.
 */
export type FlowStepStartedEventDetail = {
  startedAt: number;
};

/**
 * Dispatched when a FlowStep is formally started.
 */
export class FlowStepStartedEvent extends CustomEvent<FlowStepStartedEventDetail> {
  static type = 'flowstepstarted';

  constructor(detail: FlowStepStartedEventDetail) {
    super(FlowStepStartedEvent.type, {
      detail,
      bubbles: true,
      composed: true,
    });
  }
}

/**
 * The event detail for FlowStepClickedEvent.
 */
export type FlowStepClickedEventDetail = {
  area: string;
};

/**
 * Dispatched when a FlowStep detects a click event.
 */
export class FlowStepClickedEvent extends CustomEvent<FlowStepClickedEventDetail> {
  static type = 'flowstepclicked';

  constructor(detail: FlowStepClickedEventDetail) {
    super(FlowStepClickedEvent.type, {
      detail,
      bubbles: true,
      composed: true,
    });
  }
}

/**
 * The event detail for FlowBadgeActivatedEvent.
 */
export type FlowBadgeActivatedEventDetail = {
  initial: boolean;
};

/**
 * Dispatched when a FlowBadge is activated.
 */
export class FlowBadgeActivatedEvent extends CustomEvent<FlowBadgeActivatedEventDetail> {
  static type = 'flowbadgeactivated';

  constructor(detail: FlowBadgeActivatedEventDetail) {
    super(FlowBadgeActivatedEvent.type, {
      detail,
      bubbles: true,
      composed: true,
    });
  }
}

/**
 * Dispatched when a FlowBadge is deactivated.
 */
export class FlowBadgeDeactivatedEvent extends CustomEvent<never> {
  static type = 'flowbadgedeactivated';

  constructor() {
    super(FlowBadgeDeactivatedEvent.type, { bubbles: true, composed: true });
  }
}

/**
 * The event detail for FlowBadgeTickedEvent.
 */
export type FlowBadgeTickedEventDetail = {
  remainingTime: number;
};

/**
 * Dispatched on a repeating interval to indicate the remaining time.
 */
export class FlowBadgeTickedEvent extends CustomEvent<FlowBadgeTickedEventDetail> {
  static type = 'flowbadgeticked';

  constructor(detail: FlowBadgeTickedEventDetail) {
    super(FlowBadgeTickedEvent.type, { detail, bubbles: true, composed: true });
  }
}

/**
 * Dispatched when a FlowBadge becomes shown.
 */
export class FlowBadgeShownEvent extends CustomEvent<never> {
  static type = 'flowbadgeshown';

  constructor() {
    super(FlowBadgeShownEvent.type, { bubbles: true, composed: true });
  }
}

/**
 * Dispatched when a FlowBadge becomes hidden.
 */
export class FlowBadgeHiddenEvent extends CustomEvent<never> {
  static type = 'flowbadgehidden';

  constructor() {
    super(FlowBadgeHiddenEvent.type, { bubbles: true, composed: true });
  }
}

/**
 * The event detail for FlowBadgeClickedEvent.
 */
export type FlowBadgeClickedEventDetail = {
  area: string;
};

/**
 * Dispatched when a FlowBadge detects a click.
 */
export class FlowBadgeClickedEvent extends CustomEvent<FlowBadgeClickedEventDetail> {
  static type = 'flowbadgeclicked';

  constructor(detail: FlowBadgeClickedEventDetail) {
    super(FlowBadgeClickedEvent.type, {
      detail,
      bubbles: true,
      composed: true,
    });
  }
}

/**
 * Asserts that the event is of the expected type.
 */
export function assertEventType<T extends Event>(event: Event, type: string): asserts event is T {
  if (event.type !== type) {
    throw new Error(`Expected event type to be ${type}`);
  }
}
