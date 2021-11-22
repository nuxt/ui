<template>
  <Popover v-slot="{ open }" :class="wrapperClass">
    <PopoverButton ref="trigger" as="div">
      <slot :open="open">
        Open
      </slot>
    </PopoverButton>

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
        <PopoverPanel :class="panelClass" static>
          <slot name="panel" />
        </PopoverPanel>
      </transition>
    </div>
  </Popover>
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

    return {
      trigger,
      container
    }
  }
}
</script>
