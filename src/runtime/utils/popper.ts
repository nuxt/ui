import { ref, onMounted, watchEffect } from 'vue'
import { createPopper } from '@popperjs/core'

export function usePopper (options: object) {
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

      const { destroy } = createPopper(referenceEl, popperEl, options)

      onInvalidate(destroy)
    })
  })

  return [reference, popper]
}
