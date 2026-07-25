<script setup lang="ts">
/**
 * A popover + listbox picker: subtle trigger button, rich rows (slots can
 * restyle labels or add description strips), closes on pick. The listbox
 * root drops its own ring — it would double the popover's chrome.
 */
export interface ListPickerItem {
  label: string
  value: string
  [key: string]: unknown
}

const props = defineProps<{
  items: ListPickerItem[]
  icon?: string
  ariaLabel?: string
}>()

const model = defineModel<string>({ required: true })

const open = ref(false)
const selected = computed(() => props.items.find(item => item.value === model.value))
</script>

<template>
  <UPopover v-model:open="open" :content="{ align: 'start' }">
    <UButton
      color="neutral"
      variant="subtle"
      size="sm"
      block
      :icon="icon"
      trailing-icon="i-lucide-chevron-down"
      :ui="{ label: 'flex-1 text-left truncate' }"
      :aria-label="ariaLabel"
    >
      <slot name="trigger" :selected="selected">
        {{ selected?.label }}
      </slot>
    </UButton>

    <template #content>
      <UListbox
        v-model="model"
        :items="items"
        value-key="value"
        class="w-72"
        :ui="{ root: 'ring-0 rounded-md', content: 'max-h-80' }"
        @update:model-value="open = false"
      >
        <template v-if="$slots['item-label']" #item-label="scope">
          <slot name="item-label" v-bind="scope" />
        </template>

        <template v-if="$slots['item-description']" #item-description="scope">
          <slot name="item-description" v-bind="scope" />
        </template>
      </UListbox>
    </template>
  </UPopover>
</template>
