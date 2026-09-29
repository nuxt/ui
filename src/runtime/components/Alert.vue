<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/alert'
import type { AvatarProps } from './Avatar.vue'
import type { ButtonProps } from './Button.vue'
import type { IconProps } from './Icon.vue'
import type { LinkPropsKeys } from './Link.vue'
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
  leading?(props: { ui: Alert['ui'] }): VNode[]
  title?(props?: {}): VNode[]
  description?(props?: {}): VNode[]
  actions?(props?: {}): VNode[]
  close?(props: { ui: Alert['ui'] }): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { useComponentProps, useComponentOverrides } from '../composables/useComponentProps'
import { useLocale } from '../composables/useLocale'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'
import UAvatar from './Avatar.vue'
import UButton from './Button.vue'

const _props = withDefaults(defineProps<AlertProps>(), {
  orientation: 'vertical'
})
const emits = defineEmits<AlertEmits>()
const slots = defineSlots<AlertSlots>()

const props = useComponentProps('alert', _props, theme)

const { t } = useLocale()
const appConfig = useAppConfig() as Alert['AppConfig']
const overrides = useComponentOverrides(() => appConfig.ui?.alert)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv(theme, overrides.value)({
  color: props.color,
  variant: props.variant,
  orientation: props.orientation,
  title: !!props.title || !!slots.title
}))
</script>

<template>
  <Primitive :as="props.as" :data-orientation="props.orientation" data-slot="alert" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <slot name="leading" :ui="ui">
      <UAvatar v-if="props.avatar" size="2xl" v-bind="props.avatar" data-slot="alert-avatar" :class="ui.avatar({ class: props.ui?.avatar })" />
      <UIcon v-else-if="props.icon" :name="props.icon" data-slot="alert-icon" :class="ui.icon({ class: props.ui?.icon })" />
    </slot>

    <div data-slot="alert-wrapper" :class="ui.wrapper({ class: props.ui?.wrapper })">
      <div v-if="props.title || !!slots.title" data-slot="alert-title" :class="ui.title({ class: props.ui?.title })">
        <slot name="title">
          {{ props.title }}
        </slot>
      </div>
      <div v-if="props.description || !!slots.description" data-slot="alert-description" :class="ui.description({ class: props.ui?.description })">
        <slot name="description">
          {{ props.description }}
        </slot>
      </div>

      <div v-if="props.orientation === 'vertical' && (props.actions?.length || !!slots.actions)" data-slot="alert-actions" :class="ui.actions({ class: props.ui?.actions })">
        <slot name="actions">
          <UButton v-for="(action, index) in props.actions" :key="index" size="xs" v-bind="action" />
        </slot>
      </div>
    </div>

    <div v-if="(props.orientation === 'horizontal' && (props.actions?.length || !!slots.actions)) || props.close" data-slot="alert-actions" :class="ui.actions({ class: props.ui?.actions, orientation: 'horizontal' })">
      <template v-if="props.orientation === 'horizontal' && (props.actions?.length || !!slots.actions)">
        <slot name="actions">
          <UButton v-for="(action, index) in props.actions" :key="index" size="xs" v-bind="action" />
        </slot>
      </template>

      <slot name="close" :ui="ui">
        <UButton
          v-if="props.close"
          :icon="props.closeIcon || appConfig.ui.icons.close"
          color="neutral"
          variant="link"
          :aria-label="t('alert.close')"
          v-bind="(typeof props.close === 'object' ? props.close : {})"
          data-slot="alert-close"
          :class="ui.close({ class: props.ui?.close })"
          @click="emits('update:open', false)"
        />
      </slot>
    </div>
  </Primitive>
</template>
