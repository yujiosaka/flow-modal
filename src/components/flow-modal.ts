import './flow-step.js';

import CascadeStorage from 'cascade-storage';
import type { TemplateResult } from 'lit';
import { html } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';
import ms from 'ms';

import { durationProperty } from '../decorators.js';
import { FlowModalError } from '../errors.js';
import {
  assertEventType,
  FlowModalEvaluatedEvent,
  FlowModalStartedEvent,
  FlowModalTimedOutEvent,
  FlowStepActivatedEvent,
  FlowStepDeactivatedEvent,
  FlowStepStartedEvent,
} from '../events.js';
import { addEventListeners, RemoveListeners } from '../helpers.js';
import { FlowElement } from './flow-element.js';
import type { FlowStep } from './flow-step.js';

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const STORAGE_KEY_STARTED_AT = 'started-at';
const STORAGE_KEY_ACTIVATED_STEP = 'activated-step';
const STORAGE_KEY_TIMED_OUT = 'timed-out';

/**
 * `<flow-modal>` orchestrates multiple `<flow-step>` components.
 * It manages storage persistence, timeouts, and activation order.
 */
@customElement('flow-modal')
export class FlowModal extends FlowElement {
  #storage!: CascadeStorage;
  #removeListeners: RemoveListeners = () => {};

  @queryAssignedElements({ slot: 'step' })
  private _flowSteps!: Array<FlowStep>;

  /**
   * When `true`, prevents activating any steps.
   */
  @property({ type: Boolean, attribute: 'deactivated', reflect: true })
  deactivated = false;

  /**
   * Namespace for storing flow state.
   */
  @property({ type: String, attribute: 'storage-namespace', reflect: true })
  storageNamespace = 'flow-modal';

  /**
   * How long to persist flow state in storage.
   */
  @durationProperty({ attribute: 'storage-duration', reflect: true })
  storageDuration: number = ms('30m');

  constructor() {
    super();
    this.#initializeStorage();
  }

  connectedCallback(): void {
    super.connectedCallback();

    this.#removeListeners = addEventListeners(this, [
      { type: FlowModalStartedEvent.type, handler: this.#startedHandler.bind(this) },
      { type: FlowModalTimedOutEvent.type, handler: this.#timedOutHandler.bind(this) },
      { type: FlowModalEvaluatedEvent.type, handler: this.#evaluatedHandler.bind(this) },
    ]);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();

    this.#removeListeners();
  }

  /**
   * Force-refreshes (or resets) the flow state.
   */
  refreshState(force: boolean = false): void {
    if (force) {
      this.#storage.reset();
    }

    this.#deactivateFlowStep();
    this.#activateFlowStep();
  }

  /**
   * Indicates whether any `<flow-step>` is currently active.
   */
  get active(): boolean {
    return this.#activatedFlowStep !== null;
  }

  /**
   * Indicates whether the currently activated `<flow-step>` is visible.
   */
  get visible(): boolean {
    return this.#activatedFlowStep !== null && this.#activatedFlowStep.visible;
  }

  /**
   * Returns the index of the currently activated `<flow-step>`.
   * If no step is active, returns null.
   */
  get activatedStepIndex(): number | null {
    const index = this._flowSteps.findIndex(step => step.active);
    return index === -1 ? null : index;
  }

  protected render(): TemplateResult {
    return html`<slot name="step" @slotchange=${this.#slotchangeHandler}></slot>`;
  }

  protected willUpdate(changedProperties: Map<string, unknown>): void {
    if (changedProperties.has('storageNamespace') || changedProperties.has('storageDuration')) {
      this.#initializeStorage();
    }
    if (changedProperties.has('deactivated')) {
      if (this.deactivated) {
        this.#deactivateFlowStep();
      } else {
        this.#activateFlowStep();
      }
    }
  }

  protected firstUpdated(): void {
    this.#validateAssignedElements();
    this.#activateFlowStep();
  }

  #initializeStorage(): void {
    this.#storage = new CascadeStorage({
      storages: ['local', 'cookie', 'memory'],
      namespace: this.storageNamespace,
      expireDays: this.#expireDays,
    });
  }

  #validateAssignedElements(): void {
    this._flowSteps.forEach(step => {
      if (step.timeoutDuration && step.timeoutDuration > this.storageDuration) {
        throw new FlowModalError(`"storage-duration" must be greater than the "timeout-duration" of each <flow-step>.`);
      }
    });
  }

  #advanceActivatedStepIndex(lastActivatedStepIndex: number | null): number | null {
    let activatedStepIndex: number | null = null;
    let nextStepIndex = 0;
    if (lastActivatedStepIndex !== null && this._flowSteps[lastActivatedStepIndex]) {
      activatedStepIndex = lastActivatedStepIndex;
      nextStepIndex = lastActivatedStepIndex + 1;
    }

    for (let i = nextStepIndex; i < this._flowSteps.length; i++) {
      if (!this._flowSteps[i].ready) break;
      activatedStepIndex = i;
      if (!this._flowSteps[i].skippable) break;
    }

    if (activatedStepIndex !== null) {
      this.#storage.set(STORAGE_KEY_ACTIVATED_STEP, activatedStepIndex);
    }

    return activatedStepIndex;
  }

  #slotchangeHandler(): void {
    this.#validateAssignedElements();
  }

  #startedHandler(event: Event): void {
    assertEventType<FlowModalStartedEvent>(event, FlowModalStartedEvent.type);

    let startedAt = this.#storage.get<number>(STORAGE_KEY_STARTED_AT);
    if (!startedAt || event.detail.initial) {
      startedAt = Date.now();
      this.#storage.set(STORAGE_KEY_STARTED_AT, startedAt);
    }

    this.#startFlowStep(startedAt);
  }

  #timedOutHandler(event: Event): void {
    assertEventType<FlowModalTimedOutEvent>(event, FlowModalTimedOutEvent.type);

    this.#deactivateFlowStep();
    this.#storage.set(STORAGE_KEY_TIMED_OUT, true);
    this.#storage.remove(STORAGE_KEY_STARTED_AT);
    this.#storage.remove(STORAGE_KEY_ACTIVATED_STEP);
  }

  #evaluatedHandler(event: Event): void {
    assertEventType<FlowModalEvaluatedEvent>(event, FlowModalEvaluatedEvent.type);

    if (!this.#activatedFlowStep) {
      this.#activateFlowStep();
    }
  }

  #activateFlowStep(): void {
    if (this.deactivated || this.#storage.get(STORAGE_KEY_TIMED_OUT)) return;

    const lastActivatedStepIndex = this.#storage.get<number>(STORAGE_KEY_ACTIVATED_STEP);
    const nextActivatedStepIndex = this.#advanceActivatedStepIndex(lastActivatedStepIndex);
    if (nextActivatedStepIndex === null) return;

    const initial = lastActivatedStepIndex !== nextActivatedStepIndex;
    const nextFlowStep = this._flowSteps[nextActivatedStepIndex];
    nextFlowStep.dispatchEvent(new FlowStepActivatedEvent({ initial }));
  }

  #deactivateFlowStep(): void {
    this.#activatedFlowStep?.dispatchEvent(new FlowStepDeactivatedEvent());
  }

  #startFlowStep(startedAt: number): void {
    this.#activatedFlowStep?.dispatchEvent(new FlowStepStartedEvent({ startedAt }));
  }

  get #activatedFlowStep(): FlowStep | null {
    return this._flowSteps.find(step => step.active) ?? null;
  }

  get #expireDays(): number {
    return this.storageDuration / MS_PER_DAY;
  }

  static styles = [FlowElement.styles];
}

declare global {
  interface HTMLElementTagNameMap {
    'flow-modal': FlowModal;
  }
}
