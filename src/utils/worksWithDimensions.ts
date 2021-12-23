export function getWindowDimensions(window: Window) {
  const { innerWidth: width, innerHeight: height } = window;

  return { width, height };
}