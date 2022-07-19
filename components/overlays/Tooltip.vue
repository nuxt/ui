<template>
  <div ref="trigger" :class="wrapperClass" @mouseover="open = true" @mouseleave="open = false">
    <slot :open="open">
      Hover me
    </slot>

    <div v-if="open" ref="container" :class="containerClass">
      <transition
        appear
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-1"
      >
        <div :class="tooltipClass">
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
  wrapperClass: {
    type: String,
    default: 'relative inline-flex'
  },
  containerClass: {
    type: String,
    default: 'z-10 py-2'
  },
  tooltipClass: {
    type: String,
    default: 'flex items-center justify-center invisible w-auto h-6 max-w-xs px-2 space-x-1 truncate rounded shadow lg:visible u-bg-gray-800 truncate u-text-gray-50 text-xs'
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
  }]
})
</script>

<script lang="ts">
export default { name: 'UTooltip' }
</script>
