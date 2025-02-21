<script setup lang="ts">
import type { TreeItem } from '@nuxt/ui'
import theme from '#build/ui/tree'

const colors = Object.keys(theme.variants.color) as Array<keyof typeof theme.variants.color>
const sizes = Object.keys(theme.variants.size) as Array<keyof typeof theme.variants.size>

const color = ref(theme.defaultVariants.color)
const size = ref(theme.defaultVariants.size)

const items: TreeItem[] = [
  {
    label: 'app',
    defaultExpanded: true,
    slot: 'app',
    children: [{
      label: 'composables',
      defaultExpanded: true,
      children: [
        { label: 'useAuth.ts', icon: 'i-vscode-icons-file-type-typescript' },
        { label: 'useUser.ts', icon: 'i-vscode-icons-file-type-typescript' }
      ]
    }, {
      label: 'components',
      children: [{
        label: 'Home',
        children: [
          { label: 'Card.vue', icon: 'i-vscode-icons-file-type-vue' },
          { label: 'Button.vue', icon: 'i-vscode-icons-file-type-vue' }
        ]
      }]
    }]
  },
  { label: 'app.vue', icon: 'i-vscode-icons-file-type-vue' },
  { label: 'nuxt.config.ts', icon: 'i-vscode-icons-file-type-nuxt' }
]

const itemsWithMappedId = [
  { id: 'id', title: 'hello' },
  { id: 'id2', title: 'there' },
  { id: 'id3', title: 'obiwan kenobi' }
]

const modelValue = ref<TreeItem>()
const modelValues = ref<TreeItem[]>([])
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-2">
      <USelect v-model="color" :items="colors" placeholder="Color" />
      <USelect v-model="size" :items="sizes" placeholder="Size" />
    </div>

    <UTree
      v-model="modelValues"
      :items="items"
      :color="color"
      :size="size"
      expanded-icon="i-lucide-chevron-up"
      collapsed-icon="i-lucide-chevron-down"
      multiple
    />

    <!-- Typescript tests -->
    <template v-if="false">
      <!-- @vue-expect-error - multiple props should type modelValue to array.  -->
      <UTree :model-value="modelValue" :items="items" multiple />
      <!-- @vue-expect-error - multiple props should type defaultValue to array.  -->
      <UTree :default-value="modelValue" :items="items" multiple />
      <!-- @vue-expect-error - multiple props should type @update:modelValue to array.  -->
      <UTree :items="items" multiple @update:model-value="(payload: TreeItem) => payload" />
      <!-- @vue-expect-error - default should type modelValue to single item.  -->
      <UTree :model-value="modelValues" :items="items" />
      <!-- @vue-expect-error - default should type defaultValue to single item.  -->
      <UTree :default-value="modelValues" :items="items" />
      <!-- @vue-expect-error - default should type @update:modelValue to single item.  -->
      <UTree :items="items" @update:model-value="(payload: TreeItem[]) => payload" />

      <!-- @vue-expect-error - value key should type v-model.  -->
      <UTree v-model="modelValue" :items="itemsWithMappedId" value-key="id" />
      <!-- @vue-expect-error - label key should type v-model.  -->
      <UTree v-model="modelValue" :items="itemsWithMappedId" label-key="title" />
    </template>
  </div>
</template>
