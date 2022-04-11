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

<script>
import { ref } from 'vue'
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
      default: 'fixed'
    },
    mode: {
      type: String,
      default: 'click',
      validator: (value) => {
        return ['click', 'hover'].includes(value)
      }
    },
    wrapperClass: {
      type: String,
      default: 'relative'
    },
    containerClass: {
      type: String,
      default: 'z-10'
    },
    panelClass: {
      type: String,
      default: 'transform'
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

    const popoverApi = ref(null)
    let openTimeout = null
    let closeTimeout = null
    onMounted(() => {
      setTimeout(() => {
        const popoverProvides = trigger.value?.$.provides
        const popoverProvidesSymbols = Object.getOwnPropertySymbols(popoverProvides)
        popoverApi.value = popoverProvidesSymbols.length && popoverProvides[popoverProvidesSymbols[0]]
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
      }, 200)
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
      }, 100)
    }

    return {
      trigger,
      container,
      onMouseOver,
      onMouseLeave
    }
  }
}
</script>
