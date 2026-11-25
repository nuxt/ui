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
</script>

<script setup lang="ts" generic="T extends HeaderMenuMode">
import { computed, watch, shallowRef, useId, useTemplateRef, onBeforeUnmount } from 'vue'
import { onKeyStroke } from '@vueuse/core'
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

const id = useId()
const inline = computed(() => props.mode === 'inline')

function close() {
  open.value = false
}

// Inline, the menu is a panel under the header and not a dialog: the header stays usable, so its
// toggle closes it, and the page under it is locked.
const panelRef = useTemplateRef('panelRef')
const top = shallowRef<string>()
let opener: HTMLElement | undefined

// Lock `<html>`, not the `<body>` Reka locks for the overlays opened from the menu or the header,
// so neither restores a value the other one set. Only a lock this menu took is released. The
// gutter keeps the page from moving under the scrollbar.
const html = typeof document !== 'undefined' ? document.documentElement : undefined
let unlock: (() => void) | undefined

function lock() {
  if (!html || unlock) return

  const { overflow, scrollbarGutter } = html.style
  html.style.overflow = 'hidden'
  html.style.scrollbarGutter = 'stable'
  unlock = () => {
    html.style.overflow = overflow
    html.style.scrollbarGutter = scrollbarGutter
    unlock = undefined
  }
}

// Also runs once the header is mounted, for a menu that starts open
watch([open, inline, root], ([value, isInline, el], previous) => {
  if (!value || !isInline) {
    // Give the focus back to what opened the menu when it was in it, before the panel unmounts
    if (previous?.[0] && previous[1] && panelRef.value?.contains(document.activeElement) && opener?.isConnected) {
      opener.focus()
    }
    opener = undefined
    unlock?.()
    return
  }

  lock()

  if (!el) return

  // The header keeps its height, content in its `top` and `bottom` slots overflows it
  const rect = el.getBoundingClientRect()
  if (rect.height) {
    top.value = `${Math.max(rect.top + Math.max(rect.height, el.scrollHeight), 0)}px`
  }

  if (!previous?.[0]) {
    const active = document.activeElement as HTMLElement | null
    opener = active && active !== document.body ? active : undefined
  }
}, { immediate: true, flush: 'sync' })

onBeforeUnmount(() => unlock?.())

// A menu, a popover or a modal open above the menu closes first
onKeyStroke('Escape', () => {
  if (!open.value || !inline.value || document.querySelector('[data-dismissable-layer]:not([data-state="closed"])')) return

  close()
})

const { slideover: USlideover, modal: UModal, drawer: UDrawer } = lazyOverlays

const Overlay = computed(() => ({
  modal: UModal,
  slideover: USlideover,
  drawer: UDrawer
})[props.mode as Exclude<HeaderMenuMode, 'inline'>])

const overlayProps = computed(() => {
  const overlay = props.overlay as ModalProps | undefined

  return props.mode === 'modal' ? { fullscreen: true, transition: false, ...overlay } : overlay
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
  <div
    v-if="inline && open"
    :id="id"
    ref="panelRef"
    data-slot="header-menu"
    :style="top ? { top } : undefined"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
  >
    <slot name="content" :close="close">
      <div data-slot="header-menu-body" :class="ui.body({ class: props.ui?.body })">
        <slot />
      </div>
    </slot>
  </div>

  <Overlay
    v-else-if="!inline && renderOverlay"
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
