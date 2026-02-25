<script setup lang="ts">
import type { UIMessage } from 'ai'
import { CollapsibleRoot, CollapsibleTrigger, CollapsibleContent } from 'reka-ui'
import { useScroll } from '@vueuse/core'

const props = withDefaults(defineProps<{
  message: UIMessage
  streaming?: boolean
  duration?: number
  icon?: string
  /**
   * The position of the chevron icon.
   * @defaultValue 'trailing'
   */
  chevron?: 'leading' | 'trailing'
  /**
   * The icon used for the chevron.
   * @defaultValue appConfig.ui.icons.chevronDown
   * @IconifyIcon
   */
  chevronIcon?: string
  autoCloseDelay?: number
}>(), {
  streaming: false,
  chevron: 'trailing',
  autoCloseDelay: 500
})

const reasoningText = computed(() => {
  return (props.message.parts || [])
    .filter((p: any) => p.type === 'reasoning')
    .map((p: any) => p.text)
    .join('\n\n')
})

const hasReasoning = computed(() => {
  return (props.message.parts || []).some((p: any) => p.type === 'reasoning')
})

const isStreaming = computed(() => {
  if (!props.streaming) return false
  const lastPart = props.message.parts?.at(-1)
  return lastPart?.type === 'reasoning'
})

defineEmits<{
  'update:open': [value: boolean]
}>()

const appConfig = useAppConfig()

const internalOpen = ref(isStreaming.value)
const startTime = ref<number | null>(isStreaming.value ? Date.now() : null)
const internalDuration = ref<number | undefined>(undefined)
const autoCloseTimeout = ref<ReturnType<typeof setTimeout> | null>(null)

watch(isStreaming, (streaming, wasStreaming) => {
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

const actualDuration = computed(() => props.duration ?? internalDuration.value)

const thinkingMessage = computed(() => {
  if (isStreaming.value || actualDuration.value === 0) {
    return 'Thinking...'
  }
  if (actualDuration.value === undefined) {
    return 'Thought for a few seconds'
  }

  const d = actualDuration.value
  if (d < 60) {
    return `Thought for ${d} second${d === 1 ? '' : 's'}`
  }

  const minutes = Math.floor(d / 60)
  return `Thought for ${minutes} minute${minutes === 1 ? '' : 's'}`
})

function onOpenChange(value: boolean) {
  if (autoCloseTimeout.value) {
    clearTimeout(autoCloseTimeout.value)
    autoCloseTimeout.value = null
  }
  internalOpen.value = value
}

onUnmounted(() => {
  if (autoCloseTimeout.value) {
    clearTimeout(autoCloseTimeout.value)
  }
})

const hasContent = computed(() => !!reasoningText.value || isStreaming.value)

const chevronIconName = computed(() => props.chevronIcon || appConfig.ui.icons?.chevronDown)

const bodyRef = ref<HTMLElement>()
const { arrivedState } = useScroll(bodyRef)
const isOverflowing = ref(false)

useResizeObserver(bodyRef, (entries) => {
  const el = entries[0]?.target as HTMLElement | undefined
  if (el) {
    isOverflowing.value = el.scrollHeight > el.clientHeight
  }
})
</script>

<template>
  <CollapsibleRoot
    v-if="hasReasoning"
    v-slot="{ open }"
    :open="internalOpen"
    :unmount-on-hide="true"
    data-slot="root"
    @update:open="onOpenChange"
  >
    <CollapsibleTrigger
      as-child
      :disabled="!hasContent"
    >
      <button
        type="button"
        data-slot="trigger"
        class="group flex w-full items-center gap-1.5 text-muted hover:text-default text-sm cursor-pointer disabled:cursor-default disabled:hover:text-muted transition-colors focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <span v-if="hasContent && chevron === 'leading'" class="relative size-4 shrink-0">
          <UIcon
            :name="icon"
            class="absolute inset-0 size-4 transition-opacity group-hover:opacity-0 group-data-[state=open]:opacity-0"
          />
          <UIcon
            :name="chevronIconName"
            class="absolute inset-0 size-4 opacity-0 transition-all group-hover:opacity-100 group-data-[state=open]:opacity-100 group-data-[state=open]:rotate-180"
          />
        </span>
        <UIcon v-else :name="icon" class="size-4 shrink-0" />

        <ChatShimmer v-if="isStreaming" :text="thinkingMessage" />
        <span v-else>{{ thinkingMessage }}</span>

        <UIcon
          v-if="hasContent && chevron === 'trailing'"
          :name="chevronIconName"
          class="size-4 shrink-0 group-data-[state=open]:rotate-180 transition-transform duration-200"
        />
      </button>
    </CollapsibleTrigger>

    <CollapsibleContent
      data-slot="content"
      class="data-[state=open]:animate-[collapsible-down_200ms_ease-out] data-[state=closed]:animate-[collapsible-up_200ms_ease-out] overflow-hidden"
    >
      <div class="relative pt-2">
        <div v-if="isOverflowing && !arrivedState.top" class="absolute inset-x-0 top-2 h-6 bg-linear-to-b from-default to-transparent pointer-events-none" />
        <div ref="bodyRef" data-slot="body" class="max-h-[200px] overflow-y-auto text-sm text-muted whitespace-pre-wrap">
          <slot :open="open">
            {{ reasoningText }}
          </slot>
        </div>
        <div v-if="isOverflowing && !arrivedState.bottom" class="absolute inset-x-0 bottom-0 h-6 bg-linear-to-t from-default to-transparent pointer-events-none" />
      </div>
    </CollapsibleContent>
  </CollapsibleRoot>
</template>
