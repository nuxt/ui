<script lang="ts">
import type { VNode, InjectionKey, ComputedRef } from 'vue'
import type { DrawerRootProps, DrawerRootEmits, DrawerOpenChangeReason, DrawerPopupProps, DrawerPopupEmits, ChangeEventDetails } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import theme from '../theme/drawer'
import type { ButtonProps } from './Button.vue'
import type { IconProps } from './Icon.vue'
import type { LinkPropsKeys } from './Link.vue'
import type { EmitsToProps } from '../types/utils'
import type { ComponentConfig } from '../types/tv'

type Drawer = ComponentConfig<typeof theme, AppConfig, 'drawer'>

/** How many open drawers a nested drawer adds to the stack, and the size of the frontmost one. */
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
   * The side of the screen the drawer slides in from and is swiped back to.
   * @defaultValue 'bottom'
   */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /**
   * Whether to inset the drawer from the edges.
   * @defaultValue true
   */
  inset?: boolean
  /** The content of the drawer. */
  content?: Omit<DrawerPopupProps, 'as' | 'asChild' | 'forceMount'> & Partial<EmitsToProps<DrawerPopupEmits>>
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
import { DrawerRoot, DrawerTrigger, DrawerPortal, DrawerBackdrop, DrawerPopup, DrawerTitle, DrawerDescription, DrawerGrabber, DrawerClose, VisuallyHidden } from 'reka-ui'
import { useForwardProps } from '../composables/useForwardProps'
import { useResizeObserver } from '@vueuse/core'
import { useComponentProps, useComponentOverrides, useThemeConfig } from '../composables/useComponentProps'
import { FieldGroupReset } from '../composables/useFieldGroup'
import { useLocale } from '../composables/useLocale'
import { usePortal } from '../composables/usePortal'
import { pointerDownOutside } from '../utils/overlay'
import { tv } from '../utils/tv'
import UButton from './Button.vue'

const _props = withDefaults(defineProps<DrawerProps>(), {
  side: 'bottom',
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

const SWIPE_DIRECTION = { top: 'up', bottom: 'down', left: 'left', right: 'right' } as const
const swipeDirection = computed(() => SWIPE_DIRECTION[props.side])

// reka-ui's `--nested-drawers` only counts one level and clears once the nested drawer
// has left, so the stack is counted here and flips as soon as a nested drawer closes.
const isOpen = ref(props.open ?? props.defaultOpen ?? false)
watch(() => props.open, (value) => {
  if (value !== undefined) {
    isOpen.value = value
  }
})

// A swipe closes without a DOM event, so `dismissible` is checked on the close reason.
const ALLOWED_CLOSE_REASONS = new Set(['close-press', 'trigger-press', 'imperative-action'])
function onBeforeOpenChange(value: boolean, details: ChangeEventDetails<DrawerOpenChangeReason>) {
  if (!value && !props.dismissible && !ALLOWED_CLOSE_REASONS.has(details.reason ?? '')) {
    details.cancel()
    emits('close:prevent')
    return
  }

  // eslint-disable-next-line vue/require-explicit-emits -- `beforeUpdate:open` is declared via `DrawerEmits extends DrawerRootEmits`, which the rule doesn't resolve through
  emits('beforeUpdate:open', value, details)
}

function onOpenChange(value: boolean, details: ChangeEventDetails<DrawerOpenChangeReason>) {
  // eslint-disable-next-line vue/require-explicit-emits -- `update:open` is declared via `DrawerEmits extends DrawerRootEmits`, which the rule doesn't resolve through
  emits('update:open', value, details)
  if (props.open === undefined) {
    isOpen.value = value
  }
}

const nestedStack = shallowReactive(new Set<ComputedRef<DrawerStackEntry>>())
provide(drawerStackInjectionKey, nestedStack)
const frontmost = computed(() => [...nestedStack].reduce<DrawerStackEntry>((deepest, entry) => entry.value.depth > deepest.depth ? entry.value : deepest, { depth: 0, width: 0, height: 0 }))
const stack = computed(() => frontmost.value.depth)

// A stacked top or bottom drawer collapses to the frontmost height, so its own height is
// only measured while nothing is open above it.
const contentRef = useTemplateRef<InstanceType<typeof DrawerPopup>>('contentRef')
const size = ref({ width: 0, height: 0 })
// `$el` isn't reactive and is a comment node while closed, so `isOpen` re-runs the target.
useResizeObserver(() => isOpen.value && contentRef.value?.$el?.nodeType === 1 ? contentRef.value.$el : undefined, ([entry]) => {
  const el = entry?.target as HTMLElement | undefined
  if (!el) {
    return
  }
  size.value = { width: el.offsetWidth, height: stack.value > 0 ? size.value.height : el.offsetHeight }
}, { box: 'border-box' })
// The observer doesn't fire if the drawer comes back to the same size it was stacked at.
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
  ? { '--drawer-stack': stack.value, '--drawer-own-width': `${size.value.width}px`, '--drawer-stack-width': `${frontmost.value.width}px`, '--drawer-stack-height': `${frontmost.value.height}px` }
  : undefined)

const rootProps = useForwardProps(props, ['open', 'defaultOpen', 'modal', 'snapPoints', 'snapPoint', 'defaultSnapPoint', 'snapToSequentialPoints'])

function onSnapPointChange(...args: DrawerRootEmits['update:snapPoint']) {
  // eslint-disable-next-line vue/require-explicit-emits -- declared via `DrawerEmits extends DrawerRootEmits`, which the rule doesn't resolve through
  emits('update:snapPoint', ...args)
}

// reka-ui only reports the open animation ending when the drawer reopens mid close: its watch on
// `open` isn't immediate and the content mounts already open, so the content's own `animationend` covers it.
let entered = false
watch(isOpen, (value) => {
  if (!value) {
    entered = false
  }
})

function onOpenComplete(value: boolean) {
  if (value && entered) {
    return
  }
  entered = value

  // eslint-disable-next-line vue/require-explicit-emits -- declared via `DrawerEmits extends DrawerRootEmits`, which the rule doesn't resolve through
  emits('update:openComplete', value)
  if (value) {
    emits('after:enter')
  } else {
    emits('after:leave')
  }
}

const portalProps = usePortal(toRef(() => props.portal))
const contentProps = toRef(() => props.content)
const contentEvents = {
  pointerDownOutside,
  animationend: (event: AnimationEvent) => {
    if (event.target === event.currentTarget && isOpen.value) {
      onOpenComplete(true)
    }
  }
}

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv(theme, overrides.value)({
  side: props.side,
  inset: props.inset,
  snapPoints: props.snapPoints && props.snapPoints.length > 0
}))
</script>

<template>
  <DrawerRoot
    v-bind="rootProps"
    :swipe-direction="swipeDirection"
    @before-update:open="onBeforeOpenChange"
    @update:open="onOpenChange"
    @update:open-complete="onOpenComplete"
    @update:snap-point="onSnapPointChange"
  >
    <DrawerTrigger v-if="!!slots.default" as-child :class="props.class">
      <slot />
    </DrawerTrigger>

    <DrawerPortal v-bind="portalProps">
      <FieldGroupReset>
        <DrawerBackdrop v-if="props.overlay" data-slot="drawer-overlay" :class="ui.overlay({ class: props.ui?.overlay })" />

        <DrawerPopup
          ref="contentRef"
          data-slot="drawer-content"
          :data-stacked="stack > 0 ? '' : undefined"
          :style="stackStyle"
          :class="ui.content({ class: [!slots.default && props.class, props.ui?.content] })"
          v-bind="contentProps"
          v-on="contentEvents"
        >
          <DrawerGrabber v-if="props.handle" data-slot="drawer-handle" :class="ui.handle({ class: props.ui?.handle })" />

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
        </DrawerPopup>
      </FieldGroupReset>
    </DrawerPortal>
  </DrawerRoot>
</template>
