<script>
import theme from "#build/ui/timeline";
</script>

<script setup>
import { computed } from "vue";
import { Primitive, Separator } from "reka-ui";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { tv } from "../utils/tv";
import { get } from "../utils";
import UAvatar from "./Avatar.vue";
const props = defineProps({
  as: { type: null, required: false },
  items: { type: Array, required: true },
  size: { type: null, required: false },
  color: { type: null, required: false },
  orientation: { type: null, required: false, default: "vertical" },
  valueKey: { type: null, required: false, default: "value" },
  defaultValue: { type: [String, Number], required: false },
  reverse: { type: Boolean, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
const emits = defineEmits(["select"]);
const slots = defineSlots();
const modelValue = defineModel({ type: [String, Number] });
const appConfig = useAppConfig();
const uiProp = useComponentUI("timeline", props);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.timeline || {} })({
  orientation: props.orientation,
  size: props.size,
  color: props.color,
  reverse: props.reverse
}));
const currentStepIndex = computed(() => {
  const value = modelValue.value ?? props.defaultValue;
  if (typeof value === "string") {
    return props.items.findIndex((item) => get(item, props.valueKey) === value) ?? -1;
  }
  if (props.reverse) {
    return value != null ? props.items.length - 1 - value : -1;
  } else {
    return value ?? -1;
  }
});
function getItemState(index) {
  if (currentStepIndex.value === -1) return void 0;
  if (index === currentStepIndex.value) return "active";
  if (props.reverse) {
    return index > currentStepIndex.value ? "completed" : void 0;
  } else {
    return index < currentStepIndex.value ? "completed" : void 0;
  }
}
function onSelect(event, item) {
  emits("select", event, item);
}
</script>

<template>
  <Primitive :as="as" :data-orientation="orientation" data-slot="root" :class="ui.root({ class: [uiProp?.root, props.class] })">
    <div
      v-for="(item, index) in items"
      :key="index"
      data-slot="item"
      :class="ui.item({ class: [uiProp?.item, item.ui?.item, item.class] })"
      :data-state="getItemState(index)"
      @click="onSelect($event, item)"
    >
      <div data-slot="container" :class="ui.container({ class: [uiProp?.container, item.ui?.container] })">
        <UAvatar
          :size="size"
          :icon="item.icon"
          v-bind="typeof item.avatar === 'object' ? item.avatar : {}"
          data-slot="indicator"
          :class="ui.indicator({ class: [uiProp?.indicator, item.ui?.indicator] })"
          :ui="{ icon: 'text-inherit', fallback: 'text-inherit' }"
        >
          <slot :name="item.slot ? `${item.slot}-indicator` : 'indicator'" :item="item" />
        </UAvatar>

        <Separator
          v-if="index < items.length - 1"
          data-slot="separator"
          :class="ui.separator({ class: [uiProp?.separator, item.ui?.separator] })"
          :orientation="props.orientation"
        />
      </div>

      <div data-slot="wrapper" :class="ui.wrapper({ class: [uiProp?.wrapper, item.ui?.wrapper] })">
        <slot :name="item.slot ? `${item.slot}-wrapper` : 'wrapper'" :item="item">
          <div v-if="item.date || !!slots[item.slot ? `${item.slot}-date` : 'date']" data-slot="date" :class="ui.date({ class: [uiProp?.date, item.ui?.date] })">
            <slot :name="item.slot ? `${item.slot}-date` : 'date'" :item="item">
              {{ item.date }}
            </slot>
          </div>
          <div v-if="item.title || !!slots[item.slot ? `${item.slot}-title` : 'title']" data-slot="title" :class="ui.title({ class: [uiProp?.title, item.ui?.title] })">
            <slot :name="item.slot ? `${item.slot}-title` : 'title'" :item="item">
              {{ item.title }}
            </slot>
          </div>
          <div v-if="item.description || !!slots[item.slot ? `${item.slot}-description` : 'description']" data-slot="description" :class="ui.description({ class: [uiProp?.description, item.ui?.description] })">
            <slot :name="item.slot ? `${item.slot}-description` : 'description'" :item="item">
              {{ item.description }}
            </slot>
          </div>
        </slot>
      </div>
    </div>
  </Primitive>
</template>
