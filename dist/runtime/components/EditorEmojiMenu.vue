<script>
import theme from "#build/ui/editor-emoji-menu";
</script>

<script setup>
import { computed, h, onMounted, onBeforeUnmount, nextTick, toRef } from "vue";
import { useAppConfig } from "#imports";
import { useEditorMenu } from "../composables/useEditorMenu";
import { tv } from "../utils/tv";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  size: { type: null, required: false },
  items: { type: Array, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false },
  editor: { type: Object, required: false },
  char: { type: String, required: false, default: ":" },
  pluginKey: { type: String, required: false, default: "emojiMenu" },
  filterFields: { type: Array, required: false, default: () => ["name", "shortcodes", "tags"] },
  limit: { type: Number, required: false },
  options: { type: Object, required: false },
  suggestion: { type: Object, required: false },
  appendTo: { type: Function, required: false, skipCheck: true }
});
const appConfig = useAppConfig();
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.editorEmojiMenu || {} })({
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
      if (!item.emoji) return;
      editor.chain().focus().deleteRange(range).insertContent(item.emoji).run();
    },
    renderItem: (item, styles) => {
      const content = item.emoji || item.shortcodes[0] || item.name;
      return [
        h("span", { class: styles.value.itemLeadingIcon() }, content),
        h("span", { class: styles.value.itemWrapper() }, [
          h("span", { class: styles.value.itemLabel() }, item.name)
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
