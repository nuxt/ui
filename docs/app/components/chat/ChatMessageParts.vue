<script setup lang="ts">
import type { UIMessage } from 'ai'

const props = defineProps<{
  message: UIMessage
}>()

const slots = defineSlots<{
  [key: string]: (props: { part: Record<string, any>, index: number, message: UIMessage, loading: boolean }) => any
}>()

const visibleParts = computed(() =>
  (props.message.parts || [])
    .map((part, index) => ({ part, index }))
    .filter(({ part }) => part.type !== 'reasoning')
)

function partKey(part: any, index: number) {
  return `${props.message.id}-${part.type}-${index}${'state' in part ? `-${part.state}` : ''}`
}

function isToolPart(part: any): boolean {
  return part.type.startsWith('tool-') || part.type === 'dynamic-tool'
}

function isToolLoading(part: any): boolean {
  return !('state' in part && part.state === 'output-available')
}

function resolveSlotName(part: any): string {
  if (slots[part.type]) return part.type
  if (isToolPart(part) && slots.tool) return 'tool'
  return part.type
}
</script>

<template>
  <template v-for="{ part, index } in visibleParts" :key="partKey(part, index)">
    <slot :name="resolveSlotName(part)" :part="(part as any)" :index="index" :message="message" :loading="isToolLoading(part)">
      <p v-if="part.type === 'text'" data-slot="text" class="whitespace-pre-wrap">
        {{ (part as any).text }}
      </p>
      <p v-else-if="isToolPart(part)" data-slot="tool" class="text-muted text-sm leading-6 my-1.5">
        <ChatShimmer v-if="isToolLoading(part)" text="Processing..." />
        <span v-else>Completed</span>
      </p>
    </slot>
  </template>
</template>
