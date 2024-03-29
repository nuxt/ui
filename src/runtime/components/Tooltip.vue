<script lang="ts">
import { tv } from 'tailwind-variants'
import type { TooltipRootProps, TooltipRootEmits, TooltipContentProps, TooltipArrowProps } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/tooltip'
import type { KbdProps } from '#ui/components/Kbd.vue'

const appConfig = _appConfig as AppConfig & { ui: { tooltip: Partial<typeof theme> } }

const tooltip = tv({ extend: tv(theme), ...(appConfig.ui?.tooltip || {}) })

export interface TooltipProps extends TooltipRootProps {
  text?: string
  shortcuts?: string[] | KbdProps[]
  content?: Omit<TooltipContentProps, 'as' | 'asChild'>
  arrow?: boolean | Omit<TooltipArrowProps, 'as' | 'asChild'>
  portal?: boolean
  class?: any
  ui?: Partial<typeof tooltip.slots>
}

export interface TooltipEmits extends TooltipRootEmits {}

export interface TooltipSlots {
  default(): any
  content(): any
  text(): any
  shortcuts(): any
}
</script>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import { defu } from 'defu'
import { TooltipRoot, TooltipTrigger, TooltipPortal, TooltipContent, TooltipArrow, useForwardPropsEmits } from 'radix-vue'
import { reactivePick } from '@vueuse/core'
import UKbd from '#ui/components/Kbd.vue'

const props = withDefaults(defineProps<TooltipProps>(), { portal: true })
const emits = defineEmits<TooltipEmits>()
defineSlots<TooltipSlots>()

const rootProps = useForwardPropsEmits(reactivePick(props, 'defaultOpen', 'open', 'delayDuration'), emits)
const contentProps = toRef(() => defu(props.content, { side: 'bottom', sideOffset: 8 }) as TooltipContentProps)
const arrowProps = toRef(() => props.arrow as TooltipArrowProps)

const ui = computed(() => tv({ extend: tooltip, slots: props.ui })())
</script>

<template>
  <TooltipRoot v-bind="rootProps">
    <TooltipTrigger v-if="$slots.default" as-child>
      <slot />
    </TooltipTrigger>

    <TooltipPortal :disabled="!portal">
      <TooltipContent v-bind="contentProps" :class="ui.content({ class: props.class })">
        <slot name="content">
          <span v-if="text || $slots.text" :class="ui.text()">
            <slot name="text">{{ text }}</slot>
          </span>

          <span v-if="shortcuts?.length || $slots.shortcuts" :class="ui.shortcuts()">
            <slot name="shortcuts">
              <UKbd v-for="(shortcut, index) in shortcuts" :key="index" size="xs" v-bind="typeof shortcut === 'string' ? { value: shortcut } : shortcut" />
            </slot>
          </span>
        </slot>

        <TooltipArrow v-if="!!arrow" v-bind="arrowProps" :class="ui.arrow()" />
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
