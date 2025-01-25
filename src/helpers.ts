export type RemoveListeners = () => void;

/**
 * Adds multiple event listeners to an element.
 */
export function addEventListeners(
  element: HTMLElement,
  listeners: Array<{ type: string; handler: EventListenerOrEventListenerObject }>,
): RemoveListeners {
  listeners.forEach(({ type, handler }) => {
    element.addEventListener(type, handler);
  });
  return () => {
    listeners.forEach(({ type, handler }) => {
      element.removeEventListener(type, handler);
    });
  };
}
