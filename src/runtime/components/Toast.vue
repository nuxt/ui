<script lang="ts">
import type { ToastRootProps, ToastRootEmits } from 'reka-ui'
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/toast'
import type { AvatarProps, ButtonProps, IconProps, ProgressProps, LinkPropsKeys } from '../types'
import type { StringOrVNode } from '../types/utils'
import type { ComponentConfig } from '../types/tv'

type Toast = ComponentConfig<typeof theme, AppConfig, 'toast'>

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
  icon?: IconProps['name']
  avatar?: AvatarProps
  /**
   * @defaultValue 'primary'
   */
  color?: Toast['variants']['color']
  /**
   * The orientation between the content and the actions.
   * @defaultValue 'vertical'
   */
  orientation?: Toast['variants']['orientation']
  /**
   * Display a close button to dismiss the toast.
   * `{ size: 'md', color: 'neutral', variant: 'link' }`{lang="ts-type"}
   * @defaultValue true
   */
  close?: boolean | Omit<ButtonProps, LinkPropsKeys>
  /**
   * The icon displayed in the close button.
   * @defaultValue appConfig.ui.icons.close
   * @IconifyIcon
   */
  closeIcon?: IconProps['name']
  /**
   * Display a list of actions:
   * - under the title and description when orientation is `vertical`
   * - next to the close button when orientation is `horizontal`
   * `{ size: 'xs' }`{lang="ts-type"}
   */
  actions?: ButtonProps[]
  /**
   * Display a progress bar showing the toast's remaining duration.
   * `{ size: 'sm' }`{lang="ts-type"}
   * @defaultValue true
   */
  progress?: boolean | Pick<ProgressProps, 'color' | 'ui'>
  class?: any
  ui?: Toast['slots']
}

export interface ToastEmits extends ToastRootEmits {}

export interface ToastSlots {
  leading?(props: { ui: Toast['ui'] }): VNode[]
  title?(props?: {}): VNode[]
  description?(props?: {}): VNode[]
  actions?(props?: {}): VNode[]
  close?(props: { ui: Toast['ui'] }): VNode[]
}
</script>

<script setup lang="ts">
import { ref, computed, onMounted, useTemplateRef } from 'vue'
import { ToastRoot, ToastTitle, ToastDescription, ToastAction, ToastClose } from 'reka-ui'
import { useForwardProps } from '../composables/useForwardProps'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../composables/useComponentProps'
import { useLocale } from '../composables/useLocale'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'
import UAvatar from './Avatar.vue'
import UButton from './Button.vue'
import UProgress from './Progress.vue'

const _props = withDefaults(defineProps<ToastProps>(), {
  orientation: 'vertical',
  close: true,
  progress: true
})
const emits = defineEmits<ToastEmits>()
const slots = defineSlots<ToastSlots>()

const props = useComponentProps('toast', _props)

const { t } = useLocale()
const appConfig = useAppConfig() as Toast['AppConfig']

const rootProps = useForwardProps(reactivePick(props, 'as', 'defaultOpen', 'open', 'duration', 'type'), emits)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.toast || {}) })({
  color: props.color,
  orientation: props.orientation,
  title: !!props.title || !!slots.title
}))

const rootRef = useTemplateRef('rootRef')
const height = ref(0)

onMounted(() => {
  if (!rootRef.value?.$el?.getBoundingClientRect) {
    return
  }

  height.value = rootRef.value.$el.getBoundingClientRect().height
})

defineExpose({
  height
})
</script>

<template>
  <ToastRoot
    ref="rootRef"
    v-slot="{ remaining, duration, open }"
    v-bind="rootProps"
    :data-orientation="props.orientation"
    data-slot="root"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
    :style="{ '--height': height }"
  >
    <slot name="leading" :ui="ui">
      <UAvatar v-if="props.avatar" :size="((props.ui?.avatarSize || ui.avatarSize()) as AvatarProps['size'])" v-bind="props.avatar" data-slot="avatar" :class="ui.avatar({ class: props.ui?.avatar })" />
      <UIcon v-else-if="props.icon" :name="props.icon" data-slot="icon" :class="ui.icon({ class: props.ui?.icon })" />
    </slot>

    <div data-slot="wrapper" :class="ui.wrapper({ class: props.ui?.wrapper })">
      <ToastTitle v-if="props.title || !!slots.title" data-slot="title" :class="ui.title({ class: props.ui?.title })">
        <slot name="title">
          <component :is="props.title()" v-if="typeof props.title === 'function'" />
          <component :is="props.title" v-else-if="typeof props.title === 'object'" />
          <template v-else>
            {{ props.title }}
          </template>
        </slot>
      </ToastTitle>
      <ToastDescription v-if="props.description || !!slots.description" data-slot="description" :class="ui.description({ class: props.ui?.description })">
        <slot name="description">
          <component :is="props.description()" v-if="typeof props.description === 'function'" />
          <component :is="props.description" v-else-if="typeof props.description === 'object'" />
          <template v-else>
            {{ props.description }}
          </template>
        </slot>
      </ToastDescription>

      <div v-if="props.orientation === 'vertical' && (props.actions?.length || !!slots.actions)" data-slot="actions" :class="ui.actions({ class: props.ui?.actions })">
        <slot name="actions">
          <ToastAction v-for="(action, index) in props.actions" :key="index" :alt-text="action.label || 'Action'" as-child @click.stop>
            <UButton size="xs" :color="props.color" v-bind="action" />
          </ToastAction>
        </slot>
      </div>
    </div>

    <div v-if="(props.orientation === 'horizontal' && (props.actions?.length || !!slots.actions)) || props.close" data-slot="actions" :class="ui.actions({ class: props.ui?.actions, orientation: 'horizontal' })">
      <template v-if="props.orientation === 'horizontal' && (props.actions?.length || !!slots.actions)">
        <slot name="actions">
          <ToastAction v-for="(action, index) in props.actions" :key="index" :alt-text="action.label || 'Action'" as-child @click.stop>
            <UButton size="xs" :color="props.color" v-bind="action" />
          </ToastAction>
        </slot>
      </template>

      <ToastClose v-if="props.close || !!slots.close" as-child>
        <slot name="close" :ui="ui">
          <UButton
            v-if="props.close"
            :icon="props.closeIcon || appConfig.ui.icons.close"
            color="neutral"
            variant="link"
            :aria-label="t('toast.close')"
            v-bind="(typeof props.close === 'object' ? props.close : {})"
            data-slot="close"
            :class="ui.close({ class: props.ui?.close })"
            @click.stop
          />
        </slot>
      </ToastClose>
    </div>

    <UProgress
      v-if="props.progress && open && remaining > 0 && duration"
      :model-value="remaining / duration * 100"
      :color="props.color"
      v-bind="(typeof props.progress === 'object' ? props.progress as Partial<ProgressProps> : {})"
      size="sm"
      data-slot="progress"
      :class="ui.progress({ class: props.ui?.progress })"
    />
  </ToastRoot>
</template>
