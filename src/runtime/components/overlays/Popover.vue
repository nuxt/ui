<template>
  <HPopover ref="popover" v-slot="{ open, close }" :class="ui.wrapper" @mouseleave="onMouseLeave">
    <HPopoverButton
      ref="trigger"
      as="div"
      :disabled="disabled"
      class="inline-flex w-full"
      role="button"
      @mouseover="onMouseOver"
    >
      <slot :open="open" :close="close">
        <button :disabled="disabled">
          Open
        </button>
      </slot>
    </HPopoverButton>

    <div v-if="open" ref="container" :class="[ui.container, ui.width]" @mouseover="onMouseOver">
      <Transition appear v-bind="ui.transition">
        <HPopoverPanel :class="[ui.base, ui.background, ui.ring, ui.rounded, ui.shadow]" static>
          <slot name="panel" :open="open" :close="close" />
        </HPopoverPanel>
      </Transition>
    </div>
  </HPopover>
</template>

<script lang="ts">
import { computed, ref, onMounted, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { defu } from 'defu'
import { Popover as HPopover, PopoverButton as HPopoverButton, PopoverPanel as HPopoverPanel } from '@headlessui/vue'
import { usePopper } from '../../composables/usePopper'
import type { PopperOptions } from '../../types'
import { useAppConfig } from '#imports'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'

// const appConfig = useAppConfig()

export default defineComponent({
  components: {
    HPopover,
    HPopoverButton,
    HPopoverPanel
  },
  props: {
    mode: {
      type: String,
      default: 'click',
      validator: (value: string) => {
        return ['click', 'hover'].includes(value)
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    openDelay: {
      type: Number,
      default: 50
    },
    closeDelay: {
      type: Number,
      default: 0
    },
    popper: {
      type: Object as PropType<PopperOptions>,
      default: () => ({})
    },
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.popover>>,
      default: () => appConfig.ui.popover
    }
  },
  setup (props) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.popover>>(() => defu({}, props.ui, appConfig.ui.popover))

    const popper = computed<PopperOptions>(() => defu({}, props.popper, ui.value.popper as PopperOptions))

    const [trigger, container] = usePopper(popper.value)

    // https://github.com/tailwindlabs/headlessui/blob/f66f4926c489fc15289d528294c23a3dc2aee7b1/packages/%40headlessui-vue/src/components/popover/popover.ts#L151
    const popover = ref<any>(null)
    const popoverApi = ref<any>(null)

    let openTimeout: NodeJS.Timeout | null = null
    let closeTimeout: NodeJS.Timeout | null = null

    onMounted(() => {
      const popoverProvides = popover.value?.$.provides
      if (!popoverProvides) {
        return
      }
      const popoverProvidesSymbols = Object.getOwnPropertySymbols(popoverProvides)
      popoverApi.value = popoverProvidesSymbols.length && popoverProvides[popoverProvidesSymbols[0]]
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

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      popover,
      trigger,
      container,
      onMouseOver,
      onMouseLeave
    }
  }
})
</script>
