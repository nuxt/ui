<template>
  <div ref="trigger" :class="wrapperClass" @mouseover="open = true" @mouseleave="open = false">
    <slot :open="open">
      Hover me
    </slot>

    <div v-if="open" ref="container" :class="[containerClass, widthClass]">
      <transition appear v-bind="transitionClass">
        <div :class="baseClass">
          <slot name="text">
            {{ text }}
          </slot>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { ref, computed } from 'vue'
import { defu } from 'defu'
import { usePopper } from '../../composables/usePopper'
import type { PopperOptions } from './../types'
import $ui from '#build/ui'

const props = defineProps({
  text: {
    type: String,
    default: null
  },
  wrapperClass: {
    type: String,
    default: () => $ui.tooltip.wrapper
  },
  containerClass: {
    type: String,
    default: () => $ui.tooltip.container
  },
  widthClass: {
    type: String,
    default: () => $ui.tooltip.width
  },
  baseClass: {
    type: String,
    default: () => $ui.tooltip.base
  },
  transitionClass: {
    type: Object,
    default: () => $ui.tooltip.transition
  },
  popperOptions: {
    type: Object as PropType<PopperOptions>,
    default: () => {}
  }
})

const popperOptions = computed(() => defu({}, props.popperOptions, { strategy: 'fixed' }))

const [trigger, container] = usePopper(popperOptions.value)
const open = ref(false)
</script>

<script lang="ts">
export default { name: 'UTooltip' }
</script>
