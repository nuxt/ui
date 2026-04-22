<script>
import theme from "#build/ui/editor-toolbar";
</script>

<script setup>
import { computed, inject } from "vue";
import { Primitive, Separator, useForwardProps } from "reka-ui";
import { defu } from "defu";
import { BubbleMenu, FloatingMenu } from "@tiptap/vue-3/menus";
import { reactiveOmit } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { isArrayOfArray, pick, omit } from "../utils";
import { createHandlers } from "../utils/editor";
import { tv } from "../utils/tv";
import UButton from "./Button.vue";
import UDropdownMenu from "./DropdownMenu.vue";
import UTooltip from "./Tooltip.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  as: { type: null, required: false },
  color: { type: null, required: false, default: "neutral" },
  variant: { type: null, required: false, default: "ghost" },
  activeColor: { type: null, required: false, default: "primary" },
  activeVariant: { type: null, required: false, default: "soft" },
  size: { type: null, required: false, default: "sm" },
  items: { type: null, required: false },
  editor: { type: Object, required: true },
  class: { type: null, required: false },
  ui: { type: Object, required: false },
  layout: { type: String, required: false, default: "fixed" },
  pluginKey: { type: [Object, String], required: false },
  updateDelay: { type: Number, required: false },
  resizeDelay: { type: Number, required: false },
  shouldShow: { type: [Function, null], required: false },
  appendTo: { type: Function, required: false, skipCheck: true },
  getReferencedVirtualElement: { type: Function, required: false },
  options: { type: Object, required: false }
});
defineSlots();
const appConfig = useAppConfig();
const uiProp = useComponentUI("editorToolbar", props);
const handlers = inject("editorHandlers", computed(() => createHandlers()));
const Component = computed(() => {
  return {
    bubble: BubbleMenu,
    floating: FloatingMenu,
    fixed: "template"
  }[props.layout];
});
const rootProps = useForwardProps(reactiveOmit(props, "as", "color", "variant", "activeColor", "activeVariant", "size", "items", "layout", "editor", "class", "ui"));
const options = computed(() => defu(props.options, {
  offset: 8,
  shift: { padding: 8 }
}));
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.editorToolbar || {} })({
  layout: props.layout
}));
const groups = computed(
  () => props.items?.length ? isArrayOfArray(props.items) ? props.items : [props.items] : []
);
function isActive(item) {
  if (!props.editor?.isEditable) {
    return false;
  }
  if ("items" in item && item.items?.length) {
    return item.items?.some((item2) => isActive(item2)) || false;
  }
  if (!("kind" in item)) {
    return item.active ?? false;
  }
  const handler = handlers?.value?.[item.kind];
  return handler?.isActive(props.editor, item) || false;
}
function isDisabled(item) {
  if (!props.editor?.isEditable) {
    return true;
  }
  if ("items" in item && item.items?.length) {
    const items = isArrayOfArray(item.items) ? item.items.flat() : item.items;
    const actionableItems = items.filter((item2) => item2.type !== "separator" && item2.type !== "label");
    if (actionableItems.length === 0) {
      return true;
    }
    return actionableItems.every((item2) => isDisabled(item2));
  }
  if (!("kind" in item)) {
    return item.disabled ?? false;
  }
  const handler = handlers?.value?.[item.kind];
  if (!handler) {
    return false;
  }
  if (handler.isDisabled?.(props.editor, item)) {
    return true;
  }
  return !handler.canExecute(props.editor, item);
}
function onClick(e, item) {
  if (!props.editor?.isEditable || isDisabled(item)) {
    return;
  }
  if ("items" in item || !("kind" in item)) {
    if ("onClick" in item) {
      for (const onClick2 of Array.isArray(item.onClick) ? item.onClick : [item.onClick]) {
        onClick2?.(e);
      }
    }
    return;
  }
  const handler = handlers?.value?.[item.kind];
  if (handler) {
    handler.execute(props.editor, item).run();
  }
}
function getActiveChildItem(item) {
  if (!item.items) {
    return void 0;
  }
  const items = isArrayOfArray(item.items) ? item.items.flat() : item.items;
  return items.find((childItem) => {
    if (!("kind" in childItem)) {
      return false;
    }
    return isActive(childItem);
  });
}
function getButtonProps(item) {
  const baseProps = omit(item, ["kind", "mark", "align", "level", "href", "src", "pos", "items", "slot", "checkedIcon", "loadingIcon", "externalIcon", "content", "arrow", "portal", "modal", "tooltip", "onClick"]);
  if ("items" in item && item.items?.length) {
    const activeChild = getActiveChildItem(item);
    if (activeChild?.icon) {
      baseProps.icon = activeChild.icon;
    }
    if (activeChild?.label && baseProps.label !== void 0) {
      baseProps.label = activeChild.label;
    }
  }
  return defu(baseProps, {
    color: props.color,
    activeColor: props.activeColor,
    activeVariant: props.activeVariant,
    variant: props.variant,
    size: props.size
  });
}
function getDropdownProps(item) {
  const baseProps = pick(item, ["size", "checkedIcon", "loadingIcon", "externalIcon", "content", "arrow", "portal", "modal", "ui"]);
  return defu(baseProps, {
    modal: false,
    size: props.size
  });
}
function mapDropdownItem(item) {
  const children = "children" in item && Array.isArray(item.children) ? item.children.map(mapDropdownItem) : void 0;
  if (!("kind" in item)) {
    return children ? { ...item, children } : item;
  }
  const editorToolbarItem = item;
  return {
    ...editorToolbarItem,
    ...children && { children },
    active: isActive(editorToolbarItem),
    disabled: isDisabled(editorToolbarItem),
    onSelect: (e) => onClick(e, editorToolbarItem)
  };
}
function getDropdownItems(item) {
  if (!item.items) {
    return [];
  }
  return isArrayOfArray(item.items) ? item.items.map((group) => group.map(mapDropdownItem)) : [item.items.map(mapDropdownItem)];
}
</script>

<template>
  <Primitive
    :as="Component"
    v-bind="Component !== 'template' ? {
  editor,
  tabindex: -1,
  class: ui.root({ class: uiProp?.root }),
  ...rootProps,
  options,
  ...$attrs
} : {
  ...$attrs
}"
  >
    <Primitive :as="as" role="toolbar" data-slot="base" :class="ui.base({ class: [uiProp?.base, props.class] })">
      <template v-for="(group, groupIndex) in groups" :key="`group-${groupIndex}`">
        <div role="group" data-slot="group" :class="ui.group({ class: uiProp?.group })">
          <template v-for="(item, index) in group" :key="`group-${groupIndex}-${index}`">
            <slot
              :name="item.slot || 'item'"
              :item="item"
              :index="index"
              :is-active="isActive"
              :is-disabled="isDisabled"
              :on-click="onClick"
            >
              <UDropdownMenu
                v-if="'items' in item && item.items?.length"
                v-bind="getDropdownProps(item)"
                :items="getDropdownItems(item)"
              >
                <UTooltip v-if="item.tooltip" :disabled="isDisabled(item)" v-bind="{ ...item.tooltip || {} }">
                  <UButton :active="isActive(item)" :disabled="isDisabled(item)" v-bind="getButtonProps(item)" @click="onClick($event, item)" />
                </UTooltip>

                <UButton v-else :active="isActive(item)" :disabled="isDisabled(item)" v-bind="getButtonProps(item)" @click="onClick($event, item)" />
              </UDropdownMenu>

              <UTooltip v-else-if="item.tooltip" :disabled="isDisabled(item)" v-bind="{ ...item.tooltip || {} }">
                <UButton
                  :active="isActive(item)"
                  :disabled="isDisabled(item)"
                  v-bind="getButtonProps(item)"
                  :ui="item.ui"
                  @click="onClick($event, item)"
                />
              </UTooltip>

              <UButton
                v-else
                :active="isActive(item)"
                :disabled="isDisabled(item)"
                v-bind="getButtonProps(item)"
                :ui="item.ui"
                @click="onClick($event, item)"
              />
            </slot>
          </template>
        </div>

        <Separator
          v-if="groupIndex < groups.length - 1"
          data-slot="separator"
          :class="ui.separator({ class: uiProp?.separator })"
          orientation="vertical"
        />
      </template>
    </Primitive>
  </Primitive>
</template>
