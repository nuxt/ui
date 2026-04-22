<script>
import theme from "#build/ui/editor-mention-menu";
</script>

<script setup>
import { computed, h, onMounted, onBeforeUnmount, nextTick, toRef } from "vue";
import { useAppConfig } from "#imports";
import { useEditorMenu } from "../composables/useEditorMenu";
import { tv } from "../utils/tv";
import UIcon from "./Icon.vue";
import UAvatar from "./Avatar.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  size: { type: null, required: false },
  items: { type: Array, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false },
  editor: { type: Object, required: false },
  char: { type: String, required: false, default: "@" },
  pluginKey: { type: String, required: false, default: "mentionMenu" },
  filterFields: { type: Array, required: false },
  limit: { type: Number, required: false },
  options: { type: Object, required: false },
  suggestion: { type: Object, required: false },
  appendTo: { type: Function, required: false, skipCheck: true },
  ignoreFilter: { type: Boolean, required: false }
});
const searchTerm = defineModel("searchTerm", { type: String, ...{ default: "" } });
const appConfig = useAppConfig();
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.editorMentionMenu || {} })({
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
    ignoreFilter: props.ignoreFilter,
    limit: props.limit,
    options: props.options,
    suggestion: props.suggestion,
    appendTo: props.appendTo,
    searchTerm,
    ui,
    onSelect: (editor, range, item) => {
      editor.chain().focus().deleteRange(range).insertContent({
        type: "mention",
        attrs: {
          ...item,
          mentionSuggestionChar: props.char
        }
      }).run();
    },
    renderItem: (item, styles) => [
      item.avatar ? h(UAvatar, { ...item.avatar, size: styles.value.itemLeadingAvatarSize(), class: styles.value.itemLeadingAvatar() }) : item.icon ? h(UIcon, { name: item.icon, class: styles.value.itemLeadingIcon() }) : null,
      h("span", { class: styles.value.itemWrapper() }, [
        h("span", { class: styles.value.itemLabel() }, item.label),
        item.description ? h("span", { class: styles.value.itemDescription() }, item.description) : null
      ])
    ]
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
