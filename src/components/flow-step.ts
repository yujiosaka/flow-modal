import './flow-badge.js';

import type { TemplateResult } from 'lit';
import { css, html, nothing } from 'lit';
import { customElement, eventOptions, property, queryAssignedElements, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

import { TimerController } from '../controllers.js';
import { durationProperty, queryParentElement } from '../decorators.js';
import { FlowModalError } from '../errors.js';
import {
  assertEventType,
  FlowBadgeActivatedEvent,
  FlowBadgeDeactivatedEvent,
  FlowBadgeHiddenEvent,
  FlowBadgeShownEvent,
  FlowBadgeTickedEvent,
  FlowModalEvaluatedEvent,
  FlowModalStartedEvent,
  FlowModalTimedOutEvent,
  FlowStepActivatedEvent,
  FlowStepClickedEvent,
  FlowStepDeactivatedEvent,
  FlowStepHiddenEvent,
  FlowStepShownEvent,
  FlowStepStartedEvent,
} from '../events.js';
import { addEventListeners } from '../helpers.js';
import close from '../icons/close.svg?raw';
import closeBox from '../icons/close-box.svg?raw';
import closeBoxOutline from '../icons/close-box-outline.svg?raw';
import closeCircle from '../icons/close-circle.svg?raw';
import closeCircleOutline from '../icons/close-circle-outline.svg?raw';
import closeThick from '../icons/close-thick.svg?raw';
import type { FlowBadge } from './flow-badge.js';
import { FlowElement } from './flow-element.js';

const TIMER_INTERVAL = 200;
const ICON_SCALE = 0.6;

/**
 * `<flow-step>` represents a single step in a flow.
 * It can show a modal dialog and/or a badge.
 */
@customElement('flow-step')
export class FlowStep extends FlowElement {
  #initial = false;
  #startedAt: number | null = null;
  #timerController: TimerController;
  #removeListeners: () => void = () => {};

  @state() private _active = false;
  @state() private _visible = false;
  @state() private _hiding = false;

  @queryParentElement()
  private _parent: HTMLElement | null = null;

  @queryAssignedElements({ slot: 'badge' })
  private _flowBadges!: Array<FlowBadge>;

  /**
   * Indicates if this step is ready to activate.
   */
  @property({ type: Boolean, attribute: 'ready', reflect: true })
  ready = false;

  /**
   * Indicates if this step can be skipped if a subsequent step is also ready.
   */
  @property({ type: Boolean, attribute: 'skippable', reflect: true })
  skippable = false;

  /**
   * The timeout duration (in ms) for this step.
   */
  @durationProperty({ attribute: 'timeout-duration', reflect: true })
  timeoutDuration: number | null = null;

  /**
   * Whether to show a backdrop behind the modal content.
   */
  @property({ type: Boolean, attribute: 'backdrop', reflect: true })
  backdrop = false;

  @property({ type: String, attribute: 'backdrop-background-color', reflect: true })
  backdropBackgroundColor = 'rgba(0, 0, 0, 0.2)';

  @property({ type: String, attribute: 'backdrop-show-animation', reflect: true })
  backdropShowAnimation = 'fade-in';

  @property({ type: String, attribute: 'backdrop-show-animation-duration', reflect: true })
  backdropShowAnimationDuration = '0.2s';

  @property({ type: String, attribute: 'backdrop-hide-animation', reflect: true })
  backdropHideAnimation = 'fade-out';

  @property({ type: String, attribute: 'backdrop-hide-animation-duration', reflect: true })
  backdropHideAnimationDuration = '0.2s';

  @property({ type: String, attribute: 'modal-aria-label', reflect: true })
  modalAriaLabel = 'Modal';

  @property({ type: String, attribute: 'modal-background-color', reflect: true })
  modalBackgroundColor = 'rgba(255, 255, 255, 1)';

  @property({ type: String, attribute: 'modal-box-shadow', reflect: true })
  modalBoxShadow =
    '0 11px 15px -7px rgba(0, 0, 0, 0.2), 0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.12)';

  @property({ type: String, attribute: 'modal-border', reflect: true })
  modalBorder = 'none';

  @property({ type: String, attribute: 'modal-border-radius', reflect: true })
  modalBorderRadius = '20px';

  @property({ type: String, attribute: 'modal-align-items', reflect: true })
  modalAlignItems = 'center';

  @property({ type: String, attribute: 'modal-padding', reflect: true })
  modalPadding = '20px';

  @property({ type: String, attribute: 'modal-spacing', reflect: true })
  modalSpacing = '20px';

  @property({ type: String, attribute: 'modal-max-width', reflect: true })
  modalMaxWidth = '400px';

  @property({ type: String, attribute: 'modal-show-animation', reflect: true })
  modalShowAnimation = 'zoom-in';

  @property({ type: String, attribute: 'modal-show-animation-duration', reflect: true })
  modalShowAnimationDuration = '0.2s';

  @property({ type: String, attribute: 'modal-hide-animation', reflect: true })
  modalHideAnimation = 'zoom-out';

  @property({ type: String, attribute: 'modal-hide-animation-duration', reflect: true })
  modalHideAnimationDuration = '0.2s';

  @property({ type: String, attribute: 'hide-button-aria-label', reflect: true })
  hideButtonAriaLabel = 'Hide modal';

  @property({ type: String, attribute: 'hide-button-size', reflect: true })
  hideButtonSize = '40px';

  @property({ type: String, attribute: 'hide-button-padding', reflect: true })
  hideButtonPadding = '5px';

  @property({ type: String, attribute: 'hide-button-icon', reflect: true })
  hideButtonIcon: string | null = null;

  @property({ type: String, attribute: 'hide-button-color', reflect: true })
  hideButtonColor = 'rgba(0, 0, 0, 1)';

  @property({ type: String, attribute: 'step-z-index', reflect: true })
  stepZIndex = '2147483647';

  constructor() {
    super();

    this.#timerController = new TimerController(this, TIMER_INTERVAL, () => {
      this.#tick();
      if (this.#remainingTime <= 0) {
        this.#end();
      }
    });
  }

  connectedCallback(): void {
    super.connectedCallback();

    this.#removeListeners = addEventListeners(this, [
      { type: FlowStepActivatedEvent.type, handler: this.#activatedHandler.bind(this) },
      { type: FlowStepDeactivatedEvent.type, handler: this.#deactivatedHandler.bind(this) },
      { type: FlowStepShownEvent.type, handler: this.#shownHandler.bind(this) },
      { type: FlowStepHiddenEvent.type, handler: this.#hiddenHandler.bind(this) },
      { type: FlowStepStartedEvent.type, handler: this.#startedHandler.bind(this) },
    ]);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();

    this.#removeListeners();
  }

  /**
   * Returns whether this step is currently active.
   */
  get active(): boolean {
    return this._active;
  }

  /**
   * Returns whether the modal content is currently visible.
   */
  get visible(): boolean {
    return this._visible;
  }

  /**
   * Hides the modal content programmatically.
   */
  hideModal(): void {
    if (!this._active) {
      throw new FlowModalError('Cannot hide <flow-step> while it is not active.');
    }
    if (!this._visible) return;

    this.#hide();
  }

  /**
   * Show the modal content programmatically.
   */
  showModal(): void {
    if (!this._active) {
      throw new FlowModalError('Cannot hide <flow-step> while it is not active.');
    }
    if (this._visible) return;

    this.#hideFlowBadge();
    this.#show();
  }

  protected render(): TemplateResult {
    const backdropStyle = styleMap({ zIndex: `var(--step-z-index, ${this.stepZIndex})` });
    const backdropBackgroundStyle = styleMap({
      '--show-animation': `var(--backdrop-show-animation, ${this.backdropShowAnimation})`,
      '--show-animation-duration': `var(--backdrop-show-animation-duration, ${this.backdropShowAnimationDuration})`,
      '--hide-animation': `var(--backdrop-hide-animation, ${this.backdropHideAnimation})`,
      '--hide-animation-duration': `var(--backdrop-hide-animation-duration, ${this.backdropHideAnimationDuration})`,
      backgroundColor: `var(--backdrop-background-color, ${this.backdropBackgroundColor})`,
    });
    const modalSectionStyle = styleMap({
      zIndex: `var(--step-z-index, ${this.stepZIndex})`,
      alignItems: `var(--modal-align-items, ${this.modalAlignItems})`,
      padding: `var(--modal-spacing, ${this.modalSpacing})`,
    });
    const modalContainerStyle = styleMap({
      '--show-animation': `var(--modal-show-animation, ${this.modalShowAnimation})`,
      '--show-animation-duration': `var(--modal-show-animation-duration, ${this.modalShowAnimationDuration})`,
      '--hide-animation': `var(--modal-hide-animation, ${this.modalHideAnimation})`,
      '--hide-animation-duration': `var(--modal-hide-animation-duration, ${this.modalHideAnimationDuration})`,
      maxWidth: `var(--modal-max-width, ${this.modalMaxWidth})`,
    });
    const modalContentStyle = styleMap({
      backgroundColor: `var(--modal-background-color, ${this.modalBackgroundColor})`,
      boxShadow: `var(--modal-box-shadow, ${this.modalBoxShadow})`,
      border: `var(--modal-border, ${this.modalBorder})`,
      borderRadius: `var(--modal-border-radius, ${this.modalBorderRadius})`,
      padding: `var(--modal-padding, ${this.modalPadding})`,
    });
    const hideButtonStyle = styleMap({
      color: `var(--hide-button-color, ${this.hideButtonColor})`,
      padding: `var(--hide-button-padding, ${this.hideButtonPadding})`,
    });
    const hideButtonImageContainerStyle = styleMap({
      height: `calc(var(--hide-button-size, ${this.hideButtonSize}) * ${ICON_SCALE})`,
      width: `calc(var(--hide-button-size, ${this.hideButtonSize}) * ${ICON_SCALE})`,
    });
    const hideButtonImageContentStyle = styleMap({
      height: `calc(var(--hide-button-size, ${this.hideButtonSize}) * ${ICON_SCALE})`,
      width: `calc(var(--hide-button-size, ${this.hideButtonSize}) * ${ICON_SCALE})`,
    });

    return html`
      ${this.backdrop
        ? html`
            <aside
              class=${classMap({
                backdrop: true,
                'backdrop--hiding': this._hiding,
                'backdrop--visible': this._active && this._visible,
              })}
              role="presentation"
              style=${backdropStyle}
              @click=${this.backdropClickedHandler}
            >
              <div class="backdrop__background" style=${backdropBackgroundStyle}></div>
            </aside>
          `
        : nothing}
      <section
        role="dialog"
        aria-label=${this.modalAriaLabel}
        class=${classMap({
          modal: true,
          'modal--hiding': this._hiding,
          'modal--visible': this._active && this._visible,
        })}
        style=${modalSectionStyle}
      >
        <article class="modal__container" style=${modalContainerStyle}>
          <div class="modal__content" role="document" style=${modalContentStyle} @click=${this.contentClickedHandler}>
            ${this.hideButtonIcon
              ? html`
                  <button
                    type="button"
                    class="modal__hide-button-content"
                    aria-label=${this.hideButtonAriaLabel}
                    title=${this.hideButtonAriaLabel}
                    style=${hideButtonStyle}
                    @click=${this.hideIconClickedHandler}
                  >
                    <div class="modal__hide-button-image-container" style=${hideButtonImageContainerStyle}>
                      ${this.#hideButtonIconSVG
                        ? unsafeSVG(this.#hideButtonIconSVG)
                        : html`
                            <img
                              class="modal__hide-button-image-content"
                              style=${hideButtonImageContentStyle}
                              src="${this.hideButtonIcon}"
                            />
                          `}
                    </div>
                  </button>
                `
              : nothing}
            <slot></slot>
          </div>
        </article>
      </section>
      <slot name="badge" @slotchange=${this.#slotchangeHandler}></slot>
    `;
  }

  protected firstUpdated(): void {
    this.#validateParentElement();
    this.#validateAssignedElements();
  }

  protected willUpdate(changedProps: Map<string, unknown>): void {
    if (changedProps.has('ready') && this.ready) {
      this.#evaluateFlowModal();
    }
  }

  @eventOptions({ capture: false })
  private backdropClickedHandler(e: Event): void {
    e.stopPropagation();

    this.#dispatchClickEvent('backdrop');
    this.#hide();
  }

  @eventOptions({ capture: false })
  private contentClickedHandler(): void {
    this.#dispatchClickEvent('content');
  }

  @eventOptions({ capture: false })
  private hideIconClickedHandler(e: Event): void {
    e.stopPropagation();

    this.#dispatchClickEvent('hide-icon');
    this.#hide();
  }

  #validateParentElement(): void {
    if (!this._parent || this._parent.tagName !== 'FLOW-MODAL') {
      throw new FlowModalError('<flow-step> must be a child of <flow-modal>.');
    }
  }

  #validateAssignedElements(): void {
    if (this._flowBadges.length >= 2) {
      throw new FlowModalError('<flow-step> can only contain at most one <flow-badge>.');
    }
  }

  #slotchangeHandler(): void {
    this.#validateAssignedElements();
    if (this._active) {
      this.#activateFlowBadge();
      if (!this.#initial) {
        this.#showFlowBadge();
      }
    }
  }

  #activatedHandler(event: Event): void {
    assertEventType<FlowStepActivatedEvent>(event, FlowStepActivatedEvent.type);

    this.#initial = event.detail.initial;
    this._active = true;

    this.#activateFlowBadge();

    if (this.#initial) {
      this.#show();
    } else {
      this.#startFlowModal();
    }

    if (!this.#initial) {
      this.#showFlowBadge();
    }
  }

  #deactivatedHandler(event: Event): void {
    assertEventType<FlowStepDeactivatedEvent>(event, FlowStepDeactivatedEvent.type);

    this._active = false;
    this._visible = false;
    this._hiding = false;
    this.#timerController.stop();
    this.#startedAt = null;
    this.#deactivateFlowBadge();
  }

  #shownHandler(event: Event): void {
    assertEventType<FlowStepShownEvent>(event, FlowStepShownEvent.type);

    this._visible = true;
    this._hiding = false;
  }

  #hiddenHandler(event: Event): void {
    assertEventType<FlowStepHiddenEvent>(event, FlowStepHiddenEvent.type);

    if (this.#initial) {
      this.#startFlowModal();

      this.#initial = false;
    }

    this._visible = false;
    this._hiding = true;
  }

  #startedHandler(event: Event): void {
    assertEventType<FlowStepStartedEvent>(event, FlowStepStartedEvent.type);

    if (this.timeoutDuration === null) return;

    this.#startedAt = event.detail.startedAt;
    this.#timerController.start();
    this.#tick();
    if (this.#remainingTime <= 0) {
      this.#end();
    }
  }

  #show(): void {
    this.dispatchEvent(new FlowStepShownEvent());
  }

  #hide(): void {
    this.#dispatchHideEvent();
    this.#showFlowBadge();
  }

  #tick(): void {
    this.#tickFlowBadge();
  }

  #end(): void {
    this.#deactivateFlowBadge();
    this.#timeOutFlowModal();
  }

  #startFlowModal(): void {
    this._parent!.dispatchEvent(new FlowModalStartedEvent({ initial: this.#initial }));
  }

  #timeOutFlowModal(): void {
    this._parent!.dispatchEvent(new FlowModalTimedOutEvent());
  }

  #evaluateFlowModal(): void {
    this._parent!.dispatchEvent(new FlowModalEvaluatedEvent());
  }

  #activateFlowBadge(): void {
    this.#flowBadge?.dispatchEvent(new FlowBadgeActivatedEvent({ initial: this.#initial }));
  }

  #deactivateFlowBadge(): void {
    this.#flowBadge?.dispatchEvent(new FlowBadgeDeactivatedEvent());
  }

  #showFlowBadge(): void {
    this.#flowBadge?.dispatchEvent(new FlowBadgeShownEvent());
  }

  #hideFlowBadge(): void {
    this.#flowBadge?.dispatchEvent(new FlowBadgeHiddenEvent());
  }

  #tickFlowBadge(): void {
    this.#flowBadge?.dispatchEvent(new FlowBadgeTickedEvent({ remainingTime: this.#remainingTime }));
  }

  #dispatchHideEvent(): void {
    this.dispatchEvent(new FlowStepHiddenEvent());
  }

  #dispatchClickEvent(area: string): void {
    this.dispatchEvent(new FlowStepClickedEvent({ area }));
  }

  get #flowBadge(): FlowBadge | null {
    return this._flowBadges[0] ?? null;
  }

  get #remainingTime(): number {
    return this.#endingAt - Math.min(Date.now(), this.#endingAt);
  }

  get #endingAt(): number {
    if (this.timeoutDuration === null) {
      throw new FlowModalError('"timeout-duration" is not set.');
    }
    if (this.#startedAt === null) {
      throw new FlowModalError('Countdown is not started.');
    }

    return this.#startedAt + this.timeoutDuration;
  }

  get #hideButtonIconSVG(): string | null {
    if (!this.hideButtonIcon) return null;

    const iconMap: Record<string, string> = {
      close,
      'close-thick': closeThick,
      'close-box': closeBox,
      'close-box-outline': closeBoxOutline,
      'close-circle': closeCircle,
      'close-circle-outline': closeCircleOutline,
    };
    return iconMap[this.hideButtonIcon] ?? null;
  }

  /**
   * Lock the slot attribute to "step" so that this element can only be used
   * in the <flow-modal>’s 'step' slot.
   */
  protected static forcedSlotName = 'step';

  static styles = [
    FlowElement.styles,
    css`
      .backdrop {
        position: fixed;
        inset: 0;
        pointer-events: none;
      }

      .backdrop__background {
        position: relative;
        width: 100%;
        height: 100%;
        opacity: 0;
      }

      .backdrop--hiding .backdrop__background {
        animation-name: var(--hide-animation);
        animation-duration: var(--hide-animation-duration);
      }

      .backdrop--visible .backdrop__background {
        pointer-events: auto;
        animation-name: var(--show-animation);
        animation-duration: var(--show-animation-duration);
        opacity: 1;
      }

      .modal {
        position: fixed;
        inset: 0;
        display: flex;
        justify-content: center;
        pointer-events: none;
      }

      .modal__container {
        position: relative;
        width: 100%;
        opacity: 0;
      }

      .modal--hiding .modal__container {
        animation-name: var(--hide-animation);
        animation-duration: var(--hide-animation-duration);
      }

      .modal--visible .modal__container {
        pointer-events: auto;
        animation-name: var(--show-animation);
        animation-duration: var(--show-animation-duration);
        opacity: 1;
      }

      .modal__content {
        position: relative;
        overflow: hidden;
      }

      .modal__hide-button-content {
        background-color: transparent;
        cursor: pointer;
        border: none;
        padding: 0;
        float: right;
        outline: none;
        appearance: none;
      }

      .modal__hide-button-image-content {
        position: absolute;
        inset: 0;
        margin: auto;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'flow-step': FlowStep;
  }
}
