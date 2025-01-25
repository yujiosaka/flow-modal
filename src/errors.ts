/**
 * A specialized Error class used within FlowModal operations.
 */
export class FlowModalError extends Error {
  static type = 'FlowModalError';

  constructor(message?: string) {
    super(message ? `${FlowModalError.type}: ${message}` : FlowModalError.type);
    this.name = FlowModalError.type;
  }
}
