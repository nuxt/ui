<script lang="ts">
import type { ToastProviderProps } from 'reka-ui'
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '../theme/toaster'
import type { ComponentConfig } from '../types/tv'

type Toaster = ComponentConfig<typeof theme, AppConfig, 'toaster'>

export interface ToasterProps extends Omit<ToastProviderProps, 'swipeDirection' | 'limit' | 'toastManager'> {
  /**
   * The position on the screen to display the toasts.
   * @defaultValue 'bottom-right'
   */
  position?: Toaster['variants']['position']
  /**
   * Expand the toasts to show multiple toasts at once.
   * @defaultValue false
   */
  expand?: boolean
  /**
   * Whether to show the progress bar on all toasts.
   * @defaultValue true
   */
  progress?: boolean
  /**
   * Render the toaster in a portal.
   * @defaultValue true
   */
  portal?: boolean | string | HTMLElement
  /**
   * Maximum number of toasts to display at once.
   * @defaultValue 5
   */
  max?: number
  class?: any
  ui?: Toaster['slots']
}

export interface ToasterSlots {
  default?(props?: {}): VNode[]
}

export default {
  name: 'Toaster'
}
</script>

<script setup lang="ts">
import { ref, computed, defineAsyncComponent, toRef, provide, onMounted, onBeforeUnmount } from 'vue'
import { ToastProvider, ToastViewport, ToastPortal } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import { useComponentProps, useComponentOverrides } from '../composables/useComponentProps'
import { useForwardProps } from '../composables/useForwardProps'
import { useLocale } from '../composables/useLocale'
import { useToast, toastMaxInjectionKey } from '../composables/useToast'
import { usePortal } from '../composables/usePortal'
import { omit } from '../utils'
import { requestIdleCallback, cancelIdleCallback } from '../utils/prefetch'
import { tv } from '../utils/tv'

const _props = withDefaults(defineProps<ToasterProps>(), {
  expand: false,
  portal: true,
  duration: 5000,
  progress: true,
  max: 5
})
defineSlots<ToasterSlots>()

// `ToastProvider` is the root, attributes would fall through as its props (`limit`, `toastManager`).
defineOptions({ inheritAttrs: false })

const props = useComponentProps('toaster', _props, theme)

const loadToast = () => import('./Toast.vue')

const UToast = defineAsyncComponent(loadToast)

// Preload once idle: a toast is often shown when the network just failed.
let idleId: ReturnType<typeof requestIdleCallback>

onMounted(() => {
  idleId = requestIdleCallback(() => {
    loadToast().catch(() => {})
  })
})

onBeforeUnmount(() => {
  cancelIdleCallback(idleId)
})

const { toasts, remove } = useToast()
const { t } = useLocale()
const overrides = useComponentOverrides((ui: Toaster['AppConfig']['ui']) => ui.toaster)

provide(toastMaxInjectionKey, toRef(() => props.max))

const providerProps = useForwardProps(reactivePick(props, 'duration', 'swipeThreshold', 'disableSwipe'))
const portalProps = usePortal(toRef(() => props.portal))

const swipeDirection = computed(() => {
  switch (props.position) {
    case 'top-center':
      return 'up'
    case 'top-right':
    case 'bottom-right':
      return 'right'
    case 'bottom-center':
      return 'down'
    case 'top-left':
    case 'bottom-left':
      return 'left'
  }
  return 'right'
})

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv(theme, overrides.value)({
  position: props.position,
  swipeDirection: swipeDirection.value
}))

function onUpdateOpen(value: boolean, id: string | number) {
  if (value) {
    return
  }

  remove(id)
}

const hovered = ref(false)
const focused = ref(false)
const expanded = computed(() => props.expand || hovered.value || focused.value)

// Only keyboard focus expands, a click on a toast is already covered by the hover.
function onFocusin(event: FocusEvent) {
  focused.value = (event.target as HTMLElement).matches(':focus-visible')
}

function onFocusout(event: FocusEvent) {
  if (!(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node | null)) {
    focused.value = false
  }
}

const refs = ref<{ height: number }[]>([])

// The collapsed stack shows three toasts, the older ones fade out until the ones in front close.
const VISIBLE_TOASTS = 3

// A closing toast stays mounted until its exit ends, leave it out of the stack so the others move while it leaves.
const isOpen = (index: number) => toasts.value[index]?.open !== false

const height = computed(() => refs.value.reduce((acc, { height }, index) => isOpen(index) ? acc + height + 16 : acc, 0))
const frontHeight = computed(() => refs.value.findLast((_, index) => isOpen(index))?.height || 0)

// A closing toast keeps the place it had while open, so the toasts closing with it and a hover don't move it while it leaves.
const lastPositions = new Map<string | number, { collapsed: boolean, before: number, offset: number }>()

const positions = computed(() => {
  const ids = new Set(toasts.value.map(toast => toast.id))
  for (const id of lastPositions.keys()) {
    if (!ids.has(id)) {
      lastPositions.delete(id)
    }
  }

  return toasts.value.map((toast, index) => {
    const last = lastPositions.get(toast.id)
    if (toast.open === false && last) {
      return last
    }

    const position = {
      collapsed: !expanded.value,
      before: toasts.value.slice(index + 1).filter(toast => toast.open !== false).length,
      offset: refs.value.slice(index + 1).reduce((acc, { height }, i) => isOpen(index + 1 + i) ? acc + height + 16 : acc, 0)
    }
    lastPositions.set(toast.id, position)

    return position
  })
})
</script>

<template>
  <ToastProvider :swipe-direction="swipeDirection" :label="props.label ?? t('toaster.label')" v-bind="providerProps">
    <slot />

    <UToast
      v-for="(toast, index) of toasts"
      :key="toast.id"
      ref="refs"
      :progress="props.progress"
      v-bind="omit(toast, ['id', 'close', '_duplicate', '_updated', '_animatedAt', 'onClick'])"
      :close="(toast.close as boolean)"
      :data-collapsed="positions[index]!.collapsed"
      :data-front="positions[index]!.collapsed && positions[index]!.before === 0"
      :data-visible="!positions[index]!.collapsed || positions[index]!.before < VISIBLE_TOASTS"
      :data-pulsing="toast._duplicate ? (toast._duplicate % 2 === 0 ? 'even' : 'odd') : undefined"
      :style="{
        '--index': (index - toasts.length) + toasts.length,
        '--before': positions[index]!.before,
        '--offset': positions[index]!.offset,
        '--scale': positions[index]!.collapsed ? 'calc(1 - var(--before) * var(--scale-factor))' : '1',
        '--translate': positions[index]!.collapsed ? 'calc(var(--before) * var(--gap))' : 'calc(var(--offset) * var(--translate-factor))',
        '--transform': 'translateY(var(--translate)) scale(var(--scale))'
      }"
      data-slot="toaster-base"
      :class="ui.base({ class: [props.ui?.base, toast.onClick ? 'cursor-pointer' : undefined] })"
      @update:open="onUpdateOpen($event, toast.id)"
      @click="toast.onClick && toast.onClick(toast)"
    />

    <ToastPortal v-bind="portalProps">
      <ToastViewport
        :label="t('toaster.viewport')"
        :data-expanded="expanded"
        data-slot="toaster-viewport"
        :class="ui.viewport({ class: [props.ui?.viewport, props.class] })"
        :style="{
          '--scale-factor': '0.05',
          '--translate-factor': props.position?.startsWith('top') ? '1px' : '-1px',
          '--gap': props.position?.startsWith('top') ? '16px' : '-16px',
          '--front-height': `${frontHeight}px`,
          '--height': `${height}px`
        }"
        @mouseenter="hovered = true"
        @mouseleave="hovered = false"
        @focusin="onFocusin"
        @focusout="onFocusout"
      />
    </ToastPortal>
  </ToastProvider>
</template>
