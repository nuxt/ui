<script>
import theme from "#build/ui/prose/tabs";
</script>

<script setup>
import { computed, watch, onMounted, ref, onBeforeUpdate } from "vue";
import { useState, useAppConfig } from "#imports";
import { useComponentUI } from "../../composables/useComponentUI";
import { transformUI } from "../../utils";
import { tv } from "../../utils/tv";
import UTabs from "../Tabs.vue";
const props = defineProps({
  defaultValue: { type: String, required: false, default: "0" },
  sync: { type: String, required: false },
  hash: { type: String, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
const slots = defineSlots();
const model = defineModel({ type: String });
const appConfig = useAppConfig();
const uiProp = useComponentUI("prose.tabs", props);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.tabs || {} }));
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
onMounted(() => {
  if (props.sync) {
    const syncKey = `tabs-${props.sync}`;
    const syncValue = useState(syncKey, () => localStorage.getItem(syncKey));
    watch(syncValue, () => {
      if (!syncValue.value) return;
      model.value = syncValue.value;
    }, { immediate: true });
    watch(model, () => {
      if (!model.value) return;
      syncValue.value = model.value;
      localStorage.setItem(syncKey, model.value);
    });
  }
});
async function onUpdateModelValue() {
  if (props.hash) {
    const hash = props.hash.startsWith("#") ? props.hash : `#${props.hash}`;
    setTimeout(() => {
      document.querySelector(hash)?.scrollIntoView();
    }, 200);
  }
}
onBeforeUpdate(() => rerenderCount.value++);
</script>

<template>
  <UTabs
    v-model="model"
    color="primary"
    variant="link"
    :items="items"
    :class="props.class"
    :unmount-on-hide="false"
    :ui="transformUI(ui(), uiProp)"
    @update:model-value="onUpdateModelValue"
  >
    <template #content="{ item }">
      <component :is="item.component" />
    </template>
  </UTabs>
</template>
