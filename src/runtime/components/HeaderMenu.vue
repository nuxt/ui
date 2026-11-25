<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '../theme/header-menu'
import type { DrawerProps } from './Drawer.vue'
import type { ModalProps } from './Modal.vue'
import type { SlideoverProps } from './Slideover.vue'
import type { ComponentConfig } from '../types/tv'

type HeaderMenu = ComponentConfig<typeof theme, AppConfig, 'headerMenu'>

type HeaderMenuMode = 'inline' | 'modal' | 'slideover' | 'drawer'
type HeaderMenuOverlay<T> = T extends 'modal' ? ModalProps : T extends 'slideover' ? SlideoverProps : T extends 'drawer' ? DrawerProps : never

export interface HeaderMenuProps<T extends HeaderMenuMode = HeaderMenuMode> {
  /**
   * The mode of the menu. `inline` opens it under the header, the other modes open it in a Modal,
   * a Slideover or a Drawer.
   * @defaultValue 'inline'
   */
  mode?: T
  /**
   * The props for the Modal, Slideover or Drawer the menu opens in.
   */
  overlay?: HeaderMenuOverlay<T>
  class?: any
  ui?: HeaderMenu['slots']
}

export interface HeaderMenuSlots {
  default?(props?: {}): VNode[]
  content?(props: { close: () => void }): VNode[]
}

// One lock on `<html>` for every inline menu open at once, released when the last one closes
let locks = 0
let restore: (() => void) | undefined

function lockPage() {
  if (locks++ || typeof document === 'undefined') return

  const html = document.documentElement
  const { overflow, scrollbarGutter } = html.style
  html.style.overflow = 'hidden'
  html.style.scrollbarGutter = 'stable'
  restore = () => {
    html.style.overflow = overflow
    html.style.scrollbarGutter = scrollbarGutter
  }
}

function unlockPage() {
  if (--locks) return

  restore?.()
  restore = undefined
}
</script>

<script setup lang="ts" generic="T extends HeaderMenuMode">
import { computed, watch, shallowRef, onBeforeUnmount, defineAsyncComponent } from 'vue'
import type { FocusOutsideEvent, PointerDownOutsideEvent } from 'reka-ui'
import { injectDialogRootContext } from 'reka-ui'
import { useComponentProps, useComponentOverrides } from '../composables/useComponentProps'
import { useLocale } from '../composables/useLocale'
import { useLazyOverlay } from '../composables/useLazyOverlay'
import { lazyOverlays, loadOverlay } from '../utils/lazy-overlay'
import { injectHeaderContext } from '../utils/header'
import { tv } from '../utils/tv'

const _props = withDefaults(defineProps<HeaderMenuProps<T>>(), {
  mode: 'inline' as never
})
const slots = defineSlots<HeaderMenuSlots>()

const props = useComponentProps<HeaderMenuProps<T>>('headerMenu', _props, theme)

const { open, root } = injectHeaderContext()
const { t, locale } = useLocale()
const overrides = useComponentOverrides((ui: HeaderMenu['AppConfig']['ui']) => ui.headerMenu)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv(theme, overrides.value)())

const inline = computed(() => props.mode === 'inline')
const dialog = injectDialogRootContext()

function close() {
  open.value = false
}

// Inline, the menu is a non-modal dialog under the header: Reka closes it on Escape after the
// layers above it and gives the focus back to the toggle. The page under it is locked by hand,
// Reka's lock turns off the pointer events of the page and the header with it.
const top = shallowRef<string>()

// Lock `<html>`, not the `<body>` Reka locks for the overlays opened from the menu or the header,
// so neither restores a value the other one set. Only a lock this menu took is released. The
// gutter keeps the page from moving under the scrollbar.
let locked = false

function lock() {
  if (locked || typeof document === 'undefined') return

  locked = true
  lockPage()
}

function unlock() {
  if (!locked) return

  locked = false
  unlockPage()
}

// Also runs once the header is mounted, for a menu that starts open
watch([open, inline, root], ([value, isInline, el], previous) => {
  if (!value || !isInline) {
    unlock()
    return
  }

  lock()

  if (!el) return

  // The header keeps its height, content in its `top` and `bottom` slots overflows it
  const rect = el.getBoundingClientRect()
  if (rect.height) {
    top.value = `${Math.max(rect.top + Math.max(rect.height, el.scrollHeight), 0)}px`
  }

  // A `toggle` slot of the Header is no `DialogTrigger`, the focus goes back to what opened the menu
  if (!previous?.[0] && !dialog.triggerElement.value?.isConnected) {
    const active = document.activeElement as HTMLElement | null
    dialog.triggerElement.value = active && el.contains(active) ? active : undefined
  }
}, { immediate: true, flush: 'sync' })

onBeforeUnmount(unlock)

// The header stays usable while the menu is open, its toggle closes it
function onInteractOutside(e: PointerDownOutsideEvent | FocusOutsideEvent) {
  if (root.value?.contains(e.target as Node)) {
    e.preventDefault()
  }
}

// The inline panel and its Reka Dialog code load once the page is idle, like the overlays
const loadPanel = () => import('./internal/HeaderMenuPanel.vue')
const HeaderMenuPanel = defineAsyncComponent(loadPanel)
const renderPanel = useLazyOverlay(() => inline.value && open.value, () => inline.value ? loadPanel() : Promise.resolve())

const { slideover: USlideover, modal: UModal, drawer: UDrawer } = lazyOverlays

const Overlay = computed(() => ({
  modal: UModal,
  slideover: USlideover,
  drawer: UDrawer
})[props.mode as Exclude<HeaderMenuMode, 'inline'>])

const overlayProps = computed(() => {
  const overlay = props.overlay as ModalProps | undefined
  // `class` styles the content of the overlay, after the one of `overlay`
  const modal = { ...overlay, class: [overlay?.class, props.class] }

  return props.mode === 'modal' ? { fullscreen: true, transition: false, ...modal } : modal
})

// The Modal and the Slideover show their own close in a header of their own, the title is only
// read out. The Drawer has none.
const withHeader = computed(() => props.mode !== 'drawer' && !slots.content)

const overlayUi = computed(() => {
  const overlayUi = (props.overlay as ModalProps | undefined)?.ui as Record<string, any> | undefined

  return {
    ...overlayUi,
    overlay: ui.value.overlay({ class: [overlayUi?.overlay, props.ui?.overlay] }),
    content: ui.value.content({ class: [overlayUi?.content, props.ui?.content] }),
    ...(withHeader.value ? { title: ['sr-only', overlayUi?.title], body: ui.value.body({ class: [overlayUi?.body, props.ui?.body] }) } : {})
  }
})

const renderOverlay = useLazyOverlay(
  () => !inline.value && (open.value || (props.overlay as ModalProps | undefined)?.unmountOnHide === false),
  () => inline.value ? Promise.resolve() : loadOverlay(props.mode as Exclude<HeaderMenuMode, 'inline'>)
)
</script>

<template>
  <HeaderMenuPanel
    v-if="inline && renderPanel"
    data-slot="header-menu"
    :title="locale.messages.header?.title || t('header.open')"
    :description="locale.messages.header?.description"
    :style="top ? { top } : undefined"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
    @interact-outside="onInteractOutside"
  >
    <slot name="content" :close="close">
      <div data-slot="header-menu-body" :class="ui.body({ class: props.ui?.body })">
        <slot />
      </div>
    </slot>
  </HeaderMenuPanel>

  <Overlay
    v-else-if="renderOverlay"
    v-model:open="open"
    :title="locale.messages.header?.title || t('header.open')"
    :description="locale.messages.header?.description"
    v-bind="overlayProps"
    :ui="overlayUi"
  >
    <template v-if="withHeader" #body>
      <slot />
    </template>

    <template v-else #content="contentData">
      <slot name="content" :close="close" v-bind="contentData">
        <div data-slot="header-menu-body" :class="ui.body({ class: props.ui?.body })">
          <slot />
        </div>
      </slot>
    </template>
  </Overlay>
</template>
