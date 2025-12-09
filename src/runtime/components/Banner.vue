<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/banner'
import type { ButtonProps, IconProps, LinkProps, LinkPropsKeys } from '../types'
import type { ComponentConfig } from '../types/tv'

type Banner = ComponentConfig<typeof theme, AppConfig, 'banner'>

export interface BannerProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * A unique id saved to local storage to remember if the banner has been dismissed.
   * Change this value to show the banner again.
   * @defaultValue '1'
   */
  id?: string
  /**
   * The icon displayed next to the title.
   * @IconifyIcon
   */
  icon?: IconProps['name']
  title?: string
  /**
   * Display a list of actions next to the title.
   * `{ color: 'neutral', size: 'xs' }`{lang="ts-type"}
   */
  actions?: ButtonProps[]
  to?: LinkProps['to']
  target?: LinkProps['target']
  /**
   * @defaultValue 'primary'
   */
  color?: Banner['variants']['color']
  /**
   * Display a close button to dismiss the banner.
   * `{ size: 'md', color: 'neutral', variant: 'ghost' }`{lang="ts-type"}
   * @emits `close`
   * @defaultValue false
   */
  close?: boolean | Omit<ButtonProps, LinkPropsKeys>
  /**
   * The icon displayed in the close button.
   * @defaultValue appConfig.ui.icons.close
   * @IconifyIcon
   */
  closeIcon?: IconProps['name']
  class?: any
  ui?: Banner['slots']
}

export interface BannerSlots {
  leading(props: { ui: Banner['ui'] }): any
  title(props?: {}): any
  actions(props?: {}): any
  close(props: { ui: Banner['ui'] }): any
}

export interface BannerEmits {
  close: []
}
</script>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { Primitive } from 'reka-ui'
import { useHead, useAppConfig } from '#imports'
import { useLocale } from '../composables/useLocale'
import { tv } from '../utils/tv'
import ULink from './Link.vue'
import UContainer from './Container.vue'
import UIcon from './Icon.vue'
import UButton from './Button.vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<BannerProps>()
const slots = defineSlots<BannerSlots>()
const emits = defineEmits<BannerEmits>()

const { t } = useLocale()
const appConfig = useAppConfig() as Banner['AppConfig']

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.banner || {}) })({
  color: props.color,
  to: !!props.to
}))

const id = computed(() => `banner-${props.id || '1'}`)

watch(id, (newId) => {
  if (typeof document === 'undefined' || typeof localStorage === 'undefined') return

  const isClosed = localStorage.getItem(newId) === 'true'
  const htmlElement = document.querySelector('html')

  htmlElement?.classList.toggle('hide-banner', isClosed)
})

useHead({
  script: [{
    key: 'prehydrate-template-banner',
    innerHTML: `
            if (localStorage.getItem('${id.value}') === 'true') {
              document.querySelector('html').classList.add('hide-banner')
            }`.replace(/\s+/g, ' '),
    type: 'text/javascript'
  }]
})

function onClose() {
  localStorage.setItem(id.value, 'true')
  document.querySelector('html')?.classList.add('hide-banner')
  emits('close')
}
</script>

<template>
  <Primitive :as="as" class="banner" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <ULink
      v-if="to"
      :aria-label="title"
      v-bind="{ to, target, ...$attrs }"
      class="focus:outline-none"
      tabindex="-1"
      raw
    >
      <span class="absolute inset-0 " aria-hidden="true" />
    </ULink>

    <UContainer data-slot="container" :class="ui.container({ class: props.ui?.container })">
      <div data-slot="left" :class="ui.left({ class: props.ui?.left })" />

      <div data-slot="center" :class="ui.center({ class: props.ui?.center })">
        <slot name="leading" :ui="ui">
          <UIcon v-if="icon" :name="icon" data-slot="icon" :class="ui.icon({ class: props.ui?.icon })" />
        </slot>

        <div v-if="title || !!slots.title" data-slot="title" :class="ui.title({ class: props.ui?.title })">
          <slot name="title">
            {{ title }}
          </slot>
        </div>

        <div v-if="actions?.length || !!slots.actions" data-slot="actions" :class="ui.actions({ class: props.ui?.actions })">
          <slot name="actions">
            <UButton v-for="(action, index) in actions" :key="index" color="neutral" size="xs" v-bind="action" />
          </slot>
        </div>
      </div>

      <div data-slot="right" :class="ui.right({ class: props.ui?.right })">
        <slot name="close" :ui="ui">
          <UButton
            v-if="close"
            :icon="closeIcon || appConfig.ui.icons.close"
            size="md"
            color="neutral"
            variant="ghost"
            :aria-label="t('banner.close')"
            v-bind="(typeof close === 'object' ? close : {})"
            data-slot="close"
            :class="ui.close({ class: props.ui?.close })"
            @click="onClose"
          />
        </slot>
      </div>
    </UContainer>
  </Primitive>
</template>

<style scoped>
.hide-banner .banner {
  display: none;
}
</style>
