<script>
import theme from "#build/ui/popover";
</script>

<script setup>
import { computed, toRef } from "vue";
import { defu } from "defu";
import { useForwardPropsEmits } from "reka-ui";
import { Popover, HoverCard } from "reka-ui/namespaced";
import { reactivePick } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { FieldGroupReset } from "../composables/useFieldGroup";
import { usePortal } from "../composables/usePortal";
import { pointerDownOutside } from "../utils/overlay";
import { tv } from "../utils/tv";
const props = defineProps({
  mode: { type: null, required: false, default: "click" },
  content: { type: Object, required: false },
  arrow: { type: [Boolean, Object], required: false },
  portal: { type: [Boolean, String], required: false, skipCheck: true, default: true },
  reference: { type: null, required: false },
  dismissible: { type: Boolean, required: false, default: true },
  class: { type: null, required: false },
  ui: { type: null, required: false },
  defaultOpen: { type: Boolean, required: false },
  open: { type: Boolean, required: false },
  modal: { type: Boolean, required: false },
  openDelay: { type: Number, required: false, default: 0 },
  closeDelay: { type: Number, required: false, default: 0 }
});
const emits = defineEmits(["close:prevent", "update:open"]);
const slots = defineSlots();
const appConfig = useAppConfig();
const uiProp = useComponentUI("popover", props);
const pick = props.mode === "hover" ? reactivePick(props, "defaultOpen", "open", "openDelay", "closeDelay") : reactivePick(props, "defaultOpen", "open", "modal");
const rootProps = useForwardPropsEmits(pick, emits);
const portalProps = usePortal(toRef(() => props.portal));
const contentProps = toRef(() => defu(props.content, { side: "bottom", sideOffset: 8, collisionPadding: 8 }));
const contentEvents = computed(() => {
  if (!props.dismissible) {
    const events = ["interactOutside", "escapeKeyDown"];
    return events.reduce((acc, curr) => {
      acc[curr] = (e) => {
        e.preventDefault();
        emits("close:prevent");
      };
      return acc;
    }, {});
  }
  return {
    pointerDownOutside
  };
});
const arrowProps = toRef(() => defu(props.arrow, { rounded: true }));
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.popover || {} })({
  side: contentProps.value.side
}));
const Component = computed(() => props.mode === "hover" ? HoverCard : Popover);
</script>

<template>
  <Component.Root v-slot="{ open, close }" v-bind="rootProps">
    <Component.Trigger v-if="!!slots.default || !!reference" as-child :reference="reference" :class="props.class">
      <slot :open="open" />
    </Component.Trigger>

    <Component.Anchor v-if="'Anchor' in Component && !!slots.anchor" as-child>
      <slot name="anchor" v-bind="close ? { close } : {}" />
    </Component.Anchor>

    <Component.Portal v-bind="portalProps">
      <FieldGroupReset>
        <Component.Content v-bind="contentProps" data-slot="content" :class="ui.content({ class: [!slots.default && props.class, uiProp?.content] })" v-on="contentEvents">
          <slot name="content" v-bind="close ? { close } : {}" />

          <Component.Arrow v-if="!!arrow" v-bind="arrowProps" data-slot="arrow" :class="ui.arrow({ class: uiProp?.arrow })" />
        </Component.Content>
      </FieldGroupReset>
    </Component.Portal>
  </Component.Root>
</template>
