<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/prose/code-tree'
import type { ComponentConfig } from '../../types/tv'

type ProseCodeTree = ComponentConfig<typeof theme, AppConfig, 'codeTree', 'ui.prose'>

type TreeNode = {
  label: string
  path: string
  children?: TreeNode[]
}

type TreeItem = {
  label: string
  icon?: string
  component: any
}

export interface ProseCodeTreeProps {
  items?: TreeItem[]
  /**
   * The selected path.
   * @example 'package.json'
   */
  modelValue?: string
  /**
   * The default path to select.
   * @example 'package.json'
   */
  defaultValue?: string
  /**
   * Expand all directories by default.
   * @defaultValue false
   */
  expandAll?: boolean
  class?: any
  ui?: ProseCodeTree['slots']
}

export interface ProseCodeTreeEmits {
  'update:modelValue': [value: string | undefined]
}

export interface ProseCodeTreeSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import { TreeRoot, TreeItem } from 'reka-ui'
import { createReusableTemplate } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useComponentUI } from '../../composables/useComponentUI'
import { tv } from '../../utils/tv'
import UCodeIcon from './CodeIcon.vue'
import UIcon from '../Icon.vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<ProseCodeTreeProps>()
const emits = defineEmits<ProseCodeTreeEmits>()
const slots = defineSlots<ProseCodeTreeSlots>()

const appConfig = useAppConfig() as ProseCodeTree['AppConfig']
const uiProp = useComponentUI('prose.codeTree', props)

const [DefineTreeTemplate, ReuseTreeTemplate] = createReusableTemplate<{ items: TreeNode[], level: number }>()

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.codeTree || {}) })())

const initialPath = props.modelValue ?? props.defaultValue
const model = ref(initialPath ? { path: initialPath } : undefined)
const lastSelectedItem = ref()

watch(model, (value) => {
  if (value?.path !== props.modelValue) {
    emits('update:modelValue', value?.path)
  }
})
watch(() => props.modelValue, (value) => {
  if (value === model.value?.path) return

  model.value = value ? { path: value } : undefined
  // Expand the tree to show the selected item
  const pathsToExpand = getExpandedPaths(value)
  for (const path of pathsToExpand) {
    if (!expanded.value.includes(path)) {
      expanded.value.push(path)
    }
  }
})
// Slot children are collected and transformed via getTreeItems(), called from the
// template (render function). This ensures slots.default?.() is invoked during the
// render phase, avoiding:
// "[Vue warn]: Slot "default" invoked outside of the render function"
// Mutable state is wrapped inside the IIFE closure to prevent Vue from exposing it
// to the template context, which would cause devalue serialization errors during SSR
// (VNodes are non-POJO objects).
const { getTreeItems, getFlatItems } = (() => {
  let flatItems: TreeItem[] = []
  let treeItems: TreeNode[] = []
  let prevLabels = ''

  function getTreeItems() {
    const newFlatItems: TreeItem[] = props.items || slots.default?.()?.flatMap(transformSlot).filter(Boolean) || []
    const newLabels = newFlatItems.map(i => i.label).join('\n')

    if (newLabels !== prevLabels) {
      // Re-expand all when flatItems actually change and expandAll is true
      if (prevLabels && props.expandAll) {
        expanded.value = getExpandedPaths(undefined, newFlatItems)
      }

      flatItems = newFlatItems
      treeItems = buildTree(newFlatItems)
      prevLabels = newLabels

      // Update lastSelectedItem when items change
      const selectedItem = newFlatItems.find(item => model.value?.path === item.label)
      if (selectedItem?.component) {
        lastSelectedItem.value = selectedItem
      }
    }

    return treeItems
  }

  function getFlatItems() {
    return flatItems
  }

  return { getTreeItems, getFlatItems }
})()

function buildTree(items: { label: string }[]): TreeNode[] {
  const map = new Map<string, TreeNode>()
  const root: TreeNode[] = []

  items.forEach((item) => {
    const parts = item.label.split('/')
    let path = ''

    parts.forEach((part, i) => {
      path = path ? `${path}/${part}` : part

      if (!map.has(path)) {
        const node = { label: part, path, ...(i < parts.length - 1 && { children: [] }) }
        map.set(path, node)

        if (i === 0) {
          root.push(node)
        } else {
          map.get(parts.slice(0, i).join('/'))?.children?.push(node)
        }
      }
    })
  })

  const sort = (nodes: TreeNode[]): TreeNode[] =>
    nodes.sort((a, b) =>
      !!a.children === !!b.children ? a.label.localeCompare(b.label) : b.children ? 1 : -1
    ).map(n => ({ ...n, children: n.children && sort(n.children) }))

  return sort(root)
}

function transformSlot(slot: any, index: number): TreeItem {
  if (typeof slot.type === 'symbol') {
    return slot.children?.map(transformSlot)
  }

  return {
    label: slot.props?.filename || slot.props?.label || `${index}`,
    icon: slot.props?.icon,
    component: slot
  }
}

function getExpandedPaths(path?: string, items?: TreeItem[]) {
  if (props.expandAll) {
    const allPaths = new Set<string>()
    ;(items || getFlatItems()).forEach((item) => {
      const parts = item.label.split('/')
      for (let i = 1; i < parts.length; i++) {
        allPaths.add(parts.slice(0, i).join('/'))
      }
    })
    return Array.from(allPaths)
  }

  if (!path) {
    return []
  }

  const parts = path.split('/')
  return parts.slice(0, -1).map((_, index) => parts.slice(0, index + 1).join('/'))
}

const expanded = ref(getExpandedPaths(model.value?.path))

watch(model, (value) => {
  const item = getFlatItems().find(item => value?.path === item.label)
  if (item?.component) {
    lastSelectedItem.value = item
  }
})
</script>

<!-- eslint-disable vue/no-template-shadow -->
<template>
  <DefineTreeTemplate v-slot="{ items, level }">
    <li
      v-for="(item, index) in items"
      :key="`${level}-${index}`"
      role="presentation"
      :class="level > 1 ? ui.itemWithChildren({ class: uiProp?.itemWithChildren }) : ui.item({ class: uiProp?.item })"
    >
      <TreeItem
        v-slot="{ isExpanded, isSelected }"
        :level="level"
        :value="item"
        as-child
      >
        <button
          type="button"
          :class="ui.link({ class: uiProp?.link, active: isSelected })"
        >
          <UIcon
            v-if="item.children?.length"
            :name="isExpanded ? appConfig.ui.icons.folderOpen : appConfig.ui.icons.folder"
            :class="ui.linkLeadingIcon({ class: uiProp?.linkLeadingIcon })"
          />
          <UCodeIcon
            v-else
            :filename="item.label"
            :class="ui.linkLeadingIcon({ class: uiProp?.linkLeadingIcon })"
          />

          <span :class="ui.linkLabel({ class: uiProp?.linkLabel })">
            {{ item.label }}
          </span>

          <span v-if="item.children?.length" :class="ui.linkTrailing({ class: uiProp?.linkTrailing })">
            <UIcon
              :name="appConfig.ui.icons.chevronDown"
              :class="ui.linkTrailingIcon({ class: uiProp?.linkTrailingIcon })"
            />
          </span>
        </button>

        <ul
          v-if="item.children?.length && isExpanded"
          role="group"
          :class="ui.listWithChildren({ class: uiProp?.listWithChildren })"
        >
          <ReuseTreeTemplate :items="item.children" :level="level + 1" />
        </ul>
      </TreeItem>
    </li>
  </DefineTreeTemplate>

  <div v-bind="$attrs" :class="ui.root({ class: [uiProp?.root, props.class] })">
    <TreeRoot
      v-model="model"
      v-model:expanded="expanded"
      :class="ui.list({ class: uiProp?.list })"
      :items="getTreeItems()"
      :get-key="(item) => item.path"
    >
      <ReuseTreeTemplate :items="getTreeItems()" :level="1" />
    </TreeRoot>

    <div :class="ui.content({ class: uiProp?.content })">
      <component :is="lastSelectedItem?.component" />
    </div>
  </div>
</template>
