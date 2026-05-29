<script>
import theme from "#build/ui/prose/code-tree";
</script>

<script setup>
import { computed, watch, onBeforeUpdate, ref } from "vue";
import { TreeRoot, TreeItem } from "reka-ui";
import { createReusableTemplate } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useComponentProps } from "../../composables/useComponentProps";
import { tv } from "../../utils/tv";
import UCodeIcon from "./CodeIcon.vue";
import UIcon from "../Icon.vue";
defineOptions({ inheritAttrs: false });
const _props = defineProps({
  items: { type: Array, required: false },
  modelValue: { type: String, required: false },
  defaultValue: { type: String, required: false },
  expandAll: { type: Boolean, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
const emits = defineEmits(["update:modelValue"]);
const slots = defineSlots();
const props = useComponentProps("prose.codeTree", _props);
const appConfig = useAppConfig();
const [DefineTreeTemplate, ReuseTreeTemplate] = createReusableTemplate();
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.codeTree || {} })());
const initialPath = props.modelValue ?? props.defaultValue;
const model = ref(initialPath ? { path: initialPath } : void 0);
const lastSelectedItem = ref();
watch(model, (value) => {
  if (value?.path !== props.modelValue) {
    emits("update:modelValue", value?.path);
  }
});
watch(() => props.modelValue, (value) => {
  if (value === model.value?.path) return;
  model.value = value ? { path: value } : void 0;
  const pathsToExpand = getExpandedPaths(value);
  for (const path of pathsToExpand) {
    if (!expanded.value.includes(path)) {
      expanded.value.push(path);
    }
  }
});
const rerenderCount = ref(1);
const flatItems = computed(() => {
  rerenderCount.value;
  return props.items || slots.default?.()?.flatMap(transformSlot).filter(Boolean) || [];
});
const items = computed(() => buildTree(flatItems.value));
function buildTree(items2) {
  const map = /* @__PURE__ */ new Map();
  const root = [];
  items2.forEach((item) => {
    const parts = item.label.split("/");
    let path = "";
    parts.forEach((part, i) => {
      path = path ? `${path}/${part}` : part;
      if (!map.has(path)) {
        const node = { label: part, path, ...i < parts.length - 1 && { children: [] } };
        map.set(path, node);
        if (i === 0) {
          root.push(node);
        } else {
          map.get(parts.slice(0, i).join("/"))?.children?.push(node);
        }
      }
    });
  });
  const sort = (nodes) => nodes.sort(
    (a, b) => !!a.children === !!b.children ? a.label.localeCompare(b.label) : b.children ? 1 : -1
  ).map((n) => ({ ...n, children: n.children && sort(n.children) }));
  return sort(root);
}
function transformSlot(slot, index) {
  if (typeof slot.type === "symbol") {
    return slot.children?.map(transformSlot);
  }
  return {
    label: slot.props?.filename || slot.props?.label || `${index}`,
    icon: slot.props?.icon,
    component: slot
  };
}
function getExpandedPaths(path) {
  if (props.expandAll) {
    const allPaths = /* @__PURE__ */ new Set();
    flatItems.value.forEach((item) => {
      const parts2 = item.label.split("/");
      for (let i = 1; i < parts2.length; i++) {
        allPaths.add(parts2.slice(0, i).join("/"));
      }
    });
    return Array.from(allPaths);
  }
  if (!path) {
    return [];
  }
  const parts = path.split("/");
  return parts.slice(0, -1).map((_, index) => parts.slice(0, index + 1).join("/"));
}
const expanded = ref(getExpandedPaths(model.value?.path));
watch(flatItems, (newItems, oldItems) => {
  if (!props.expandAll) return;
  const newLabels = newItems.map((i) => i.label).join("\n");
  const oldLabels = oldItems?.map((i) => i.label).join("\n") ?? "";
  if (newLabels !== oldLabels) {
    expanded.value = getExpandedPaths();
  }
});
watch(model, (value) => {
  const item = flatItems.value.find((item2) => value?.path === item2.label);
  if (item?.component) {
    lastSelectedItem.value = item;
  }
}, { immediate: true });
onBeforeUpdate(() => rerenderCount.value++);
</script>

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
      v-model:expanded="expanded"
      :class="ui.list({ class: props.ui?.list })"
      :items="items"
      :get-key="(item2) => item2.path"
    >
      <ReuseTreeTemplate :items="items" :level="1" />
    </TreeRoot>

    <div :class="ui.content({ class: props.ui?.content })">
      <component :is="lastSelectedItem?.component" />
    </div>
  </div>
</template>
