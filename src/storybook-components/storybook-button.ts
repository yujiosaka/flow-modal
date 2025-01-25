import type { TemplateResult } from 'lit';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

@customElement('storybook-button')
export class StorybookButton extends LitElement {
  @property({ type: Boolean, attribute: 'primary', reflect: true })
  primary: boolean | undefined;

  @property({ type: String, attribute: 'background-color', reflect: true })
  backgroundColor: string | undefined;

  @property({ type: String, attribute: 'size', reflect: true })
  size: 'small' | 'medium' | 'large' | undefined;

  @property({ type: String, attribute: 'label', reflect: true })
  label = 'Button';

  render(): TemplateResult {
    const mode = this.primary ? 'storybook-button--primary' : 'storybook-button--secondary';

    return html`
      <button
        type="button"
        class=${['storybook-button', `storybook-button--${this.size || 'medium'}`, mode].join(' ')}
        style=${styleMap({ backgroundColor: this.backgroundColor })}
      >
        ${this.label}
      </button>
    `;
  }

  static styles = css`
    .storybook-button {
      display: inline-block;
      cursor: pointer;
      border: 0;
      border-radius: 3em;
      font-weight: 700;
      line-height: 1;
      font-family: 'Nunito Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    }
    .storybook-button--primary {
      background-color: #555ab9;
      color: white;
    }
    .storybook-button--secondary {
      box-shadow: rgba(0, 0, 0, 0.15) 0px 0px 0px 1px inset;
      background-color: transparent;
      color: #333;
    }
    .storybook-button--small {
      padding: 10px 16px;
      font-size: 12px;
    }
    .storybook-button--medium {
      padding: 11px 20px;
      font-size: 14px;
    }
    .storybook-button--large {
      padding: 12px 24px;
      font-size: 16px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'storybook-button': StorybookButton;
  }
}
