<script setup lang="ts">
import { CollapsibleRoot, CollapsibleTrigger, CollapsibleContent } from 'reka-ui'

const props = withDefaults(defineProps<{
  text?: string
  isStreaming?: boolean
  duration?: number
  icon?: string
  autoCloseDelay?: number
}>(), {
  isStreaming: false,
  autoCloseDelay: 500
})

defineEmits<{
  'update:open': [value: boolean]
}>()

const appConfig = useAppConfig()

const internalOpen = ref(props.isStreaming)
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

const actualDuration = computed(() => props.duration ?? internalDuration.value)

const thinkingMessage = computed(() => {
  if (props.isStreaming || actualDuration.value === 0) {
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

const hasContent = computed(() => !!props.text || props.isStreaming)
</script>

<template>
  <CollapsibleRoot
    v-slot="{ open }"
    :open="internalOpen"
    :unmount-on-hide="true"
    data-slot="reasoning"
    class="my-1.5"
    @update:open="onOpenChange"
  >
    <CollapsibleTrigger
      as-child
      :disabled="!hasContent"
    >
      <button
        type="button"
        data-slot="reasoning-trigger"
        class="group flex w-full items-center gap-2 text-muted text-sm hover:text-default cursor-pointer disabled:cursor-default disabled:hover:text-muted transition-colors"
      >
        <UIcon :name="icon" class="size-4 shrink-0" />

        <ChatShimmer v-if="isStreaming" :text="thinkingMessage" />
        <span v-else>{{ thinkingMessage }}</span>

        <UIcon
          v-if="hasContent"
          :name="(appConfig.ui as any).icons?.chevronDown || 'i-lucide-chevron-down'"
          class="size-4 shrink-0 group-data-[state=open]:rotate-180 transition-transform duration-200"
        />
      </button>
    </CollapsibleTrigger>

    <CollapsibleContent
      data-slot="reasoning-content"
      class="data-[state=open]:animate-[collapsible-down_200ms_ease-out] data-[state=closed]:animate-[collapsible-up_200ms_ease-out] overflow-hidden"
    >
      <div data-slot="reasoning-body" class="pt-2 text-sm text-muted whitespace-pre-wrap">
        <slot :open="open">
          {{ text }}
        </slot>
      </div>
    </CollapsibleContent>
  </CollapsibleRoot>
</template>
