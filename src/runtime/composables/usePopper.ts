import { ref, onMounted, watchEffect } from 'vue'
import type { Ref } from 'vue'
import { popperGenerator, defaultModifiers } from '@popperjs/core/lib/popper-lite'
import type { Instance } from '@popperjs/core'
import { omitBy, isUndefined } from 'lodash-es'
import flip from '@popperjs/core/lib/modifiers/flip'
import offset from '@popperjs/core/lib/modifiers/offset'
import preventOverflow from '@popperjs/core/lib/modifiers/preventOverflow'

export const createPopper = popperGenerator({
  defaultModifiers: [...defaultModifiers, offset, flip, preventOverflow]
})

export function usePopper ({
  locked = false,
  overflowPadding = 8,
  offsetDistance = 8,
  offsetSkid = 0,
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
        }]
      }, isUndefined))

      onInvalidate(instance.value.destroy)
    })
  })

  return [reference, popper, instance]
}
