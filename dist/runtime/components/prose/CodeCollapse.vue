<script>
import theme from "#build/ui/prose/code-collapse";
</script>

<script setup>
import { computed } from "vue";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../../composables/useComponentUI";
import { useLocale } from "../../composables/useLocale";
import { tv } from "../../utils/tv";
import UButton from "../Button.vue";
const props = defineProps({
  icon: { type: null, required: false },
  name: { type: String, required: false },
  openText: { type: String, required: false },
  closeText: { type: String, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
defineSlots();
const open = defineModel("open", { type: Boolean, ...{ default: false } });
const { t } = useLocale();
const appConfig = useAppConfig();
const uiProp = useComponentUI("prose.codeCollapse", props);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.codeCollapse || {} })({
  open: open.value
}));
</script>

<template>
  <div :class="ui.root({ class: [uiProp?.root, props.class] })">
    <slot />

    <div :class="ui.footer({ class: uiProp?.footer })">
      <UButton
        :icon="icon || appConfig.ui.icons.chevronDown"
        color="neutral"
        variant="outline"
        :data-state="open ? 'open' : 'closed'"
        :label="`${open ? props.closeText || t('prose.codeCollapse.closeText') : props.openText || t('prose.codeCollapse.openText')} ${props.name || t('prose.codeCollapse.name')}`"
        :class="ui.trigger({ class: uiProp?.trigger })"
        :ui="{ leadingIcon: ui.triggerIcon({ class: uiProp?.triggerIcon }) }"
        @click="open = !open"
      />
    </div>
  </div>
</template>
