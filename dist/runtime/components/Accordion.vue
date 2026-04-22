<script>
import theme from "#build/ui/accordion";
</script>

<script setup>
import { computed } from "vue";
import { AccordionRoot, AccordionItem, AccordionHeader, AccordionTrigger, AccordionContent, useForwardPropsEmits } from "reka-ui";
import { reactivePick } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { get } from "../utils";
import { tv } from "../utils/tv";
import UIcon from "./Icon.vue";
const props = defineProps({
  as: { type: null, required: false },
  items: { type: Array, required: false },
  trailingIcon: { type: null, required: false },
  valueKey: { type: null, required: false, default: "value" },
  labelKey: { type: null, required: false, default: "label" },
  class: { type: null, required: false },
  ui: { type: Object, required: false },
  collapsible: { type: Boolean, required: false, default: true },
  defaultValue: { type: null, required: false },
  modelValue: { type: null, required: false },
  type: { type: String, required: false, default: "single" },
  disabled: { type: Boolean, required: false },
  unmountOnHide: { type: Boolean, required: false, default: true }
});
const emits = defineEmits(["update:modelValue"]);
const slots = defineSlots();
const appConfig = useAppConfig();
const uiProp = useComponentUI("accordion", props);
const rootProps = useForwardPropsEmits(reactivePick(props, "as", "collapsible", "defaultValue", "disabled", "modelValue", "unmountOnHide"), emits);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.accordion || {} })({
  disabled: props.disabled
}));
</script>

<template>
  <AccordionRoot v-bind="rootProps" :type="type" data-slot="root" :class="ui.root({ class: [uiProp?.root, props.class] })">
    <AccordionItem
      v-for="(item, index) in props.items"
      v-slot="{ open }"
      :key="get(item, props.valueKey) ?? index"
      :value="get(item, props.valueKey) ?? String(index)"
      :disabled="item.disabled"
      data-slot="item"
      :class="ui.item({ class: [uiProp?.item, item.ui?.item, item.class] })"
    >
      <AccordionHeader as="div" data-slot="header" :class="ui.header({ class: [uiProp?.header, item.ui?.header] })">
        <AccordionTrigger data-slot="trigger" :class="ui.trigger({ class: [uiProp?.trigger, item.ui?.trigger], disabled: item.disabled })">
          <slot name="leading" :item="item" :index="index" :open="open" :ui="ui">
            <UIcon v-if="item.icon" :name="item.icon" data-slot="leadingIcon" :class="ui.leadingIcon({ class: [uiProp?.leadingIcon, item?.ui?.leadingIcon] })" />
          </slot>

          <span v-if="get(item, props.labelKey) || !!slots.default" data-slot="label" :class="ui.label({ class: [uiProp?.label, item.ui?.label] })">
            <slot :item="item" :index="index" :open="open">{{ get(item, props.labelKey) }}</slot>
          </span>

          <slot name="trailing" :item="item" :index="index" :open="open" :ui="ui">
            <UIcon :name="item.trailingIcon || trailingIcon || appConfig.ui.icons.chevronDown" data-slot="trailingIcon" :class="ui.trailingIcon({ class: [uiProp?.trailingIcon, item.ui?.trailingIcon] })" />
          </slot>
        </AccordionTrigger>
      </AccordionHeader>

      <AccordionContent v-if="item.content || !!slots.content || item.slot && !!slots[item.slot] || !!slots.body || item.slot && !!slots[`${item.slot}-body`]" data-slot="content" :class="ui.content({ class: [uiProp?.content, item.ui?.content] })">
        <slot :name="item.slot || 'content'" :item="item" :index="index" :open="open" :ui="ui">
          <div data-slot="body" :class="ui.body({ class: [uiProp?.body, item.ui?.body] })">
            <slot :name="item.slot ? `${item.slot}-body` : 'body'" :item="item" :index="index" :open="open" :ui="ui">
              {{ item.content }}
            </slot>
          </div>
        </slot>
      </AccordionContent>
    </AccordionItem>
  </AccordionRoot>
</template>
