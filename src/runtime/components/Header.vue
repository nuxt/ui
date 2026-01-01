<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/header'
import type { ButtonProps, DrawerProps, ModalProps, SlideoverProps, LinkPropsKeys } from '../types'
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
  class?: any
  ui?: Header['slots']
}

export interface HeaderSlots {
  title(props?: {}): any
  left(props?: {}): any
  default(props?: {}): any
  right(props?: {}): any
  toggle(props: { open: boolean, toggle: () => void, ui: Header['ui'] }): any
  top(props?: {}): any
  bottom(props?: {}): any
  body(props?: {}): any
  content(props: { close?: () => void }): any
}
</script>

<script setup lang="ts" generic="T extends HeaderMode">
import { computed, watch, toRef } from 'vue'
import { Primitive } from 'reka-ui'
import { defu } from 'defu'
import { createReusableTemplate } from '@vueuse/core'
import { useAppConfig, useRoute } from '#imports'
import { useLocale } from '../composables/useLocale'
import { getSlotChildrenText } from '../utils'
import { tv } from '../utils/tv'
import UButton from './Button.vue'
import ULink from './Link.vue'
import UContainer from './Container.vue'
import USlideover from './Slideover.vue'
import UModal from './Modal.vue'
import UDrawer from './Drawer.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<HeaderProps<T>>(), {
  as: 'header',
  mode: 'modal' as never,
  toggle: true,
  toggleSide: 'right',
  to: '/',
  title: 'Nuxt UI'
})
const slots = defineSlots<HeaderSlots>()

const open = defineModel<boolean>('open', { default: false })

const route = useRoute()
const { t } = useLocale()
const appConfig = useAppConfig() as Header['AppConfig']

const [DefineLeftTemplate, ReuseLeftTemplate] = createReusableTemplate()
const [DefineRightTemplate, ReuseRightTemplate] = createReusableTemplate()
const [DefineToggleTemplate, ReuseToggleTemplate] = createReusableTemplate()

const ariaLabel = computed(() => {
  const slotText = slots.title && getSlotChildrenText(slots.title())
  return (slotText || props.title || 'Nuxt UI').trim()
})

watch(() => route.fullPath, () => {
  open.value = false
})

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.header || {}) })())

const Menu = computed(() => ({
  slideover: USlideover,
  modal: UModal,
  drawer: UDrawer
})[props.mode as HeaderMode])

const menuProps = toRef(() => defu(props.menu, {
  content: {
    onOpenAutoFocus: (e: Event) => e.preventDefault()
  }
}, props.mode === 'modal' ? { fullscreen: true, transition: false } : {}) as HeaderMenu<T>)

function toggleOpen() {
  open.value = !open.value
}
</script>

<template>
  <DefineToggleTemplate>
    <slot name="toggle" :open="open" :toggle="toggleOpen" :ui="ui">
      <UButton
        v-if="toggle"
        color="neutral"
        variant="ghost"
        :aria-label="open ? t('header.close') : t('header.open')"
        :icon="open ? appConfig.ui.icons.close : appConfig.ui.icons.menu"
        v-bind="(typeof toggle === 'object' ? toggle : {})"
        data-slot="toggle"
        :class="ui.toggle({ class: props.ui?.toggle, toggleSide })"
        @click="toggleOpen"
      />
    </slot>
  </DefineToggleTemplate>

  <DefineLeftTemplate>
    <div data-slot="left" :class="ui.left({ class: props.ui?.left })">
      <ReuseToggleTemplate v-if="toggleSide === 'left'" />

      <slot name="left">
        <ULink :to="to" :aria-label="ariaLabel" data-slot="title" :class="ui.title({ class: props.ui?.title })">
          <slot name="title">
            {{ title }}
          </slot>
        </ULink>
      </slot>
    </div>
  </DefineLeftTemplate>

  <DefineRightTemplate>
    <div data-slot="right" :class="ui.right({ class: props.ui?.right })">
      <slot name="right" />

      <ReuseToggleTemplate v-if="toggleSide === 'right'" />
    </div>
  </DefineRightTemplate>

  <Primitive :as="as" v-bind="$attrs" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <slot name="top" />

    <UContainer data-slot="container" :class="ui.container({ class: props.ui?.container })">
      <ReuseLeftTemplate />

      <div data-slot="center" :class="ui.center({ class: props.ui?.center })">
        <slot />
      </div>

      <ReuseRightTemplate />
    </UContainer>

    <slot name="bottom" />
  </Primitive>

  <Menu
    v-model:open="open"
    :title="t('header.title')"
    :description="t('header.description')"
    v-bind="menuProps"
    :ui="{
      overlay: ui.overlay({ class: props.ui?.overlay }),
      content: ui.content({ class: props.ui?.content })
    }"
  >
    <template #content="contentData">
      <slot name="content" v-bind="contentData">
        <div v-if="mode !== 'drawer'" data-slot="header" :class="ui.header({ class: props.ui?.header })">
          <ReuseLeftTemplate />

          <ReuseRightTemplate />
        </div>

        <div data-slot="body" :class="ui.body({ class: props.ui?.body })">
          <slot name="body" />
        </div>
      </slot>
    </template>
  </Menu>
</template>
