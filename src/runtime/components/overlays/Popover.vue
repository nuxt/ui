<template>
  <Popover v-slot="{ open, close }" :class="wrapperClass" @mouseleave="onMouseLeave">
    <PopoverButton ref="trigger" as="div" class="inline-flex" @mouseover="onMouseOver">
      <slot :open="open" :close="close">
        <button>Open</button>
      </slot>
    </PopoverButton>

    <div v-if="open" ref="container" :class="[containerClass, widthClass]" @mouseover="onMouseOver">
      <transition appear v-bind="transitionClass">
        <PopoverPanel :class="baseClass" static>
          <slot name="panel" :open="open" :close="close" />
        </PopoverPanel>
      </transition>
    </div>
  </Popover>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import type { PropType } from 'vue'
import { defu } from 'defu'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { usePopper } from '../../composables/usePopper'
import type { PopperOptions } from '../../types'
import $ui from '#build/ui'

const props = defineProps({
  mode: {
    type: String,
    default: 'click',
    validator: (value: string) => {
      return ['click', 'hover'].includes(value)
    }
  },
  wrapperClass: {
    type: String,
    default: () => $ui.popover.wrapper
  },
  containerClass: {
    type: String,
    default: () => $ui.popover.container
  },
  widthClass: {
    type: String,
    default: () => $ui.popover.width
  },
  baseClass: {
    type: String,
    default: () => $ui.popover.base
  },
  transitionClass: {
    type: Object,
    default: () => $ui.popover.transition
  },
  popperOptions: {
    type: Object as PropType<PopperOptions>,
    default: () => ({})
  },
  openDelay: {
    type: Number,
    default: 50
  },
  closeDelay: {
    type: Number,
    default: 0
  }
})

const popperOptions = computed<PopperOptions>(() => defu({}, props.popperOptions, $ui.popover.popperOptions))

const [trigger, container] = usePopper(popperOptions.value)

// https://github.com/tailwindlabs/headlessui/blob/f66f4926c489fc15289d528294c23a3dc2aee7b1/packages/%40headlessui-vue/src/components/popover/popover.ts#L151
const popoverApi = ref<any>(null)

let openTimeout: NodeJS.Timeout | null = null
let closeTimeout: NodeJS.Timeout | null = null

onMounted(() => {
  setTimeout(() => {
    // @ts-expect-error internals
    const popoverProvides = trigger.value?.$.provides
    if (!popoverProvides) {
      return
    }
    const popoverProvidesSymbols = Object.getOwnPropertySymbols(popoverProvides)
    popoverApi.value = popoverProvidesSymbols.length && popoverProvides[popoverProvidesSymbols[0]]
    // stop trigger click propagation on hover
    popoverApi.value?.button?.addEventListener('click', (e: Event) => {
      if (props.mode === 'hover') {
        e.stopPropagation()
      }
    }, true)
  }, 200)
})

function onMouseOver () {
  if (props.mode !== 'hover' || !popoverApi.value) {
    return
  }

  // cancel programmed closing
  if (closeTimeout) {
    clearTimeout(closeTimeout)
    closeTimeout = null
  }
  // dropdown already open
  if (popoverApi.value.popoverState === 0) {
    return
  }
  openTimeout = openTimeout || setTimeout(() => {
    popoverApi.value.togglePopover && popoverApi.value.togglePopover()
    openTimeout = null
  }, props.openDelay)
}

function onMouseLeave () {
  if (props.mode !== 'hover' || !popoverApi.value) {
    return
  }

  // cancel programmed opening
  if (openTimeout) {
    clearTimeout(openTimeout)
    openTimeout = null
  }
  // dropdown already closed
  if (popoverApi.value.popoverState === 1) {
    return
  }
  closeTimeout = closeTimeout || setTimeout(() => {
    popoverApi.value.closePopover && popoverApi.value.closePopover()
    closeTimeout = null
  }, props.closeDelay)
}
</script>

<script lang="ts">
export default { name: 'UPopover' }
</script>
