<script lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { ToastRootProps, ToastRootEmits } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/toast'
import { tv } from '../utils/tv'
import type { AvatarProps, ButtonProps } from '../types'
import type { StringOrVNode } from '../types/utils'

const appConfigToast = _appConfig as AppConfig & { ui: { toast: Partial<typeof theme> } }

const toast = tv({ extend: tv(theme), ...(appConfigToast.ui?.toast || {}) })

type ToastVariants = VariantProps<typeof toast>

export interface ToastProps extends Pick<ToastRootProps, 'defaultOpen' | 'open' | 'type' | 'duration'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'li'
   */
  as?: any
  title?: StringOrVNode
  description?: StringOrVNode
  /**
   * @IconifyIcon
   */
  icon?: string
  avatar?: AvatarProps
  /**
   * @defaultValue 'primary'
   */
  color?: ToastVariants['color']
  /**
   * The orientation between the content and the actions.
   * @defaultValue 'vertical'
   */
  orientation?: ToastVariants['orientation']
  /**
   * Display a list of actions:
   * - under the title and description when orientation is `vertical`
   * - next to the close button when orientation is `horizontal`
   * `{ size: 'xs' }`{lang="ts-type"}
   */
  actions?: ButtonProps[]
  /**
   * Display a close button to dismiss the toast.
   * `{ size: 'md', color: 'neutral', variant: 'link' }`{lang="ts-type"}
   * @defaultValue true
   */
  close?: boolean | Partial<ButtonProps>
  /**
   * The icon displayed in the close button.
   * @defaultValue appConfig.ui.icons.close
   * @IconifyIcon
   */
  closeIcon?: string
  class?: any
  ui?: Partial<typeof toast.slots>
}

export interface ToastEmits extends ToastRootEmits {}

export interface ToastSlots {
  leading(props?: {}): any
  title(props?: {}): any
  description(props?: {}): any
  actions(props?: {}): any
  close(props: { ui: ReturnType<typeof toast> }): any
}
</script>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ToastRoot, ToastTitle, ToastDescription, ToastAction, ToastClose, useForwardPropsEmits } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useLocale } from '../composables/useLocale'
import UIcon from './Icon.vue'
import UAvatar from './Avatar.vue'
import UButton from './Button.vue'

const props = withDefaults(defineProps<ToastProps>(), {
  close: true,
  orientation: 'vertical'
})
const emits = defineEmits<ToastEmits>()
const slots = defineSlots<ToastSlots>()

const { t } = useLocale()
const appConfig = useAppConfig()

const rootProps = useForwardPropsEmits(reactivePick(props, 'as', 'defaultOpen', 'open', 'duration', 'type'), emits)

const ui = computed(() => toast({
  color: props.color,
  orientation: props.orientation,
  title: !!props.title || !!slots.title
}))

const el = ref()
const height = ref(0)

onMounted(() => {
  if (!el.value) {
    return
  }

  setTimeout(() => {
    height.value = el.value.$el.getBoundingClientRect()?.height
  }, 0)
})

defineExpose({
  height
})
</script>

<template>
  <ToastRoot
    ref="el"
    v-slot="{ remaining, duration }"
    v-bind="rootProps"
    :data-orientation="orientation"
    :class="ui.root({ class: [props.class, props.ui?.root] })"
    :style="{ '--height': height }"
  >
    <slot name="leading">
      <UAvatar v-if="avatar" :size="((props.ui?.avatarSize || ui.avatarSize()) as AvatarProps['size'])" v-bind="avatar" :class="ui.avatar({ class: props.ui?.avatar })" />
      <UIcon v-else-if="icon" :name="icon" :class="ui.icon({ class: props.ui?.icon })" />
    </slot>

    <div :class="ui.wrapper({ class: props.ui?.wrapper })">
      <ToastTitle v-if="title || !!slots.title" :class="ui.title({ class: props.ui?.title })">
        <slot name="title">
          <component :is="title()" v-if="typeof title === 'function'" />
          <component :is="title" v-else-if="typeof title === 'object'" />
          <template v-else>
            {{ title }}
          </template>
        </slot>
      </ToastTitle>
      <ToastDescription v-if="description || !!slots.description" :class="ui.description({ class: props.ui?.description })">
        <slot name="description">
          <component :is="description()" v-if="typeof description === 'function'" />
          <component :is="description" v-else-if="typeof description === 'object'" />
          <template v-else>
            {{ description }}
          </template>
        </slot>
      </ToastDescription>

      <div v-if="orientation === 'vertical' && actions?.length" :class="ui.actions({ class: props.ui?.actions })">
        <slot name="actions">
          <ToastAction v-for="(action, index) in actions" :key="index" :alt-text="action.label || 'Action'" as-child @click.stop>
            <UButton size="xs" :color="color" v-bind="action" />
          </ToastAction>
        </slot>
      </div>
    </div>

    <div v-if="(orientation === 'horizontal' && actions?.length) || close" :class="ui.actions({ class: props.ui?.actions, orientation: 'horizontal' })">
      <template v-if="orientation === 'horizontal' && actions?.length">
        <slot name="actions">
          <ToastAction v-for="(action, index) in actions" :key="index" :alt-text="action.label || 'Action'" as-child @click.stop>
            <UButton size="xs" :color="color" v-bind="action" />
          </ToastAction>
        </slot>
      </template>

      <ToastClose v-if="close || !!slots.close" as-child>
        <slot name="close" :ui="ui">
          <UButton
            v-if="close"
            :icon="closeIcon || appConfig.ui.icons.close"
            size="md"
            color="neutral"
            variant="link"
            :aria-label="t('toast.close')"
            v-bind="(typeof close === 'object' ? close as Partial<ButtonProps> : {})"
            :class="ui.close({ class: props.ui?.close })"
            @click.stop
          />
        </slot>
      </ToastClose>
    </div>

    <div v-if="remaining > 0 && duration" :class="ui.progress({ class: props.ui?.progress })" :style="{ width: `${remaining / duration * 100}%` }" />
  </ToastRoot>
</template>
