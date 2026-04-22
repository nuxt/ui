<script>
import theme from "#build/ui/editor-suggestion-menu";
</script>

<script setup>
import { computed, h, inject, onMounted, onBeforeUnmount, nextTick, toRef } from "vue";
import { useAppConfig } from "#imports";
import { useEditorMenu } from "../composables/useEditorMenu";
import { createHandlers } from "../utils/editor";
import { tv } from "../utils/tv";
import UIcon from "./Icon.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  size: { type: null, required: false },
  items: { type: Array, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false },
  editor: { type: Object, required: false },
  char: { type: String, required: false, default: "/" },
  pluginKey: { type: String, required: false, default: "suggestionMenu" },
  filterFields: { type: Array, required: false },
  limit: { type: Number, required: false },
  options: { type: Object, required: false },
  suggestion: { type: Object, required: false },
  appendTo: { type: Function, required: false, skipCheck: true }
});
const appConfig = useAppConfig();
const handlers = inject("editorHandlers", computed(() => createHandlers()));
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.editorSuggestionMenu || {} })({
  size: props.size
}));
let menu = null;
onMounted(async () => {
  await nextTick();
  if (!props.editor || props.editor.isDestroyed) {
    return;
  }
  menu = useEditorMenu({
    editor: props.editor,
    char: props.char,
    pluginKey: props.pluginKey,
    items: toRef(() => props.items),
    filterFields: props.filterFields,
    limit: props.limit,
    options: props.options,
    suggestion: props.suggestion,
    appendTo: props.appendTo,
    ui,
    onSelect: (editor, range, item) => {
      if (item.type === "label" || item.type === "separator") return;
      editor.chain().focus().deleteRange(range).run();
      const handler = handlers?.value?.[item.kind];
      if (handler) {
        handler.execute(editor, item).run();
      }
    },
    renderItem: (item, styles) => {
      if (item.type === "label") {
        return [h("span", {}, item.label)];
      }
      return [
        item.icon ? h(UIcon, { name: item.icon, class: styles.value.itemLeadingIcon() }) : null,
        h("span", { class: styles.value.itemWrapper() }, [
          h("span", { class: styles.value.itemLabel() }, item.label),
          item.description ? h("span", { class: styles.value.itemDescription() }, item.description) : null
        ])
      ];
    }
  });
  props.editor.registerPlugin(menu.plugin);
});
onBeforeUnmount(() => {
  if (menu) {
    menu.destroy();
    menu = null;
  }
  if (props.editor && !props.editor.isDestroyed) {
    props.editor.unregisterPlugin(props.pluginKey);
  }
});
</script>

<template>
  <div />
</template>
