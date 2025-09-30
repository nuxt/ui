<script setup lang="ts">
import type { TreeItem } from '@nuxt/ui'
import theme from '#build/ui/tree'

const colors = Object.keys(theme.variants.color)
const sizes = Object.keys(theme.variants.size)

const attrs = reactive({
  color: [theme.defaultVariants.color],
  size: [theme.defaultVariants.size]
})

const items = [
  {
    label: 'app',
    defaultExpanded: true,
    slot: 'app' as const,
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
] satisfies TreeItem[]

const itemsWithMappedId = [
  { id: 'id', title: 'hello' },
  { id: 'id2', title: 'there' },
  { id: 'id3', title: 'obiwan kenobi' }
]

const modelValue = ref<(typeof items)[number]>()
const modelValues = ref<(typeof items)>([items[items.length - 2]!])
const modelValueWithMappedId = ref<(typeof itemsWithMappedId)[number]>()
</script>

<template>
  <Navbar>
    <USelect v-model="attrs.color" :items="colors" placeholder="Color" multiple />
    <USelect v-model="attrs.size" :items="sizes" placeholder="Size" multiple />
  </Navbar>

  <Matrix v-slot="props" :attrs="attrs">
    <UTree
      v-model="modelValues"
      :items="items"
      expanded-icon="i-lucide-chevron-up"
      collapsed-icon="i-lucide-chevron-down"
      multiple
      v-bind="props"
    />
  </Matrix>

  <!-- Typescript tests -->
  <template v-if="false">
    <UTree :model-value="modelValues" :items="items" multiple />
    <UTree :default-value="modelValues" :items="items" multiple />
    <UTree :items="items" multiple @update:model-value="(payload) => payload" />
    <UTree :model-value="modelValue" :items="items" />
    <UTree :default-value="modelValue" :items="items" />
    <UTree :items="items" @update:model-value="(payload) => payload" />

    <UTree v-model="modelValueWithMappedId" :items="itemsWithMappedId" :get-key="(i) => i.id" />
    <UTree v-model="modelValueWithMappedId" :items="itemsWithMappedId" label-key="title" />
  </template>
</template>
