<script lang="ts" setup>
import theme from '#build/ui/repeater'

const variants = Object.keys(theme.variants.variant)
const sizes = Object.keys(theme.variants.size)

const variant = ref(theme.defaultVariants.variant as keyof typeof theme.variants.variant)
const size = ref(theme.defaultVariants.size as keyof typeof theme.variants.size)
const disabled = ref(false)
const dragEnabled = ref(true)
const sortButtons = ref(true)
const addButton = ref(true)
const removeButton = ref(true)

const items = ref([
  { task: 'Research Nuxt UI', status: 'done' },
  { task: 'Implement Repeater', status: 'in-progress' },
  { task: 'Write Tests', status: 'todo' }
])

const template = () => ({
  task: '',
  status: 'todo'
})

const statusOptions = ['todo', 'in-progress', 'done']
</script>

<template>
  <Navbar>
    <div class="flex items-center gap-2 overflow-x-auto py-2 px-4 no-scrollbar">
      <USelect v-model="variant" :items="variants" placeholder="Variant" class="w-32 shrink-0" />
      <USelect v-model="size" :items="sizes" placeholder="Size" class="w-24 shrink-0" />

      <div class="h-4 w-px bg-gray-200 dark:bg-gray-800 mx-2 shrink-0" />

      <div class="flex items-center gap-4 shrink-0">
        <USwitch v-model="dragEnabled" label="Drag" />
        <USwitch v-model="sortButtons" label="Sort" />
        <USwitch v-model="addButton" label="Add" />
        <USwitch v-model="removeButton" label="Remove" />
        <USwitch v-model="disabled" label="Disabled" />
      </div>
    </div>
  </Navbar>

  <div class="p-4 min-h-0 max-w-4xl w-full mx-auto">
    <URepeater
      v-model="items"
      :new-item-template="template"
      :variant="variant"
      :size="size"
      :disabled="disabled"
      :drag-enabled="dragEnabled"
      :sort-buttons="sortButtons"
      :add-button="addButton"
      :remove-button="removeButton"
      class="w-full"
    >
      <template #header="{ index }">
        <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Task #{{ index + 1 }}
        </span>
      </template>

      <template #default="{ item }">
        <div class="flex gap-2">
          <UInput v-model="item.task" placeholder="Enter task name..." class="flex-1" :disabled="disabled" />
          <USelect v-model="item.status" :items="statusOptions" class="w-32" :disabled="disabled" />
        </div>
      </template>

      <template #empty>
        <div class="text-center py-8 text-gray-400">
          <UIcon name="i-heroicons-clipboard-document-list" class="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No tasks found. Add a new one!</p>
        </div>
      </template>
    </URepeater>

    <div
      class="mt-8 p-4 rounded-lg bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 font-mono text-xs overflow-auto max-h-48"
    >
      <div class="text-gray-500 mb-2 font-bold">
        Model Value:
      </div>
      {{ items }}
    </div>
  </div>
</template>
