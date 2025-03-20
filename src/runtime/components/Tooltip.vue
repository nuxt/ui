<script lang="ts">
import type { TooltipRootProps, TooltipRootEmits, TooltipContentProps, TooltipContentEmits, TooltipArrowProps } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/tooltip'
import { tv } from '../utils/tv'
import type { KbdProps } from '../types'
import type { EmitsToProps } from '../types/utils'

const appConfigTooltip = _appConfig as AppConfig & { ui: { tooltip: Partial<typeof theme> } }

const tooltip = tv({ extend: tv(theme), ...(appConfigTooltip.ui?.tooltip || {}) })

export interface TooltipProps extends TooltipRootProps {
  /** The text content of the tooltip. */
  text?: string
  /** The keyboard keys to display in the tooltip. */
  kbds?: KbdProps['value'][] | KbdProps[]
  /**
   * The content of the tooltip.
   * @defaultValue { side: 'bottom', sideOffset: 8, collisionPadding: 8 }
   */
  content?: Omit<TooltipContentProps, 'as' | 'asChild'> & Partial<EmitsToProps<TooltipContentEmits>>
  /**
   * Display an arrow alongside the tooltip.
   * @defaultValue false
   */
  arrow?: boolean | Omit<TooltipArrowProps, 'as' | 'asChild'>
  /**
   * Render the tooltip in a portal.
   * @defaultValue true
   */
  portal?: boolean
  class?: any
  ui?: Partial<typeof tooltip.slots>
}

export interface TooltipEmits extends TooltipRootEmits {}

export interface TooltipSlots {
  default(props: { open: boolean }): any
  content(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import { defu } from 'defu'
import { TooltipRoot, TooltipTrigger, TooltipPortal, TooltipContent, TooltipArrow, useForwardPropsEmits } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import UKbd from './Kbd.vue'

const props = withDefaults(defineProps<TooltipProps>(), {
  portal: true
})
const emits = defineEmits<TooltipEmits>()
const slots = defineSlots<TooltipSlots>()

const rootProps = useForwardPropsEmits(reactivePick(props, 'defaultOpen', 'open', 'delayDuration', 'disableHoverableContent', 'disableClosingTrigger', 'disabled', 'ignoreNonKeyboardFocus'), emits)
const contentProps = toRef(() => defu(props.content, { side: 'bottom', sideOffset: 8, collisionPadding: 8 }) as TooltipContentProps)
const arrowProps = toRef(() => props.arrow as TooltipArrowProps)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tooltip({
  side: contentProps.value.side
}))
</script>

<template>
  <TooltipRoot v-slot="{ open }" v-bind="rootProps">
    <TooltipTrigger v-if="!!slots.default" v-bind="$attrs" as-child :class="props.class">
      <slot :open="open" />
    </TooltipTrigger>

    <TooltipPortal :disabled="!portal">
      <TooltipContent v-bind="contentProps" :class="ui.content({ class: [!slots.default && props.class, props.ui?.content] })">
        <slot name="content">
          <span v-if="text" :class="ui.text({ class: props.ui?.text })">{{ text }}</span>

          <span v-if="kbds?.length" :class="ui.kbds({ class: props.ui?.kbds })">
            <UKbd v-for="(kbd, index) in kbds" :key="index" :size="((props.ui?.kbdsSize || ui.kbdsSize()) as KbdProps['size'])" v-bind="typeof kbd === 'string' ? { value: kbd } : kbd" />
          </span>
        </slot>

        <TooltipArrow v-if="!!arrow" v-bind="arrowProps" :class="ui.arrow({ class: props.ui?.arrow })" />
      </TooltipContent>
    </TooltipPortal>
  </TooltipRoot>
</template>
