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

export interface ProseCodeTreeProps {
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

export interface ProseCodeTreeSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed, ref, watch, onBeforeUpdate } from 'vue'
import { TreeRoot, TreeItem } from 'reka-ui'
import { createReusableTemplate } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { tv } from '../../utils/tv'
import UCodeIcon from './CodeIcon.vue'
import UIcon from '../Icon.vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<ProseCodeTreeProps>()
const slots = defineSlots<ProseCodeTreeSlots>()

const appConfig = useAppConfig() as ProseCodeTree['AppConfig']

const [DefineTreeTemplate, ReuseTreeTemplate] = createReusableTemplate<{ items: TreeNode[], level: number }>()

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.codeTree || {}) })())

const model = ref(props.defaultValue ? { path: props.defaultValue } : undefined)
const lastSelectedItem = ref()
const rerenderCount = ref(1)

const flatItems = computed<{
  index: number
  label: string
  icon: string
  component: any
}[]>(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  rerenderCount.value
  return slots.default?.()?.flatMap(transformSlot).filter(Boolean) || []
})
const items = computed(() => buildTree(flatItems.value))

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

function transformSlot(slot: any, index: number) {
  if (typeof slot.type === 'symbol') {
    return slot.children?.map(transformSlot)
  }

  return {
    label: slot.props?.filename || slot.props?.label || `${index}`,
    icon: slot.props?.icon,
    component: slot
  }
}

const expanded = computed(() => {
  if (props.expandAll) {
    const allPaths = new Set<string>()
    flatItems.value.forEach((item) => {
      const parts = item.label.split('/')
      for (let i = 1; i < parts.length; i++) {
        allPaths.add(parts.slice(0, i).join('/'))
      }
    })
    return Array.from(allPaths)
  }

  const path = model.value?.path
  if (!path) {
    return []
  }

  const parts = path.split('/')
  return parts.map((_, index) => parts.slice(0, index + 1).join('/'))
})

watch(model, (value) => {
  const item = flatItems.value.find(item => value?.path === item.label)
  if (item?.component) {
    lastSelectedItem.value = item
  }
}, { immediate: true })

onBeforeUpdate(() => rerenderCount.value++)
</script>

<!-- eslint-disable vue/no-template-shadow -->
<template>
  <DefineTreeTemplate v-slot="{ items, level }">
    <li
      v-for="(item, index) in items"
      :key="`${level}-${index}`"
      role="presentation"
      :class="level > 1 ? ui.itemWithChildren({ class: props.ui?.itemWithChildren }) : ui.item({ class: props.ui?.item })"
    >
      <TreeItem
        v-slot="{ isExpanded, isSelected }"
        :level="level"
        :value="item"
        as-child
      >
        <button
          type="button"
          :class="ui.link({ class: props.ui?.link, active: isSelected })"
        >
          <UIcon
            v-if="item.children?.length"
            :name="isExpanded ? appConfig.ui.icons.folderOpen : appConfig.ui.icons.folder"
            :class="ui.linkLeadingIcon({ class: props.ui?.linkLeadingIcon })"
          />
          <UCodeIcon
            v-else
            :filename="item.label"
            :class="ui.linkLeadingIcon({ class: props.ui?.linkLeadingIcon })"
          />

          <span :class="ui.linkLabel({ class: props.ui?.linkLabel })">
            {{ item.label }}
          </span>

          <span v-if="item.children?.length" :class="ui.linkTrailing({ class: props.ui?.linkTrailing })">
            <UIcon
              :name="appConfig.ui.icons.chevronDown"
              :class="ui.linkTrailingIcon({ class: props.ui?.linkTrailingIcon })"
            />
          </span>
        </button>

        <ul
          v-if="item.children?.length && isExpanded"
          role="group"
          :class="ui.listWithChildren({ class: props.ui?.listWithChildren })"
        >
          <ReuseTreeTemplate :items="item.children" :level="level + 1" />
        </ul>
      </TreeItem>
    </li>
  </DefineTreeTemplate>

  <div v-bind="$attrs" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <TreeRoot
      v-model="model"
      :class="ui.list({ class: props.ui?.list })"
      :items="items"
      :get-key="(item) => item.path"
      :default-expanded="expanded"
    >
      <ReuseTreeTemplate :items="items" :level="1" />
    </TreeRoot>

    <div :class="ui.content({ class: props.ui?.content })">
      <component :is="lastSelectedItem?.component" />
    </div>
  </div>
</template>
