<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/alert'
import type { AvatarProps, ButtonProps } from '../types'

const appConfig = _appConfig as AppConfig & { ui: { alert: Partial<typeof theme> } }

const alert = tv({ extend: tv(theme), ...(appConfig.ui?.alert || {}) })

type AlertVariants = VariantProps<typeof alert>

export interface AlertProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  title?: string
  description?: string
  icon?: string
  avatar?: AvatarProps
  color?: AlertVariants['color']
  variant?: AlertVariants['variant']
  /**
   * Display a list of actions:
   * - under the title and description if multiline
   * - next to the close button if not multiline
   */
  actions?: ButtonProps[]
  /**
   * Display a close button to dismiss the alert.
   * `{ size: 'md', color: 'gray', variant: 'link' }`
   * @emits `close`
   * @defaultValue false
   */
  close?: ButtonProps | boolean
  /**
   * The icon displayed in the close button.
   * @defaultValue appConfig.ui.icons.close
   */
  closeIcon?: string
  class?: any
  ui?: Partial<typeof alert.slots>
}

export interface AlertEmits {
  (e: 'close'): void
}

export interface AlertSlots {
  leading(props?: {}): any
  title(props?: {}): any
  description(props?: {}): any
  actions(props?: {}): any
  close(props: { ui: any }): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'radix-vue'
import { useAppConfig } from '#imports'
import { UIcon, UAvatar } from '#components'

const props = defineProps<AlertProps>()
const emits = defineEmits<AlertEmits>()
const slots = defineSlots<AlertSlots>()

const appConfig = useAppConfig()

const multiline = computed(() => !!props.title && !!props.description)

const ui = computed(() => alert({
  color: props.color,
  variant: props.variant
}))
</script>

<template>
  <Primitive :as="as" :class="ui.root({ class: props.class, multiline })">
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
      <template v-if="description || !!slots.description">
        <div :class="ui.description({ class: props.ui?.description })">
          <slot name="description">
            {{ description }}
          </slot>
        </div>
      </template>

      <div v-if="multiline && actions?.length" :class="ui.actions({ class: props.ui?.actions, multiline: true })">
        <slot name="actions">
          <UButton v-for="(action, index) in actions" :key="index" size="xs" v-bind="action" />
        </slot>
      </div>
    </div>

    <div v-if="(!multiline && actions?.length) || close" :class="ui.actions({ class: props.ui?.actions, multiline: false })">
      <template v-if="!multiline">
        <slot name="actions">
          <UButton v-for="(action, index) in actions" :key="index" size="xs" v-bind="action" />
        </slot>
      </template>

      <slot name="close" :ui="ui">
        <UButton
          v-if="close"
          :icon="closeIcon || appConfig.ui.icons.close"
          size="md"
          color="gray"
          variant="link"
          aria-label="Close"
          v-bind="typeof close === 'object' ? close : undefined"
          :class="ui.close({ class: props.ui?.close })"
          @click="emits('close')"
        />
      </slot>
    </div>
  </Primitive>
</template>
