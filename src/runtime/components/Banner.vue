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
   * Without an explicit id, the banner will not be persisted and will reappear on page reload.
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
import { computed, ref, onMounted, useId } from 'vue'
import { Primitive } from 'reka-ui'
import { useHead, useAppConfig } from '#imports'
import { useComponentUI } from '../composables/useComponentUI'
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
const uiProp = useComponentUI('banner', props)

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.banner || {}) })({
  color: props.color,
  to: !!props.to
}))

const instanceId = useId()
const id = computed(() => {
  const rawId = props.id || instanceId
  // Sanitize to only allow safe characters for CSS custom properties and selectors
  return `banner-${rawId.replace(/[^\w-]/g, '-')}`
})
const isVisible = ref(true)
const hasPersistence = computed(() => !!props.id)

onMounted(() => {
  if (hasPersistence.value && typeof localStorage !== 'undefined') {
    const isClosed = localStorage.getItem(id.value) === 'true'
    isVisible.value = !isClosed
  }
})

useHead(() => {
  if (!hasPersistence.value) return {}

  return {
    script: [{
      key: `prehydrate-banner-${id.value}`,
      innerHTML: `
        (function() {
          try {
            if (localStorage.getItem(${JSON.stringify(id.value)}) === 'true') {
              document.documentElement.style.setProperty('--${id.value}-display', 'none');
            }
          } catch (e) {}
        })();
      `.replace(/\s+/g, ' '),
      type: 'text/javascript',
      tagPosition: 'head'
    }],
    style: [{
      key: `banner-style-${id.value}`,
      innerHTML: `.banner[data-banner-id="${id.value}"] { display: var(--${id.value}-display, block); }`,
      tagPosition: 'head'
    }]
  }
})

function onClose() {
  if (hasPersistence.value) {
    localStorage.setItem(id.value, 'true')
    document.documentElement.style.setProperty(`--${id.value}-display`, 'none')
  }
  isVisible.value = false
  emits('close')
}
</script>

<template>
  <Primitive
    v-show="isVisible"
    :as="as"
    class="banner"
    :data-banner-id="id"
    data-slot="root"
    :class="ui.root({ class: [uiProp?.root, props.class] })"
  >
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

    <UContainer data-slot="container" :class="ui.container({ class: uiProp?.container })">
      <div data-slot="left" :class="ui.left({ class: uiProp?.left })" />

      <div data-slot="center" :class="ui.center({ class: uiProp?.center })">
        <slot name="leading" :ui="ui">
          <UIcon v-if="icon" :name="icon" data-slot="icon" :class="ui.icon({ class: uiProp?.icon })" />
        </slot>

        <div v-if="title || !!slots.title" data-slot="title" :class="ui.title({ class: uiProp?.title })">
          <slot name="title">
            {{ title }}
          </slot>
        </div>

        <div v-if="actions?.length || !!slots.actions" data-slot="actions" :class="ui.actions({ class: uiProp?.actions })">
          <slot name="actions">
            <UButton v-for="(action, index) in actions" :key="index" color="neutral" size="xs" v-bind="action" />
          </slot>
        </div>
      </div>

      <div data-slot="right" :class="ui.right({ class: uiProp?.right })">
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
            :class="ui.close({ class: uiProp?.close })"
            @click="onClose"
          />
        </slot>
      </div>
    </UContainer>
  </Primitive>
</template>
