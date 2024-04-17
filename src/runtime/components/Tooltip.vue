<script lang="ts">
import { tv } from 'tailwind-variants'
import type { TooltipRootProps, TooltipRootEmits, TooltipContentProps, TooltipArrowProps } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/tooltip'
import type { KbdProps } from '#ui/types'

const appConfig = _appConfig as AppConfig & { ui: { tooltip: Partial<typeof theme> } }

const tooltip = tv({ extend: tv(theme), ...(appConfig.ui?.tooltip || {}) })

export interface TooltipProps extends TooltipRootProps {
  text?: string
  shortcuts?: string[] | KbdProps[]
  content?: Omit<TooltipContentProps, 'asChild'>
  arrow?: boolean | Omit<TooltipArrowProps, 'asChild'>
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
import { computed, toRef } from 'vue'
import { defu } from 'defu'
import { TooltipRoot, TooltipTrigger, TooltipPortal, TooltipContent, TooltipArrow, useForwardPropsEmits } from 'radix-vue'
import { reactivePick } from '@vueuse/core'
import { UKbd } from '#components'

const props = withDefaults(defineProps<TooltipProps>(), { portal: true })
const emits = defineEmits<TooltipEmits>()
defineSlots<TooltipSlots>()

const rootProps = useForwardPropsEmits(reactivePick(props, 'defaultOpen', 'open', 'delayDuration'), emits)
const contentProps = toRef(() => defu(props.content, { side: 'bottom', sideOffset: 8 }) as TooltipContentProps)
const arrowProps = toRef(() => props.arrow as TooltipArrowProps)

const ui = computed(() => tv({ extend: tooltip, slots: props.ui })({ side: contentProps.value.side }))
</script>

<template>
  <TooltipRoot v-bind="rootProps">
    <TooltipTrigger v-if="$slots.default" as-child>
      <slot />
    </TooltipTrigger>

    <TooltipPortal :disabled="!portal">
      <TooltipContent v-bind="contentProps" :class="ui.content({ class: props.class })">
        <slot name="content">
          <span v-if="text" :class="ui.text()">{{ text }}</span>

          <span v-if="shortcuts?.length" :class="ui.shortcuts()">
            <UKbd v-for="(shortcut, index) in shortcuts" :key="index" size="sm" v-bind="typeof shortcut === 'string' ? { value: shortcut } : shortcut" />
          </span>
        </slot>

        <TooltipArrow v-if="!!arrow" v-bind="arrowProps" :class="ui.arrow()" />
      </TooltipContent>
    </TooltipPortal>
  </TooltipRoot>
</template>
