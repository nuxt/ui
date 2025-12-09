<script setup lang="ts">
import type { TreeItem } from '@nuxt/ui'
import theme from '#build/ui/tree'

const colors = Object.keys(theme.variants.color)
const sizes = Object.keys(theme.variants.size)

const attrs = reactive({
  color: [theme.defaultVariants.color],
  size: [theme.defaultVariants.size]
})

const nested = ref(true)
const virtualize = ref(false)

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

const largeItems = Array(1000).fill(0).map((_, i) => ({
  label: `Item ${i + 1}`,
  icon: 'i-lucide-file',
  children: [
    { label: `Child ${i + 1}-1`, icon: 'i-lucide-file-text' },
    { label: `Child ${i + 1}-2`, icon: 'i-lucide-file-text' }
  ]
})) satisfies TreeItem[]

const modelValue = ref<(typeof items)[number]>()
const modelValues = ref<(typeof items)>([items[items.length - 2]!])
const modelValueWithMappedId = ref<(typeof itemsWithMappedId)[number]>()
</script>

<template>
  <Navbar>
    <USwitch v-model="nested" label="Nested" />
    <USwitch v-model="virtualize" label="Virtualize" />
    <USelect v-model="attrs.color" :items="colors" placeholder="Color" multiple />
    <USelect v-model="attrs.size" :items="sizes" placeholder="Size" multiple />
  </Navbar>

  <Matrix v-slot="props" :attrs="attrs" container-class="w-60">
    <UTree
      v-if="virtualize"
      virtualize
      :items="largeItems"
      :nested="nested"
      v-bind="props"
      class="w-full h-80"
    />

    <UTree
      v-else
      v-model="modelValues"
      :items="items"
      :nested="nested"
      multiple
      v-bind="props"
      class="w-full"
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
