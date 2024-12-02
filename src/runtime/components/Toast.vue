<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { ToastRootProps, ToastRootEmits } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/toast'
import { extendDevtoolsMeta } from '../composables/extendDevtoolsMeta'
import type { AvatarProps, ButtonProps } from '../types'

const appConfig = _appConfig as AppConfig & { ui: { toast: Partial<typeof theme> } }

const toast = tv({ extend: tv(theme), ...(appConfig.ui?.toast || {}) })

type ToastVariants = VariantProps<typeof toast>

export interface ToastProps extends Pick<ToastRootProps, 'defaultOpen' | 'open' | 'type' | 'duration'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'li'
   */
  as?: any
  title?: string
  description?: string
  icon?: string
  avatar?: AvatarProps
  color?: ToastVariants['color']
  /**
   * Display a list of actions:
   * - under the title and description if multiline
   * - next to the close button if not multiline
   * `{ size: 'xs' }`{lang="ts-type"}
   */
  actions?: ButtonProps[]
  /**
   * Display a close button to dismiss the toast.
   * `{ size: 'md', color: 'neutral', variant: 'link' }`{lang="ts-type"}
   * @defaultValue true
   */
  close?: ButtonProps | boolean
  /**
   * The icon displayed in the close button.
   * @defaultValue appConfig.ui.icons.close
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
  close(props: { ui: any }): any
}

extendDevtoolsMeta<ToastProps>({ ignore: true })
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
  close: true
})
const emits = defineEmits<ToastEmits>()
const slots = defineSlots<ToastSlots>()

const { t } = useLocale()
const appConfig = useAppConfig()

const rootProps = useForwardPropsEmits(reactivePick(props, 'as', 'defaultOpen', 'open', 'duration', 'type'), emits)

const multiline = computed(() => !!props.title && !!props.description)

const ui = computed(() => toast({
  color: props.color
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
    :class="ui.root({ class: [props.class, props.ui?.root], multiline })"
    :style="{ '--height': height }"
  >
    <slot name="leading">
      <UAvatar v-if="avatar" :size="((props.ui?.avatarSize || ui.avatarSize()) as AvatarProps['size'])" v-bind="avatar" :class="ui.avatar({ class: props.ui?.avatar })" />
      <UIcon v-else-if="icon" :name="icon" :class="ui.icon({ class: props.ui?.icon })" />
    </slot>

    <div :class="ui.wrapper({ class: props.ui?.wrapper })">
      <ToastTitle v-if="title || !!slots.title" :class="ui.title({ class: props.ui?.title })">
        <slot name="title">
          {{ title }}
        </slot>
      </ToastTitle>
      <ToastDescription v-if="description || !!slots.description" :class="ui.description({ class: props.ui?.description })">
        <slot name="description">
          {{ description }}
        </slot>
      </ToastDescription>

      <div v-if="multiline && actions?.length" :class="ui.actions({ class: props.ui?.actions, multiline: true })">
        <slot name="actions">
          <ToastAction v-for="(action, index) in actions" :key="index" :alt-text="action.label || 'Action'" as-child @click.stop>
            <UButton size="xs" :color="color" v-bind="action" />
          </ToastAction>
        </slot>
      </div>
    </div>

    <div v-if="(!multiline && actions?.length) || close !== null" :class="ui.actions({ class: props.ui?.actions, multiline: false })">
      <template v-if="!multiline">
        <slot name="actions">
          <ToastAction v-for="(action, index) in actions" :key="index" :alt-text="action.label || 'Action'" as-child @click.stop>
            <UButton size="xs" :color="color" v-bind="action" />
          </ToastAction>
        </slot>
      </template>

      <ToastClose as-child>
        <slot name="close" :ui="ui">
          <UButton
            v-if="close"
            :icon="closeIcon || appConfig.ui.icons.close"
            size="md"
            color="neutral"
            variant="link"
            :aria-label="t('toast.close')"
            v-bind="typeof close === 'object' ? close : undefined"
            :class="ui.close({ class: props.ui?.close })"
            @click.stop
          />
        </slot>
      </ToastClose>
    </div>

    <div v-if="remaining > 0 && duration" :class="ui.progress({ class: props.ui?.progress })" :style="{ width: `${remaining / duration * 100}%` }" />
  </ToastRoot>
</template>
