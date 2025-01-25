# flow-modal [![npm version](https://badge.fury.io/js/flow-modal.svg)](https://badge.fury.io/js/flow-modal) [![CI/CD](https://github.com/yujiosaka/flow-modal/actions/workflows/ci_cd.yml/badge.svg)](https://github.com/yujiosaka/flow-modal/actions/workflows/ci_cd.yml)

###### [API](https://github.com/yujiosaka/flow-modal/blob/main/docs/API.md) | [Contributing](https://github.com/yujiosaka/flow-modal/blob/main/docs/CONTRIBUTING.md) | [Changelog](https://github.com/yujiosaka/flow-modal/blob/main/docs/CHANGELOG.md)

**flow-modal** is a flexible UI library for orchestrating multi‐step experiences in modern web applications. Built with Web Components, flow-modal makes it easy to create guided flows with built‐in state persistence, rich animations, and event-driven interactions.

## 🌟 Features

- **Modular Components:**
  - `<flow-modal>`: A container that manages and orchestrates a sequence of steps.
  - `<flow-step>`: Represents an individual step in the flow. Each step can include modal content and supports customizable animations.
  - `<flow-badge>`: An optional badge component that can display hints, countdowns, or actionable buttons.
- **Rich Animation Options:**  
  Support animations such as fade, fly, and zoom effects for showing/hiding modals and badges.

- **State Persistence:**  
  Automatically persist flow state (using local, cookie, or in‑memory storage) so users continue where they left off.

- **Event‑Driven Architecture:**  
  Listen to events like `flowmodalstarted`, `flowstepactivated`, or `flowbadgeclicked` to integrate custom behaviors.

- **Accessibility & Customization:**
  Designed with ARIA labels and configurable CSS variables so you can seamlessly match your app’s design.

![flow-modal](https://github.com/user-attachments/assets/4148bb11-96fb-4077-b446-9b5b0eff1478)

## 🚀 Getting Started

### Installation

```bash
npm install flow-modal
```

### Basic Usage

Include the components in your project by importing them from the published package. For example, you might add the following to your HTML:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>flow-modal Example</title>
    <!-- Import the flow-modal components -->
    <script type="module" src="path/to/flow-modal.js"></script>
  </head>
  <body>
    <flow-modal>
      <flow-step ready timeout-duration="1m" backdrop hide-button-icon="close">
        <flow-badge hint-text="Click to open modal" button-icon="bell" button-count-down-format="mm:ss"></flow-badge>
        <h2>Welcome to Our Presentation!</h2>
        <p>This is the first step of our presentation flow. You have one minute to review this announcement.</p>
      </flow-step>
      <flow-step ready backdrop>
        <flow-badge button-text="Click"></flow-badge>
        <h2>Presentation Details</h2>
        <p>Thank you for viewing the introduction. This is the second step of the presentation.</p>
      </flow-step>
    </flow-modal>
  </body>
</html>
```

You can also explore the live [Storybook on Chromatic](https://main--67987fa0e37e8d240be96359.chromatic.com/) for interactive examples and to tweak properties in real time.

## 🧑‍💻️ API reference

See [here](https://github.com/yujiosaka/flow-modal/blob/main/docs/API.md) for the API reference.

## 🎞 Animations

flow-modal supports a variety of animations that you can use to customize the appearance and behavior of your components. Use the corresponding attributes (e.g., `modal-show-animation`, `hint-hide-animation`) or override the default CSS variables to control the animations.

| Name                 | Example                                                                                                | Name                | Example                                                                                               |
| -------------------- | ------------------------------------------------------------------------------------------------------ | ------------------- | ----------------------------------------------------------------------------------------------------- |
| `fade-in`            | ![fade-in](https://github.com/user-attachments/assets/f7de3bbe-72e9-4fc6-829d-4178132995b9)            | `fade-out`          | ![fade-out](https://github.com/user-attachments/assets/4c198ddd-ba83-4152-8d40-3d37c738cdb8)          |
| `fly-in-from-left`   | ![fly-in-from-left](https://github.com/user-attachments/assets/1bba4be2-61f3-460d-8137-d3a9509ed635)   | `fly-out-to-left`   | ![fly-out-to-left](https://github.com/user-attachments/assets/61807ba3-571d-4b61-a965-f1fa79816ffb)   |
| `fly-in-from-right`  | ![fly-in-from-right](https://github.com/user-attachments/assets/2aa44b23-23c6-478b-bae4-377aaddab2db)  | `fly-out-to-right`  | ![fly-out-to-right](https://github.com/user-attachments/assets/23e7b733-37a8-44e7-a211-fbc77e6150ac)  |
| `fly-in-from-top`    | ![fly-in-from-top](https://github.com/user-attachments/assets/adc2cba0-4895-4619-a9a3-65ad48d18c87)    | `fly-out-to-top`    | ![fly-out-to-top](https://github.com/user-attachments/assets/b0b2098d-fad2-445d-b81b-cd92260b4c46)    |
| `fly-in-from-bottom` | ![fly-in-from-bottom](https://github.com/user-attachments/assets/fe1ab851-71d8-4dfa-8caa-66358c97e908) | `fly-out-to-bottom` | ![fly-out-to-bottom](https://github.com/user-attachments/assets/789f5f6b-07f4-4a4d-8bd1-6cfcb4bac25c) |
| `zoom-in`            | ![zoom-in](https://github.com/user-attachments/assets/4049f6b0-f747-43de-a5f4-608aabb299c2)            | `zoom-out`          | ![zoom-out](https://github.com/user-attachments/assets/52359aca-0ca7-4cf4-af5a-bafa9592c871)          |

## 💻 Testing

CascadeStorage includes a series of [Bun](https://bun.sh/) tests verifying functionality.

```bash
bun test
```

## 💳 License

This project is licensed under the MIT License. See [LICENSE](https://github.com/yujiosaka/flow-modal/blob/main/LICENSE) for details.
