import { pick, omit } from './index'

const hoverTriggerAttrs = ['onPointermove', 'onPointerenter', 'onPointerleave', 'data-grace-area-trigger']

/** Keep hover boundaries around the label, and focus, activation and ARIA on the control. */
export function getFormControlAttrs(attrs: Record<string, unknown>, target: 'root' | 'base') {
  // Read attrs during rendering: useAttrs() is not reactive, so computed would cache stale listeners.
  return target === 'root' ? pick(attrs, hoverTriggerAttrs) : omit(attrs, ['data-state', ...hoverTriggerAttrs])
}
