<template>
  <div v-if="isOpen" ref="container" :class="[ui.container, ui.width]">
    <transition appear v-bind="ui.transition">
      <div :class="[ui.base, ui.ring, ui.rounded, ui.shadow, ui.background]">
        <slot />
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { computed, toRef, defineComponent } from 'vue'
import type { PropType, Ref } from 'vue'
import { defu } from 'defu'
import type { VirtualElement } from '@popperjs/core'
import { usePopper } from '../../composables/usePopper'
import type { PopperOptions } from '../../types'
import { useAppConfig } from '#imports'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'

// const appConfig = useAppConfig()

export default defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    virtualElement: {
      type: Object,
      required: true
    },
    popper: {
      type: Object as PropType<PopperOptions>,
      default: () => ({})
    },
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.popover>>,
      default: () => appConfig.ui.popover
    }
  },
  emits: ['update:modelValue', 'close'],
  setup (props, { emit }) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.popover>>(() => defu({}, props.ui, appConfig.ui.popover))

    const popper = computed<PopperOptions>(() => defu({}, props.popper, ui.value.popper as PopperOptions))

    const isOpen = computed({
      get () {
        return props.modelValue
      },
      set (value) {
        emit('update:modelValue', value)
      }
    })

    const virtualElement = toRef(props, 'virtualElement') as Ref<VirtualElement>

    const [, container] = usePopper(popper.value, virtualElement)

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      isOpen,
      container
    }
  }
})
</script>
