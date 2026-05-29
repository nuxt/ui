<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import type { NuxtError } from '#app'
import theme from '#build/ui/error'
import type { ButtonProps, IconProps } from '../types'
import type { ComponentConfig } from '../types/tv'

type Error = ComponentConfig<typeof theme, AppConfig, 'error'>

export interface ErrorProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'main'
   */
  as?: any
  /**
   * The icon displayed above the status code.
   * @IconifyIcon
   */
  icon?: IconProps['name']
  error?: Partial<NuxtError & { message: string }>
  /**
   * The URL to redirect to when the error is cleared.
   * @defaultValue '/'
   */
  redirect?: string
  /**
   * Display a button to clear the error in the links slot.
   * `{ size: 'lg', color: 'primary', variant: 'solid', label: 'Back to home' }`{lang="ts-type"}
   * @defaultValue true
   */
  clear?: boolean | ButtonProps
  class?: any
  ui?: Error['slots']
}

export interface ErrorSlots {
  default?(props?: {}): VNode[]
  leading?(props: { ui: Error['ui'] }): VNode[]
  statusCode?(props?: {}): VNode[]
  statusMessage?(props?: {}): VNode[]
  message?(props?: {}): VNode[]
  links?(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { clearError, useAppConfig } from '#imports'
import { useComponentProps } from '../composables/useComponentProps'
import { useLocale } from '../composables/useLocale'
import { tv } from '../utils/tv'
import UButton from './Button.vue'
import UIcon from './Icon.vue'

const _props = withDefaults(defineProps<ErrorProps>(), {
  as: 'main',
  redirect: '/',
  clear: true
})
const slots = defineSlots<ErrorSlots>()

const props = useComponentProps('error', _props)

const { t } = useLocale()
const appConfig = useAppConfig() as Error['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.error || {}) })())

function handleError() {
  clearError({ redirect: props.redirect })
}
</script>

<template>
  <Primitive :as="props.as" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div v-if="props.icon || !!slots.leading" data-slot="leading" :class="ui.leading({ class: props.ui?.leading })">
      <slot name="leading" :ui="ui">
        <UIcon v-if="props.icon" :name="props.icon" data-slot="leadingIcon" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
      </slot>
    </div>
    <p v-if="!!props.error?.statusCode || !!props.error?.status || !!slots.statusCode" data-slot="statusCode" :class="ui.statusCode({ class: props.ui?.statusCode })">
      <slot name="statusCode">
        {{ props.error?.statusCode || props.error?.status }}
      </slot>
    </p>
    <h1 v-if="!!props.error?.statusMessage || !!props.error?.statusText || !!slots.statusMessage" data-slot="statusMessage" :class="ui.statusMessage({ class: props.ui?.statusMessage })">
      <slot name="statusMessage">
        {{ props.error?.statusMessage || props.error?.statusText }}
      </slot>
    </h1>
    <p v-if="(props.error?.message && props.error.message !== (props.error.statusMessage || props.error.statusText)) || !!slots.message" data-slot="message" :class="ui.message({ class: props.ui?.message })">
      <slot name="message">
        {{ props.error?.message }}
      </slot>
    </p>
    <div v-if="!!props.clear || !!slots.links" data-slot="links" :class="ui.links({ class: props.ui?.links })">
      <slot name="links">
        <UButton
          v-if="props.clear"
          size="lg"
          color="primary"
          variant="solid"
          :label="t('error.clear')"
          v-bind="(typeof props.clear === 'object' ? props.clear : {})"
          @click="handleError"
        />
      </slot>
    </div>
  </Primitive>
</template>
