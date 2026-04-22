<script>
import theme from "#build/ui/prose/prompt";
</script>

<script setup>
import { computed } from "vue";
import { useClipboard } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../../composables/useComponentUI";
import { useLocale } from "../../composables/useLocale";
import { getSlotChildrenText } from "../../utils";
import { tv } from "../../utils/tv";
import UIcon from "../Icon.vue";
import UButton from "../Button.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  description: { type: String, required: false },
  icon: { type: null, required: false },
  actions: { type: Array, required: false, default: () => ["copy"] },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
const slots = defineSlots();
const { t } = useLocale();
const { copy, copied } = useClipboard();
const appConfig = useAppConfig();
const uiProp = useComponentUI("prose.prompt", props);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.prompt || {} })());
function getPromptText() {
  const children = slots.default?.();
  return children ? getSlotChildrenText(children).trim() : "";
}
function copyPrompt() {
  copy(getPromptText());
}
function openInCursor() {
  const url = new URL("cursor://anysphere.cursor-deeplink/prompt");
  url.searchParams.set("text", getPromptText());
  window.open(url.toString(), "_self");
}
function openInWindsurf() {
  const url = new URL("windsurf://cascade/newChat");
  url.searchParams.set("prompt", getPromptText());
  window.open(url.toString(), "_self");
}
</script>

<template>
  <div :class="ui.root({ class: [uiProp?.root, props.class] })" v-bind="$attrs">
    <UIcon v-if="icon" :name="icon" :class="ui.icon({ class: uiProp?.icon })" />

    <div :class="ui.content({ class: uiProp?.content })">
      <p v-if="description" :class="ui.description({ class: uiProp?.description })">
        {{ description }}
      </p>
    </div>

    <div :class="ui.actions({ class: uiProp?.actions })">
      <UButton
        v-if="actions.includes('copy')"
        :icon="copied ? appConfig.ui.icons.copyCheck : appConfig.ui.icons.copy"
        size="sm"
        :label="t('prose.prompt.copy')"
        @click="copyPrompt"
      />

      <UButton
        v-if="actions.includes('cursor')"
        icon="i-simple-icons-cursor"
        color="neutral"
        variant="outline"
        size="sm"
        :label="t('prose.prompt.openIn', { name: 'Cursor' })"
        @click="openInCursor"
      />

      <UButton
        v-if="actions.includes('windsurf')"
        icon="i-simple-icons-windsurf"
        color="neutral"
        variant="outline"
        size="sm"
        :label="t('prose.prompt.openIn', { name: 'Windsurf' })"
        @click="openInWindsurf"
      />
    </div>
  </div>
</template>
