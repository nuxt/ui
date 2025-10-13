<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/chat-prompt'
import type { TextareaProps, TextareaSlots } from '../types'
import type { ComponentConfig } from '../types/tv'

type ChatPrompt = ComponentConfig<typeof theme, AppConfig, 'chatPrompt'>

export interface ChatPromptProps extends /** @vue-ignore */ Pick<TextareaProps, 'autofocusDelay' | 'autoresizeDelay' | 'maxrows' | 'icon' | 'avatar' | 'loading' | 'loadingIcon'> {
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
  autofocus?: TextareaProps['autofocus']
  autoresize?: TextareaProps['autoresize']
  rows?: TextareaProps['rows']
  /**
   * @defaultValue 'outline'
   */
  variant?: ChatPrompt['variants']['variant']
  error?: Error
  class?: any
  ui?: ChatPrompt['slots'] & TextareaProps['ui']
}

export interface ChatPromptEmits {
  submit: [event: Event]
  close: [event: Event]
}

export interface ChatPromptSlots extends TextareaSlots {
  header(props?: {}): any
  footer(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { Primitive, useForwardProps } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useLocale } from '../composables/useLocale'
import { omit, transformUI } from '../utils'
import { tv } from '../utils/tv'
import UTextarea from './Textarea.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<ChatPromptProps>(), {
  as: 'form',
  autofocus: true,
  autoresize: true,
  rows: 1
})
const emits = defineEmits<ChatPromptEmits>()
const slots = defineSlots<ChatPromptSlots>()

const model = defineModel<string>({ default: '' })

const { t } = useLocale()
const appConfig = useAppConfig() as ChatPrompt['AppConfig']

const textareaProps = useForwardProps(reactivePick(props, 'autofocus', 'autoresize', 'rows'))

const getProxySlots = () => omit(slots, ['header', 'footer'])

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.chatPrompt || {}) })({
  variant: props.variant
}))

function submit(e: Event) {
  if (model.value.trim() === '') {
    return
  }

  emits('submit', e)
}

function blur(e: Event) {
  textarea.value?.textareaRef?.blur()

  emits('close', e)
}

const textarea = useTemplateRef('textarea')

defineExpose({
  textareaRef: textarea.value?.textareaRef
})
</script>

<template>
  <Primitive :as="as" :class="ui.root({ class: [props.ui?.root, props.class] })" @submit.prevent="submit">
    <div v-if="!!slots.header" :class="ui.header({ class: props.ui?.header })">
      <slot name="header" />
    </div>

    <UTextarea
      ref="textarea"
      v-model="model"
      :placeholder="placeholder || t('chatPrompt.placeholder')"
      :disabled="Boolean(error)"
      variant="none"
      v-bind="{ ...textareaProps, ...$attrs }"
      :ui="transformUI(omit(ui, ['root', 'body', 'header', 'footer']), props.ui)"
      :class="ui.body({ class: props.ui?.body })"
      @keydown.enter.exact.prevent="submit"
      @keydown.esc="blur"
    >
      <template v-for="(_, name) in getProxySlots()" #[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>
    </UTextarea>

    <div v-if="!!slots.footer" :class="ui.footer({ class: props.ui?.footer })">
      <slot name="footer" />
    </div>
  </Primitive>
</template>
