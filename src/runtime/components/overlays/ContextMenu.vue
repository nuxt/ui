<template>
  <div v-if="isOpen" ref="container" :class="wrapperClass" v-bind="attrs">
    <Transition appear v-bind="ui.transition">
      <div>
        <div v-if="popper.arrow" data-popper-arrow :class="Object.values(ui.arrow)" />

        <div :class="[ui.base, ui.ring, ui.rounded, ui.shadow, ui.background]">
          <slot />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts">
import { computed, toRef, defineComponent } from 'vue'
import type { PropType, Ref } from 'vue'
import { defu } from 'defu'
import { onClickOutside } from '@vueuse/core'
import type { VirtualElement } from '@popperjs/core'
import { twMerge, twJoin } from 'tailwind-merge'
import { useUI } from '../../composables/useUI'
import { usePopper } from '../../composables/usePopper'
import { mergeConfig } from '../../utils'
import type { DeepPartial, PopperOptions, Strategy } from '../../types/index'
// @ts-expect-error
import appConfig from '#build/app.config'
import { contextMenu } from '#ui/ui.config'

const config = mergeConfig<typeof contextMenu>(appConfig.ui.strategy, appConfig.ui.contextMenu, contextMenu)

export default defineComponent({
  inheritAttrs: false,
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
    class: {
      type: [String, Object, Array] as PropType<any>,
      default: () => ''
    },
    ui: {
      type: Object as PropType<DeepPartial<typeof config> & { strategy?: Strategy }>,
      default: () => ({})
    }
  },
  emits: ['update:modelValue', 'close'],
  setup(props, { emit }) {
    const { ui, attrs } = useUI('contextMenu', toRef(props, 'ui'), config)

    const popper = computed<PopperOptions>(() => defu({}, props.popper, ui.value.popper as PopperOptions))

    const isOpen = computed({
      get() {
        return props.modelValue
      },
      set(value) {
        emit('update:modelValue', value)
      }
    })

    const virtualElement = toRef(props, 'virtualElement') as Ref<VirtualElement>

    const [, container] = usePopper(popper.value, virtualElement)

    const wrapperClass = computed(() => {
      return twMerge(twJoin(
        ui.value.container,
        ui.value.width
      ), props.class)
    })

    onClickOutside(container, () => {
      isOpen.value = false
    })

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      isOpen,
      wrapperClass,
      // eslint-disable-next-line vue/no-dupe-keys
      popper,
      container
    }
  }
})
</script>
