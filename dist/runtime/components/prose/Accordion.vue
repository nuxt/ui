<script>
import theme from "#build/ui/prose/accordion";
</script>

<script setup>
import { computed, ref, onBeforeUpdate } from "vue";
import { useAppConfig } from "#imports";
import { useComponentProps } from "../../composables/useComponentProps";
import { transformUI } from "../../utils";
import { tv } from "../../utils/tv";
import UAccordion from "../Accordion.vue";
const _props = defineProps({
  type: { type: String, required: false, default: "multiple" },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
const slots = defineSlots();
const props = useComponentProps("prose.accordion", _props);
const appConfig = useAppConfig();
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.accordion || {} }));
const rerenderCount = ref(1);
const items = computed(() => {
  rerenderCount.value;
  return slots.default?.()?.flatMap(transformSlot).filter(Boolean) || [];
});
function transformSlot(slot, index) {
  if (typeof slot.type === "symbol") {
    return slot.children?.map(transformSlot);
  }
  return {
    index,
    label: slot.props?.label || `${index}`,
    description: slot.props?.description,
    icon: slot.props?.icon,
    component: slot
  };
}
onBeforeUpdate(() => rerenderCount.value++);
</script>

<template>
  <UAccordion :type="props.type" :items="items" :unmount-on-hide="false" :class="props.class" :ui="transformUI(ui(), props.ui)">
    <template #content="{ item }">
      <component :is="item.component" />
    </template>
  </UAccordion>
</template>
