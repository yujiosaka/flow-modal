import type { CSSResultGroup } from 'lit';
import { css, LitElement } from 'lit';

/**
 * Abstract base class for FlowModal elements.
 * It enforces a locked slot attribute if required and contains shared styles/animations.
 */
export abstract class FlowElement extends LitElement {
  /**
   * Subclasses may override this property to lock the `slot` attribute.
   */
  protected static forcedSlotName: string | null = null;

  /**
   * Observe the `slot` attribute if `forcedSlotName` is set.
   */
  static get observedAttributes(): string[] {
    const parentAttrs = super.observedAttributes ?? [];
    if (this.forcedSlotName) {
      return [...parentAttrs, 'slot'];
    }
    return parentAttrs;
  }

  constructor() {
    super();

    // Force the 'slot' attribute to always be the same as forcedSlotName.
    const slotName = (this.constructor as typeof FlowElement).forcedSlotName;
    if (slotName) {
      this.setAttribute('slot', slotName);
    }
  }

  /**
   * Whenever an observed attribute changes, if it's `slot` and we've specified a forcedSlotName,
   * we override it back to that forcedSlotName. This effectively locks the slot.
   */
  attributeChangedCallback(name: string, oldVal: string, newVal: string) {
    super.attributeChangedCallback(name, oldVal, newVal);

    const slotName = (this.constructor as typeof FlowElement).forcedSlotName;
    if (name === 'slot' && slotName && newVal !== slotName) {
      this.setAttribute('slot', slotName);
    }
  }

  static styles = css`
    @keyframes fade-in {
      0% {
        opacity: 0;
        animation-timing-function: ease-in-out;
      }
      100% {
        opacity: 1;
      }
    }

    @keyframes fade-out {
      0% {
        opacity: 1;
        animation-timing-function: ease-in-out;
      }
      100% {
        opacity: 0;
      }
    }

    @keyframes fly-in-from-left {
      0% {
        opacity: 0;
        transform: translateX(-20%);
        animation-timing-function: ease-out;
      }
      80% {
        transform: translateX(5%);
        animation-timing-function: ease-in;
      }
      100% {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes fly-out-to-left {
      0% {
        opacity: 1;
        transform: translateX(0);
        animation-timing-function: ease-in;
      }
      20% {
        transform: translateX(5%);
        animation-timing-function: ease-out;
      }
      100% {
        opacity: 0;
        transform: translateX(-20%);
      }
    }

    @keyframes fly-in-from-right {
      0% {
        opacity: 0;
        transform: translateX(20%);
        animation-timing-function: ease-out;
      }
      80% {
        transform: translateX(-5%);
        animation-timing-function: ease-in;
      }
      100% {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes fly-out-to-right {
      0% {
        opacity: 1;
        transform: translateX(0);
        animation-timing-function: ease-in;
      }
      20% {
        transform: translateX(-5%);
        animation-timing-function: ease-out;
      }
      100% {
        opacity: 0;
        transform: translateX(20%);
      }
    }

    @keyframes fly-in-from-top {
      0% {
        opacity: 0;
        transform: translateY(-20%);
        animation-timing-function: ease-out;
      }
      80% {
        transform: translateY(5%);
        animation-timing-function: ease-in;
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fly-out-to-top {
      0% {
        opacity: 1;
        transform: translateY(0);
        animation-timing-function: ease-in;
      }
      20% {
        transform: translateY(5%);
        animation-timing-function: ease-out;
      }
      100% {
        opacity: 0;
        transform: translateY(-20%);
      }
    }

    @keyframes fly-in-from-bottom {
      0% {
        opacity: 0;
        transform: translateY(20%);
        animation-timing-function: ease-out;
      }
      80% {
        transform: translateY(-5%);
        animation-timing-function: ease-in;
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fly-out-to-bottom {
      0% {
        opacity: 1;
        transform: translateY(0);
        animation-timing-function: ease-in;
      }
      20% {
        transform: translateY(-5%);
        animation-timing-function: ease-out;
      }
      100% {
        opacity: 0;
        transform: translateY(20%);
      }
    }

    @keyframes zoom-in {
      0% {
        opacity: 0;
        transform: scale(0.8);
        animation-timing-function: ease-out;
      }
      80% {
        transform: scale(1.05);
        animation-timing-function: ease-in;
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    }

    @keyframes zoom-out {
      0% {
        opacity: 1;
        transform: scale(1);
        animation-timing-function: ease-in;
      }
      20% {
        transform: scale(1.05);
        animation-timing-function: ease-out;
      }
      100% {
        opacity: 0;
        transform: scale(0.8);
      }
    }
  ` as CSSResultGroup;
}
