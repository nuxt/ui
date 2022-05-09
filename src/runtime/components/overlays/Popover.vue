<template>
  <Popover v-slot="{ open, close }" :class="wrapperClass" @mouseleave="onMouseLeave">
    <PopoverButton ref="trigger" as="div" @mouseover="onMouseOver">
      <slot :open="open" :close="close">
        <button>Open</button>
      </slot>
    </PopoverButton>

    <div v-if="open" ref="container" :class="containerClass" @mouseover="onMouseOver">
      <transition
        appear
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-1"
      >
        <PopoverPanel :class="panelClass" static>
          <slot name="panel" :open="open" :close="close" />
        </PopoverPanel>
      </transition>
    </div>
  </Popover>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import { ref, onMounted } from 'vue'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'

import { usePopper } from '../../utils'

const props = defineProps({
  placement: {
    type: String,
    default: 'bottom'
  },
  strategy: {
    type: String,
    default: 'fixed'
  },
  mode: {
    type: String,
    default: 'click',
    validator: (value: string) => {
      return ['click', 'hover'].includes(value)
    }
  },
  wrapperClass: {
    type: String,
    default: 'relative'
  },
  containerClass: {
    type: String,
    default: 'z-10 py-2'
  },
  panelClass: {
    type: String,
    default: ''
  }
})

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

const popoverApi: Ref<any> = ref(null)

let openTimeout: NodeJS.Timeout | null = null
let closeTimeout: NodeJS.Timeout | null = null

onMounted(() => {
  setTimeout(() => {
    const popoverProvides = trigger.value?.$.provides
    const popoverProvidesSymbols = Object.getOwnPropertySymbols(popoverProvides)
    popoverApi.value = popoverProvidesSymbols.length && popoverProvides[popoverProvidesSymbols[0]]
    // stop trigger click propagation on hover
    popoverApi.value.button.addEventListener('click', (e: Event) => {
      if (props.mode === 'hover') {
        e.stopPropagation()
      }
    }, true)
  }, 0)
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
  }, 50)
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
  }, 0)
}
</script>
