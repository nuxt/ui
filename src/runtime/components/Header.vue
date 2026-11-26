<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '../theme/header'
import type { ButtonProps } from './Button.vue'
import type { DrawerProps } from './Drawer.vue'
import type { ModalProps } from './Modal.vue'
import type { SlideoverProps } from './Slideover.vue'
import type { LinkPropsKeys } from './Link.vue'
import type { ComponentConfig } from '../types/tv'

type Header = ComponentConfig<typeof theme, AppConfig, 'header'>

type HeaderMode = 'modal' | 'slideover' | 'drawer'
type HeaderMenu<T> = T extends 'modal' ? ModalProps : T extends 'slideover' ? SlideoverProps : T extends 'drawer' ? DrawerProps : never

export interface HeaderProps<T extends HeaderMode = HeaderMode> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'header'
   */
  as?: any
  title?: string
  to?: string
  /**
   * The mode of the header menu.
   * @defaultValue 'modal'
   */
  mode?: T
  /**
   * The props for the header menu component.
   */
  menu?: HeaderMenu<T>
  /**
   * Customize the toggle button to open the header menu displayed when the `content` slot is used.
   * `{ color: 'neutral', variant: 'ghost' }`{lang="ts-type"}
   */
  toggle?: boolean | Omit<ButtonProps, LinkPropsKeys>
  /**
   * The side to render the toggle button on.
   * @defaultValue 'right'
   */
  toggleSide?: 'left' | 'right'
  /**
   * Automatically close when route changes.
   * @defaultValue true
   */
  autoClose?: boolean
  class?: any
  ui?: Header['slots']
}

export interface HeaderSlots {
  title?(props?: {}): VNode[]
  left?(props?: {}): VNode[]
  default?(props?: {}): VNode[]
  right?(props?: {}): VNode[]
  toggle?(props: { open: boolean, toggle: () => void, ui: Header['ui'] }): VNode[]
  top?(props?: {}): VNode[]
  bottom?(props?: {}): VNode[]
  body?(props?: {}): VNode[]
  content?(props: { close?: () => void }): VNode[]
}

// One lock on `<html>` for every Header menu open at once, released when the last one closes. Only
// the styles the first lock found are restored, never a lock another component holds.
let locks = 0
let restore: (() => void) | undefined

function lockPage() {
  if (!locks++) {
    const { style } = document.documentElement
    const { overflow, scrollbarGutter } = style
    style.overflow = 'hidden'
    style.scrollbarGutter = 'stable'
    restore = () => {
      style.overflow = overflow
      style.scrollbarGutter = scrollbarGutter
    }
  }

  return () => {
    if (!--locks) {
      restore?.()
    }
  }
}
</script>

<script setup lang="ts" generic="T extends HeaderMode">
import { computed, watch, toRef, shallowRef, useTemplateRef, onBeforeUnmount } from 'vue'
import type { FocusOutsideEvent, PointerDownOutsideEvent } from 'reka-ui'
import { Primitive } from 'reka-ui'
import { createReusableTemplate, unrefElement } from '@vueuse/core'
import { useRoute } from '#imports'
import { useComponentProps, useComponentOverrides, useThemeConfig } from '../composables/useComponentProps'
import { useLocale } from '../composables/useLocale'
import { useLazyOverlay } from '../composables/useLazyOverlay'
import { lazyOverlays, loadOverlay } from '../utils/lazy-overlay'
import { getSlotChildrenText } from '../utils'
import { tv } from '../utils/tv'
import UButton from './Button.vue'
import ULink from './Link.vue'
import UContainer from './Container.vue'

defineOptions({ inheritAttrs: false })

const _props = withDefaults(defineProps<HeaderProps<T>>(), {
  as: 'header',
  mode: 'modal' as never,
  autoClose: true,
  toggle: true,
  toggleSide: 'right',
  to: '/',
  title: 'Nuxt UI'
})
const slots = defineSlots<HeaderSlots>()

const props = useComponentProps<HeaderProps<T>>('header', _props, theme)

const open = defineModel<boolean>('open', { default: false })

const route = useRoute()
const { t, locale } = useLocale()
const appConfig = useThemeConfig() as Header['AppConfig']
const overrides = useComponentOverrides((ui: Header['AppConfig']['ui']) => ui.header)

const [DefineToggleTemplate, ReuseToggleTemplate] = createReusableTemplate()

const ariaLabel = computed(() => {
  const slotText = slots.title && getSlotChildrenText(slots.title())
  return (slotText || props.title || 'Nuxt UI').trim()
})

watch(() => route.fullPath, () => {
  if (!props.autoClose) return

  open.value = false
})

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv(theme, overrides.value)({ mode: props.mode as HeaderMode }))

const rootRef = useTemplateRef('rootRef')
const rootEl = computed(() => unrefElement(rootRef) as HTMLElement | undefined)

// The fullscreen menu opens under the header instead of covering it, so the header and its toggle
// are only mounted once. The slideover and the drawer only cover part of the page and stay modal.
const underHeader = computed(() => props.mode === 'modal')

// Read where the header ends when the menu opens: a banner above it or its `top` and `bottom`
// slots move it. The page can't scroll while the menu is open, so it stays right.
const menuTop = shallowRef<string>()
let opener: HTMLElement | undefined
let leftMenu = false

// Lock `<html>`, not the `<body>` Reka locks for the overlays opened from the header, so neither
// lock restores a value the other one set. The gutter keeps the page from moving under the scrollbar.
let release: (() => void) | undefined

function unlock() {
  release?.()
  release = undefined
}

watch([open, underHeader], ([value, under]) => {
  if (!value || !under) {
    unlock()
  } else if (typeof document !== 'undefined') {
    release ??= lockPage()
  }
}, { immediate: true })

onBeforeUnmount(unlock)

// Also runs once the root is mounted, for a menu that starts open
watch([open, rootEl], ([value, el], previous) => {
  if (!value || !underHeader.value || !el) return

  // The root keeps its height, content in the `top` and `bottom` slots overflows it
  const rect = el.getBoundingClientRect()
  if (rect.height) {
    menuTop.value = `${Math.max(rect.top + Math.max(rect.height, el.scrollHeight), 0)}px`
  }

  if (!previous?.[0]) {
    const active = document.activeElement as HTMLElement | null
    opener = active && active !== document.body ? active : undefined
    leftMenu = false
  }
}, { immediate: true, flush: 'sync' })

// The header stays reachable while the menu is open, so its toggle can close it
function onInteractOutside(e: PointerDownOutsideEvent | FocusOutsideEvent) {
  if (rootEl.value?.contains(e.target as Node)) {
    e.preventDefault()
  } else if (!e.defaultPrevented) {
    leftMenu = true
  }
}

// Give the focus back to what opened the menu, the dialog has no trigger of its own. Not when the
// focus or a click already went somewhere else on the page.
function onCloseAutoFocus(e: Event) {
  e.preventDefault()
  if (!leftMenu && opener?.isConnected) {
    opener.focus()
  }
  opener = undefined
}

const { slideover: USlideover, modal: UModal, drawer: UDrawer } = lazyOverlays

const Menu = computed(() => ({
  slideover: USlideover,
  modal: UModal,
  drawer: UDrawer
})[props.mode as HeaderMode])

const menuProps = toRef(() => {
  if (!underHeader.value) {
    return props.menu as HeaderMenu<T>
  }

  // The layout under the header is fixed, so the props that would move it are overridden and the
  // handlers of `menu.content` run before the Header's own
  const menu = (props.menu ?? {}) as ModalProps
  const content = menu.content as Record<string, any> | undefined

  const modal: ModalProps = {
    ...menu,
    modal: false,
    portal: menu.portal ?? false,
    fullscreen: true,
    scrollable: false,
    transition: menu.transition ?? false,
    content: {
      ...content,
      style: [content?.style, menuTop.value && { top: menuTop.value }],
      onInteractOutside: (e: PointerDownOutsideEvent | FocusOutsideEvent) => {
        content?.onInteractOutside?.(e)
        onInteractOutside(e)
      },
      onCloseAutoFocus: (e: Event) => {
        content?.onCloseAutoFocus?.(e)
        // The caller moved the focus somewhere else
        if (e.defaultPrevented) {
          opener = undefined
          return
        }
        onCloseAutoFocus(e)
      }
    } as ModalProps['content']
  }

  return modal as HeaderMenu<T>
})

// Read on render, like the slots it depends on
function menuUi() {
  return {
    overlay: ui.value.overlay({ class: props.ui?.overlay }),
    content: ui.value.content({ class: props.ui?.content }),
    // The slideover shows its own close in a header of its own, the title is only read out
    ...(props.mode === 'slideover' && !slots.content ? { title: 'sr-only', body: ui.value.body({ class: props.ui?.body }) } : {})
  }
}

// The toggle only shows when there is a menu to open. Slots aren't reactive, read them on render.
function hasMenu() {
  return !!slots.body || !!slots.content
}

const renderMenu = useLazyOverlay(() => open.value || (props.menu as ModalProps | undefined)?.unmountOnHide === false, () => loadOverlay(props.mode as HeaderMode))

function toggleOpen() {
  open.value = !open.value
}
</script>

<template>
  <DefineToggleTemplate>
    <slot v-if="hasMenu()" name="toggle" :open="open" :toggle="toggleOpen" :ui="ui">
      <UButton
        v-if="props.toggle"
        color="neutral"
        variant="ghost"
        :aria-label="open ? t('header.close') : t('header.open')"
        :aria-expanded="open"
        :icon="open ? appConfig.ui.icons.close : appConfig.ui.icons.menu"
        v-bind="(typeof props.toggle === 'object' ? props.toggle : {})"
        data-slot="header-toggle"
        :class="ui.toggle({ class: props.ui?.toggle, toggleSide: props.toggleSide })"
        @click="toggleOpen"
      />
    </slot>
  </DefineToggleTemplate>

  <Primitive ref="rootRef" :as="props.as" data-slot="header" v-bind="$attrs" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <slot name="top" />

    <UContainer data-slot="header-container" :class="ui.container({ class: props.ui?.container })">
      <div data-slot="header-left" :class="ui.left({ class: props.ui?.left })">
        <ReuseToggleTemplate v-if="props.toggleSide === 'left'" />

        <slot name="left">
          <ULink :to="props.to" :aria-label="ariaLabel" data-slot="header-title" :class="ui.title({ class: props.ui?.title })">
            <slot name="title">
              {{ props.title }}
            </slot>
          </ULink>
        </slot>
      </div>

      <div data-slot="header-center" :class="ui.center({ class: props.ui?.center })">
        <slot />
      </div>

      <div data-slot="header-right" :class="ui.right({ class: props.ui?.right })">
        <slot name="right" />

        <ReuseToggleTemplate v-if="props.toggleSide === 'right'" />
      </div>
    </UContainer>

    <slot name="bottom" />
  </Primitive>

  <Menu
    v-if="renderMenu"
    v-model:open="open"
    :title="locale.messages.header?.title || t('header.open')"
    :description="locale.messages.header?.description"
    v-bind="menuProps"
    :ui="menuUi()"
  >
    <template v-if="props.mode === 'slideover' && !slots.content" #body>
      <slot name="body" />
    </template>

    <template v-else #content="contentData">
      <slot name="content" v-bind="contentData">
        <div data-slot="header-body" :class="ui.body({ class: props.ui?.body })">
          <slot name="body" />
        </div>
      </slot>
    </template>
  </Menu>
</template>
