/**
 * A Storybook configuration for `<flow-modal>`, `<flow-step>`, and `<flow-badge>`.
 *
 * Demonstrates:
 * - **Single-step** usage (one `<flow-step>` inside `<flow-modal>`).
 * - **Multi-step** usage (multiple `<flow-step>` elements inside `<flow-modal>`).
 */

import '../components/flow-modal.js';
import '../components/flow-step.js';
import '../components/flow-badge.js';
import '../storybook-components/storybook-button.js';
import './flow-modal.stories.css';

import { fn } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/web-components';
import type { TemplateResult } from 'lit';
import { html, nothing } from 'lit';
import { ifDefined } from 'lit-html/directives/if-defined.js';

import type {
  FlowBadgeActivatedEvent,
  FlowBadgeClickedEvent,
  FlowBadgeDeactivatedEvent,
  FlowBadgeHiddenEvent,
  FlowBadgeShownEvent,
  FlowModalStartedEvent,
  FlowModalTimedOutEvent,
  FlowStepActivatedEvent,
  FlowStepClickedEvent,
  FlowStepDeactivatedEvent,
  FlowStepHiddenEvent,
  FlowStepShownEvent,
  FlowStepStartedEvent,
} from '../events.js';

interface FlowModalStoryArgs {
  // <flow-modal>
  deactivated: boolean;
  storages?: string;
  storageNamespace: string;
  storageDuration: string;
  onModalStarted: (event: FlowModalStartedEvent) => void;
  onModalTimedOut: (event: FlowModalTimedOutEvent) => void;

  // <flow-step>
  ready: boolean;
  skippable: boolean;
  timeoutDuration?: string;
  backdrop: boolean;
  backdropBackgroundColor: string;
  backdropShowAnimation: string;
  backdropShowAnimationDuration: string;
  backdropHideAnimation: string;
  backdropHideAnimationDuration: string;
  modalAriaLabel: string;
  modalBackgroundColor: string;
  modalBoxShadow: string;
  modalBorder: string;
  modalBorderRadius: string;
  modalAlignItems: string;
  modalPadding: string;
  modalSpacing: string;
  modalMaxWidth: string;
  modalShowAnimation: string;
  modalShowAnimationDuration: string;
  modalHideAnimation: string;
  modalHideAnimationDuration: string;
  hideButtonAriaLabel: string;
  hideButtonSize: string;
  hideButtonPadding: string;
  hideButtonIcon?: string;
  hideButtonColor: string;
  stepZIndex: string;
  onStepActivated: (event: FlowStepActivatedEvent) => void;
  onStepDeactivated: (event: FlowStepDeactivatedEvent) => void;
  onStepStarted: (event: FlowStepStartedEvent) => void;
  onStepShown: (event: FlowStepShownEvent) => void;
  onStepHidden: (event: FlowStepHiddenEvent) => void;
  onStepClicked: (event: FlowStepClickedEvent) => void;

  // <flow-badge>
  badgeTop: string;
  badgeLeft: string;
  badgeBottom: string;
  badgeRight: string;
  badgeZIndex: string;
  hintAriaLabel: string;
  hintText?: string;
  hintDuration: string;
  hintColor: string;
  hintBackgroundColor: string;
  hintFontSize: string;
  hintWidth: string;
  hintBorder: string;
  hintBorderRadius: string;
  hintBoxShadow: string;
  hintPadding: string;
  hintSpacing: string;
  hintShowAnimation: string;
  hintShowAnimationDuration: string;
  hintHideAnimation: string;
  hintHideAnimationDuration: string;
  buttonAriaLabel: string;
  buttonIcon?: string;
  buttonText?: string;
  buttonCountDownFormat?: string;
  buttonColor: string;
  buttonBackgroundColor: string;
  buttonFontSize: string;
  buttonSize: string;
  buttonBorder: string;
  buttonBorderRadius: string;
  buttonBoxShadow: string;
  buttonShowAnimation: string;
  buttonShowAnimationDuration: string;
  buttonHideAnimation: string;
  buttonHideAnimationDuration: string;
  onBadgeActivated: (event: FlowBadgeActivatedEvent) => void;
  onBadgeDeactivated: (event: FlowBadgeDeactivatedEvent) => void;
  onBadgeShown: (event: FlowBadgeShownEvent) => void;
  onBadgeHidden: (event: FlowBadgeHiddenEvent) => void;
  onBadgeClicked: (event: FlowBadgeClickedEvent) => void;
}

const meta: Meta<FlowModalStoryArgs> = {
  title: 'FlowModal',
  tags: ['autodocs'],
  argTypes: {
    // <flow-modal>
    deactivated: {
      control: 'boolean',
      description: 'Deactivates the modal and all steps if true.',
      table: { category: '<flow-modal>' },
    },
    storages: {
      control: 'text',
      description: 'Comma-separated list of storages for CascadeStorage. For example: "memory".',
      table: { category: '<flow-modal>' },
    },
    storageNamespace: {
      control: 'text',
      description: 'Unique namespace for storing flow state in local/cookie/memory. Change it for separate flows.',
      table: { category: '<flow-modal>' },
    },
    storageDuration: {
      control: 'text',
      description: 'Duration to persist flow state (e.g., "30m", "1h"). Should exceed any step timeout.',
      table: { category: '<flow-modal>' },
    },
    onModalStarted: { table: { disable: true } },
    onModalTimedOut: { table: { disable: true } },

    // <flow-step>
    ready: {
      control: 'boolean',
      description: 'Indicates if this step is currently ready to activate.',
      table: { category: '<flow-step>' },
    },
    skippable: {
      control: 'boolean',
      description: 'If true, this step is bypassed if a subsequent step is also ready.',
      table: { category: '<flow-step>' },
    },
    timeoutDuration: {
      control: 'text',
      description: 'Time limit for this step (e.g. "30m" or "120000"). Once reached, the flow times out.',
      table: { category: '<flow-step>' },
    },
    backdrop: {
      control: 'boolean',
      description: 'Whether to show a backdrop behind this step’s modal content.',
      table: { category: '<flow-step>' },
    },
    backdropBackgroundColor: {
      control: 'color',
      description: 'Backdrop’s background color.',
      table: { category: '<flow-step>' },
    },
    backdropShowAnimation: {
      control: 'select',
      options: ['fade-in', 'fly-in-from-left', 'fly-in-from-right', 'fly-in-from-top', 'fly-in-from-bottom', 'zoom-in'],
      description: 'Animation used when showing the backdrop.',
      table: { category: '<flow-step>' },
    },
    backdropShowAnimationDuration: {
      control: 'text',
      description: 'Duration for the backdrop show animation (e.g. "0.2s").',
      table: { category: '<flow-step>' },
    },
    backdropHideAnimation: {
      control: 'select',
      options: ['fade-out', 'fly-out-to-left', 'fly-out-to-right', 'fly-out-to-top', 'fly-out-to-bottom', 'zoom-out'],
      description: 'Animation used when hiding the backdrop.',
      table: { category: '<flow-step>' },
    },
    backdropHideAnimationDuration: {
      control: 'text',
      description: 'Duration for the backdrop hide animation.',
      table: { category: '<flow-step>' },
    },
    modalAriaLabel: {
      control: 'text',
      description: 'ARIA label for the modal dialog.',
      table: { category: '<flow-step>' },
    },
    modalBackgroundColor: {
      control: 'color',
      description: 'Modal background color.',
      table: { category: '<flow-step>' },
    },
    modalBoxShadow: {
      control: 'text',
      description: 'CSS box-shadow for the modal container.',
      table: { category: '<flow-step>' },
    },
    modalBorder: {
      control: 'text',
      description: 'Border for the modal container.',
      table: { category: '<flow-step>' },
    },
    modalBorderRadius: {
      control: 'text',
      description: 'Border radius for the modal container (e.g. "12px").',
      table: { category: '<flow-step>' },
    },
    modalAlignItems: {
      control: 'select',
      options: ['center', 'start', 'end'],
      description: 'Flex alignment on the cross axis inside the modal.',
      table: { category: '<flow-step>' },
    },
    modalPadding: {
      control: 'text',
      description: 'Padding inside the modal content (e.g. "20px").',
      table: { category: '<flow-step>' },
    },
    modalSpacing: {
      control: 'text',
      description: 'Spacing around the modal in the flex container.',
      table: { category: '<flow-step>' },
    },
    modalMaxWidth: {
      control: 'text',
      description: 'Max width for the modal container.',
      table: { category: '<flow-step>' },
    },
    modalShowAnimation: {
      control: 'select',
      options: ['fade-in', 'fly-in-from-left', 'fly-in-from-right', 'fly-in-from-top', 'fly-in-from-bottom', 'zoom-in'],
      description: 'Animation used when showing the modal.',
      table: { category: '<flow-step>' },
    },
    modalShowAnimationDuration: {
      control: 'text',
      description: 'Duration of the modal show animation (e.g. "0.2s").',
      table: { category: '<flow-step>' },
    },
    modalHideAnimation: {
      control: 'select',
      options: ['fade-out', 'fly-out-to-left', 'fly-out-to-right', 'fly-out-to-top', 'fly-out-to-bottom', 'zoom-out'],
      description: 'Animation used when hiding the modal.',
      table: { category: '<flow-step>' },
    },
    modalHideAnimationDuration: {
      control: 'text',
      description: 'Duration of the modal hide animation.',
      table: { category: '<flow-step>' },
    },
    hideButtonAriaLabel: {
      control: 'text',
      description: 'ARIA label for the close/hide button inside the modal.',
      table: { category: '<flow-step>' },
    },
    hideButtonSize: {
      control: 'text',
      description: 'Dimensions (width/height) for the hide button (e.g. "40px").',
      table: { category: '<flow-step>' },
    },
    hideButtonPadding: {
      control: 'text',
      description: 'Padding around the hide button’s icon.',
      table: { category: '<flow-step>' },
    },
    hideButtonIcon: {
      control: 'text',
      description: 'URL or a known keyword ("close", "close-circle", etc.) for the hide button’s icon. If absent, no icon.',
      table: { category: '<flow-step>' },
    },
    hideButtonColor: {
      control: 'color',
      description: 'Color of the hide button icon.',
      table: { category: '<flow-step>' },
    },
    stepZIndex: {
      control: 'text',
      description: 'Z-index for the backdrop and modal container.',
      table: { category: '<flow-step>' },
    },
    onStepActivated: { table: { disable: true } },
    onStepDeactivated: { table: { disable: true } },
    onStepStarted: { table: { disable: true } },
    onStepShown: { table: { disable: true } },
    onStepHidden: { table: { disable: true } },
    onStepClicked: { table: { disable: true } },

    // <flow-badge>
    badgeTop: {
      control: 'text',
      description: 'Position offset from the top edge (e.g. "10px").',
      table: { category: '<flow-badge>' },
    },
    badgeLeft: {
      control: 'text',
      description: 'Position offset from the left edge (e.g. "10px").',
      table: { category: '<flow-badge>' },
    },
    badgeBottom: {
      control: 'text',
      description: 'Position offset from the bottom edge (e.g. "10px").',
      table: { category: '<flow-badge>' },
    },
    badgeRight: {
      control: 'text',
      description: 'Position offset from the right edge (e.g. "10px").',
      table: { category: '<flow-badge>' },
    },
    badgeZIndex: {
      control: 'text',
      description: 'Z-index for the badge and its hint bubble.',
      table: { category: '<flow-badge>' },
    },
    hintAriaLabel: {
      control: 'text',
      description: 'ARIA label for the hint bubble.',
      table: { category: '<flow-badge>' },
    },
    hintText: {
      control: 'text',
      description: 'Text content displayed inside the hint bubble.',
      table: { category: '<flow-badge>' },
    },
    hintDuration: {
      control: 'text',
      description: 'How long (e.g. "5s", "2000") to keep the hint visible.',
      table: { category: '<flow-badge>' },
    },
    hintColor: {
      control: 'color',
      description: 'Text color for the hint bubble.',
      table: { category: '<flow-badge>' },
    },
    hintBackgroundColor: {
      control: 'color',
      description: 'Background color for the hint bubble.',
      table: { category: '<flow-badge>' },
    },
    hintFontSize: {
      control: 'text',
      description: 'Font size for the hint text (e.g. "12px").',
      table: { category: '<flow-badge>' },
    },
    hintWidth: {
      control: 'text',
      description: 'Width of the hint bubble (e.g. "150px").',
      table: { category: '<flow-badge>' },
    },
    hintBorder: {
      control: 'text',
      description: 'Border for the hint bubble container.',
      table: { category: '<flow-badge>' },
    },
    hintBorderRadius: {
      control: 'text',
      description: 'Border radius for the hint bubble.',
      table: { category: '<flow-badge>' },
    },
    hintBoxShadow: {
      control: 'text',
      description: 'Box shadow for the badge hint.',
      table: { category: '<flow-badge>' },
    },
    hintPadding: {
      control: 'text',
      description: 'Padding inside the hint bubble.',
      table: { category: '<flow-badge>' },
    },
    hintSpacing: {
      control: 'text',
      description: 'Spacing between the badge button and the hint bubble.',
      table: { category: '<flow-badge>' },
    },
    hintShowAnimation: {
      control: 'select',
      options: ['fade-in', 'fly-in-from-left', 'fly-in-from-right', 'fly-in-from-top', 'fly-in-from-bottom', 'zoom-in'],
      description: 'Animation used when showing the hint bubble.',
      table: { category: '<flow-badge>' },
    },
    hintShowAnimationDuration: {
      control: 'text',
      description: 'Duration for the hint show animation.',
      table: { category: '<flow-badge>' },
    },
    hintHideAnimation: {
      control: 'select',
      options: ['fade-out', 'fly-out-to-left', 'fly-out-to-right', 'fly-out-to-top', 'fly-out-to-bottom', 'zoom-out'],
      description: 'Animation used when hiding the hint bubble.',
      table: { category: '<flow-badge>' },
    },
    hintHideAnimationDuration: {
      control: 'text',
      description: 'Duration for the hint hide animation.',
      table: { category: '<flow-badge>' },
    },
    buttonAriaLabel: {
      control: 'text',
      description: 'ARIA label for the badge button.',
      table: { category: '<flow-badge>' },
    },
    buttonIcon: {
      control: 'text',
      description: 'Keyword icon (e.g. "bell", "gift") or an image URL for the badge button.',
      table: { category: '<flow-badge>' },
    },
    buttonText: {
      control: 'text',
      description: 'Optional text displayed inside the badge button.',
      table: { category: '<flow-badge>' },
    },
    buttonCountDownFormat: {
      control: 'text',
      description: 'If set, displays a countdown (e.g. "mm:ss") based on the step’s remaining time.',
      table: { category: '<flow-badge>' },
    },
    buttonColor: {
      control: 'color',
      description: 'Color for the text/icon in the badge button.',
      table: { category: '<flow-badge>' },
    },
    buttonBackgroundColor: {
      control: 'color',
      description: 'Background color for the badge button.',
      table: { category: '<flow-badge>' },
    },
    buttonFontSize: {
      control: 'text',
      description: 'Font size for the badge button text (e.g. "14px").',
      table: { category: '<flow-badge>' },
    },
    buttonSize: {
      control: 'text',
      description: 'Width/height for the badge button (e.g. "60px").',
      table: { category: '<flow-badge>' },
    },
    buttonBorder: {
      control: 'text',
      description: 'Border for the badge button container.',
      table: { category: '<flow-badge>' },
    },
    buttonBorderRadius: {
      control: 'text',
      description: 'Border radius for the badge button (e.g. "50%").',
      table: { category: '<flow-badge>' },
    },
    buttonBoxShadow: {
      control: 'text',
      description: 'Box shadow for the badge button.',
      table: { category: '<flow-badge>' },
    },
    buttonShowAnimation: {
      control: 'select',
      options: ['fade-in', 'fly-in-from-left', 'fly-in-from-right', 'fly-in-from-top', 'fly-in-from-bottom', 'zoom-in'],
      description: 'Animation used when showing the badge button.',
      table: { category: '<flow-badge>' },
    },
    buttonShowAnimationDuration: {
      control: 'text',
      description: 'Duration for the badge button show animation.',
      table: { category: '<flow-badge>' },
    },
    buttonHideAnimation: {
      control: 'select',
      options: ['fade-out', 'fly-out-to-left', 'fly-out-to-right', 'fly-out-to-top', 'fly-out-to-bottom', 'zoom-out'],
      description: 'Animation used when hiding the badge button.',
      table: { category: '<flow-badge>' },
    },
    buttonHideAnimationDuration: {
      control: 'text',
      description: 'Duration for the badge button hide animation.',
      table: { category: '<flow-badge>' },
    },
    onBadgeActivated: { table: { disable: true } },
    onBadgeDeactivated: { table: { disable: true } },
    onBadgeShown: { table: { disable: true } },
    onBadgeHidden: { table: { disable: true } },
    onBadgeClicked: { table: { disable: true } },
  },
  parameters: {
    docs: {
      description: {
        component: 'For the complete guide, please refer to the [README](https://github.com/yujiosaka/flow-modal#readme)',
      },
      story: {
        height: '400px',
      },
    },
  },
};

export default meta;

function renderFlowModal(args: FlowModalStoryArgs, slot?: TemplateResult): TemplateResult {
  return html`
    <flow-modal
      ?deactivated=${args.deactivated}
      storages=${ifDefined(args.storages)}
      storage-namespace=${args.storageNamespace}
      storage-duration=${args.storageDuration}
      @flowmodalstarted=${args.onModalStarted}
      @flowmodaltimedout=${args.onModalTimedOut}
    >
      ${slot ?? nothing}
    </flow-modal>
  `;
}

function renderFlowStep(args: FlowModalStoryArgs, slot?: TemplateResult): TemplateResult {
  return html`
    <flow-step
      ?ready=${args.ready}
      ?skippable=${args.skippable}
      timeout-duration=${ifDefined(args.timeoutDuration)}
      ?backdrop=${args.backdrop}
      backdrop-background-color=${args.backdropBackgroundColor}
      backdrop-show-animation=${args.backdropShowAnimation}
      backdrop-show-animation-duration=${args.backdropShowAnimationDuration}
      backdrop-hide-animation=${args.backdropHideAnimation}
      backdrop-hide-animation-duration=${args.backdropHideAnimationDuration}
      modal-aria-label=${args.modalAriaLabel}
      modal-background-color=${args.modalBackgroundColor}
      modal-box-shadow=${args.modalBoxShadow}
      modal-border=${args.modalBorder}
      modal-border-radius=${args.modalBorderRadius}
      modal-align-items=${args.modalAlignItems}
      modal-padding=${args.modalPadding}
      modal-spacing=${args.modalSpacing}
      modal-max-width=${args.modalMaxWidth}
      modal-show-animation=${args.modalShowAnimation}
      modal-show-animation-duration=${args.modalShowAnimationDuration}
      modal-hide-animation=${args.modalHideAnimation}
      modal-hide-animation-duration=${args.modalHideAnimationDuration}
      hide-button-aria-label=${args.hideButtonAriaLabel}
      hide-button-size=${args.hideButtonSize}
      hide-button-padding=${args.hideButtonPadding}
      hide-button-icon=${ifDefined(args.hideButtonIcon)}
      hide-button-color=${args.hideButtonColor}
      step-z-index=${args.stepZIndex}
      @flowstepactivated=${args.onStepActivated}
      @flowstepdeactivated=${args.onStepDeactivated}
      @flowstepstarted=${args.onStepStarted}
      @flowstepshown=${args.onStepShown}
      @flowstephidden=${args.onStepHidden}
      @flowstepclicked=${args.onStepClicked}
    >
      ${slot ?? nothing}
    </flow-step>
  `;
}

function renderFlowBadge(args: FlowModalStoryArgs): TemplateResult {
  return html`
    <flow-badge
      badge-top=${args.badgeTop}
      badge-left=${args.badgeLeft}
      badge-bottom=${args.badgeBottom}
      badge-right=${args.badgeRight}
      badge-z-index=${args.badgeZIndex}
      hint-aria-label=${args.hintAriaLabel}
      hint-text=${ifDefined(args.hintText)}
      hint-duration=${args.hintDuration}
      hint-color=${args.hintColor}
      hint-background-color=${args.hintBackgroundColor}
      hint-font-size=${args.hintFontSize}
      hint-width=${args.hintWidth}
      hint-border=${args.hintBorder}
      hint-border-radius=${args.hintBorderRadius}
      hint-box-shadow=${args.hintBoxShadow}
      hint-padding=${args.hintPadding}
      hint-spacing=${args.hintSpacing}
      hint-show-animation=${args.hintShowAnimation}
      hint-show-animation-duration=${args.hintShowAnimationDuration}
      hint-hide-animation=${args.hintHideAnimation}
      hint-hide-animation-duration=${args.hintHideAnimationDuration}
      button-aria-label=${args.buttonAriaLabel}
      button-icon=${ifDefined(args.buttonIcon)}
      button-text=${ifDefined(args.buttonText)}
      button-count-down-format=${ifDefined(args.buttonCountDownFormat)}
      button-color=${args.buttonColor}
      button-background-color=${args.buttonBackgroundColor}
      button-font-size=${args.buttonFontSize}
      button-size=${args.buttonSize}
      button-border=${args.buttonBorder}
      button-border-radius=${args.buttonBorderRadius}
      button-box-shadow=${args.buttonBoxShadow}
      button-show-animation=${args.buttonShowAnimation}
      button-show-animation-duration=${args.buttonShowAnimationDuration}
      button-hide-animation=${args.buttonHideAnimation}
      button-hide-animation-duration=${args.buttonHideAnimationDuration}
      @flowbadgeactivated=${args.onBadgeActivated}
      @flowbadgedeactivated=${args.onBadgeDeactivated}
      @flowbadgeshown=${args.onBadgeShown}
      @flowbadgehidden=${args.onBadgeHidden}
      @flowbadgeclicked=${args.onBadgeClicked}
    >
    </flow-badge>
  `;
}

function renderRefreshButtons(): TemplateResult {
  const refreshModal = (force: boolean) => (event: PointerEvent) => {
    const target = event.currentTarget as HTMLElement;
    const modal = target.closest('#root-inner')!.querySelector('flow-modal');
    modal!.refreshState(force);
  };

  return html`
    <div class="control">
      <storybook-button
        background-color="white"
        label="refreshState(false)"
        @click=${refreshModal(false)}
      ></storybook-button>
      <storybook-button primary label="refreshState(true)" @click=${refreshModal(true)}></storybook-button>
    </div>
  `;
}

type Story = StoryObj<FlowModalStoryArgs>;

/**
 * A simple example with a single <flow-step> inside <flow-modal>.
 */
export const SingleStep: Story = {
  name: 'Single Step',
  args: {
    // <flow-modal>
    deactivated: false,
    storages: 'memory',
    storageNamespace: 'flow-modal',
    storageDuration: '30m',
    onModalStarted: fn(),
    onModalTimedOut: fn(),

    // <flow-step>
    ready: true,
    skippable: false,
    timeoutDuration: '1m',
    backdrop: true,
    backdropBackgroundColor: 'rgba(0, 0, 0, 0.2)',
    backdropShowAnimation: 'fade-in',
    backdropShowAnimationDuration: '0.2s',
    backdropHideAnimation: 'fade-out',
    backdropHideAnimationDuration: '0.2s',
    modalAriaLabel: 'Modal',
    modalBackgroundColor: 'rgba(255, 255, 255, 1)',
    modalBoxShadow:
      '0 11px 15px -7px rgba(0, 0, 0, 0.2), 0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.12)',
    modalBorder: 'none',
    modalBorderRadius: '20px',
    modalAlignItems: 'center',
    modalPadding: '20px',
    modalSpacing: '20px',
    modalMaxWidth: '400px',
    modalShowAnimation: 'zoom-in',
    modalShowAnimationDuration: '0.2s',
    modalHideAnimation: 'zoom-out',
    modalHideAnimationDuration: '0.2s',
    hideButtonAriaLabel: 'Hide modal',
    hideButtonSize: '40px',
    hideButtonPadding: '5px',
    hideButtonIcon: 'close',
    hideButtonColor: 'rgba(0, 0, 0, 1)',
    stepZIndex: '2147483647',
    onStepActivated: fn(),
    onStepDeactivated: fn(),
    onStepStarted: fn(),
    onStepShown: fn(),
    onStepHidden: fn(),
    onStepClicked: fn(),

    // <flow-badge>
    badgeTop: 'auto',
    badgeLeft: 'auto',
    badgeBottom: '20px',
    badgeRight: '20px',
    badgeZIndex: '2147483647',
    hintAriaLabel: 'Hint',
    hintText: 'Click to open modal',
    hintDuration: '5s',
    hintColor: 'rgba(0, 0, 0, 1)',
    hintBackgroundColor: 'rgba(255, 255, 255, 1)',
    hintFontSize: '12px',
    hintWidth: '150px',
    hintBorder: 'none',
    hintBorderRadius: '75px',
    hintBoxShadow:
      '0px 3px 3px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12)',
    hintPadding: '10px',
    hintSpacing: '10px',
    hintShowAnimation: 'fade-in',
    hintShowAnimationDuration: '0.2s',
    hintHideAnimation: 'fade-out',
    hintHideAnimationDuration: '0.2s',
    buttonAriaLabel: 'Show modal',
    buttonIcon: 'megaphone',
    buttonText: 'Click',
    buttonCountDownFormat: undefined,
    buttonColor: 'rgba(255, 255, 255, 1)',
    buttonBackgroundColor: 'rgba(255, 152, 0, 1)',
    buttonFontSize: '12px',
    buttonSize: '60px',
    buttonBorder: 'none',
    buttonBorderRadius: '50%',
    buttonBoxShadow:
      '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px rgba(0, 0, 0, 0.14), 0px 1px 10px rgba(0, 0, 0, 0.12)',
    buttonShowAnimation: 'zoom-in',
    buttonShowAnimationDuration: '0.2s',
    buttonHideAnimation: 'zoom-out',
    buttonHideAnimationDuration: '0.2s',
    onBadgeActivated: fn(),
    onBadgeDeactivated: fn(),
    onBadgeShown: fn(),
    onBadgeHidden: fn(),
    onBadgeClicked: fn(),
  },
  render: args => {
    return html`
      ${renderFlowModal(
        args,
        renderFlowStep(
          args,
          html`
            <h2>Single Step</h2>
            <p>This is a single-step flow. Toggle the various controls to see how it behaves.</p>
            ${renderFlowBadge(args)}
          `,
        ),
      )}
      ${renderRefreshButtons()}
    `;
  },
};

/**
 * Demonstrates how multiple <flow-step> elements can be orchestrated
 * within a single <flow-modal>.
 */
export const MultiStep: Story = {
  name: 'Multi Step',
  args: {
    // <flow-modal>
    deactivated: false,
    storages: 'memory',
    storageNamespace: 'multi-step',
    storageDuration: '30m',
    onModalStarted: fn(),
    onModalTimedOut: fn(),

    // <flow-step>
    ready: true,
    skippable: false,
    timeoutDuration: '1m',
    backdrop: true,
    backdropBackgroundColor: 'rgba(0, 0, 0, 0.2)',
    backdropShowAnimation: 'fade-in',
    backdropShowAnimationDuration: '0.2s',
    backdropHideAnimation: 'fade-out',
    backdropHideAnimationDuration: '0.2s',
    modalAriaLabel: 'Modal',
    modalBackgroundColor: 'rgba(255, 255, 255, 1)',
    modalBoxShadow:
      '0 11px 15px -7px rgba(0, 0, 0, 0.2), 0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.12)',
    modalBorder: 'none',
    modalBorderRadius: '20px',
    modalAlignItems: 'center',
    modalPadding: '20px',
    modalSpacing: '20px',
    modalMaxWidth: '400px',
    modalShowAnimation: 'zoom-in',
    modalShowAnimationDuration: '0.2s',
    modalHideAnimation: 'zoom-out',
    modalHideAnimationDuration: '0.2s',
    hideButtonAriaLabel: 'Hide modal',
    hideButtonSize: '40px',
    hideButtonPadding: '5px',
    hideButtonIcon: 'close',
    hideButtonColor: 'rgba(0, 0, 0, 1)',
    stepZIndex: '2147483647',
    onStepActivated: fn(),
    onStepDeactivated: fn(),
    onStepStarted: fn(),
    onStepShown: fn(),
    onStepHidden: fn(),
    onStepClicked: fn(),

    // <flow-badge>
    badgeTop: 'auto',
    badgeLeft: 'auto',
    badgeBottom: '20px',
    badgeRight: '20px',
    badgeZIndex: '2147483647',
    hintAriaLabel: 'Hint',
    hintText: 'Click to open modal',
    hintDuration: '5s',
    hintColor: 'rgba(0, 0, 0, 1)',
    hintBackgroundColor: 'rgba(255, 255, 255, 1)',
    hintFontSize: '12px',
    hintWidth: '150px',
    hintBorder: 'none',
    hintBorderRadius: '75px',
    hintBoxShadow:
      '0px 3px 3px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12)',
    hintPadding: '10px',
    hintSpacing: '10px',
    hintShowAnimation: 'fade-in',
    hintShowAnimationDuration: '0.2s',
    hintHideAnimation: 'fade-out',
    hintHideAnimationDuration: '0.2s',
    buttonAriaLabel: 'Show modal',
    buttonIcon: 'megaphone',
    buttonText: 'Click',
    buttonCountDownFormat: 'mm:ss',
    buttonColor: 'rgba(255, 255, 255, 1)',
    buttonBackgroundColor: 'rgba(255, 152, 0, 1)',
    buttonFontSize: '12px',
    buttonSize: '60px',
    buttonBorder: 'none',
    buttonBorderRadius: '50%',
    buttonBoxShadow:
      '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px rgba(0, 0, 0, 0.14), 0px 1px 10px rgba(0, 0, 0, 0.12)',
    buttonShowAnimation: 'zoom-in',
    buttonShowAnimationDuration: '0.2s',
    buttonHideAnimation: 'zoom-out',
    buttonHideAnimationDuration: '0.2s',
    onBadgeActivated: fn(),
    onBadgeDeactivated: fn(),
    onBadgeShown: fn(),
    onBadgeHidden: fn(),
    onBadgeClicked: fn(),
  },
  render: args => {
    return html`
      ${renderFlowModal(
        args,
        html`
          ${renderFlowStep(
            args,
            html`
              <h2>Step 1</h2>
              <p>
                This is the first step. If "ready" is true and "skippable" is false, it will run before Step 2. You can tweak
                these properties in the Controls panel.
              </p>
              ${renderFlowBadge(args)}
            `,
          )}
          ${renderFlowStep(
            args,
            html`
              <h2>Step 2</h2>
              <p>
                This is the second step of the flow. If Step 1 is also ready and skippable, the flow might jump here
                automatically if both are marked "ready."
              </p>
              ${renderFlowBadge(args)}
            `,
          )}
        `,
      )}
      ${renderRefreshButtons()}
    `;
  },
};
