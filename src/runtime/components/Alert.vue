<script lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/alert'
import { tv } from '../utils/tv'
import type { AvatarProps, ButtonProps } from '../types'

const appConfigAlert = _appConfig as AppConfig & { ui: { alert: Partial<typeof theme> } }

const alert = tv({ extend: tv(theme), ...(appConfigAlert.ui?.alert || {}) })

type AlertVariants = VariantProps<typeof alert>

export interface AlertProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  title?: string
  description?: string
  /**
   * @IconifyIcon
   */
  icon?: string
  avatar?: AvatarProps
  /**
   * @defaultValue 'primary'
   */
  color?: AlertVariants['color']
  /**
   * @defaultValue 'solid'
   */
  variant?: AlertVariants['variant']
  /**
   * The orientation between the content and the actions.
   * @defaultValue 'vertical'
   */
  orientation?: AlertVariants['orientation']
  /**
   * Display a list of actions:
   * - under the title and description when orientation is `vertical`
   * - next to the close button when orientation is `horizontal`
   * `{ size: 'xs' }`{lang="ts-type"}
   */
  actions?: ButtonProps[]
  /**
   * Display a close button to dismiss the alert.
   * `{ size: 'md', color: 'neutral', variant: 'link' }`{lang="ts-type"}
   * @emits 'update:open'
   * @defaultValue false
   */
  close?: boolean | Partial<ButtonProps>
  /**
   * The icon displayed in the close button.
   * @defaultValue appConfig.ui.icons.close
   * @IconifyIcon
   */
  closeIcon?: string
  class?: any
  ui?: Partial<typeof alert.slots>
}

export interface AlertEmits {
  (e: 'update:open', value: boolean): void
}

export interface AlertSlots {
  leading(props?: {}): any
  title(props?: {}): any
  description(props?: {}): any
  actions(props?: {}): any
  close(props: { ui: ReturnType<typeof alert> }): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { useLocale } from '../composables/useLocale'
import UIcon from './Icon.vue'
import UAvatar from './Avatar.vue'
import UButton from './Button.vue'

const props = withDefaults(defineProps<AlertProps>(), {
  orientation: 'vertical'
})
const emits = defineEmits<AlertEmits>()
const slots = defineSlots<AlertSlots>()

const { t } = useLocale()
const appConfig = useAppConfig()

const ui = computed(() => alert({
  color: props.color,
  variant: props.variant,
  orientation: props.orientation,
  title: !!props.title || !!slots.title
}))
</script>

<template>
  <Primitive :as="as" :data-orientation="orientation" :class="ui.root({ class: [props.class, props.ui?.root] })">
    <slot name="leading">
      <UAvatar v-if="avatar" :size="((props.ui?.avatarSize || ui.avatarSize()) as AvatarProps['size'])" v-bind="avatar" :class="ui.avatar({ class: props.ui?.avatar })" />
      <UIcon v-else-if="icon" :name="icon" :class="ui.icon({ class: props.ui?.icon })" />
    </slot>

    <div :class="ui.wrapper({ class: props.ui?.wrapper })">
      <div v-if="title || !!slots.title" :class="ui.title({ class: props.ui?.title })">
        <slot name="title">
          {{ title }}
        </slot>
      </div>
      <div v-if="description || !!slots.description" :class="ui.description({ class: props.ui?.description })">
        <slot name="description">
          {{ description }}
        </slot>
      </div>

      <div v-if="orientation === 'vertical' && actions?.length" :class="ui.actions({ class: props.ui?.actions })">
        <slot name="actions">
          <UButton v-for="(action, index) in actions" :key="index" size="xs" v-bind="action" />
        </slot>
      </div>
    </div>

    <div v-if="(orientation === 'horizontal' && actions?.length) || close" :class="ui.actions({ class: props.ui?.actions, orientation: 'horizontal' })">
      <template v-if="orientation === 'horizontal' && actions?.length">
        <slot name="actions">
          <UButton v-for="(action, index) in actions" :key="index" size="xs" v-bind="action" />
        </slot>
      </template>

      <slot name="close" :ui="ui">
        <UButton
          v-if="close"
          :icon="closeIcon || appConfig.ui.icons.close"
          size="md"
          color="neutral"
          variant="link"
          :aria-label="t('alert.close')"
          v-bind="(typeof close === 'object' ? close as Partial<ButtonProps> : {})"
          :class="ui.close({ class: props.ui?.close })"
          @click="emits('update:open', false)"
        />
      </slot>
    </div>
  </Primitive>
</template>
