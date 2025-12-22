<script lang="ts">
import type { ChatStatus } from 'ai'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/chat-prompt-submit'
import type { ButtonProps, ButtonSlots, IconProps, LinkPropsKeys } from '../types'
import type { ComponentConfig } from '../types/tv'

type ChatPromptSubmit = ComponentConfig<typeof theme, AppConfig, 'chatPromptSubmit'>

export interface ChatPromptSubmitProps extends Omit<ButtonProps, LinkPropsKeys | 'icon' | 'color' | 'variant'> {
  status?: ChatStatus
  /**
   * The icon displayed in the button when the status is `ready`.
   * @defaultValue appConfig.ui.icons.arrowUp
   * @IconifyIcon
   */
  icon?: IconProps['name']
  /**
   * The color of the button when the status is `ready`.
   * @defaultValue 'primary'
   */
  color?: ButtonProps['color']
  /**
   * The variant of the button when the status is `ready`.
   * @defaultValue 'solid'
   */
  variant?: ButtonProps['variant']
  /**
   * The icon displayed in the button when the status is `streaming`.
   * @defaultValue appConfig.ui.icons.stop
   * @IconifyIcon
   */
  streamingIcon?: IconProps['name']
  /**
   * The color of the button when the status is `streaming`.
   * @defaultValue 'neutral'
   */
  streamingColor?: ButtonProps['color']
  /**
   * The variant of the button when the status is `streaming`.
   * @defaultValue 'subtle'
   */
  streamingVariant?: ButtonProps['variant']
  /**
   * The icon displayed in the button when the status is `submitted`.
   * @defaultValue appConfig.ui.icons.stop
   * @IconifyIcon
   */
  submittedIcon?: IconProps['name']
  /**
   * The color of the button when the status is `submitted`.
   * @defaultValue 'neutral'
   */
  submittedColor?: ButtonProps['color']
  /**
   * The variant of the button when the status is `submitted`.
   * @defaultValue 'subtle'
   */
  submittedVariant?: ButtonProps['variant']
  /**
   * The icon displayed in the button when the status is `error`.
   * @defaultValue appConfig.ui.icons.reload
   * @IconifyIcon
   */
  errorIcon?: IconProps['name']
  /**
   * The color of the button when the status is `error`.
   * @defaultValue 'error'
   */
  errorColor?: ButtonProps['color']
  /**
   * The variant of the button when the status is `error`.
   * @defaultValue 'soft'
   */
  errorVariant?: ButtonProps['variant']
  ui?: ChatPromptSubmit['slots'] & ButtonProps['ui']
  class?: any
}

export interface ChatPromptSubmitEmits {
  stop: [event: MouseEvent]
  reload: [event: MouseEvent]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useForwardProps } from 'reka-ui'
import { reactiveOmit } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useLocale } from '../composables/useLocale'
import { transformUI } from '../utils'
import { tv } from '../utils/tv'
import UButton from './Button.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<ChatPromptSubmitProps>(), {
  status: 'ready',
  streamingColor: 'neutral',
  streamingVariant: 'subtle',
  submittedColor: 'neutral',
  submittedVariant: 'subtle',
  errorColor: 'error',
  errorVariant: 'soft'
})
const emits = defineEmits<ChatPromptSubmitEmits>()
const slots = defineSlots<ButtonSlots>()

const { t } = useLocale()
const appConfig = useAppConfig() as ChatPromptSubmit['AppConfig']

const buttonProps = useForwardProps(reactiveOmit(props, 'icon', 'color', 'variant', 'status', 'streamingIcon', 'streamingColor', 'streamingVariant', 'submittedIcon', 'submittedColor', 'submittedVariant', 'errorIcon', 'errorColor', 'errorVariant', 'class', 'ui'))

const statusButtonProps = computed(() => ({
  ready: {
    icon: props.icon || appConfig.ui.icons.arrowUp,
    color: props.color,
    variant: props.variant,
    type: 'submit' as const
  },
  submitted: {
    icon: props.submittedIcon || appConfig.ui.icons.stop,
    color: props.submittedColor,
    variant: props.submittedVariant,
    onClick(e) {
      emits('stop', e)
    }
  },
  streaming: {
    icon: props.streamingIcon || appConfig.ui.icons.stop,
    color: props.streamingColor,
    variant: props.streamingVariant,
    onClick(e) {
      emits('stop', e)
    }
  },
  error: {
    icon: props.errorIcon || appConfig.ui.icons.reload,
    color: props.errorColor,
    variant: props.errorVariant,
    onClick(e) {
      emits('reload', e)
    }
  }
} satisfies { [key: string]: ButtonProps })[props.status])

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.chatPromptSubmit || {}) })())
</script>

<template>
  <UButton
    v-bind="{
      ...buttonProps,
      ...statusButtonProps,
      'aria-label': t('chatPromptSubmit.label'),
      ...$attrs
    }"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    :ui="transformUI(ui, props.ui)"
  >
    <template v-for="(_, name) in slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>
  </UButton>
</template>
