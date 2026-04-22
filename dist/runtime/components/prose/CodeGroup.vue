<script>
import theme from "#build/ui/prose/code-group";
</script>

<script setup>
import { computed, watch, onMounted, ref, onBeforeUpdate } from "vue";
import { TabsRoot, TabsList, TabsIndicator, TabsTrigger, TabsContent } from "reka-ui";
import { useState, useAppConfig } from "#imports";
import { useComponentUI } from "../../composables/useComponentUI";
import { tv } from "../../utils/tv";
import UCodeIcon from "./CodeIcon.vue";
const props = defineProps({
  defaultValue: { type: String, required: false, default: "0" },
  sync: { type: String, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
const slots = defineSlots();
const model = defineModel({ type: String });
const appConfig = useAppConfig();
const uiProp = useComponentUI("prose.codeGroup", props);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.codeGroup || {} })());
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
    label: slot.props?.filename || slot.props?.label || `${index}`,
    icon: slot.props?.icon,
    component: slot
  };
}
onMounted(() => {
  if (props.sync) {
    const syncKey = `code-group-${props.sync}`;
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
onBeforeUpdate(() => rerenderCount.value++);
</script>

<template>
  <TabsRoot v-model="model" :default-value="defaultValue" :unmount-on-hide="false" :class="ui.root({ class: [uiProp?.root, props.class] })">
    <TabsList :class="ui.list({ class: uiProp?.list })">
      <TabsIndicator :class="ui.indicator({ class: uiProp?.indicator })" />

      <TabsTrigger v-for="(item, index) of items" :key="index" :value="String(index)" :class="ui.trigger({ class: uiProp?.trigger })">
        <UCodeIcon :icon="item.icon" :filename="item.label" :class="ui.triggerIcon({ class: uiProp?.triggerIcon })" />

        <span :class="ui.triggerLabel({ class: uiProp?.triggerLabel })">{{ item.label }}</span>
      </TabsTrigger>
    </TabsList>

    <TabsContent v-for="(item, index) of items" :key="index" :value="String(index)" as-child>
      <component :is="item.component" hide-header tabindex="-1" />
    </TabsContent>
  </TabsRoot>
</template>
