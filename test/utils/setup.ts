// @ts-expect-error incomplete implementation
window.IntersectionObserver = class IntersectionObserver {
  // eslint-disable-next-line
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}
