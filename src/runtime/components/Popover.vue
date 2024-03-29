<script lang="ts">
import { tv } from 'tailwind-variants'
import type { PopoverRootProps, HoverCardRootProps, PopoverRootEmits, PopoverContentProps, PopoverArrowProps } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/popover'

const appConfig = _appConfig as AppConfig & { ui: { popover: Partial<typeof theme> } }

const popover = tv({ extend: tv(theme), ...(appConfig.ui?.popover || {}) })

export interface PopoverProps extends PopoverRootProps, Pick<HoverCardRootProps, 'openDelay' | 'closeDelay'>{
  /**
   * The mode of the popover.
   * @defaultValue "click"
   */
  mode?: 'click' | 'hover'
  content?: Omit<PopoverContentProps, 'as' | 'asChild' | 'forceMount'>
  arrow?: boolean | Omit<PopoverArrowProps, 'as' | 'asChild'>
  portal?: boolean
  class?: any
  ui?: Partial<typeof popover.slots>
}

export interface PopoverEmits extends PopoverRootEmits {}

export interface PopoverSlots {
  default(): any
  content(): any
}
</script>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import { defu } from 'defu'
import { useForwardPropsEmits } from 'radix-vue'
import { Popover, HoverCard } from 'radix-vue/namespaced'
import { reactivePick } from '@vueuse/core'

const props = withDefaults(defineProps<PopoverProps>(), {
  portal: true,
  mode: 'click',
  openDelay: 0,
  closeDelay: 0
})
const emits = defineEmits<PopoverEmits>()
defineSlots<PopoverSlots>()

const pick = props.mode === 'hover' ? reactivePick(props, 'defaultOpen', 'open', 'openDelay', 'closeDelay') : reactivePick(props, 'defaultOpen', 'open', 'modal')
const rootProps = useForwardPropsEmits(pick, emits)
const contentProps = toRef(() => defu(props.content, { side: 'bottom', sideOffset: 8 }) as PopoverContentProps)
const arrowProps = toRef(() => props.arrow as PopoverArrowProps)

const ui = computed(() => tv({ extend: popover, slots: props.ui })())

const Component = computed(() => props.mode === 'hover' ? HoverCard : Popover)
</script>

<template>
  <Component.Root v-bind="rootProps">
    <Component.Trigger v-if="$slots.default" as-child>
      <slot />
    </Component.Trigger>

    <Component.Portal :disabled="!portal">
      <Component.Content v-bind="contentProps" :class="ui.content({ class: props.class })">
        <slot name="content" />

        <Component.Arrow v-if="!!arrow" v-bind="arrowProps" :class="ui.arrow()" />
      </Component.Content>
    </Component.Portal>
  </Component.Root>
</template>

<style>
@keyframes popover-down-open {
  from {
    opacity: 0;
    transform: translateY(-0.25rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes popover-down-closed {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-0.25rem);
  }
}
@keyframes popover-right-open {
  from {
    opacity: 0;
    transform: translateX(-0.25rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes popover-right-closed {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateX(-0.25rem);
  }
}
@keyframes popover-up-open {
  from {
    opacity: 0;
    transform: translateY(0.25rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes popover-up-closed {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(0.25rem);
  }
}
@keyframes popover-left-open {
  from {
    opacity: 0;
    transform: translateX(0.25rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes popover-left-closed {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateX(0.25rem);
  }
}
</style>
