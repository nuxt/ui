<script>
import theme from "#build/ui/chat-prompt";
</script>

<script setup>
import { computed, toRef, useTemplateRef } from "vue";
import { Primitive } from "reka-ui";
import { reactivePick } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useComponentProps } from "../composables/useComponentProps";
import { useForwardProps } from "../composables/useForwardProps";
import { useIMEGuard } from "../composables/useIMEGuard";
import { useLocale } from "../composables/useLocale";
import { omit, transformUI } from "../utils";
import { tv } from "../utils/tv";
import UTextarea from "./Textarea.vue";
defineOptions({ inheritAttrs: false });
const _props = defineProps({
  as: { type: null, required: false, default: "form" },
  placeholder: { type: String, required: false },
  variant: { type: null, required: false },
  submitOnEnter: { type: Boolean, required: false, default: true },
  error: { type: Error, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false },
  rows: { type: Number, required: false, default: 1 },
  autofocus: { type: Boolean, required: false, default: true },
  autofocusDelay: { type: Number, required: false },
  autoresize: { type: Boolean, required: false, default: true },
  autoresizeDelay: { type: Number, required: false },
  maxrows: { type: Number, required: false },
  icon: { type: null, required: false },
  avatar: { type: Object, required: false },
  loading: { type: Boolean, required: false },
  loadingIcon: { type: null, required: false },
  disabled: { type: Boolean, required: false }
});
const emits = defineEmits(["submit", "close"]);
const slots = defineSlots();
const props = useComponentProps("chatPrompt", _props);
const model = defineModel({ type: String, ...{ default: "" } });
const { t } = useLocale();
const appConfig = useAppConfig();
const textareaProps = useForwardProps(reactivePick(props, "rows", "autofocus", "autofocusDelay", "autoresize", "autoresizeDelay", "maxrows", "icon", "avatar", "loading", "loadingIcon"));
const getProxySlots = () => omit(slots, ["header", "footer"]);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.chatPrompt || {} })({
  variant: props.variant
}));
const textareaRef = useTemplateRef("textareaRef");
function submit(e) {
  if (model.value.trim() === "") {
    return;
  }
  emits("submit", e);
}
function blur(e) {
  textareaRef.value?.textareaRef?.blur();
  emits("close", e);
}
const { onKeydown: onEnter, onCompositionEnd } = useIMEGuard((event) => {
  submit(event);
});
function handleEnter(event) {
  if (props.submitOnEnter) {
    if (event.shiftKey || event.ctrlKey || event.metaKey || event.altKey) return;
  } else {
    if (!event.ctrlKey && !event.metaKey) return;
  }
  onEnter(event);
}
defineExpose({
  textareaRef: toRef(() => textareaRef.value?.textareaRef)
});
</script>

<template>
  <Primitive :as="props.as" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })" @submit.prevent="submit">
    <div v-if="!!slots.header" data-slot="header" :class="ui.header({ class: props.ui?.header })">
      <slot name="header" />
    </div>

    <UTextarea
      ref="textareaRef"
      v-model="model"
      :placeholder="props.placeholder ?? t('chatPrompt.placeholder')"
      :disabled="Boolean(props.error) || props.disabled"
      variant="none"
      fixed
      v-bind="{ ...textareaProps, ...$attrs }"
      :ui="transformUI(omit(ui, ['root', 'body', 'header', 'footer']), props.ui)"
      data-slot="body"
      :class="ui.body({ class: props.ui?.body })"
      @keydown.enter="handleEnter"
      @compositionend="onCompositionEnd"
      @keydown.esc="blur"
    >
      <template v-for="(_, name) in getProxySlots()" #[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>
    </UTextarea>

    <div v-if="!!slots.footer" data-slot="footer" :class="ui.footer({ class: props.ui?.footer })">
      <slot name="footer" />
    </div>
  </Primitive>
</template>
