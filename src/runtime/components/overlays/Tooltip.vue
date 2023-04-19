<template>
  <div ref="trigger" :class="wrapperClass" @mouseover="onMouseOver" @mouseleave="onMouseLeave">
    <slot :open="open">
      Hover me
    </slot>

    <div v-if="open && !prevent" ref="container" :class="[containerClass, widthClass]">
      <transition appear v-bind="transitionClass">
        <div :class="[baseClass, backgroundClass, roundedClass, shadowClass, ringClass]">
          <slot name="text">
            {{ text }}
          </slot>

          <span v-if="shortcuts?.length" :class="shortcutsClass">
            <span class="mr-1 text-gray-700 dark:text-gray-200">&middot;</span>
            <kbd v-for="shortcut of shortcuts" :key="shortcut" class="flex items-center justify-center font-sans px-1 h-4 min-w-[16px] text-[10px] bg-gray-100 dark:bg-gray-800 rounded text-gray-900 dark:text-white">
              {{ shortcut }}
            </kbd>
          </span>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, ref } from 'vue'
import { defu } from 'defu'
import { usePopper } from '../../composables/usePopper'
import type { PopperOptions } from '../../types'
import $ui from '#build/ui'

const props = defineProps({
  text: {
    type: String,
    default: null
  },
  prevent: {
    type: Boolean,
    default: false
  },
  shortcuts: {
    type: Array as PropType<string[]>,
    default: () => []
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
  backgroundClass: {
    type: String,
    default: () => $ui.tooltip.background
  },
  shadowClass: {
    type: String,
    default: () => $ui.tooltip.shadow
  },
  ringClass: {
    type: String,
    default: () => $ui.tooltip.ring
  },
  roundedClass: {
    type: String,
    default: () => $ui.tooltip.rounded
  },
  baseClass: {
    type: String,
    default: () => $ui.tooltip.base
  },
  transitionClass: {
    type: Object,
    default: () => $ui.tooltip.transition
  },
  popper: {
    type: Object as PropType<PopperOptions>,
    default: () => ({})
  },
  shortcutsClass: {
    type: String,
    default: () => $ui.tooltip.shortcuts
  },
  openDelay: {
    type: Number,
    default: 0
  },
  closeDelay: {
    type: Number,
    default: 0
  }
})

const popper = computed<PopperOptions>(() => defu({}, props.popper, $ui.tooltip.popper))

const [trigger, container] = usePopper(popper.value)

const open = ref(false)

let openTimeout: NodeJS.Timeout | null = null
let closeTimeout: NodeJS.Timeout | null = null

// Methods

function onMouseOver () {
  // cancel programmed closing
  if (closeTimeout) {
    clearTimeout(closeTimeout)
    closeTimeout = null
  }
  // dropdown already open
  if (open.value) {
    return
  }
  openTimeout = openTimeout || setTimeout(() => {
    open.value = true
    openTimeout = null
  }, props.openDelay)
}

function onMouseLeave () {
  // cancel programmed opening
  if (openTimeout) {
    clearTimeout(openTimeout)
    openTimeout = null
  }
  // dropdown already closed
  if (!open.value) {
    return
  }
  closeTimeout = closeTimeout || setTimeout(() => {
    open.value = false
    closeTimeout = null
  }, props.closeDelay)
}
</script>
