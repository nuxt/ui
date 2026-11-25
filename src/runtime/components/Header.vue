<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '../theme/header'
import type { ButtonProps } from './Button.vue'
import type { LinkPropsKeys } from './Link.vue'
import type { ComponentConfig } from '../types/tv'

type Header = ComponentConfig<typeof theme, AppConfig, 'header'>

export interface HeaderProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'header'
   */
  as?: any
  title?: string
  to?: string
  /**
   * Customize the toggle button that opens the header menu.
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
  /**
   * The content of the menu, in a HeaderMenu with its defaults. Use the `menu` slot for a HeaderMenu of your own.
   */
  body?(props?: {}): VNode[]
  menu?(props: { open: boolean, close: () => void }): VNode[]
}
</script>

<script setup lang="ts">
import { computed, watch, useTemplateRef } from 'vue'
import { DialogRoot, DialogTrigger, Primitive } from 'reka-ui'
import { createReusableTemplate, unrefElement } from '@vueuse/core'
import { useRoute } from '#imports'
import { useComponentProps, useComponentOverrides, useThemeConfig } from '../composables/useComponentProps'
import { useLocale } from '../composables/useLocale'
import { provideHeaderContext } from '../utils/header'
import { getSlotChildrenText } from '../utils'
import { tv } from '../utils/tv'
import UButton from './Button.vue'
import ULink from './Link.vue'
import UContainer from './Container.vue'
import UHeaderMenu from './HeaderMenu.vue'

defineOptions({ inheritAttrs: false })

const _props = withDefaults(defineProps<HeaderProps>(), {
  as: 'header',
  autoClose: true,
  toggle: true,
  toggleSide: 'right',
  to: '/',
  title: 'Nuxt UI'
})
const slots = defineSlots<HeaderSlots>()

const props = useComponentProps('header', _props, theme)

const open = defineModel<boolean>('open', { default: false })

const route = useRoute()
const { t } = useLocale()
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
const ui = computed(() => tv(theme, overrides.value)())

const rootRef = useTemplateRef('rootRef')
const root = computed(() => unrefElement(rootRef) as HTMLElement | undefined)

provideHeaderContext({ open, root })

// The toggle only shows when there is a menu to open. Slots aren't reactive, read them on render.
function hasMenu() {
  return !!slots.body || !!slots.menu
}

function toggleOpen() {
  open.value = !open.value
}

function close() {
  open.value = false
}
</script>

<template>
  <!-- The menu is a non-modal dialog: the header stays usable while it's open -->
  <DialogRoot v-model:open="open" :modal="false">
    <DefineToggleTemplate>
      <slot v-if="hasMenu()" name="toggle" :open="open" :toggle="toggleOpen" :ui="ui">
        <DialogTrigger v-if="props.toggle" as-child>
          <UButton
            color="neutral"
            variant="ghost"
            :aria-label="open ? t('header.close') : t('header.open')"
            :icon="open ? appConfig.ui.icons.close : appConfig.ui.icons.menu"
            v-bind="(typeof props.toggle === 'object' ? props.toggle : {})"
            data-slot="header-toggle"
            :class="ui.toggle({ class: props.ui?.toggle, toggleSide: props.toggleSide })"
          />
        </DialogTrigger>
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

    <slot name="menu" :open="open" :close="close">
      <UHeaderMenu v-if="!!slots.body">
        <slot name="body" />
      </UHeaderMenu>
    </slot>
  </DialogRoot>
</template>
