import { format } from 'date-fns';
import type { TemplateResult } from 'lit';
import { css, html, nothing } from 'lit';
import { customElement, eventOptions, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import ms from 'ms';

import { assertEventType } from '../assertions.js';
import { durationProperty, queryParentElement } from '../decorators.js';
import { FlowModalError } from '../errors.js';
import {
  FlowBadgeActivatedEvent,
  FlowBadgeClickedEvent,
  FlowBadgeDeactivatedEvent,
  FlowBadgeHiddenEvent,
  FlowBadgeShownEvent,
  FlowBadgeTickedEvent,
  FlowStepShownEvent,
} from '../events.js';
import { addEventListeners } from '../helpers.js';
import bell from '../icons/bell.svg?raw';
import envelope from '../icons/envelope.svg?raw';
import gift from '../icons/gift.svg?raw';
import megaphone from '../icons/megaphone.svg?raw';
import tag from '../icons/tag.svg?raw';
import { FlowElement } from './flow-element.js';

/**
 * `<flow-badge>` is an optional badge that can be displayed by a `<flow-step>`.
 * It can show a hint, a button with text/icon, and/or a countdown.
 */
@customElement('flow-badge')
export class FlowBadge extends FlowElement {
  #initial = false;
  #timerId: ReturnType<typeof setTimeout> | null = null;
  #removeListeners: () => void = () => {};

  @state() private _active = false;
  @state() private _hintVisible = false;
  @state() private _hintHiding = false;
  @state() private _buttonVisible = false;
  @state() private _buttonHiding = false;
  @state() private _buttonCountDownText: string | null = null;

  @queryParentElement()
  private _parent: HTMLElement | null = null;

  /**
   * Positioning properties for the badge.
   */
  @property({ type: String, attribute: 'badge-top', reflect: true })
  badgeTop = 'auto';

  @property({ type: String, attribute: 'badge-left', reflect: true })
  badgeLeft = 'auto';

  @property({ type: String, attribute: 'badge-bottom', reflect: true })
  badgeBottom = 'auto';

  @property({ type: String, attribute: 'badge-right', reflect: true })
  badgeRight = 'auto';

  /**
   * The z-index for the badge and hint.
   */
  @property({ type: String, attribute: 'badge-z-index', reflect: true })
  badgeZIndex = '2147483647';

  @property({ type: String, attribute: 'hint-aria-label', reflect: true })
  hintAriaLabel = 'Hint';

  /**
   * Optional text for the hint bubble.
   */
  @property({ type: String, attribute: 'hint-text', reflect: true })
  hintText: string | null = null;

  /**
   * Duration (in ms) for which the hint remains visible.
   */
  @durationProperty({ attribute: 'hint-duration', reflect: true })
  hintDuration: number = ms('5s');

  @property({ type: String, attribute: 'hint-color', reflect: true })
  hintColor = 'rgba(0, 0, 0, 1)';

  @property({ type: String, attribute: 'hint-background-color', reflect: true })
  hintBackgroundColor = 'rgba(255, 255, 255, 1)';

  @property({ type: String, attribute: 'hint-font-size', reflect: true })
  hintFontSize = '12px';

  @property({ type: String, attribute: 'hint-width', reflect: true })
  hintWidth = '150px';

  @property({ type: String, attribute: 'hint-border', reflect: true })
  hintBorder = 'none';

  @property({ type: String, attribute: 'hint-border-radius', reflect: true })
  hintBorderRadius = '75px';

  @property({ type: String, attribute: 'hint-box-shadow', reflect: true })
  hintBoxShadow =
    '0px 3px 3px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12)';

  @property({ type: String, attribute: 'hint-padding', reflect: true })
  hintPadding = '10px';

  @property({ type: String, attribute: 'hint-spacing', reflect: true })
  hintSpacing = '10px';

  @property({ type: String, attribute: 'hint-show-animation', reflect: true })
  hintShowAnimation = 'fade-in';

  @property({ type: String, attribute: 'hint-show-animation-duration', reflect: true })
  hintShowAnimationDuration = '0.2s';

  @property({ type: String, attribute: 'hint-hide-animation', reflect: true })
  hintHideAnimation = 'fade-out';

  @property({ type: String, attribute: 'hint-hide-animation-duration', reflect: true })
  hintHideAnimationDuration = '0.2s';

  @property({ type: String, attribute: 'button-aria-label', reflect: true })
  buttonAriaLabel = 'Show modal';

  /**
   * A keyword (e.g. "bell", "gift") or image URL for the badge icon.
   */
  @property({ type: String, attribute: 'button-icon', reflect: true })
  buttonIcon: string | null = null;

  @property({ type: String, attribute: 'button-text', reflect: true })
  buttonText: string | null = null;

  /**
   * Format string to format the remaining time (using date-fns).
   */
  @property({ type: String, attribute: 'button-count-down-format', reflect: true })
  buttonCountDownFormat: string | null = null;

  @property({ type: String, attribute: 'button-color', reflect: true })
  buttonColor = 'rgba(0, 0, 0, 1)';

  @property({ type: String, attribute: 'button-background-color', reflect: true })
  buttonBackgroundColor = 'rgba(255, 255, 255, 1)';

  @property({ type: String, attribute: 'button-font-size', reflect: true })
  buttonFontSize = '12px';

  @property({ type: String, attribute: 'button-size', reflect: true })
  buttonSize = '60px';

  @property({ type: String, attribute: 'button-border', reflect: true })
  buttonBorder = 'none';

  @property({ type: String, attribute: 'button-border-radius', reflect: true })
  buttonBorderRadius = '50%';

  @property({ type: String, attribute: 'button-box-shadow', reflect: true })
  buttonBoxShadow = '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px rgba(0, 0, 0, 0.14), 0px 1px 10px rgba(0, 0, 0, 0.12)';

  @property({ type: String, attribute: 'button-show-animation', reflect: true })
  buttonShowAnimation = 'zoom-in';

  @property({ type: String, attribute: 'button-show-animation-duration', reflect: true })
  buttonShowAnimationDuration = '0.2s';

  @property({ type: String, attribute: 'button-hide-animation', reflect: true })
  buttonHideAnimation = 'zoom-out';

  @property({ type: String, attribute: 'button-hide-animation-duration', reflect: true })
  buttonHideAnimationDuration = '0.2s';

  connectedCallback(): void {
    super.connectedCallback();

    this.#removeListeners = addEventListeners(this, [
      { type: FlowBadgeActivatedEvent.type, handler: this.#activatedHandler.bind(this) },
      { type: FlowBadgeDeactivatedEvent.type, handler: this.#deactivatedHandler.bind(this) },
      { type: FlowBadgeShownEvent.type, handler: this.#shownHandler.bind(this) },
      { type: FlowBadgeHiddenEvent.type, handler: this.#hiddenHandler.bind(this) },
      { type: FlowBadgeTickedEvent.type, handler: this.#tickedHandler.bind(this) },
    ]);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();

    this.#removeListeners();
  }

  /**
   * Returns whether the badge is active.
   */
  get active(): boolean {
    return this._active;
  }

  /**
   * Returns whether the badge (hint or button) is visible.
   */
  get visible(): boolean {
    return this._hintVisible || this._buttonVisible;
  }

  protected render(): TemplateResult {
    const hintStyle = styleMap({
      insetBlockStart: `var(--badge-top, ${this.badgeTop})`,
      insetInlineStart: `var(--badge-left, ${this.badgeLeft})`,
      insetBlockEnd: `var(--badge-bottom, ${this.badgeBottom})`,
      insetInlineEnd: `var(--badge-right, ${this.badgeRight})`,
      zIndex: `var(--badge-z-index, ${this.badgeZIndex})`,
      width: `var(--hint-width, ${this.hintWidth})`,
      marginBlockStart: `calc(var(--button-size, ${this.buttonSize}) + var(--hint-spacing, ${this.hintSpacing}))`,
      marginBlockEnd: `calc(var(--button-size, ${this.buttonSize}) + var(--hint-spacing, ${this.hintSpacing}))`,
      '--show-animation': `var(--hint-show-animation, ${this.hintShowAnimation})`,
      '--show-animation-duration': `var(--hint-show-animation-duration, ${this.hintShowAnimationDuration})`,
      '--hide-animation': `var(--hint-hide-animation, ${this.hintHideAnimation})`,
      '--hide-animation-duration': `var(--hint-hide-animation-duration, ${this.hintHideAnimationDuration})`,
    });

    const hintContainerStyle = styleMap({
      color: `var(--hint-color, ${this.hintColor})`,
      backgroundColor: `var(--hint-background-color, ${this.hintBackgroundColor})`,
      fontSize: `var(--hint-font-size, ${this.hintFontSize})`,
      padding: `var(--hint-padding, ${this.hintPadding})`,
      border: `var(--hint-border, ${this.hintBorder})`,
      borderRadius: `var(--hint-border-radius, ${this.hintBorderRadius})`,
      boxShadow: `var(--hint-box-shadow, ${this.hintBoxShadow})`,
    });

    const buttonWrapperStyle = styleMap({
      insetBlockStart: `var(--badge-top, ${this.badgeTop})`,
      insetInlineStart: `var(--badge-left, ${this.badgeLeft})`,
      insetBlockEnd: `var(--badge-bottom, ${this.badgeBottom})`,
      insetInlineEnd: `var(--badge-right, ${this.badgeRight})`,
      zIndex: `var(--badge-z-index, ${this.badgeZIndex})`,
      height: `var(--button-size, ${this.buttonSize})`,
      width: `var(--button-size, ${this.buttonSize})`,
      '--show-animation': `var(--button-show-animation, ${this.buttonShowAnimation})`,
      '--show-animation-duration': `var(--button-show-animation-duration, ${this.buttonShowAnimationDuration})`,
      '--hide-animation': `var(--button-hide-animation, ${this.buttonHideAnimation})`,
      '--hide-animation-duration': `var(--button-hide-animation-duration, ${this.buttonHideAnimationDuration})`,
    });

    const buttonContainerStyle = styleMap({
      backgroundColor: `var(--button-background-color, ${this.buttonBackgroundColor})`,
      border: `var(--button-border, ${this.buttonBorder})`,
      borderRadius: `var(--button-border-radius, ${this.buttonBorderRadius})`,
      boxShadow: `var(--button-box-shadow, ${this.buttonBoxShadow})`,
    });

    const buttonContentStyle = styleMap({
      color: `var(--button-color, ${this.buttonColor})`,
    });

    const buttonImageContainerStyle = styleMap({
      width: `calc(var(--button-size, ${this.buttonSize}) * 0.6)`,
      height: `calc(var(--button-size, ${this.buttonSize}) * 0.6)`,
    });

    const buttonImageContentStyle = styleMap({
      height: `calc(var(--button-size, ${this.buttonSize}) * 0.6)`,
      width: `calc(var(--button-size, ${this.buttonSize}) * 0.6)`,
    });

    const buttonTextContentStyle = styleMap({
      color: `var(--button-color, ${this.buttonColor})`,
      fontSize: `var(--button-font-size, ${this.buttonFontSize})`,
    });

    return html`
      ${this.hintText
        ? html`
            <aside
              class=${classMap({
                hint: true,
                'hint--hiding': this._hintHiding,
                'hint--visible': this._active && this._hintVisible,
              })}
              aria-label=${this.hintAriaLabel}
              style=${hintStyle}
              @click=${this.hintClickedHandler}
            >
              <div class="hint__container" style=${hintContainerStyle}>${this.hintText}</div>
            </aside>
          `
        : nothing}
      <aside
        class=${classMap({
          button: true,
          'button--hiding': this._buttonHiding,
          'button--visible': this._active && this._buttonVisible,
        })}
        role="presentation"
        style=${buttonWrapperStyle}
        @click=${this.buttonClickedHandler}
      >
        <button class="button__container" type="button" aria-label=${this.buttonAriaLabel} style=${buttonContainerStyle}>
          <div class="button__content" style=${buttonContentStyle}>
            ${this.buttonIcon
              ? html`
                  <div class="button__image-container" style=${buttonImageContainerStyle}>
                    ${this.#buttonIconSVG
                      ? unsafeSVG(this.#buttonIconSVG)
                      : html`
                          <img class="button__image-content" style=${buttonImageContentStyle} src="${this.buttonIcon}" />
                        `}
                  </div>
                `
              : nothing}
            ${(this._buttonCountDownText ?? this.buttonText)
              ? html`
                  <div class="button__text-container">
                    <span class="button__text-content" style=${buttonTextContentStyle}>
                      ${this._buttonCountDownText ?? this.buttonText ?? ''}
                    </span>
                  </div>
                `
              : nothing}
          </div>
        </button>
      </aside>
    `;
  }

  protected firstUpdated(): void {
    this.#validateParentElement();
  }

  @eventOptions({ capture: false })
  private hintClickedHandler(): void {
    this.#dispatchClickEvent('hint');
    this.#hide();
  }

  @eventOptions({ capture: false })
  private buttonClickedHandler(e: Event): void {
    e.stopPropagation();

    this.#dispatchClickEvent('button');
    this.#hide();
  }

  #validateParentElement(): void {
    if (!this._parent || this._parent.tagName !== 'FLOW-STEP') {
      throw new FlowModalError('<flow-badge> must be a child of <flow-step>.');
    }
  }

  #activatedHandler(event: Event): void {
    assertEventType<FlowBadgeActivatedEvent>(event, FlowBadgeActivatedEvent.type);

    this.#initial = event.detail.initial;
    this._active = true;
  }

  #deactivatedHandler(event: Event): void {
    assertEventType<FlowBadgeDeactivatedEvent>(event, FlowBadgeDeactivatedEvent.type);

    this._active = false;
    this._hintVisible = false;
    this._buttonVisible = false;
    this._hintHiding = false;
    this._buttonHiding = false;

    if (this.#timerId) {
      clearTimeout(this.#timerId);
      this.#timerId = null;
    }
  }

  #shownHandler(event: Event): void {
    assertEventType<FlowBadgeShownEvent>(event, FlowBadgeShownEvent.type);

    this._buttonVisible = true;
    this._hintHiding = false;
    this._buttonHiding = false;

    if (this.#initial) {
      this._hintVisible = true;

      if (!this.#timerId) {
        this.#timerId = setTimeout(() => {
          clearTimeout(this.#timerId!);
          this.#timerId = null;

          this._hintVisible = false;
          this._hintHiding = true;

          this.requestUpdate();
        }, this.hintDuration);
      }
    }
  }

  #hiddenHandler(event: Event): void {
    assertEventType<FlowBadgeHiddenEvent>(event, FlowBadgeHiddenEvent.type);

    this.#initial = false;
    this._hintVisible = false;
    this._buttonVisible = false;
    this._buttonHiding = true;

    if (this.#timerId) {
      clearTimeout(this.#timerId);
      this.#timerId = null;
    }
  }

  #tickedHandler(event: Event): void {
    assertEventType<FlowBadgeTickedEvent>(event, FlowBadgeTickedEvent.type);

    if (this.buttonCountDownFormat) {
      const date = new Date(event.detail.remainingTime);
      this._buttonCountDownText = format(date, this.buttonCountDownFormat);
    } else {
      this._buttonCountDownText = null;
    }
  }

  #hide(): void {
    this.#dispatchHideEvent();
    this.#showFlowStep();
  }

  #showFlowStep(): void {
    this._parent!.dispatchEvent(new FlowStepShownEvent());
  }

  #dispatchHideEvent(): void {
    this.dispatchEvent(new FlowBadgeHiddenEvent());
  }

  #dispatchClickEvent(area: string): void {
    this.dispatchEvent(new FlowBadgeClickedEvent({ area }));
  }

  get #buttonIconSVG(): string | null {
    if (!this.buttonIcon) return null;

    const iconMap: Record<string, string> = {
      bell,
      envelope,
      gift,
      megaphone,
      tag,
    };
    return iconMap[this.buttonIcon] ?? null;
  }

  /**
   * Lock the slot attribute to "badge" so that this element can only be used
   * in the <flow-step>’s 'badge' slot.
   */
  protected static forcedSlotName = 'badge';

  static styles = [
    FlowElement.styles,
    css`
      .hint {
        position: fixed;
        opacity: 0;
        pointer-events: none;
      }

      .hint--hiding {
        animation-name: var(--hide-animation);
        animation-duration: var(--hide-animation-duration);
      }

      .hint--visible {
        animation-name: var(--show-animation);
        animation-duration: var(--show-animation-duration);
        opacity: 1;
        pointer-events: auto;
      }

      .hint__container {
        position: relative;
        word-break: break-all;
        cursor: pointer;
      }

      .button {
        position: fixed;
        opacity: 0;
        pointer-events: none;
      }

      .button--hiding {
        animation-name: var(--hide-animation);
        animation-duration: var(--hide-animation-duration);
      }

      .button--visible {
        animation-name: var(--show-animation);
        animation-duration: var(--show-animation-duration);
        opacity: 1;
        pointer-events: auto;
      }

      .button__container {
        position: relative;
        cursor: pointer;
        height: 100%;
        width: 100%;
      }

      .button__content {
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        inset: 0;
        margin: auto;
        text-align: center;
        width: 100%;
      }

      .button__image-container {
        position: relative;
        text-align: center;
      }

      .button__image-content {
        position: absolute;
        inset: 0;
        margin: auto;
      }

      .button__text-container {
        text-align: center;
      }

      .button__text-content {
        display: inline-block;
        font-variant-numeric: lining-nums;
        font-weight: bold;
        white-space: nowrap;
        word-break: keep-all;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'flow-badge': FlowBadge;
  }
}
