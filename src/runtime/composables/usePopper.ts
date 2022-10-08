import { ref, onMounted, watchEffect } from 'vue'
import type { Ref } from 'vue'
import { popperGenerator, defaultModifiers } from '@popperjs/core/lib/popper-lite'
import type { Instance } from '@popperjs/core'
import { omitBy, isUndefined } from 'lodash-es'
import flip from '@popperjs/core/lib/modifiers/flip'
import offset from '@popperjs/core/lib/modifiers/offset'
import preventOverflow from '@popperjs/core/lib/modifiers/preventOverflow'
import computeStyles from '@popperjs/core/lib/modifiers/computeStyles'
import eventListeners from '@popperjs/core/lib/modifiers/eventListeners'

export const createPopper = popperGenerator({
  defaultModifiers: [...defaultModifiers, offset, flip, preventOverflow, computeStyles, eventListeners]
})

export function usePopper ({
  locked = false,
  overflowPadding = 8,
  offsetDistance = 8,
  offsetSkid = 0,
  gpuAcceleration = true,
  adaptive = true,
  scroll = true,
  resize = true,
  placement,
  strategy
}, virtualReference) {
  const reference: Ref<HTMLElement> = ref(null)
  const popper: Ref<HTMLElement> = ref(null)
  const instance: Ref<Instance> = ref(null)

  onMounted(() => {
    watchEffect((onInvalidate) => {
      if (!popper.value) { return }
      if (!reference.value && !virtualReference.value) { return }

      const popperEl = popper.value.$el || popper.value
      const referenceEl = virtualReference?.value || reference.value.$el || reference.value

      // if (!(referenceEl instanceof HTMLElement)) { return }
      if (!(popperEl instanceof HTMLElement)) { return }

      instance.value = createPopper(referenceEl, popperEl, omitBy({
        placement,
        strategy,
        modifiers: [{
          name: 'flip',
          enabled: !locked
        }, {
          name: 'preventOverflow',
          options: {
            padding: overflowPadding
          }
        }, {
          name: 'offset',
          options: {
            offset: [offsetSkid, offsetDistance]
          }
        }, {
          name: 'computeStyles',
          options: {
            adaptive,
            gpuAcceleration
          }
        }, {
          name: 'eventListeners',
          options: {
            scroll,
            resize
          }
        }]
      }, isUndefined))

      onInvalidate(instance.value.destroy)
    })
  })

  return [reference, popper, instance]
}
