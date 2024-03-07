<script lang="ts">
import { tv } from 'tailwind-variants'
import type { TooltipRootProps, TooltipRootEmits, TooltipContentProps } from 'radix-vue'
import appConfig from '#build/app.config'
import theme from '#build/ui/tooltip'

const tooltip = tv({ extend: tv(theme), ...(appConfig.ui?.tooltip || {}) })

export interface TooltipProps extends TooltipRootProps, Omit<TooltipContentProps, 'as' | 'asChild'> {
  text?: string
  disabled?: boolean
  arrow?: boolean
  portal?: boolean
  class?: any
  ui?: Partial<typeof tooltip.slots>
}

export interface TooltipEmits extends TooltipRootEmits {}

export interface TooltipSlots {
  default(): any
  text(): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { TooltipRoot, TooltipTrigger, TooltipPortal, TooltipContent, TooltipArrow, useForwardProps, useForwardPropsEmits } from 'radix-vue'
import { reactivePick } from '@vueuse/core'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<TooltipProps>(), {
  text: '',
  side: 'bottom',
  delayDuration: 0,
  sideOffset: 8,
  class: undefined,
  ui: undefined
})
const emits = defineEmits<TooltipEmits>()
defineSlots<TooltipSlots>()

const forwardRoot = useForwardPropsEmits(reactivePick(props, 'defaultOpen', 'open', 'delayDuration'), emits)
const forwardContent = useForwardProps(reactivePick(props, 'side', 'sideOffset', 'align', 'alignOffset', 'avoidCollisions', 'collisionBoundary', 'collisionPadding', 'arrowPadding', 'sticky', 'hideWhenDetached'))

// FIXME: Cannot extend multiple times
// const ui = computed(() => tv({ extend: tooltip, slots: props.ui })())
// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tooltip())
</script>

<template>
  <TooltipRoot v-bind="forwardRoot">
    <TooltipTrigger as-child>
      <slot />
    </TooltipTrigger>

    <TooltipPortal :disabled="!portal">
      <TooltipContent v-bind="{ ...forwardContent, ...$attrs }" :class="ui.content({ class: props.class })">
        <slot name="text">
          {{ text }}
        </slot>

        <TooltipArrow v-if="arrow" :width="11" :height="5" :class="ui.arrow()" />
      </TooltipContent>
    </TooltipPortal>
  </TooltipRoot>
</template>

<style>
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-0.25rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes slideRight {
  from {
    opacity: 0;
    transform: translateX(-0.25rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(0.25rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes slideLeft {
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