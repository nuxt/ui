<script lang="ts">
import type { VNode } from 'vue'
import type { DrawerRootProps, DrawerRootEmits, DrawerOpenChangeDetails, DialogContentProps, DialogContentEmits } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/drawer'
import type { ButtonProps } from './Button.vue'
import type { IconProps } from './Icon.vue'
import type { LinkPropsKeys } from './Link.vue'
import type { EmitsToProps } from '../types/utils'
import type { ComponentConfig } from '../types/tv'

type Drawer = ComponentConfig<typeof theme, AppConfig, 'drawer'>

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
   * @defaultValue false
   */
  inset?: boolean
  /** The content of the drawer. */
  content?: Omit<DialogContentProps, 'as' | 'asChild' | 'forceMount'> & Partial<EmitsToProps<DialogContentEmits>>
  /**
   * Render an overlay behind the drawer.
   * @defaultValue true
   */
  overlay?: boolean
  /**
   * Render a handle on the drawer.
   * @defaultValue true
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
import { computed, ref, toRef } from 'vue'
import { DrawerRoot, DrawerTrigger, DrawerPortal, DrawerOverlay, DrawerContent, DrawerTitle, DrawerDescription, DrawerHandle, DrawerClose, VisuallyHidden } from 'reka-ui'
import { useForwardProps } from '../composables/useForwardProps'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../composables/useComponentProps'
import { FieldGroupReset } from '../composables/useFieldGroup'
import { useLocale } from '../composables/useLocale'
import { usePortal } from '../composables/usePortal'
import { pointerDownOutside } from '../utils/overlay'
import { tv } from '../utils/tv'
import UButton from './Button.vue'

const _props = withDefaults(defineProps<DrawerProps>(), {
  direction: 'bottom',
  portal: true,
  overlay: true,
  handle: true,
  modal: true,
  dismissible: true
})
const emits = defineEmits<DrawerEmits>()
const slots = defineSlots<DrawerSlots>()

const props = useComponentProps('drawer', _props)

const { t } = useLocale()
const appConfig = useAppConfig() as Drawer['AppConfig']

// reka-ui's Drawer dismisses by swiping towards the edge the drawer slides in
// from, so `direction` (which edge to anchor to) and `swipeDirection` (which
// way a swipe-to-dismiss gesture travels) are always the same value — just
// named differently between the two axes' vocabularies (top/bottom vs up/down).
const SWIPE_DIRECTION = { top: 'up', bottom: 'down', left: 'left', right: 'right' } as const
const swipeDirection = computed(() => SWIPE_DIRECTION[props.direction])

// reka-ui's Drawer can close for reasons that never pass through a DOM event
// (e.g. `swipe`, or dragging past the last snap point), so `dismissible` is
// enforced centrally on the open-change reason rather than by intercepting
// individual outside-click/escape-key events like `Modal` does.
const isControlled = computed(() => props.open !== undefined)
const uncontrolledOpen = ref(props.defaultOpen ?? false)
const openModel = computed({
  get: () => isControlled.value ? !!props.open : uncontrolledOpen.value,
  set: (value: boolean) => {
    if (!isControlled.value) {
      uncontrolledOpen.value = value
    }
  }
})

const ALLOWED_CLOSE_REASONS = new Set(['close-press', 'cancel'])
function onOpenChange(value: boolean, details?: DrawerOpenChangeDetails) {
  if (!value && !props.dismissible && !ALLOWED_CLOSE_REASONS.has(details?.reason ?? '')) {
    emits('close:prevent')
    return
  }

  openModel.value = value
  // eslint-disable-next-line vue/require-explicit-emits -- `update:open` is declared via `DrawerEmits extends DrawerRootEmits`, which the rule doesn't resolve through
  emits('update:open', value, details)
}

// reka-ui's `useEmitAsProps` (used internally by `useForwardProps`) maps every
// event declared on *this* component's own `defineEmits` into an `onXxx` prop —
// regardless of which emit function is passed in — so `onUpdate:open` and
// `onClose:prevent` end up in the result below. Both are omitted before
// binding to `DrawerRoot`: `update:open` is wired explicitly via `onOpenChange`
// so the `dismissible` gate isn't bypassed, and `close:prevent` isn't a
// `DrawerRoot` prop at all (forwarding it just trips Vue's fallthrough-attrs
// warning, since `DrawerRoot`'s template root is a `<slot>` fragment).
const rawRootProps = useForwardProps(computed(() => ({
  ...reactivePick(props, 'modal', 'snapPoints', 'snapPoint', 'defaultSnapPoint', 'snapToSequentialPoints'),
  swipeDirection: swipeDirection.value
})), emits)
const rootProps = computed(() => {
  const { 'onUpdate:open': _onUpdateOpen, 'onClose:prevent': _onClosePrevent, ...rest } = rawRootProps.value as Record<string, unknown>
  return rest
})
const portalProps = usePortal(toRef(() => props.portal))
const contentProps = toRef(() => props.content)
const contentEvents = computed(() => ({
  pointerDownOutside
}))

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: theme, ...(appConfig.ui?.drawer || {}) })({
  direction: props.direction,
  inset: props.inset,
  snapPoints: props.snapPoints && props.snapPoints.length > 0
}))
</script>

<template>
  <DrawerRoot v-bind="rootProps" :open="openModel" @update:open="onOpenChange">
    <DrawerTrigger v-if="!!slots.default" as-child :class="props.class">
      <slot />
    </DrawerTrigger>

    <DrawerPortal v-bind="portalProps">
      <FieldGroupReset>
        <DrawerOverlay v-if="props.overlay" data-slot="overlay" :class="ui.overlay({ class: props.ui?.overlay })" />

        <DrawerContent data-slot="content" :class="ui.content({ class: [!slots.default && props.class, props.ui?.content] })" v-bind="contentProps" v-on="contentEvents">
          <DrawerHandle v-if="props.handle" data-slot="handle" :class="ui.handle({ class: props.ui?.handle })" />

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
            <div data-slot="container" :class="ui.container({ class: props.ui?.container })">
              <div v-if="!!slots.header || (props.title || !!slots.title) || (props.description || !!slots.description) || (props.close || !!slots.close) || !!slots.actions" data-slot="header" :class="ui.header({ class: props.ui?.header })">
                <slot name="header">
                  <div v-if="props.title || !!slots.title || props.description || !!slots.description" data-slot="wrapper" :class="ui.wrapper({ class: props.ui?.wrapper })">
                    <DrawerTitle v-if="props.title || !!slots.title" data-slot="title" :class="ui.title({ class: props.ui?.title })">
                      <slot name="title">
                        {{ props.title }}
                      </slot>
                    </DrawerTitle>

                    <DrawerDescription v-if="props.description || !!slots.description" data-slot="description" :class="ui.description({ class: props.ui?.description })">
                      <slot name="description">
                        {{ props.description }}
                      </slot>
                    </DrawerDescription>
                  </div>

                  <div v-if="!!slots.actions || props.close || !!slots.close" data-slot="actions" :class="ui.actions({ class: props.ui?.actions })">
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
                          data-slot="close"
                          :class="ui.close({ class: props.ui?.close })"
                        />
                      </slot>
                    </DrawerClose>
                  </div>
                </slot>
              </div>

              <div v-if="!!slots.body" data-slot="body" :class="ui.body({ class: props.ui?.body })">
                <slot name="body" />
              </div>

              <div v-if="!!slots.footer" data-slot="footer" :class="ui.footer({ class: props.ui?.footer })">
                <slot name="footer" />
              </div>
            </div>
          </slot>
        </DrawerContent>
      </FieldGroupReset>
    </DrawerPortal>
  </DrawerRoot>
</template>
