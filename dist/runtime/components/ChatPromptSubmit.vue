<script>
import theme from "#build/ui/chat-prompt-submit";
</script>

<script setup>
import { computed } from "vue";
import { useForwardProps } from "reka-ui";
import { reactiveOmit } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { useLocale } from "../composables/useLocale";
import { transformUI } from "../utils";
import { tv } from "../utils/tv";
import UButton from "./Button.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  status: { type: String, required: false, default: "ready" },
  icon: { type: null, required: false },
  color: { type: null, required: false },
  variant: { type: null, required: false },
  streamingIcon: { type: null, required: false },
  streamingColor: { type: null, required: false, default: "neutral" },
  streamingVariant: { type: null, required: false, default: "subtle" },
  submittedIcon: { type: null, required: false },
  submittedColor: { type: null, required: false, default: "neutral" },
  submittedVariant: { type: null, required: false, default: "subtle" },
  errorIcon: { type: null, required: false },
  errorColor: { type: null, required: false, default: "error" },
  errorVariant: { type: null, required: false, default: "soft" },
  ui: { type: Object, required: false },
  class: { type: null, required: false },
  label: { type: String, required: false },
  activeColor: { type: null, required: false },
  activeVariant: { type: null, required: false },
  size: { type: null, required: false },
  square: { type: Boolean, required: false },
  block: { type: Boolean, required: false },
  loadingAuto: { type: Boolean, required: false },
  onClick: { type: [Function, Array], required: false },
  avatar: { type: Object, required: false },
  leading: { type: Boolean, required: false },
  leadingIcon: { type: null, required: false },
  trailing: { type: Boolean, required: false },
  trailingIcon: { type: null, required: false },
  loading: { type: Boolean, required: false },
  loadingIcon: { type: null, required: false },
  as: { type: null, required: false },
  type: { type: null, required: false },
  disabled: { type: Boolean, required: false },
  exactActiveClass: { type: String, required: false },
  viewTransition: { type: Boolean, required: false }
});
const emits = defineEmits(["stop", "reload"]);
const slots = defineSlots();
const { t } = useLocale();
const appConfig = useAppConfig();
const uiProp = useComponentUI("chatPromptSubmit", props);
const buttonProps = useForwardProps(reactiveOmit(props, "icon", "color", "variant", "status", "disabled", "streamingIcon", "streamingColor", "streamingVariant", "submittedIcon", "submittedColor", "submittedVariant", "errorIcon", "errorColor", "errorVariant", "class", "ui"));
const disabled = computed(() => props.status === "ready" ? props.disabled : false);
const statusButtonProps = computed(() => ({
  ready: {
    icon: props.icon || appConfig.ui.icons.arrowUp,
    color: props.color,
    variant: props.variant,
    type: "submit"
  },
  submitted: {
    icon: props.submittedIcon || appConfig.ui.icons.stop,
    color: props.submittedColor,
    variant: props.submittedVariant,
    onClick(e) {
      emits("stop", e);
    }
  },
  streaming: {
    icon: props.streamingIcon || appConfig.ui.icons.stop,
    color: props.streamingColor,
    variant: props.streamingVariant,
    onClick(e) {
      emits("stop", e);
    }
  },
  error: {
    icon: props.errorIcon || appConfig.ui.icons.reload,
    color: props.errorColor,
    variant: props.errorVariant,
    onClick(e) {
      emits("reload", e);
    }
  }
})[props.status]);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.chatPromptSubmit || {} })());
</script>

<template>
  <UButton
    v-bind="{
  ...buttonProps,
  ...statusButtonProps,
  disabled,
  'aria-label': t('chatPromptSubmit.label'),
  ...$attrs
}"
    :class="ui.base({ class: [uiProp?.base, props.class] })"
    :ui="transformUI(ui, uiProp)"
  >
    <template v-for="(_, name) in slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>
  </UButton>
</template>
