<template>
  <div ref="trigger" :class="wrapperClass" @mouseover="onMouseOver" @mouseleave="onMouseLeave">
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

const popperOptions = computed<PopperOptions>(() => defu({}, props.popperOptions, $ui.tooltip.popperOptions))

const [trigger, container] = usePopper(popperOptions.value)

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

<script lang="ts">
export default { name: 'UTooltip' }
</script>
