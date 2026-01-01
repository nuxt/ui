<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/alert'
import type { AvatarProps, ButtonProps, IconProps, LinkPropsKeys } from '../types'
import type { ComponentConfig } from '../types/tv'

type Alert = ComponentConfig<typeof theme, AppConfig, 'alert'>

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
  icon?: IconProps['name']
  avatar?: AvatarProps
  /**
   * @defaultValue 'primary'
   */
  color?: Alert['variants']['color']
  /**
   * @defaultValue 'solid'
   */
  variant?: Alert['variants']['variant']
  /**
   * The orientation between the content and the actions.
   * @defaultValue 'vertical'
   */
  orientation?: Alert['variants']['orientation']
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
  close?: boolean | Omit<ButtonProps, LinkPropsKeys>
  /**
   * The icon displayed in the close button.
   * @defaultValue appConfig.ui.icons.close
   * @IconifyIcon
   */
  closeIcon?: IconProps['name']
  class?: any
  ui?: Alert['slots']
}

export interface AlertEmits {
  'update:open': [value: boolean]
}

export interface AlertSlots {
  leading(props: { ui: Alert['ui'] }): any
  title(props?: {}): any
  description(props?: {}): any
  actions(props?: {}): any
  close(props: { ui: Alert['ui'] }): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { useLocale } from '../composables/useLocale'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'
import UAvatar from './Avatar.vue'
import UButton from './Button.vue'

const props = withDefaults(defineProps<AlertProps>(), {
  orientation: 'vertical'
})
const emits = defineEmits<AlertEmits>()
const slots = defineSlots<AlertSlots>()

const { t } = useLocale()
const appConfig = useAppConfig() as Alert['AppConfig']

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.alert || {}) })({
  color: props.color,
  variant: props.variant,
  orientation: props.orientation,
  title: !!props.title || !!slots.title
}))
</script>

<template>
  <Primitive :as="as" :data-orientation="orientation" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <slot name="leading" :ui="ui">
      <UAvatar v-if="avatar" :size="((props.ui?.avatarSize || ui.avatarSize()) as AvatarProps['size'])" v-bind="avatar" data-slot="avatar" :class="ui.avatar({ class: props.ui?.avatar })" />
      <UIcon v-else-if="icon" :name="icon" data-slot="icon" :class="ui.icon({ class: props.ui?.icon })" />
    </slot>

    <div data-slot="wrapper" :class="ui.wrapper({ class: props.ui?.wrapper })">
      <div v-if="title || !!slots.title" data-slot="title" :class="ui.title({ class: props.ui?.title })">
        <slot name="title">
          {{ title }}
        </slot>
      </div>
      <div v-if="description || !!slots.description" data-slot="description" :class="ui.description({ class: props.ui?.description })">
        <slot name="description">
          {{ description }}
        </slot>
      </div>

      <div v-if="orientation === 'vertical' && (actions?.length || !!slots.actions)" data-slot="actions" :class="ui.actions({ class: props.ui?.actions })">
        <slot name="actions">
          <UButton v-for="(action, index) in actions" :key="index" size="xs" v-bind="action" />
        </slot>
      </div>
    </div>

    <div v-if="(orientation === 'horizontal' && (actions?.length || !!slots.actions)) || close" data-slot="actions" :class="ui.actions({ class: props.ui?.actions, orientation: 'horizontal' })">
      <template v-if="orientation === 'horizontal' && (actions?.length || !!slots.actions)">
        <slot name="actions">
          <UButton v-for="(action, index) in actions" :key="index" size="xs" v-bind="action" />
        </slot>
      </template>

      <slot name="close" :ui="ui">
        <UButton
          v-if="close"
          :icon="closeIcon || appConfig.ui.icons.close"
          color="neutral"
          variant="link"
          :aria-label="t('alert.close')"
          v-bind="(typeof close === 'object' ? close : {})"
          data-slot="close"
          :class="ui.close({ class: props.ui?.close })"
          @click="emits('update:open', false)"
        />
      </slot>
    </div>
  </Primitive>
</template>
