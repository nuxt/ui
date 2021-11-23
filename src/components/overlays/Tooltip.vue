
<template>
  <div ref="container" @mouseover="mouseover" @mouseleave="mouseleave">
    <slot />

    <transition
      enter-class="transform scale-95 opacity-0"
      enter-active-class="transition duration-100 ease-out"
      enter-to-class="transform scale-100 opacity-100"
      leave-class="opacity-100"
      leave-active-class="duration-100 ease-in"
      leave-to-class="opacity-0"
    >
      <div
        v-show="show && (text || shortcuts.length || $slots.text)"
        ref="tooltip"
        class="fixed z-30 flex bg-gray-800 items-center justify-center invisible w-auto h-6 max-w-xs px-2 space-x-1 truncate rounded shadow lg:visible"
      >
        <span v-if="text || $slots.text" class="truncate text-gray-50 text-xxs">
          <slot name="text">{{ text }}</slot>
        </span>
        <div v-if="shortcuts && shortcuts.length">
          <div class="flex items-center flex-shrink-0 h-6 space-x-1">
            <span v-if="text" class="mb-2 text-center text-gray-500">.</span>
            <div
              v-for="(shortcut, index) of shortcuts"
              :key="index"
              class="flex items-center px-1 bg-gray-600 rounded"
            >
              <span
                class="font-light text-center text-gray-200 text-xxs"
              >{{ shortcut }}</span>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'

import { usePopper } from '../../utils'

export default {
  components: {
    Popover,
    PopoverButton,
    PopoverPanel
  },
  props: {
    placement: {
      type: String,
      default: 'bottom'
    },
    strategy: {
      type: String,
      default: 'absolute'
    },
    wrapperClass: {
      type: String,
      default: 'relative'
    },
    tooltipClass: {
      type: String,
      default: 'z-10'
    },
    label: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    const [trigger, container] = usePopper({
      placement: props.placement,
      strategy: props.strategy,
      modifiers: [{
        name: 'offset',
        options: {
          offset: [0, 8]
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

    return {
      trigger,
      container
    }
  }
}
</script>
