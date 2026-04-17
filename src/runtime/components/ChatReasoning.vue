<script lang="ts">
import type { CollapsibleRootProps } from 'reka-ui'
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/chat-reasoning'
import type { IconProps } from '../types'
import type { ChatShimmerProps } from './ChatShimmer.vue'
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
  streaming?: boolean
  /**
   * The duration in seconds that the AI spent reasoning.
   * If not provided, it will be calculated automatically based on streaming time.
   */
  duration?: number
  /**
   * The icon displayed next to the trigger.
   * @IconifyIcon
   */
  icon?: IconProps['name']
  /**
   * The position of the chevron icon.
   * @defaultValue 'trailing'
   */
  chevron?: 'leading' | 'trailing'
  /**
   * The icon displayed as the chevron.
   * @defaultValue appConfig.ui.icons.chevronDown
   * @IconifyIcon
   */
  chevronIcon?: IconProps['name']
  /**
   * The delay in milliseconds before auto-closing when streaming ends.
   * Set to `0` to disable auto-close.
   * @defaultValue 500
   */
  autoCloseDelay?: number
  /**
   * Customize the [`ChatShimmer`](https://ui.nuxt.com/docs/components/chat-shimmer) component when streaming.
   */
  shimmer?: Partial<Omit<ChatShimmerProps, 'text'>>
  class?: any
  ui?: ChatReasoning['slots']
}

export interface ChatReasoningEmits {
  'update:open': [value: boolean]
}

export interface ChatReasoningSlots {
  default?(props: { open: boolean }): VNode[]
}
</script>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted, nextTick, useTemplateRef } from 'vue'
import { CollapsibleRoot, CollapsibleTrigger, CollapsibleContent } from 'reka-ui'
import { useAppConfig } from '#imports'
import { useComponentUI } from '../composables/useComponentUI'
import { useLocale } from '../composables/useLocale'
import { useScrollShadow } from '../composables/useScrollShadow'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'
import UChatShimmer from './ChatShimmer.vue'

const props = withDefaults(defineProps<ChatReasoningProps>(), {
  open: undefined,
  streaming: false,
  chevron: 'trailing',
  unmountOnHide: false,
  autoCloseDelay: 500
})
const emits = defineEmits<ChatReasoningEmits>()
defineSlots<ChatReasoningSlots>()

const { t, code } = useLocale()
const appConfig = useAppConfig() as ChatReasoning['AppConfig']
const uiProp = useComponentUI('chatReasoning', props)

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.chatReasoning || {}) })({
  chevron: props.chevron
}))

const isControlled = computed(() => props.open !== undefined)
const internalOpen = ref(props.defaultOpen ?? props.streaming)
const startTime = ref<number | null>(props.streaming ? Date.now() : null)
const internalDuration = ref<number | undefined>(undefined)
const autoCloseTimeout = ref<ReturnType<typeof setTimeout> | null>(null)

watch(() => props.streaming, (streaming, wasStreaming) => {
  if (streaming) {
    if (autoCloseTimeout.value) {
      clearTimeout(autoCloseTimeout.value)
      autoCloseTimeout.value = null
    }
    if (!wasStreaming) {
      setOpen(true)
      startTime.value = Date.now()
    }
  } else if (wasStreaming) {
    if (startTime.value !== null) {
      internalDuration.value = Math.ceil((Date.now() - startTime.value) / 1000)
      startTime.value = null
    }
    if (props.autoCloseDelay > 0) {
      autoCloseTimeout.value = setTimeout(() => {
        setOpen(false)
      }, props.autoCloseDelay)
    }
  }
}, { immediate: true })

const actualDuration = computed(() => props.duration ?? internalDuration.value)

const thinkingText = computed(() => {
  if (props.streaming || actualDuration.value === 0) {
    return t('chatReasoning.thinking')
  }
  if (actualDuration.value === undefined) {
    return t('chatReasoning.thought')
  }

  const d = actualDuration.value
  const unit = d < 60 ? 'second' : 'minute'
  const value = d < 60 ? d : Math.floor(d / 60)
  const duration = new Intl.NumberFormat(code.value, { style: 'unit', unit, unitDisplay: 'long' }).format(value)

  return t('chatReasoning.thoughtFor', { duration })
})

const resolvedOpen = computed(() => isControlled.value ? props.open : internalOpen.value)

function setOpen(value: boolean) {
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

const hasContent = computed(() => !!props.text || props.streaming)

const chevronIconName = computed(() => props.chevronIcon || appConfig.ui.icons?.chevronDown)

const bodyRef = useTemplateRef('bodyRef')
const { style: scrollShadowStyle } = useScrollShadow(bodyRef)

watch(() => props.text, () => {
  if (!props.streaming || !bodyRef.value) return

  const el = bodyRef.value
  const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight

  if (distanceFromBottom < 50) {
    nextTick(() => {
      el.scrollTop = el.scrollHeight
    })
  }
})
</script>

<template>
  <CollapsibleRoot
    v-if="hasContent"
    v-slot="{ open: isOpen }"
    :open="resolvedOpen"
    :disabled="disabled"
    :unmount-on-hide="unmountOnHide"
    data-slot="root"
    :class="ui.root({ class: [uiProp?.root, props.class] })"
    @update:open="setOpen"
  >
    <CollapsibleTrigger as-child :disabled="!hasContent">
      <button
        type="button"
        data-slot="trigger"
        :class="ui.trigger({ class: uiProp?.trigger })"
      >
        <span v-if="icon || (hasContent && chevron === 'leading')" data-slot="leading" :class="ui.leading({ class: uiProp?.leading })">
          <UIcon
            v-if="icon"
            :name="icon"
            data-slot="leadingIcon"
            :class="ui.leadingIcon({ class: uiProp?.leadingIcon, alone: !(hasContent && chevron === 'leading') })"
          />
          <UIcon
            v-if="hasContent && chevron === 'leading'"
            :name="chevronIconName"
            data-slot="chevronIcon"
            :class="ui.chevronIcon({ class: uiProp?.chevronIcon, alone: !icon })"
          />
        </span>

        <UChatShimmer v-if="streaming" :text="thinkingText" v-bind="props.shimmer" data-slot="label" :class="ui.label({ class: uiProp?.label })" />
        <span v-else data-slot="label" :class="ui.label({ class: uiProp?.label })">{{ thinkingText }}</span>

        <UIcon
          v-if="hasContent && chevron === 'trailing'"
          :name="chevronIconName"
          data-slot="trailingIcon"
          :class="ui.trailingIcon({ class: uiProp?.trailingIcon })"
        />
      </button>
    </CollapsibleTrigger>

    <CollapsibleContent data-slot="content" :class="ui.content({ class: uiProp?.content })">
      <div ref="bodyRef" data-slot="body" :class="ui.body({ class: uiProp?.body })" :style="scrollShadowStyle">
        <slot :open="isOpen">
          {{ text }}
        </slot>
      </div>
    </CollapsibleContent>
  </CollapsibleRoot>
</template>
