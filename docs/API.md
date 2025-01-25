# API Reference

## Table of Contents

- [\<flow-modal\>](#flow-modal)
- [\<flow-step\>](#flow-step)
- [\<flow-badge\>](#flow-badge)

## \<flow-modal\>

A container for managing multi‑step experiences. It handles state persistence, timeouts, and orchestrates the activation order of its child `<flow-step>` components.

### Attributes

| Attribute           | Type    | Default        | Description                                                                                      | CSS Variable |
| ------------------- | ------- | -------------- | ------------------------------------------------------------------------------------------------ | ------------ |
| `deactivated`       | Boolean | `false`        | Prevents activating any steps when set to true.                                                  | —            |
| `storage-namespace` | String  | `"flow-modal"` | Namespace used to store the flow state. Change this to isolate flows between different contexts. | —            |
| `storage-duration`  | String  | `"30m"`        | Duration for persisting the flow state (supports formats like `"30m"` or `"1h"`).                | —            |

### Public Methods

| Method                         | Description                                                                                              |
| ------------------------------ | -------------------------------------------------------------------------------------------------------- |
| `active` (getter)              | Returns a boolean indicating if any `<flow-step>` is currently active.                                   |
| `visible` (getter)             | Returns a boolean indicating if the modal content of the currently activated `<flow-step>` is displayed. |
| `activatedStepIndex` (getter)  | Returns the index of the currently activated `<flow-step>`. Returns `null` if no step is active.         |
| `refreshState(force: boolean)` | Refreshes (or resets) the flow state. Pass `true` to force a reset.                                      |

### Exposed Events

| Event Name          | Detail                 | Description                       |
| ------------------- | ---------------------- | --------------------------------- |
| `flowmodalstarted`  | `{ initial: boolean }` | Fired when the modal flow starts. |
| `flowmodaltimedout` | `none`                 | Fired when the flow times out.    |

## \<flow-step\>

Represents an individual step in the modal flow. A `<flow-step>` can display modal content, enforce timeouts, and include an optional `<flow-badge>`.

### Attributes

| Attribute                          | Type    | Default                                                                                                        | Description                                                                                                                                          | CSS Variable                         |
| ---------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| `ready`                            | Boolean | `false`                                                                                                        | Marks the step as ready to be activated.                                                                                                             | -                                    |
| `skippable`                        | Boolean | `false`                                                                                                        | If true, the step can be skipped when a subsequent step is also ready.                                                                               | -                                    |
| `timeout-duration`                 | String  | —                                                                                                              | Time limit for the step (e.g., `"1m"`). Must be shorter than the modal’s `storage-duration`.                                                         | -                                    |
| `backdrop`                         | Boolean | `false`                                                                                                        | If set, a backdrop is shown behind the modal content.                                                                                                | -                                    |
| `backdrop-background-color`        | String  | `rgba(0, 0, 0, 0.2)`                                                                                           | CSS color for the backdrop background.                                                                                                               | `--kdrop-background-color`           |
| `backdrop-show-animation`          | String  | `fade-in`                                                                                                      | Animation for showing the backdrop. Options: `fade-in`, `fly-in-from-left`, `fly-in-from-right`, `fly-in-from-top`, `fly-in-from-bottom`, `zoom-in`. | `--backdrop-show-animation`          |
| `backdrop-show-animation-duration` | String  | `0.2s`                                                                                                         | Duration for the backdrop show animation.                                                                                                            | `--backdrop-show-animation-duration` |
| `backdrop-hide-animation`          | String  | `fade-out`                                                                                                     | Animation for hiding the backdrop. Options: `fade-out`, `fly-out-to-left`, `fly-out-to-right`, `fly-out-to-top`, `fly-out-to-bottom`, `zoom-out`.    | `--backdrop-hide-animation`          |
| `backdrop-hide-animation-duration` | String  | `0.2s`                                                                                                         | Duration for the backdrop hide animation.                                                                                                            | `--backdrop-hide-animation-duration` |
| `modal-background-color`           | String  | `rgba(255, 255, 255, 1)`                                                                                       | Background color of the modal container.                                                                                                             | `--modal-background-color`           |
| `modal-box-shadow`                 | String  | `0 11px 15px -7px rgba(0, 0, 0, 0.2), 0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.12)` | CSS box-shadow for the modal container.                                                                                                              | `--modal-box-shadow`                 |
| `modal-border`                     | String  | `none`                                                                                                         | Border for the modal container.                                                                                                                      | `--modal-border`                     |
| `modal-border-radius`              | String  | `20px`                                                                                                         | Border radius for the modal container.                                                                                                               | `--modal-border-radius`              |
| `modal-align-items`                | String  | `center`                                                                                                       | Flex alignment for the modal content. Options: `center`, `start`, `end`.                                                                             | `--modal-align-items`                |
| `modal-padding`                    | String  | `20px`                                                                                                         | Padding inside the modal content.                                                                                                                    | `modal-padding`                      |
| `modal-spacing`                    | String  | `20px`                                                                                                         | Spacing around the modal container.                                                                                                                  | `--modal-spacing`                    |
| `modal-max-width`                  | String  | `400px`                                                                                                        | Maximum width of the modal container.                                                                                                                | `--modal-max-width`                  |
| `modal-show-animation`             | String  | `zoom-in`                                                                                                      | Animation for showing the modal. Options are similar to backdrop animations.                                                                         | `--modal-show-animation`             |
| `modal-show-animation-duration`    | String  | `0.2s`                                                                                                         | Duration for the modal show animation.                                                                                                               | `--modal-show-animation-duration`    |
| `modal-hide-animation`             | String  | `zoom-out`                                                                                                     | Animation for hiding the modal. Options are similar to backdrop animations.                                                                          | `--modal-hide-animation`             |
| `modal-hide-animation-duration`    | String  | `0.2s`                                                                                                         | Duration for the modal hide animation.                                                                                                               | `--modal-hide-animation-duration`    |
| `hide-button-aria-label`           | String  | `Hide modal`                                                                                                   | ARIA label for the close/hide button.                                                                                                                | `--hide-button-aria-label`           |
| `hide-button-size`                 | String  | `40px`                                                                                                         | Size of the hide button.                                                                                                                             | `--hide-button-size`                 |
| `hide-button-padding`              | String  | `5px`                                                                                                          | Padding for the hide button’s icon.                                                                                                                  | `--hide-button-padding`              |
| `hide-button-icon`                 | String  | —                                                                                                              | Icon for the hide button. Options: `close`, `close-thick`, `close-box`, `close-box-outline`, `close-circle`, `close-circle-outline`.                 | `--hide-button-icon`                 |
| `hide-button-color`                | String  | `rgba(0, 0, 0, 1)`                                                                                             | Color of the hide button icon.                                                                                                                       | `--hide-button-color`                |
| `step-z-index`                     | String  | `2147483647`                                                                                                   | Z-index for the step overlay.                                                                                                                        | `--step-z-index`                     |

### Public Methods

| Method             | Description                                                           |
| ------------------ | --------------------------------------------------------------------- |
| `active` (getter)  | Returns a boolean indicating if the step is currently active.         |
| `visible` (getter) | Returns a boolean indicating if modal content is currently displayed. |
| `showModal()`      | Programmatically shows the modal content for this step.               |
| `hideModal()`      | Programmatically hides the modal content for this step.               |

### Exposed Events

| Event Name            | Detail                  | Description                                                                                 |
| --------------------- | ----------------------- | ------------------------------------------------------------------------------------------- |
| `flowstepactivated`   | `{ initial: boolean }`  | Fired when the step is activated (with an `initial` flag indicating first‑time activation). |
| `flowstepdeactivated` | —                       | Fired when the step is deactivated.                                                         |
| `flowstepstarted`     | `{ startedAt: number }` | Fired when the step officially starts, including a timestamp of when it began.              |
| `flowstepshown`       | —                       | Fired when the modal content becomes visible.                                               |
| `flowstephidden`      | —                       | Fired when the modal content becomes hidden.                                                |
| `flowstepclicked`     | `{ area: string }`      | Fired when a click is detected (e.g., on the backdrop, content area, or hide button).       |

## \<flow-badge\>

An optional badge used within `<flow-step>` to display hints, countdowns, or buttons. It can show an informative bubble and a clickable button with an optional countdown timer.

### Attributes

| Attribute                        | Type   | Default                                                                                                         | Description                                                                                                                                      | CSS Variable                       |
| -------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------- |
| `badge-top`                      | String | `auto`                                                                                                          | Offset from the top edge.                                                                                                                        | `--badge-top`                      |
| `badge-left`                     | String | `auto`                                                                                                          | Offset from the left edge.                                                                                                                       | `--badge-left`                     |
| `badge-bottom`                   | String | `auto`                                                                                                          | Offset from the bottom edge.                                                                                                                     | `--badge-bottom`                   |
| `badge-right`                    | String | `auto`                                                                                                          | Offset from the right edge.                                                                                                                      | `--badge-right`                    |
| `badge-z-index`                  | String | `2147483647`                                                                                                    | Z-index for the badge.                                                                                                                           | `--badge-z-index`                  |
| `hint-aria-label`                | String | `Hint`                                                                                                          | ARIA label for the hint bubble.                                                                                                                  | —                                  |
| `hint-text`                      | String | —                                                                                                               | Text content for the hint bubble.                                                                                                                | —                                  |
| `hint-duration`                  | String | `5s`                                                                                                            | Duration the hint remains visible (e.g., `"5s"`).                                                                                                | —                                  |
| `hint-color`                     | String | `rgba(0, 0, 0, 1)`                                                                                              | Text color for the hint.                                                                                                                         | `--hint-color`                     |
| `hint-background-color`          | String | `rgba(255, 255, 255, 1)`                                                                                        | Background color for the hint bubble.                                                                                                            | `--hint-background-color`          |
| `hint-font-size`                 | String | `12px`                                                                                                          | Font size for the hint text.                                                                                                                     | `--hint-font-size`                 |
| `hint-width`                     | String | `150px`                                                                                                         | Width of the hint bubble.                                                                                                                        | `--hint-width`                     |
| `hint-border`                    | String | `none`                                                                                                          | Border for the hint bubble.                                                                                                                      | `--hint-border`                    |
| `hint-border-radius`             | String | `75px`                                                                                                          | Border radius for the hint bubble.                                                                                                               | `--hint-border-radius`             |
| `hint-box-shadow`                | String | `0px 3px 3px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12)` | Box shadow for the hint bubble.                                                                                                                  | `--hint-box-shadow`                |
| `hint-padding`                   | String | `10px`                                                                                                          | Padding inside the hint bubble.                                                                                                                  | `--hint-padding`                   |
| `hint-spacing`                   | String | `10px`                                                                                                          | Spacing between the badge and the hint bubble.                                                                                                   | `--hint-spacing`                   |
| `hint-show-animation`            | String | `fade-in`                                                                                                       | Animation for showing the hint. Options: `fade-in`, `fly-in-from-left`, `fly-in-from-right`, `fly-in-from-top`, `fly-in-from-bottom`, `zoom-in`. | `--hint-show-animation`            |
| `hint-show-animation-duration`   | String | `0.2s`                                                                                                          | Duration for the hint show animation.                                                                                                            | `--hint-show-animation-duration`   |
| `hint-hide-animation`            | String | `fade-out`                                                                                                      | Animation for hiding the hint. Options: `fade-out`, `fly-out-to-left`, `fly-out-to-right`, `fly-out-to-top`, `fly-out-to-bottom`, `zoom-out`.    | `--hint-hide-animation`            |
| `hint-hide-animation-duration`   | String | `0.2s`                                                                                                          | Duration for the hint hide animation.                                                                                                            | `--hint-hide-animation-duration`   |
| `button-aria-label`              | String | `Show modal`                                                                                                    | ARIA label for the badge button.                                                                                                                 | —                                  |
| `button-icon`                    | String | —                                                                                                               | Icon for the badge button. Options: `bell`, `envelope`, `gift`, `megaphone`, `tag`.                                                              | —                                  |
| `button-text`                    | String | —                                                                                                               | Optional text for the badge button.                                                                                                              | —                                  |
| `button-count-down-format`       | String | —                                                                                                               | Format string (e.g., `"mm:ss"`) for displaying a countdown based on the step’s remaining time.                                                   | —                                  |
| `button-color`                   | String | `rgba(0, 0, 0, 1)`                                                                                              | Text/icon color for the button.                                                                                                                  | `--button-color`                   |
| `button-background-color`        | String | `rgba(255, 255, 255, 1)`                                                                                        | Background color for the badge button.                                                                                                           | `--button-background-color`        |
| `button-font-size`               | String | `12px`                                                                                                          | Font size for the button text.                                                                                                                   | `--button-font-size`               |
| `button-size`                    | String | `60px`                                                                                                          | Size (width/height) of the badge button.                                                                                                         | `--button-size`                    |
| `button-border`                  | String | `none`                                                                                                          | Border for the badge button container.                                                                                                           | `--button-border`                  |
| `button-border-radius`           | String | `50%`                                                                                                           | Border radius for the badge button.                                                                                                              | `--button-border-radius`           |
| `button-box-shadow`              | String | `0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px rgba(0, 0, 0, 0.14), 0px 1px 10px rgba(0, 0, 0, 0.12)`        | Box shadow for the badge button.                                                                                                                 | `--button-box-shadow`              |
| `button-show-animation`          | String | `zoom-in`                                                                                                       | Animation for showing the badge button. Options are similar to hint animations.                                                                  | `--button-show-animation`          |
| `button-show-animation-duration` | String | `0.2s`                                                                                                          | Duration for the button show animation.                                                                                                          | `--button-show-animation-duration` |
| `button-hide-animation`          | String | `zoom-out`                                                                                                      | Animation for hiding the badge button. Options are similar to hint animations.                                                                   | `--button-hide-animation`          |
| `button-hide-animation-duration` | String | `0.2s`                                                                                                          | Duration for the button hide animation.                                                                                                          | `--button-hide-animation-duration` |

### Exposed Events

| Event Name             | Detail                 | Description                                                    |
| ---------------------- | ---------------------- | -------------------------------------------------------------- |
| `flowbadgeactivated`   | `{ initial: boolean }` | Fired when the badge is activated.                             |
| `flowbadgedeactivated` | —                      | Fired when the badge is deactivated.                           |
| `flowbadgeshown`       | —                      | Fired when the badge becomes visible.                          |
| `flowbadgehidden`      | —                      | Fired when the badge becomes hidden.                           |
| `flowbadgeclicked`     | `{ area: string }`     | Fired when the badge is clicked (e.g., on the hint or button). |
