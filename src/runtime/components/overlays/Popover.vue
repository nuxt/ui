<template>
  <!-- eslint-disable-next-line vue/no-template-shadow -->
  <HPopover ref="popover" v-slot="{ open, close }" :class="ui.wrapper" v-bind="attrs" @mouseleave="onMouseLeave">
    <HPopoverButton
      ref="trigger"
      as="div"
      :disabled="disabled"
      :class="ui.trigger"
      role="button"
      @mouseenter="onMouseEnter"
      @touchstart.passive="onTouchStart"
    >
      <slot :open="open" :close="close">
        <button :disabled="disabled">
          Open
        </button>
      </slot>
    </HPopoverButton>

    <Transition v-if="overlay" appear v-bind="ui.overlay.transition">
      <div v-if="open" :class="[ui.overlay.base, ui.overlay.background]" />
    </Transition>

    <div v-if="open" ref="container" :class="[ui.container, ui.width]" :style="containerStyle" @mouseenter="onMouseEnter">
      <Transition appear v-bind="ui.transition">
        <div>
          <div v-if="popper.arrow" data-popper-arrow :class="Object.values(ui.arrow)" />

          <HPopoverPanel :class="[ui.base, ui.background, ui.ring, ui.rounded, ui.shadow]" static>
            <slot name="panel" :open="open" :close="close" />
          </HPopoverPanel>
        </div>
      </Transition>
    </div>
  </HPopover>
</template>

<script lang="ts">
import { computed, ref, toRef, onMounted, defineComponent, watch } from 'vue'
import type { PropType } from 'vue'
import { defu } from 'defu'
import { Popover as HPopover, PopoverButton as HPopoverButton, PopoverPanel as HPopoverPanel, provideUseId } from '@headlessui/vue'
import { useUI } from '../../composables/useUI'
import { usePopper } from '../../composables/usePopper'
import { mergeConfig } from '../../utils'
import type { DeepPartial, PopperOptions, Strategy } from '../../types/index'
// @ts-expect-error
import appConfig from '#build/app.config'
import { popover } from '#ui/ui.config'
import { useId } from '#imports'

const config = mergeConfig<typeof popover>(appConfig.ui.strategy, appConfig.ui.popover, popover)

export default defineComponent({
  components: {
    HPopover,
    HPopoverButton,
    HPopoverPanel
  },
  inheritAttrs: false,
  props: {
    mode: {
      type: String as PropType<'click' | 'hover'>,
      default: 'click',
      validator: (value: string) => ['click', 'hover'].includes(value)
    },
    open: {
      type: Boolean,
      default: undefined
    },
    disabled: {
      type: Boolean,
      default: false
    },
    openDelay: {
      type: Number,
      default: () => config.default.openDelay
    },
    closeDelay: {
      type: Number,
      default: () => config.default.closeDelay
    },
    overlay: {
      type: Boolean,
      default: false
    },
    popper: {
      type: Object as PropType<PopperOptions>,
      default: () => ({})
    },
    class: {
      type: [String, Object, Array] as PropType<any>,
      default: () => ''
    },
    ui: {
      type: Object as PropType<DeepPartial<typeof config> & { strategy?: Strategy }>,
      default: () => ({})
    }
  },
  emits: ['update:open'],
  setup(props, { emit }) {
    const { ui, attrs } = useUI('popover', toRef(props, 'ui'), config, toRef(props, 'class'))

    const popper = computed<PopperOptions>(() => defu(props.mode === 'hover' ? { offsetDistance: 0 } : {}, props.popper, ui.value.popper as PopperOptions))

    const [trigger, container] = usePopper(popper.value)

    const popover = ref<any>(null)
    // https://github.com/tailwindlabs/headlessui/blob/f66f4926c489fc15289d528294c23a3dc2aee7b1/packages/%40headlessui-vue/src/components/popover/popover.ts#L151
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

      if (props.open) {
        popoverApi.value?.togglePopover()
      }
    })

    const containerStyle = computed(() => {
      if (props.mode !== 'hover') {
        return {}
      }

      const offsetDistance = (props.popper as PopperOptions)?.offsetDistance || (ui.value.popper as PopperOptions)?.offsetDistance || 8
      const placement = popper.value.placement?.split('-')[0]
      const padding = `${offsetDistance}px`

      if (placement === 'top' || placement === 'bottom') {
        return {
          paddingTop: padding,
          paddingBottom: padding
        }
      } else if (placement === 'left' || placement === 'right') {
        return {
          paddingLeft: padding,
          paddingRight: padding
        }
      } else {
        return {
          paddingTop: padding,
          paddingBottom: padding,
          paddingLeft: padding,
          paddingRight: padding
        }
      }
    })

    function onTouchStart(event: TouchEvent) {
      if (!event.cancelable || !popoverApi.value || props.mode === 'click') {
        return
      }

      if (popoverApi.value.popoverState === 0) {
        popoverApi.value.closePopover()
      } else {
        popoverApi.value.togglePopover()
      }
    }

    function onMouseEnter() {
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
        if (popoverApi.value.togglePopover) {
          popoverApi.value.togglePopover()
        }
        openTimeout = null
      }, props.openDelay)
    }

    function onMouseLeave() {
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
        if (popoverApi.value.closePopover) {
          popoverApi.value.closePopover()
        }
        closeTimeout = null
      }, props.closeDelay)
    }

    watch(() => props.open, (newValue: boolean, oldValue: boolean) => {
      if (!popoverApi.value) return
      if (oldValue === undefined || newValue === oldValue) return

      if (newValue) {
        // No `openPopover` method and `popoverApi.value.togglePopover` won't work because of the `watch` below
        popoverApi.value.popoverState = 0
      } else {
        popoverApi.value.closePopover()
      }
    })

    watch(() => popoverApi.value?.popoverState, (newValue: number, oldValue: number) => {
      if (oldValue === undefined || newValue === oldValue) return

      emit('update:open', newValue === 0)
    })

    provideUseId(() => useId())

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      popover,
      // eslint-disable-next-line vue/no-dupe-keys
      popper,
      trigger,
      container,
      containerStyle,
      onTouchStart,
      onMouseEnter,
      onMouseLeave
    }
  }
})
</script>
