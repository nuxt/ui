<script>
import theme from "#build/ui/prose/pre";
</script>

<script setup>
import { computed, useTemplateRef } from "vue";
import { useClipboard } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../../composables/useComponentUI";
import { useLocale } from "../../composables/useLocale";
import { tv } from "../../utils/tv";
import UCodeIcon from "./CodeIcon.vue";
import UButton from "../Button.vue";
const props = defineProps({
  icon: { type: null, required: false },
  code: { type: String, required: false },
  language: { type: String, required: false },
  filename: { type: String, required: false },
  highlights: { type: Array, required: false },
  hideHeader: { type: Boolean, required: false },
  meta: { type: String, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
defineSlots();
const { t } = useLocale();
const { copy, copied } = useClipboard();
const appConfig = useAppConfig();
const uiProp = useComponentUI("prose.pre", props);
const baseRef = useTemplateRef("baseRef");
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.pre || {} })());
function copyCode() {
  const code = props.code ?? baseRef.value?.textContent ?? "";
  copy(code);
}
</script>

<template>
  <div :class="ui.root({ class: [uiProp?.root], filename: !!filename })">
    <div v-if="filename && !hideHeader" :class="ui.header({ class: uiProp?.header })">
      <UCodeIcon :icon="icon" :filename="filename" :class="ui.icon({ class: uiProp?.icon })" />

      <span :class="ui.filename({ class: uiProp?.filename })">{{ filename }}</span>
    </div>

    <UButton
      :icon="copied ? appConfig.ui.icons.copyCheck : appConfig.ui.icons.copy"
      color="neutral"
      variant="outline"
      size="sm"
      :aria-label="t('prose.pre.copy')"
      :class="ui.copy({ class: uiProp?.copy })"
      tabindex="-1"
      @click="copyCode"
    />

    <pre ref="baseRef" :class="ui.base({ class: [uiProp?.base, props.class] })" v-bind="$attrs"><slot /></pre>
  </div>
</template>
