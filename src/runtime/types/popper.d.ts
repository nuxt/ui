import type { Placement, PositioningStrategy } from '@popperjs/core'
import { MaybeElement } from '@vueuse/core'
import { VirtualElement } from '@popperjs/core/lib/popper-lite'

export type MaybeVirtualElement = MaybeElement | VirtualElement
export type MaybeComputedVirtualElementRef<T extends MaybeVirtualElement = MaybeVirtualElement> = MaybeRefOrGetter<T>;

export interface PopperOptions {
  locked?: boolean
  overflowPadding?: number
  offsetDistance?: number
  offsetSkid?: number
  placement?: Placement
  strategy?: PositioningStrategy
  gpuAcceleration?: boolean
  adaptive?: boolean
  scroll?: boolean
  resize?: boolean
}
