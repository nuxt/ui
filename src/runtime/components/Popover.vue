<script lang="ts">
import type { PopoverRootProps, HoverCardRootProps, PopoverRootEmits, PopoverContentProps, PopoverContentEmits, PopoverArrowProps } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/popover'
import type { EmitsToProps, ComponentConfig } from '../types/utils'

type Popover = ComponentConfig<typeof theme, AppConfig, 'popover'>

export interface PopoverProps extends PopoverRootProps, Pick<HoverCardRootProps, 'openDelay' | 'closeDelay'> {
  /**
   * The display mode of the popover.
   * @defaultValue 'click'
   */
  mode?: 'click' | 'hover'
  /**
   * The content of the popover.
   * @defaultValue { side: 'bottom', sideOffset: 8, collisionPadding: 8 }
   */
  content?: Omit<PopoverContentProps, 'as' | 'asChild' | 'forceMount'> & Partial<EmitsToProps<PopoverContentEmits>>
  /**
   * Display an arrow alongside the popover.
   * @defaultValue false
   */
  arrow?: boolean | Omit<PopoverArrowProps, 'as' | 'asChild'>
  /**
   * Render the popover in a portal.
   * @defaultValue true
   */
  portal?: boolean | string | HTMLElement
  /**
   * When `false`, the popover will not close when clicking outside or pressing escape.
   * @defaultValue true
   */
  dismissible?: boolean
  class?: any
  ui?: Popover['slots']
}

export interface PopoverEmits extends PopoverRootEmits {
  'close:prevent': []
}

export interface PopoverSlots {
  default(props: { open: boolean }): any
  content(props?: {}): any
  anchor(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import { defu } from 'defu'
import { useForwardPropsEmits } from 'reka-ui'
import { Popover, HoverCard } from 'reka-ui/namespaced'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { usePortal } from '../composables/usePortal'
import { tv } from '../utils/tv'

const props = withDefaults(defineProps<PopoverProps>(), {
  portal: true,
  mode: 'click',
  openDelay: 0,
  closeDelay: 0,
  dismissible: true
})
const emits = defineEmits<PopoverEmits>()
const slots = defineSlots<PopoverSlots>()

const appConfig = useAppConfig() as Popover['AppConfig']

const pick = props.mode === 'hover' ? reactivePick(props, 'defaultOpen', 'open', 'openDelay', 'closeDelay') : reactivePick(props, 'defaultOpen', 'open', 'modal')
const rootProps = useForwardPropsEmits(pick, emits)
const portalProps = usePortal(toRef(() => props.portal))
const contentProps = toRef(() => defu(props.content, { side: 'bottom', sideOffset: 8, collisionPadding: 8 }) as PopoverContentProps)
const contentEvents = computed(() => {
  if (!props.dismissible) {
    const events = ['pointerDownOutside', 'interactOutside', 'escapeKeyDown']

    return events.reduce((acc, curr) => {
      acc[curr] = (e: Event) => {
        e.preventDefault()
        emits('close:prevent')
      }
      return acc
    }, {} as Record<typeof events[number], (e: Event) => void>)
  }

  return {}
})
const arrowProps = toRef(() => props.arrow as PopoverArrowProps)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.popover || {}) })({
  side: contentProps.value.side
}))

const Component = computed(() => props.mode === 'hover' ? HoverCard : Popover)
</script>

<template>
  <Component.Root v-slot="{ open }" v-bind="rootProps">
    <Component.Trigger v-if="!!slots.default" as-child :class="props.class">
      <slot :open="open" />
    </Component.Trigger>

    <Component.Anchor v-if="'Anchor' in Component && !!slots.anchor" as-child>
      <slot name="anchor" />
    </Component.Anchor>

    <Component.Portal v-bind="portalProps">
      <Component.Content v-bind="contentProps" :class="ui.content({ class: [!slots.default && props.class, props.ui?.content] })" v-on="contentEvents">
        <slot name="content" />

        <Component.Arrow v-if="!!arrow" v-bind="arrowProps" :class="ui.arrow({ class: props.ui?.arrow })" />
      </Component.Content>
    </Component.Portal>
  </Component.Root>
</template>
