<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { NuxtError } from '#app'
import theme from '#build/ui/error'
import type { ButtonProps } from '../types'
import type { ComponentConfig } from '../types/tv'

type Error = ComponentConfig<typeof theme, AppConfig, 'error'>

export interface ErrorProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
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
  clear?: boolean | Partial<ButtonProps>
  class?: any
  ui?: Error['slots']
}

export interface ErrorSlots {
  default(props?: {}): any
  statusCode(props?: {}): any
  statusMessage(props?: {}): any
  message(props?: {}): any
  links(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { clearError, useAppConfig, useComponentUiTheme } from '#imports'
import { useLocale } from '../composables/useLocale'
import { tv } from '../utils/tv'
import UButton from './Button.vue'

const props = withDefaults(defineProps<ErrorProps>(), {
  as: 'main',
  redirect: '/',
  clear: true
})
const slots = defineSlots<ErrorSlots>()

const { t } = useLocale()
const appConfig = useAppConfig() as Error['AppConfig']
const uiTheme = useComponentUiTheme('error', () => ({ slots: props.ui }))

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.error || {}) })())

function handleError() {
  clearError({ redirect: props.redirect })
}
</script>

<template>
  <Primitive :as="as" :class="ui.root({ class: [uiTheme?.slots?.root, props.class] })">
    <p v-if="!!props.error?.statusCode || !!slots.statusCode" :class="ui.statusCode({ class: uiTheme?.slots?.statusCode })">
      <slot name="statusCode">
        {{ props.error?.statusCode }}
      </slot>
    </p>
    <h1 v-if="!!props.error?.statusMessage || !!slots.statusMessage" :class="ui.statusMessage({ class: uiTheme?.slots?.statusMessage })">
      <slot name="statusMessage">
        {{ props.error?.statusMessage }}
      </slot>
    </h1>
    <p v-if="(props.error?.message && props.error.message !== props.error.statusMessage) || !!slots.message" :class="ui.message({ class: uiTheme?.slots?.message })">
      <slot name="message">
        {{ props.error?.message }}
      </slot>
    </p>
    <div v-if="!!clear || !!slots.links" :class="ui.links({ class: uiTheme?.slots?.links })">
      <slot name="links">
        <UButton
          v-if="clear"
          size="lg"
          color="primary"
          variant="solid"
          :label="t('error.clear')"
          v-bind="(typeof clear === 'object' ? clear as Partial<ButtonProps> : {})"
          @click="handleError"
        />
      </slot>
    </div>
  </Primitive>
</template>
