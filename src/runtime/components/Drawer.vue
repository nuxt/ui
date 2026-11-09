<script lang="ts">
import type { VNode, InjectionKey, ComputedRef } from 'vue'
import type { DrawerRootProps, DrawerRootEmits, DrawerOpenChangeDetails, DrawerContentProps, DrawerContentEmits } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import theme from '../theme/drawer'
import type { ButtonProps } from './Button.vue'
import type { IconProps } from './Icon.vue'
import type { LinkPropsKeys } from './Link.vue'
import type { EmitsToProps } from '../types/utils'
import type { ComponentConfig } from '../types/tv'

type Drawer = ComponentConfig<typeof theme, AppConfig, 'drawer'>

/**
 * What each drawer nested in a drawer reports: how many open drawers it adds to the
 * stack, `0` when closed, and the size of the frontmost one the stack collapses to.
 */
interface DrawerStackEntry {
  depth: number
  width: number
  height: number
}
const drawerStackInjectionKey: InjectionKey<Set<ComputedRef<DrawerStackEntry>>> = Symbol('nuxt-ui.drawer-stack')

export interface DrawerProps extends Pick<DrawerRootProps, 'modal' | 'open' | 'defaultOpen' | 'snapPoints' | 'snapPoint' | 'defaultSnapPoint' | 'snapToSequentialPoints'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  title?: string
  description?: string
  /**
   * The edge the drawer slides in from (and the direction it's swiped to dismiss).
   * @defaultValue 'bottom'
   */
  direction?: 'top' | 'right' | 'bottom' | 'left'
  /**
   * Whether to inset the drawer from the edges.
   * @defaultValue true
   */
  inset?: boolean
  /** The content of the drawer. */
  content?: Omit<DrawerContentProps, 'as' | 'asChild' | 'forceMount'> & Partial<EmitsToProps<DrawerContentEmits>>
  /**
   * Render an overlay behind the drawer.
   * @defaultValue true
   */
  overlay?: boolean
  /**
   * Render a handle on the drawer.
   * @defaultValue false
   */
  handle?: boolean
  /**
   * Render the drawer in a portal.
   * @defaultValue true
   */
  portal?: boolean | string | HTMLElement
  /**
   * Display a close button to dismiss the drawer.
   * `{ size: 'md', color: 'neutral', variant: 'ghost' }`{lang="ts-type"}
   * @defaultValue false
   */
  close?: boolean | Omit<ButtonProps, LinkPropsKeys>
  /**
   * The icon displayed in the close button.
   * @defaultValue appConfig.ui.icons.close
   * @IconifyIcon
   */
  closeIcon?: IconProps['name']
  /**
   * When `false`, the drawer will not close when clicking outside, pressing escape, or swiping.
   * @defaultValue true
   */
  dismissible?: boolean
  class?: any
  ui?: Drawer['slots']
}

export interface DrawerEmits extends DrawerRootEmits {
  'close:prevent': []
  'after:enter': []
  'after:leave': []
}

export interface DrawerSlots {
  default?(props?: {}): VNode[]
  content?(props?: {}): VNode[]
  header?(props?: {}): VNode[]
  title?(props?: {}): VNode[]
  description?(props?: {}): VNode[]
  actions?(props?: {}): VNode[]
  close?(props: { ui: Drawer['ui'] }): VNode[]
  body?(props?: {}): VNode[]
  footer?(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, provide, ref, shallowReactive, toRef, useTemplateRef, watch } from 'vue'
import { DrawerRoot, DrawerTrigger, DrawerPortal, DrawerOverlay, DrawerContent, DrawerTitle, DrawerDescription, DrawerHandle, DrawerClose, VisuallyHidden } from 'reka-ui'
import { useForwardProps } from '../composables/useForwardProps'
import { reactivePick, useResizeObserver } from '@vueuse/core'
import { useComponentProps, useComponentOverrides, useThemeConfig } from '../composables/useComponentProps'
import { FieldGroupReset } from '../composables/useFieldGroup'
import { useLocale } from '../composables/useLocale'
import { usePortal } from '../composables/usePortal'
import { pointerDownOutside } from '../utils/overlay'
import { tv } from '../utils/tv'
import UButton from './Button.vue'

const _props = withDefaults(defineProps<DrawerProps>(), {
  direction: 'bottom',
  inset: true,
  portal: true,
  overlay: true,
  modal: true,
  dismissible: true
})
const emits = defineEmits<DrawerEmits>()
const slots = defineSlots<DrawerSlots>()

const props = useComponentProps('drawer', _props, theme)

const { t } = useLocale()
const appConfig = useThemeConfig() as Drawer['AppConfig']
const overrides = useComponentOverrides((ui: Drawer['AppConfig']['ui']) => ui.drawer)

// reka-ui's Drawer dismisses by swiping towards the edge the drawer slides in
// from, so `direction` (which edge to anchor to) and `swipeDirection` (which
// way a swipe-to-dismiss gesture travels) are always the same value — just
// named differently between the two axes' vocabularies (top/bottom vs up/down).
const SWIPE_DIRECTION = { top: 'up', bottom: 'down', left: 'left', right: 'right' } as const
const swipeDirection = computed(() => SWIPE_DIRECTION[props.direction])

// reka-ui's Drawer can close for reasons that never pass through a DOM event
// (e.g. `swipe`, or dragging past the last snap point), so `dismissible` is
// enforced centrally on the open-change reason rather than by intercepting
// individual outside-click/escape-key events like `Modal` does. `details.cancel()`
// is what the swipe gesture branches on to abort and restore its transform.
// A press on the trigger or on a `DrawerClose` stays allowed, like `Modal`.
const ALLOWED_CLOSE_REASONS = new Set(['close-press', 'trigger-press'])
function onOpenChange(value: boolean, details: DrawerOpenChangeDetails) {
  if (!value && !props.dismissible && !ALLOWED_CLOSE_REASONS.has(details.reason ?? '')) {
    details.cancel()
    emits('close:prevent')
    return
  }

  // eslint-disable-next-line vue/require-explicit-emits -- `update:open` is declared via `DrawerEmits extends DrawerRootEmits`, which the rule doesn't resolve through
  emits('update:open', value, details)
  if (!details.isCanceled && props.open === undefined) {
    isOpen.value = value
  }
}

// reka-ui's `--nested-drawers` only counts one level and clears once the nested
// drawer has finished leaving, so each drawer counts the open drawers above it
// itself. It flips as soon as a nested drawer starts closing, which lets the
// stack come back forward while it leaves instead of after.
const isOpen = ref(props.open ?? props.defaultOpen ?? false)
watch(() => props.open, (value) => {
  if (value !== undefined) {
    isOpen.value = value
  }
})

const nestedStack = shallowReactive(new Set<ComputedRef<DrawerStackEntry>>())
provide(drawerStackInjectionKey, nestedStack)
const frontmost = computed(() => [...nestedStack].reduce<DrawerStackEntry>((deepest, entry) => entry.value.depth > deepest.depth ? entry.value : deepest, { depth: 0, width: 0, height: 0 }))
const stack = computed(() => frontmost.value.depth)

// A stacked drawer collapses to the size of the frontmost one, so its own size is only
// measured while nothing is open above it. `borderBoxSize` ignores the stack's scale.
const contentRef = useTemplateRef<InstanceType<typeof DrawerContent>>('contentRef')
const size = ref({ width: 0, height: 0 })
// `$el` isn't reactive, so `isOpen` re-runs the target once the content renders, and
// a closed drawer renders a comment node in its place.
useResizeObserver(() => isOpen.value && contentRef.value?.$el?.nodeType === 1 ? contentRef.value.$el : undefined, ([entry]) => {
  const box = entry?.borderBoxSize?.[0]
  if (!box || stack.value > 0) {
    return
  }
  size.value = { width: box.inlineSize, height: box.blockSize }
})
// A drawer that opened under an already open one has never been measured, and the
// observer won't fire if it comes back at the same size. `offset*` ignores the scale.
watch(stack, (value) => {
  const el = contentRef.value?.$el
  if (value === 0 && el?.nodeType === 1) {
    size.value = { width: el.offsetWidth, height: el.offsetHeight }
  }
}, { flush: 'post' })

const parentStack = inject(drawerStackInjectionKey, undefined)
const stackEntry = computed<DrawerStackEntry>(() => {
  if (!isOpen.value) {
    return { depth: 0, width: 0, height: 0 }
  }
  return { ...(stack.value > 0 ? frontmost.value : size.value), depth: stack.value + 1 }
})
parentStack?.add(stackEntry)
onBeforeUnmount(() => parentStack?.delete(stackEntry))

const stackStyle = computed(() => stack.value > 0
  ? { '--drawer-stack': stack.value, '--drawer-own-width': `${size.value.width}px`, '--drawer-frontmost-width': `${frontmost.value.width}px`, '--drawer-frontmost-height': `${frontmost.value.height}px` }
  : undefined)

// reka-ui's `useEmitAsProps` (used internally by `useForwardProps`) maps every
// event declared on *this* component's own `defineEmits` into an `onXxx` prop —
// regardless of which emit function is passed in — so `onUpdate:open` and
// `onClose:prevent` end up in the result below. Both are omitted before
// binding to `DrawerRoot`: `update:open` is wired explicitly via `onOpenChange`
// so the `dismissible` gate isn't bypassed, and `close:prevent` isn't a
// `DrawerRoot` prop at all (forwarding it just trips Vue's fallthrough-attrs
// warning, since `DrawerRoot`'s template root is a `<slot>` fragment).
const rawRootProps = useForwardProps(computed(() => ({
  ...reactivePick(props, 'open', 'defaultOpen', 'modal', 'snapPoints', 'snapPoint', 'defaultSnapPoint', 'snapToSequentialPoints'),
  swipeDirection: swipeDirection.value
})), emits)
const rootProps = computed(() => {
  const { 'onUpdate:open': _onUpdateOpen, 'onClose:prevent': _onClosePrevent, 'onAfter:enter': _onAfterEnter, 'onAfter:leave': _onAfterLeave, ...rest } = rawRootProps.value as Record<string, unknown>
  return rest
})

function onOpenComplete(value: boolean) {
  if (value) {
    emits('after:enter')
  } else {
    emits('after:leave')
  }
}

const portalProps = usePortal(toRef(() => props.portal))
const contentProps = toRef(() => props.content)
const contentEvents = computed(() => ({
  pointerDownOutside
}))

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv(theme, overrides.value)({
  direction: props.direction,
  inset: props.inset,
  snapPoints: props.snapPoints && props.snapPoints.length > 0
}))
</script>

<template>
  <DrawerRoot v-bind="rootProps" @update:open="onOpenChange" @update:open-complete="onOpenComplete">
    <DrawerTrigger v-if="!!slots.default" as-child :class="props.class">
      <slot />
    </DrawerTrigger>

    <DrawerPortal v-bind="portalProps">
      <FieldGroupReset>
        <DrawerOverlay v-if="props.overlay" data-slot="drawer-overlay" :class="ui.overlay({ class: props.ui?.overlay })" />

        <DrawerContent
          ref="contentRef"
          data-slot="drawer-content"
          :data-stacked="stack > 0 ? '' : undefined"
          :style="stackStyle"
          :class="ui.content({ class: [!slots.default && props.class, props.ui?.content] })"
          v-bind="contentProps"
          v-on="contentEvents"
        >
          <DrawerHandle v-if="props.handle" data-slot="drawer-handle" :class="ui.handle({ class: props.ui?.handle })" />

          <VisuallyHidden v-if="(!props.title && !slots.title) || (!props.description && !slots.description) || !!slots.content">
            <DrawerTitle v-if="!props.title && !slots.title" />
            <DrawerTitle v-else-if="!!slots.content">
              <slot name="title">
                {{ props.title }}
              </slot>
            </DrawerTitle>

            <DrawerDescription v-if="!props.description && !slots.description" />
            <DrawerDescription v-else-if="!!slots.content">
              <slot name="description">
                {{ props.description }}
              </slot>
            </DrawerDescription>
          </VisuallyHidden>

          <slot name="content">
            <div data-slot="drawer-container" :class="ui.container({ class: props.ui?.container })">
              <div v-if="!!slots.header || (props.title || !!slots.title) || (props.description || !!slots.description) || (props.close || !!slots.close) || !!slots.actions" data-slot="drawer-header" :class="ui.header({ class: props.ui?.header })">
                <slot name="header">
                  <div v-if="props.title || !!slots.title || props.description || !!slots.description" data-slot="drawer-wrapper" :class="ui.wrapper({ class: props.ui?.wrapper })">
                    <DrawerTitle v-if="props.title || !!slots.title" data-slot="drawer-title" :class="ui.title({ class: props.ui?.title })">
                      <slot name="title">
                        {{ props.title }}
                      </slot>
                    </DrawerTitle>

                    <DrawerDescription v-if="props.description || !!slots.description" data-slot="drawer-description" :class="ui.description({ class: props.ui?.description })">
                      <slot name="description">
                        {{ props.description }}
                      </slot>
                    </DrawerDescription>
                  </div>

                  <div v-if="!!slots.actions || props.close || !!slots.close" data-slot="drawer-actions" :class="ui.actions({ class: props.ui?.actions })">
                    <slot name="actions" />

                    <DrawerClose v-if="props.close || !!slots.close" as-child>
                      <slot name="close" :ui="ui">
                        <UButton
                          v-if="props.close"
                          :icon="props.closeIcon || appConfig.ui.icons.close"
                          color="neutral"
                          variant="ghost"
                          :aria-label="t('drawer.close')"
                          v-bind="(typeof props.close === 'object' ? props.close : {})"
                          data-slot="drawer-close"
                          :class="ui.close({ class: props.ui?.close })"
                        />
                      </slot>
                    </DrawerClose>
                  </div>
                </slot>
              </div>

              <div v-if="!!slots.body" data-slot="drawer-body" :class="ui.body({ class: props.ui?.body })">
                <slot name="body" />
              </div>

              <div v-if="!!slots.footer" data-slot="drawer-footer" :class="ui.footer({ class: props.ui?.footer })">
                <slot name="footer" />
              </div>
            </div>
          </slot>
        </DrawerContent>
      </FieldGroupReset>
    </DrawerPortal>
  </DrawerRoot>
</template>
