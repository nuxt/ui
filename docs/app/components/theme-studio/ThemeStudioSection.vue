<script setup lang="ts">
/**
 * One settings section, folded behind a full-width trigger button (the
 * Semantic/Modifiers treatment). The help link and action toggles sit
 * beside the trigger as their own buttons — they stop the click so they
 * never toggle the fold; actions force it open instead, so what they
 * reveal is visible.
 */
const props = withDefaults(defineProps<{
  label: string
  /** Docs page the header's help icon links to */
  helpTo?: string
  defaultOpen?: boolean
}>(), {
  defaultOpen: true
})

const slots = defineSlots<{
  default: () => any
  /** Controls beside the trigger (edit/adjust toggles). */
  actions: () => any
}>()

const open = ref(props.defaultOpen)
</script>

<template>
  <UCollapsible v-model:open="open">
    <div class="flex items-center gap-1">
      <!-- Leading chevron: the disclosure cue that tells a fold trigger
           apart from a select (whose chevron trails). -->
      <UButton
        :label="label"
        :icon="open ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
        color="neutral"
        variant="ghost"
        size="sm"
        block
        active-variant="subtle"
        class="justify-start flex-1"
      />

      <UButton
        v-if="helpTo"
        :to="helpTo"
        size="sm"
        color="neutral"
        variant="ghost"
        icon="i-lucide-help-circle"
        aria-label="About this setting"
        @click.stop
      />

      <div v-if="!!slots.actions" class="flex items-center gap-1" @click.stop="open = true">
        <slot name="actions" />
      </div>
    </div>

    <template #content>
      <div class="pt-2">
        <slot />
      </div>
    </template>
  </UCollapsible>
</template>
