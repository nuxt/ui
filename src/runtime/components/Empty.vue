<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/empty'
import type { ComponentConfig } from '../types/tv'
import type { ButtonProps, IconProps, AvatarProps } from '../types'

type Empty = ComponentConfig<typeof theme, AppConfig, 'empty'>

export interface EmptyProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * The icon displayed above the title.
   * @IconifyIcon
   */
  icon?: IconProps['name']
  avatar?: AvatarProps
  title?: string
  description?: string
  /**
   * Display a list of Button in the body.
   */
  actions?: ButtonProps[]
  /**
   * @defaultValue 'outline'
   */
  variant?: Empty['variants']['variant']
  /**
   * @defaultValue 'md'
   */
  size?: Empty['variants']['size']
  class?: any
  ui?: Empty['slots']
}

export interface EmptySlots {
  header(props?: {}): any
  leading(props: { ui: Empty['ui'] }): any
  title(props?: {}): any
  description(props?: {}): any
  body(props?: {}): any
  actions(props?: {}): any
  footer(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { tv } from '../utils/tv'
import UAvatar from './Avatar.vue'
import UButton from './Button.vue'

const props = defineProps<EmptyProps>()
const slots = defineSlots<EmptySlots>()

const appConfig = useAppConfig() as Empty['AppConfig']

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.empty || {}) })({
  variant: props.variant,
  size: props.size
}))
</script>

<template>
  <Primitive :as="as" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div v-if="!!slots.header || (icon || avatar || !!slots.leading) || (title || !!slots.title) || (description || !!slots.description)" data-slot="header" :class="ui.header({ class: props.ui?.header })">
      <slot name="header">
        <slot name="leading" :ui="ui">
          <UAvatar v-if="icon || avatar" :icon="icon" v-bind="typeof avatar === 'object' ? avatar : {}" data-slot="avatar" :class="ui.avatar({ class: props.ui?.avatar })" />
        </slot>

        <h2 v-if="title || !!slots.title" data-slot="title" :class="ui.title({ class: props.ui?.title })">
          <slot name="title">
            {{ title }}
          </slot>
        </h2>

        <div v-if="description || !!slots.description" data-slot="description" :class="ui.description({ class: props.ui?.description })">
          <slot name="description">
            {{ description }}
          </slot>
        </div>
      </slot>
    </div>

    <div v-if="!!slots.body || (actions?.length || !!slots.actions)" data-slot="body" :class="ui.body({ class: props.ui?.body })">
      <slot name="body">
        <div v-if="actions?.length || !!slots.actions" data-slot="actions" :class="ui.actions({ class: props.ui?.actions })">
          <slot name="actions">
            <UButton v-for="(action, index) in actions" :key="index" :size="size" v-bind="action" />
          </slot>
        </div>
      </slot>
    </div>

    <div v-if="!!slots.footer" data-slot="footer" :class="ui.footer({ class: props.ui?.footer })">
      <slot name="footer" />
    </div>
  </Primitive>
</template>
