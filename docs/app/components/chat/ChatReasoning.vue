<script setup lang="ts">
import { CollapsibleRoot, CollapsibleTrigger, CollapsibleContent } from 'reka-ui'
import { useScroll, useResizeObserver } from '@vueuse/core'

const props = withDefaults(defineProps<{
  text?: string
  streaming?: boolean
  open?: boolean
  defaultOpen?: boolean
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
  class?: any
}>(), {
  open: undefined,
  streaming: false,
  chevron: 'trailing',
  autoCloseDelay: 500
})

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const appConfig = useAppConfig()

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

const thinkingMessage = computed(() => {
  if (props.streaming || actualDuration.value === 0) {
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

const resolvedOpen = computed(() => isControlled.value ? props.open : internalOpen.value)

function setOpen(value: boolean) {
  if (autoCloseTimeout.value) {
    clearTimeout(autoCloseTimeout.value)
    autoCloseTimeout.value = null
  }
  internalOpen.value = value
  emit('update:open', value)
}

onUnmounted(() => {
  if (autoCloseTimeout.value) {
    clearTimeout(autoCloseTimeout.value)
  }
})

const hasContent = computed(() => !!props.text || props.streaming)

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

watch(() => props.text, () => {
  if (props.streaming && bodyRef.value && arrivedState.bottom) {
    nextTick(() => {
      bodyRef.value!.scrollTop = bodyRef.value!.scrollHeight
    })
  }
})
</script>

<template>
  <CollapsibleRoot
    v-if="hasContent"
    v-slot="{ open: isOpen }"
    :open="resolvedOpen"
    :unmount-on-hide="false"
    data-slot="root"
    :class="props.class"
    @update:open="setOpen"
  >
    <CollapsibleTrigger as-child :disabled="!hasContent">
      <button
        type="button"
        data-slot="trigger"
        class="group flex w-full items-center gap-1.5 text-muted hover:text-default text-sm cursor-pointer disabled:cursor-default disabled:hover:text-muted transition-colors focus-visible:outline-offset-2 focus-visible:outline-primary min-w-0"
      >
        <span v-if="hasContent && chevron === 'leading' && icon" class="relative size-4 shrink-0">
          <UIcon
            :name="icon"
            class="absolute inset-0 size-4 transition-opacity group-hover:opacity-0 group-data-[state=open]:opacity-0 duration-200"
          />
          <UIcon
            :name="chevronIconName"
            class="absolute inset-0 size-4 opacity-0 transition-all group-hover:opacity-100 group-data-[state=open]:opacity-100 group-data-[state=open]:rotate-180 duration-200"
          />
        </span>
        <UIcon
          v-else-if="hasContent && chevron === 'leading'"
          :name="chevronIconName"
          class="size-4 shrink-0 group-data-[state=open]:rotate-180 transition-transform duration-200"
        />
        <UIcon v-else-if="icon" :name="icon" class="size-4 shrink-0" />

        <UChatShimmer v-if="streaming" :label="thinkingMessage" class="truncate" />
        <span v-else class="truncate">{{ thinkingMessage }}</span>

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
        <div ref="bodyRef" data-slot="body" class="max-h-[200px] overflow-y-auto text-sm text-dimmed whitespace-pre-wrap">
          <slot :open="isOpen" :reasoning-text="text || ''">
            {{ text }}
          </slot>
        </div>
        <div v-if="isOverflowing && !arrivedState.bottom" class="absolute inset-x-0 bottom-0 h-6 bg-linear-to-t from-default to-transparent pointer-events-none" />
      </div>
    </CollapsibleContent>
  </CollapsibleRoot>
</template>
