import { ReactiveController, ReactiveControllerHost } from 'lit';

type Tick = () => void;

/**
 * TimerController abstracts a repeated timer for Lit components.
 * It automatically stops the timer when the host disconnects.
 */
export class TimerController implements ReactiveController {
  #timerId: number | null = null;
  #interval: number;
  #tick: Tick;

  host: ReactiveControllerHost;

  constructor(host: ReactiveControllerHost, interval: number, tick: Tick) {
    this.host = host;
    this.#interval = interval;
    this.#tick = tick;
    host.addController(this);
  }

  /**
   * Starts the timer with the specified interval.
   * Any running timer is first stopped.
   */
  start() {
    this.stop();
    this.#timerId = window.setInterval(() => {
      this.#tick();
    }, this.#interval);
  }

  /**
   * Stops the timer if it is running.
   */
  stop() {
    if (this.#timerId !== null) {
      clearInterval(this.#timerId);
      this.#timerId = null;
    }
  }

  hostConnected() {
    // No-op.
  }

  hostDisconnected() {
    this.stop();
  }
}
