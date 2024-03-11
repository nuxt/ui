<script lang="ts">
import { tv } from 'tailwind-variants'
import type { TooltipRootProps, TooltipRootEmits, TooltipContentProps } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/tooltip'

const appConfig = _appConfig as AppConfig & { ui: { tooltip: Partial<typeof theme> } }

const tooltip = tv({ extend: tv(theme), ...(appConfig.ui?.tooltip || {}) })

export interface TooltipProps extends TooltipRootProps, Omit<TooltipContentProps, 'as' | 'asChild'> {
  content?: string
  arrow?: boolean
  portal?: boolean
  class?: any
  ui?: Partial<typeof tooltip.slots>
}

export interface TooltipEmits extends TooltipRootEmits {}

export interface TooltipSlots {
  default(): any
  content(): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { TooltipRoot, TooltipTrigger, TooltipPortal, TooltipContent, TooltipArrow, useForwardProps, useForwardPropsEmits } from 'radix-vue'
import { reactivePick } from '@vueuse/core'

const props = withDefaults(defineProps<TooltipProps>(), {
  side: 'bottom',
  delayDuration: 0,
  sideOffset: 8
})
const emits = defineEmits<TooltipEmits>()
defineSlots<TooltipSlots>()

const forwardRoot = useForwardPropsEmits(reactivePick(props, 'defaultOpen', 'open', 'delayDuration'), emits)
const forwardContent = useForwardProps(reactivePick(props, 'side', 'sideOffset', 'align', 'alignOffset', 'avoidCollisions', 'collisionBoundary', 'collisionPadding', 'arrowPadding', 'sticky', 'hideWhenDetached'))

const ui = computed(() => tv({ extend: tooltip, slots: props.ui })())
</script>

<template>
  <TooltipRoot v-bind="forwardRoot">
    <TooltipTrigger as-child>
      <slot />
    </TooltipTrigger>

    <TooltipPortal :disabled="!portal">
      <TooltipContent v-bind="forwardContent" :class="ui.content({ class: props.class })">
        <slot name="content">
          {{ content }}
        </slot>

        <TooltipArrow v-if="arrow" :class="ui.arrow()" />
      </TooltipContent>
    </TooltipPortal>
  </TooltipRoot>
</template>

<style>
@keyframes tooltip-down {
  from {
    opacity: 0;
    transform: translateY(-0.25rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes tooltip-right {
  from {
    opacity: 0;
    transform: translateX(-0.25rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes tooltip-up {
  from {
    opacity: 0;
    transform: translateY(0.25rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes tooltip-left {
  from {
    opacity: 0;
    transform: translateX(0.25rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>