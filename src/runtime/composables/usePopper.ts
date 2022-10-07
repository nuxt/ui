import { ref, onMounted, watchEffect } from 'vue'
import { popperGenerator, defaultModifiers } from '@popperjs/core/lib/popper-lite'
import { omitBy, isUndefined } from 'lodash-es'
import flip from '@popperjs/core/lib/modifiers/flip'
import offset from '@popperjs/core/lib/modifiers/offset'
import preventOverflow from '@popperjs/core/lib/modifiers/preventOverflow'

const createPopper = popperGenerator({
  defaultModifiers: [...defaultModifiers, offset, flip, preventOverflow]
})

export function usePopper ({
  locked = false,
  overflowPadding = 8,
  offsetDistance = 8,
  offsetSkid = 0,
  placement,
  strategy
}) {
  const reference = ref(null)
  const popper = ref(null)

  onMounted(() => {
    watchEffect((onInvalidate) => {
      if (!popper.value) { return }
      if (!reference.value) { return }

      const popperEl = popper.value.$el || popper.value
      const referenceEl = reference.value.$el || reference.value

      if (!(referenceEl instanceof HTMLElement)) { return }
      if (!(popperEl instanceof HTMLElement)) { return }

      const { destroy } = createPopper(referenceEl, popperEl, omitBy({
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

      onInvalidate(destroy)
    })
  })

  return [reference, popper]
}
