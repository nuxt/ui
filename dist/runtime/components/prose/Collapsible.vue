<script>
import theme from "#build/ui/prose/collapsible";
</script>

<script setup>
import { computed } from "vue";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../../composables/useComponentUI";
import { useLocale } from "../../composables/useLocale";
import { transformUI } from "../../utils";
import { tv } from "../../utils/tv";
import UCollapsible from "../Collapsible.vue";
import UIcon from "../Icon.vue";
const props = defineProps({
  icon: { type: null, required: false },
  name: { type: String, required: false },
  openText: { type: String, required: false },
  closeText: { type: String, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
defineSlots();
const { t } = useLocale();
const appConfig = useAppConfig();
const uiProp = useComponentUI("prose.collapsible", props);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.collapsible || {} })());
</script>

<template>
  <UCollapsible :unmount-on-hide="false" :class="props.class" :ui="transformUI(ui, uiProp)">
    <template #default="{ open }">
      <button :class="ui.trigger({ class: uiProp?.trigger })">
        <UIcon :name="icon || appConfig.ui.icons.chevronDown" :class="ui.triggerIcon({ class: uiProp?.triggerIcon })" />

        <span :class="ui.triggerLabel({ class: uiProp?.triggerLabel })">
          {{ open ? props.closeText || t("prose.collapsible.closeText") : props.openText || t("prose.collapsible.openText") }} {{ props.name || t("prose.collapsible.name") }}
        </span>
      </button>
    </template>

    <template #content>
      <slot />
    </template>
  </UCollapsible>
</template>
