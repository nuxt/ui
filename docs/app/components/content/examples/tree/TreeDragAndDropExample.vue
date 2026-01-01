<script setup lang="ts">
import type { TreeItem } from '@nuxt/ui'
import { useSortable } from '@vueuse/integrations/useSortable'

const items = shallowRef<TreeItem[]>([
  {
    label: 'app/',
    defaultExpanded: true,
    children: [
      {
        label: 'composables/',
        children: [
          { label: 'useAuth.ts', icon: 'i-vscode-icons-file-type-typescript' },
          { label: 'useUser.ts', icon: 'i-vscode-icons-file-type-typescript' }
        ]
      },
      {
        label: 'components/',
        defaultExpanded: true,
        children: [
          { label: 'Card.vue', icon: 'i-vscode-icons-file-type-vue' },
          { label: 'Button.vue', icon: 'i-vscode-icons-file-type-vue' }
        ]
      }
    ]
  },
  { label: 'app.vue', icon: 'i-vscode-icons-file-type-vue' },
  { label: 'nuxt.config.ts', icon: 'i-vscode-icons-file-type-nuxt' }
])

function flatten(items: TreeItem[], parent = items): { item: TreeItem, parent: TreeItem[], index: number }[] {
  return items.flatMap((item, index) => [
    { item, parent, index },
    ...(item.children?.length && item.defaultExpanded ? flatten(item.children, item.children) : [])
  ])
}

function moveItem(oldIndex: number, newIndex: number) {
  if (oldIndex === newIndex) return

  const flat = flatten(items.value)
  const source = flat[oldIndex]
  const target = flat[newIndex]

  if (!source || !target) return

  const [moved] = source.parent.splice(source.index, 1)
  if (!moved) return

  const updatedFlat = flatten(items.value)
  const updatedTarget = updatedFlat.find(({ item }) => item === target.item)
  if (!updatedTarget) return

  const insertIndex = oldIndex < newIndex ? updatedTarget.index + 1 : updatedTarget.index
  updatedTarget.parent.splice(insertIndex, 0, moved)
}

const tree = useTemplateRef<HTMLElement>('tree')

useSortable(tree, items, {
  animation: 150,
  ghostClass: 'opacity-50',
  onUpdate: (e: any) => moveItem(e.oldIndex, e.newIndex)
})
</script>

<template>
  <UTree ref="tree" :nested="false" :unmount-on-hide="false" :items="items" />
</template>
