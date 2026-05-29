<script>
import theme from "#build/ui/prose/collapsible";
</script>

<script setup>
import { computed } from "vue";
import { useAppConfig } from "#imports";
import { useComponentProps } from "../../composables/useComponentProps";
import { useLocale } from "../../composables/useLocale";
import { transformUI } from "../../utils";
import { tv } from "../../utils/tv";
import UCollapsible from "../Collapsible.vue";
import UIcon from "../Icon.vue";
const _props = defineProps({
  icon: { type: null, required: false },
  name: { type: String, required: false },
  openText: { type: String, required: false },
  closeText: { type: String, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
defineSlots();
const props = useComponentProps("prose.collapsible", _props);
const { t } = useLocale();
const appConfig = useAppConfig();
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.collapsible || {} })());
</script>

<template>
  <UCollapsible :unmount-on-hide="false" :class="props.class" :ui="transformUI(ui, props.ui)">
    <template #default="{ open }">
      <button :class="ui.trigger({ class: props.ui?.trigger })">
        <UIcon :name="props.icon || appConfig.ui.icons.chevronDown" :class="ui.triggerIcon({ class: props.ui?.triggerIcon })" />

        <span :class="ui.triggerLabel({ class: props.ui?.triggerLabel })">
          {{ open ? props.closeText || t("prose.collapsible.closeText") : props.openText || t("prose.collapsible.openText") }} {{ props.name || t("prose.collapsible.name") }}
        </span>
      </button>
    </template>

    <template #content>
      <slot />
    </template>
  </UCollapsible>
</template>
