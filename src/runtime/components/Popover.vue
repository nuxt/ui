<script lang="ts">
import { tv } from 'tailwind-variants'
import type { PopoverRootProps, PopoverRootEmits, PopoverContentProps, PopoverArrowProps } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/popover'
import type { KbdProps } from '#ui/components/Kbd.vue'

const appConfig = _appConfig as AppConfig & { ui: { popover: Partial<typeof theme> } }

const popover = tv({ extend: tv(theme), ...(appConfig.ui?.popover || {}) })

export interface PopoverProps extends PopoverRootProps {
  text?: string
  shortcuts?: string[] | KbdProps[]
  content?: Omit<PopoverContentProps, 'as' | 'asChild'>
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
import { PopoverRoot, PopoverTrigger, PopoverPortal, PopoverContent, PopoverArrow, useForwardPropsEmits } from 'radix-vue'
import { reactivePick } from '@vueuse/core'

const props = defineProps<PopoverProps>()
const emits = defineEmits<PopoverEmits>()
defineSlots<PopoverSlots>()

const rootProps = useForwardPropsEmits(reactivePick(props, 'defaultOpen', 'open', 'modal'), emits)
const contentProps = toRef(() => defu(props.content, { side: 'bottom', sideOffset: 8 }) as PopoverContentProps)
const arrowProps = toRef(() => props.arrow as PopoverArrowProps)

const ui = computed(() => tv({ extend: popover, slots: props.ui })())
</script>

<template>
  <PopoverRoot v-bind="rootProps">
    <PopoverTrigger as-child>
      <slot />
    </PopoverTrigger>

    <PopoverPortal :disabled="!portal">
      <PopoverContent v-bind="contentProps" :class="ui.content({ class: props.class })">
        <slot name="content" />

        <PopoverArrow v-if="!!arrow" v-bind="arrowProps" :class="ui.arrow()" />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
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