<script>
import theme from "#build/ui/editor-drag-handle";
</script>

<script setup>
import { computed, ref } from "vue";
import DragHandle from "@tiptap/extension-drag-handle-vue-3";
import { useForwardProps } from "reka-ui";
import { reactiveOmit, reactivePick } from "@vueuse/core";
import { defu } from "defu";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { buildFloatingUIMiddleware } from "../utils/editor";
import { transformUI } from "../utils";
import { tv } from "../utils/tv";
import UButton from "./Button.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  icon: { type: null, required: false },
  color: { type: null, required: false, default: "neutral" },
  variant: { type: null, required: false, default: "ghost" },
  options: { type: Object, required: false },
  editor: { type: Object, required: true },
  ui: { type: Object, required: false },
  pluginKey: { type: [Object, String], required: false },
  nestedOptions: { type: Object, required: false },
  onElementDragStart: { type: Function, required: false },
  onElementDragEnd: { type: Function, required: false },
  getReferencedVirtualElement: { type: Function, required: false },
  nested: { type: [Boolean, Object], required: false },
  label: { type: String, required: false },
  activeColor: { type: null, required: false },
  activeVariant: { type: null, required: false },
  size: { type: null, required: false, default: "sm" },
  square: { type: Boolean, required: false },
  block: { type: Boolean, required: false },
  loadingAuto: { type: Boolean, required: false },
  onClick: { type: [Function, Array], required: false },
  class: { type: null, required: false },
  avatar: { type: Object, required: false },
  leading: { type: Boolean, required: false },
  leadingIcon: { type: null, required: false },
  trailing: { type: Boolean, required: false },
  trailingIcon: { type: null, required: false },
  loading: { type: Boolean, required: false },
  loadingIcon: { type: null, required: false },
  as: { type: null, required: false },
  type: { type: null, required: false },
  disabled: { type: Boolean, required: false },
  exactActiveClass: { type: String, required: false },
  viewTransition: { type: Boolean, required: false }
});
defineSlots();
const emit = defineEmits(["nodeChange", "hover"]);
const dragHandleProps = useForwardProps(reactivePick(props, "pluginKey", "nested", "nestedOptions", "onElementDragEnd", "onElementDragStart", "getReferencedVirtualElement"));
const buttonProps = useForwardProps(reactiveOmit(props, "icon", "options", "editor", "pluginKey", "nested", "nestedOptions", "onElementDragEnd", "onElementDragStart", "getReferencedVirtualElement", "class", "ui"));
const appConfig = useAppConfig();
const uiProp = useComponentUI("editorDragHandle", props);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.editorDragHandle || {} })());
const floatingUIOptions = computed(() => defu(props.options, {
  strategy: "absolute",
  placement: "left-start",
  offset: ({ rects }) => {
    const blockHeight = rects.reference.height;
    const handleHeight = rects.floating.height;
    if (blockHeight > 40) {
      return {
        alignmentAxis: 0,
        mainAxis: 8
      };
    }
    return {
      alignmentAxis: (blockHeight - handleHeight) / 2,
      mainAxis: 8
    };
  },
  flip: {},
  shift: {},
  size: false,
  autoPlacement: false,
  hide: false,
  inline: false
}));
const middleware = computed(() => buildFloatingUIMiddleware(floatingUIOptions.value));
const computePositionConfig = computed(() => ({
  placement: floatingUIOptions.value.placement,
  strategy: floatingUIOptions.value.strategy,
  middleware: middleware.value
}));
const currentNodePos = ref();
function onNodeChange({ pos }) {
  currentNodePos.value = pos;
  if (pos == null || pos < 0) return;
  const node = props.editor.state.doc.nodeAt(pos);
  if (node) {
    emit("hover", { node: node.toJSON(), pos });
  }
}
function onClick() {
  if (!props.editor) return;
  const pos = currentNodePos.value;
  if (pos == null || pos < 0) return;
  const node = props.editor.state.doc.nodeAt(pos);
  if (node) {
    const selectedNode = { node: node.toJSON(), pos };
    emit("nodeChange", selectedNode);
    props.editor.chain().setNodeSelection(pos).run();
    return selectedNode;
  }
}
</script>

<template>
  <DragHandle
    v-bind="dragHandleProps"
    :compute-position-config="computePositionConfig"
    :editor="editor"
    :on-node-change="onNodeChange"
    data-slot="root"
    :class="ui.root({ class: [uiProp?.root, props.class] })"
    @click="onClick"
  >
    <slot :ui="ui" :on-click="onClick">
      <UButton
        v-bind="{
  ...buttonProps,
  icon: props.icon || appConfig.ui.icons.drag,
  ...$attrs
}"
        data-slot="handle"
        :class="ui.handle({ class: [uiProp?.handle, props.class] })"
        :ui="transformUI(ui, uiProp)"
      />
    </slot>
  </DragHandle>
</template>
