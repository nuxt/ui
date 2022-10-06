<template>
  <div ref="trigger" :class="wrapperClass" @mouseover="open = true" @mouseleave="open = false">
    <slot :open="open">
      Hover me
    </slot>

    <div v-if="open" ref="container" :class="containerClass">
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
import { ref } from 'vue'
import { usePopper } from '../../utils'
import $ui from '#build/ui'

const props = defineProps({
  text: {
    type: String,
    default: null
  },
  placement: {
    type: String,
    default: 'bottom',
    validator: (value: string) => {
      return ['auto', 'auto-start', 'auto-end', 'top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'right', 'right-start', 'right-end', 'left', 'left-start', 'left-end'].includes(value)
    }
  },
  strategy: {
    type: String,
    default: 'fixed',
    validator: (value: string) => {
      return ['absolute', 'fixed'].includes(value)
    }
  },
  flip: {
    type: Boolean,
    default: true
  },
  wrapperClass: {
    type: String,
    default: () => $ui.tooltip.wrapper
  },
  containerClass: {
    type: String,
    default: () => $ui.tooltip.container
  },
  baseClass: {
    type: String,
    default: () => $ui.tooltip.base
  },
  transitionClass: {
    type: Object,
    default: () => $ui.tooltip.transition
  }
})

const open = ref(false)
const [trigger, container] = usePopper({
  placement: props.placement,
  strategy: props.strategy,
  modifiers: [{
    name: 'offset',
    options: {
      offset: 0
    }
  },
  {
    name: 'computeStyles',
    options: {
      gpuAcceleration: false,
      adaptive: false
    }
  },
  {
    name: 'preventOverflow',
    options: {
      padding: 8
    }
  }, {
    name: 'flip',
    enabled: props.flip
  }]
})
</script>

<script lang="ts">
export default { name: 'UTooltip' }
</script>
