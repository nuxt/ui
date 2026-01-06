<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/reasoning'
import type { IconProps } from '../types'
import type { ComponentConfig } from '../types/tv'

type Reasoning = ComponentConfig<typeof theme, AppConfig, 'reasoning'>

export interface ReasoningProps {
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
   * Whether the collapsible is open by default.
   * @defaultValue false
   */
  defaultOpen?: boolean
  /**
   * The icon displayed in the trigger.
   * @defaultValue appConfig.ui.icons.reasoning
   * @IconifyIcon
   */
  icon?: IconProps['name']
  /**
   * The text displayed while streaming/thinking.
   * @defaultValue t('reasoning.thinking')
   */
  thinkingText?: string
  /**
   * The text displayed when thinking is complete (without duration).
   * @defaultValue t('reasoning.thoughtFewSeconds')
   */
  thoughtText?: string
  /**
   * The text displayed when thinking is complete (with duration).
   * Use {duration} as placeholder for the duration value.
   * @defaultValue t('reasoning.thoughtSeconds')
   */
  thoughtDurationText?: string
  class?: any
  ui?: Reasoning['slots']
}

export interface ReasoningEmits {
  'update:open': [value: boolean]
}

export interface ReasoningSlots {
  default(props: { open: boolean }): any
  trigger(props: { open: boolean, isStreaming: boolean, duration: number | undefined }): any
  body(props: { open: boolean }): any
}
</script>

<script setup lang="ts">
import { ref, computed, watch, useSlots } from 'vue'
import { useAppConfig } from '#imports'
import { useLocale } from '../composables/useLocale'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'
import UShimmer from './Shimmer.vue'

const props = withDefaults(defineProps<ReasoningProps>(), {
  defaultOpen: false,
  isStreaming: false
})
const emits = defineEmits<ReasoningEmits>()
const slots = useSlots()

const { t } = useLocale()
const appConfig = useAppConfig() as Reasoning['AppConfig']

// Check if there's content to display
const hasContent = computed(() => {
  return !!props.text || !!slots.default || !!slots.body
})

// Open state
const isOpen = ref(props.defaultOpen)

// Auto-open when streaming starts, auto-close when it ends
watch(() => props.isStreaming, (streaming, wasStreaming) => {
  if (streaming && hasContent.value) {
    // Open when streaming starts
    isOpen.value = true
    emits('update:open', true)
  } else if (wasStreaming === true && !streaming) {
    // Close when streaming ends (with a small delay)
    setTimeout(() => {
      isOpen.value = false
      emits('update:open', false)
    }, 500)
  }
}, { immediate: true })

function toggle() {
  if (hasContent.value) {
    isOpen.value = !isOpen.value
    emits('update:open', isOpen.value)
  }
}

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.reasoning || {}) })())

const thinkingMessage = computed(() => {
  if (props.isStreaming) {
    return props.thinkingText || t('reasoning.thinking')
  }
  if (props.duration === undefined) {
    return props.thoughtText || t('reasoning.thoughtFewSeconds')
  }
  const template = props.thoughtDurationText || t('reasoning.thoughtSeconds', { duration: props.duration })
  if (props.thoughtDurationText) {
    return template.replace('{duration}', String(props.duration))
  }
  return template
})
</script>

<template>
  <div
    data-slot="root"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
  >
    <slot name="trigger" :open="isOpen" :is-streaming="isStreaming" :duration="duration">
      <button
        type="button"
        data-slot="trigger"
        :class="ui.trigger({ class: props.ui?.trigger })"
        :disabled="!hasContent"
        @click="toggle"
      >
        <UIcon :name="props.icon" data-slot="triggerIcon" :class="ui.triggerIcon({ class: props.ui?.triggerIcon })" />

        <UShimmer v-if="isStreaming" :text="thinkingMessage" />
        <span v-else>{{ thinkingMessage }}</span>

        <UIcon
          v-if="hasContent"
          :name="appConfig.ui.icons.chevronDown"
          :data-state="isOpen ? 'open' : 'closed'"
          data-slot="triggerChevron"
          :class="ui.triggerChevron({ class: props.ui?.triggerChevron })"
        />
      </button>
    </slot>

    <div
      v-if="hasContent"
      v-show="isOpen"
      data-slot="content"
      :class="ui.content({ class: props.ui?.content })"
    >
      <div data-slot="body" :class="ui.body({ class: props.ui?.body })">
        <slot name="body" :open="isOpen">
          <slot :open="isOpen">
            {{ text }}
          </slot>
        </slot>
      </div>
    </div>
  </div>
</template>
