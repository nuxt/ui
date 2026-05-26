<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/chat-prompt'
import type { TextareaProps, TextareaSlots } from '../types'
import type { ComponentConfig } from '../types/tv'

type ChatPrompt = ComponentConfig<typeof theme, AppConfig, 'chatPrompt'>

export interface ChatPromptProps extends Pick<TextareaProps, 'rows' | 'autofocus' | 'autofocusDelay' | 'autoresize' | 'autoresizeDelay' | 'maxrows' | 'icon' | 'avatar' | 'loading' | 'loadingIcon' | 'disabled'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'form'
   */
  as?: any
  /**
   * The placeholder text for the textarea.
   * @defaultValue t('chatPrompt.placeholder')
   */
  placeholder?: string
  /**
   * @defaultValue 'outline'
   */
  variant?: ChatPrompt['variants']['variant']
  /**
   * When `true`, pressing `Enter` submits and `Shift+Enter` inserts a newline.
   * When `false`, pressing `Enter` inserts a newline and `Ctrl+Enter` / `Cmd+Enter` submits.
   * @defaultValue true
   */
  submitOnEnter?: boolean
  error?: Error
  class?: any
  ui?: ChatPrompt['slots'] & TextareaProps['ui']
}

export interface ChatPromptEmits {
  submit: [event: Event]
  close: [event: Event]
}

export interface ChatPromptSlots extends TextareaSlots {
  header?(props?: {}): VNode[]
  footer?(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed, toRef, useTemplateRef } from 'vue'
import { Primitive } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../composables/useComponentProps'
import { useForwardProps } from '../composables/useForwardProps'
import { useIMEGuard } from '../composables/useIMEGuard'
import { useLocale } from '../composables/useLocale'
import { omit, transformUI } from '../utils'
import { tv } from '../utils/tv'
import UTextarea from './Textarea.vue'

defineOptions({ inheritAttrs: false })

const _props = withDefaults(defineProps<ChatPromptProps>(), {
  as: 'form',
  autofocus: true,
  autoresize: true,
  rows: 1,
  submitOnEnter: true
})
const emits = defineEmits<ChatPromptEmits>()
const slots = defineSlots<ChatPromptSlots>()

const props = useComponentProps('chatPrompt', _props)

const model = defineModel<string>({ default: '' })

const { t } = useLocale()
const appConfig = useAppConfig() as ChatPrompt['AppConfig']

const textareaProps = useForwardProps(reactivePick(props, 'rows', 'autofocus', 'autofocusDelay', 'autoresize', 'autoresizeDelay', 'maxrows', 'icon', 'avatar', 'loading', 'loadingIcon'))

const getProxySlots = () => omit(slots, ['header', 'footer'])

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.chatPrompt || {}) })({
  variant: props.variant
}))

const textareaRef = useTemplateRef('textareaRef')

function submit(e: Event) {
  if (model.value.trim() === '') {
    return
  }

  emits('submit', e)
}

function blur(e: Event) {
  textareaRef.value?.textareaRef?.blur()

  emits('close', e)
}

const { onKeydown: onEnter, onCompositionEnd } = useIMEGuard((event) => {
  submit(event)
})

function handleEnter(event: KeyboardEvent) {
  if (props.submitOnEnter) {
    if (event.shiftKey || event.ctrlKey || event.metaKey || event.altKey) return
  } else {
    if (!event.ctrlKey && !event.metaKey) return
  }

  onEnter(event)
}

defineExpose({
  textareaRef: toRef(() => textareaRef.value?.textareaRef)
})
</script>

<template>
  <Primitive :as="props.as" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })" @submit.prevent="submit">
    <div v-if="!!slots.header" data-slot="header" :class="ui.header({ class: props.ui?.header })">
      <slot name="header" />
    </div>

    <UTextarea
      ref="textareaRef"
      v-model="model"
      :placeholder="props.placeholder ?? t('chatPrompt.placeholder')"
      :disabled="Boolean(props.error) || props.disabled"
      variant="none"
      fixed
      v-bind="{ ...textareaProps, ...$attrs }"
      :ui="transformUI(omit(ui, ['root', 'body', 'header', 'footer']), props.ui)"
      data-slot="body"
      :class="ui.body({ class: props.ui?.body })"
      @keydown.enter="handleEnter"
      @compositionend="onCompositionEnd"
      @keydown.esc="blur"
    >
      <template v-for="(_, name) in getProxySlots()" #[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>
    </UTextarea>

    <div v-if="!!slots.footer" data-slot="footer" :class="ui.footer({ class: props.ui?.footer })">
      <slot name="footer" />
    </div>
  </Primitive>
</template>
