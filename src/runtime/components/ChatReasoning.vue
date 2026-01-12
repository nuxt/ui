<script lang="ts">
import type { CollapsibleRootProps } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/chat-reasoning'
import type { IconProps } from '../types'
import type { ComponentConfig } from '../types/tv'

type ChatReasoning = ComponentConfig<typeof theme, AppConfig, 'chatReasoning'>

export interface ChatReasoningProps extends Pick<CollapsibleRootProps, 'defaultOpen' | 'open' | 'disabled' | 'unmountOnHide'> {
  /**
   * The reasoning text content to display.
   */
  text?: string
  /**
   * Whether the reasoning content is currently streaming.
   * @defaultValue false
   */
  isStreaming?: boolean
  /**
   * The duration in seconds that the AI spent reasoning.
   * If not provided, it will be calculated automatically based on streaming time.
   */
  duration?: number
  /**
   * The icon displayed on the left side of the trigger.
   * @defaultValue appConfig.ui.icons.chatReasoning
   * @IconifyIcon
   */
  icon?: IconProps['name']
  /**
   * The icon displayed on the right side of the trigger.
   * @defaultValue appConfig.ui.icons.chevronDown
   * @IconifyIcon
   */
  trailingIcon?: IconProps['name']
  /**
   * Optional function to customize the thinking message.
   * @param isStreaming - Whether reasoning is currently streaming
   * @param duration - Duration in seconds (undefined during streaming, calculated after)
   */
  getThinkingMessage?: (isStreaming: boolean, duration?: number) => string
  /**
   * The delay in milliseconds before auto-closing when streaming ends.
   * Set to 0 to disable auto-close.
   * @defaultValue 500
   */
  autoCloseDelay?: number
  class?: any
  ui?: ChatReasoning['slots']
}

export interface ChatReasoningEmits {
  'update:open': [value: boolean]
}

export interface ChatReasoningSlots {
  default(props: { open: boolean }): any
  trigger(props: { open: boolean, isStreaming: boolean, duration: number | undefined }): any
  body(props: { open: boolean }): any
  thinkingMessage(props: { isStreaming: boolean, duration: number | undefined }): any
}
</script>

<script setup lang="ts">
import { ref, computed, watch, useSlots, onUnmounted } from 'vue'
import { CollapsibleRoot, CollapsibleTrigger, CollapsibleContent } from 'reka-ui'
import { useAppConfig } from '#imports'
import { useLocale } from '../composables/useLocale'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'
import UChatShimmer from './ChatShimmer.vue'

const props = withDefaults(defineProps<ChatReasoningProps>(), {
  defaultOpen: false,
  isStreaming: false,
  unmountOnHide: true,
  autoCloseDelay: 500
})
const emits = defineEmits<ChatReasoningEmits>()
const slots = useSlots()

const { t } = useLocale()
const appConfig = useAppConfig() as ChatReasoning['AppConfig']

const hasContent = computed(() => {
  return !!props.text || !!slots.default || !!slots.body || props.isStreaming
})

const internalOpen = ref(props.open ?? (props.isStreaming ? true : props.defaultOpen))
const startTime = ref<number | null>(props.isStreaming ? Date.now() : null)
const internalDuration = ref<number | undefined>(undefined)
const autoCloseTimeout = ref<ReturnType<typeof setTimeout> | null>(null)

watch(() => props.isStreaming, (streaming, wasStreaming) => {
  if (streaming) {
    if (autoCloseTimeout.value) {
      clearTimeout(autoCloseTimeout.value)
      autoCloseTimeout.value = null
    }
    if (!wasStreaming) {
      internalOpen.value = true
      startTime.value = Date.now()
    }
  } else if (wasStreaming) {
    if (startTime.value !== null) {
      internalDuration.value = Math.ceil((Date.now() - startTime.value) / 1000)
      startTime.value = null
    }
    if (props.autoCloseDelay > 0) {
      autoCloseTimeout.value = setTimeout(() => {
        internalOpen.value = false
        autoCloseTimeout.value = null
      }, props.autoCloseDelay)
    }
  }
}, { immediate: true })

watch(() => props.open, (value) => {
  if (value !== undefined) {
    internalOpen.value = value
  }
})

const actualDuration = computed(() => props.duration ?? internalDuration.value)

function onOpenChange(value: boolean) {
  if (autoCloseTimeout.value) {
    clearTimeout(autoCloseTimeout.value)
    autoCloseTimeout.value = null
  }
  internalOpen.value = value
  emits('update:open', value)
}

onUnmounted(() => {
  if (autoCloseTimeout.value) {
    clearTimeout(autoCloseTimeout.value)
  }
})

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.chatReasoning || {}) })())

const thinkingMessage = computed(() => {
  if (props.getThinkingMessage) {
    return props.getThinkingMessage(props.isStreaming, actualDuration.value)
  }

  if (props.isStreaming || actualDuration.value === 0) {
    return t('chatReasoning.thinking')
  }
  if (actualDuration.value === undefined) {
    return t('chatReasoning.thoughtFewSeconds')
  }

  const duration = actualDuration.value
  if (duration < 60) {
    return t('chatReasoning.thoughtSeconds', { duration })
  }

  const minutes = Math.floor(duration / 60)
  return minutes === 1
    ? t('chatReasoning.thoughtMinute', { duration: minutes })
    : t('chatReasoning.thoughtMinutes', { duration: minutes })
})
</script>

<template>
  <CollapsibleRoot
    v-slot="{ open }"
    :open="internalOpen"
    :disabled="props.disabled"
    :unmount-on-hide="props.unmountOnHide"
    data-slot="root"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
    @update:open="onOpenChange"
  >
    <CollapsibleTrigger as-child :disabled="!hasContent">
      <slot name="trigger" :open="open" :is-streaming="isStreaming" :duration="actualDuration">
        <button
          type="button"
          data-slot="trigger"
          :class="ui.trigger({ class: props.ui?.trigger })"
        >
          <UIcon :name="props.icon" data-slot="leadingIcon" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />

          <slot name="thinkingMessage" :is-streaming="isStreaming" :duration="actualDuration">
            <UChatShimmer v-if="isStreaming" :text="thinkingMessage" />
            <span v-else>{{ thinkingMessage }}</span>
          </slot>

          <UIcon
            v-if="hasContent"
            :name="trailingIcon || appConfig.ui.icons.chevronDown"
            data-slot="trailingIcon"
            :class="ui.trailingIcon({ class: props.ui?.trailingIcon })"
          />
        </button>
      </slot>
    </CollapsibleTrigger>

    <CollapsibleContent data-slot="content" :class="ui.content({ class: props.ui?.content })">
      <div data-slot="body" :class="ui.body({ class: props.ui?.body })">
        <slot name="body" :open="open">
          <slot :open="open">
            {{ text }}
          </slot>
        </slot>
      </div>
    </CollapsibleContent>
  </CollapsibleRoot>
</template>
