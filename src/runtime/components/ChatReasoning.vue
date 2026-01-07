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
   * The text displayed while streaming/thinking.
   * @defaultValue t('chatReasoning.thinking')
   */
  thinkingText?: string
  /**
   * The text displayed when thinking is complete (without duration).
   * @defaultValue t('chatReasoning.thoughtFewSeconds')
   */
  thoughtText?: string
  /**
   * The text displayed when thinking is complete (with duration).
   * Use {duration} as placeholder for the duration value.
   * @defaultValue t('chatReasoning.thoughtSeconds')
   */
  thoughtDurationText?: string
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
}
</script>

<script setup lang="ts">
import { ref, computed, watch, useSlots } from 'vue'
import { CollapsibleRoot, CollapsibleTrigger, CollapsibleContent, useForwardPropsEmits } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useLocale } from '../composables/useLocale'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'
import UChatShimmer from './ChatShimmer.vue'

const props = withDefaults(defineProps<ChatReasoningProps>(), {
  defaultOpen: false,
  isStreaming: false,
  unmountOnHide: true
})
const emits = defineEmits<ChatReasoningEmits>()
const slots = useSlots()

const { t } = useLocale()
const appConfig = useAppConfig() as ChatReasoning['AppConfig']

const rootProps = useForwardPropsEmits(reactivePick(props, 'defaultOpen', 'open', 'disabled', 'unmountOnHide'), emits)

const hasContent = computed(() => {
  return !!props.text || !!slots.default || !!slots.body
})

const streamingOpen = ref<boolean | null>(props.isStreaming ? true : null)

watch(() => props.isStreaming, (streaming, wasStreaming) => {
  if (streaming && !wasStreaming) {
    streamingOpen.value = true
  } else if (!streaming && wasStreaming) {
    setTimeout(() => {
      streamingOpen.value = false
      setTimeout(() => {
        streamingOpen.value = null
      }, 300)
    }, 500)
  }
})

const controlledOpen = computed(() => {
  if (streamingOpen.value !== null) return streamingOpen.value
  return undefined
})

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.chatReasoning || {}) })())

const thinkingMessage = computed(() => {
  if (props.isStreaming) {
    return props.thinkingText || t('chatReasoning.thinking')
  }
  if (props.duration === undefined) {
    return props.thoughtText || t('chatReasoning.thoughtFewSeconds')
  }
  const template = props.thoughtDurationText || t('chatReasoning.thoughtSeconds', { duration: props.duration })
  if (props.thoughtDurationText) {
    return template.replace('{duration}', String(props.duration))
  }
  return template
})
</script>

<template>
  <CollapsibleRoot
    v-slot="{ open }"
    v-bind="rootProps"
    :open="controlledOpen"
    data-slot="root"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
  >
    <CollapsibleTrigger as-child :disabled="!hasContent">
      <slot name="trigger" :open="open" :is-streaming="isStreaming" :duration="duration">
        <button
          type="button"
          data-slot="trigger"
          :class="ui.trigger({ class: props.ui?.trigger })"
        >
          <UIcon :name="props.icon" data-slot="leadingIcon" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />

          <UChatShimmer v-if="isStreaming" :text="thinkingMessage" />
          <span v-else>{{ thinkingMessage }}</span>

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
