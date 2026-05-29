<script>
import theme from "#build/ui/chat-reasoning";
</script>

<script setup>
import { ref, computed, watch, onUnmounted, nextTick, useTemplateRef } from "vue";
import { CollapsibleRoot, CollapsibleTrigger, CollapsibleContent } from "reka-ui";
import { useAppConfig } from "#imports";
import { useComponentProps } from "../composables/useComponentProps";
import { useLocale } from "../composables/useLocale";
import { useScrollShadow } from "../composables/useScrollShadow";
import { tv } from "../utils/tv";
import UIcon from "./Icon.vue";
import UChatShimmer from "./ChatShimmer.vue";
const _props = defineProps({
  text: { type: String, required: false },
  streaming: { type: Boolean, required: false, default: false },
  duration: { type: Number, required: false },
  icon: { type: null, required: false },
  chevron: { type: String, required: false, default: "trailing" },
  chevronIcon: { type: null, required: false },
  autoCloseDelay: { type: Number, required: false, default: 500 },
  shimmer: { type: Object, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false },
  defaultOpen: { type: Boolean, required: false },
  open: { type: Boolean, required: false, default: void 0 },
  disabled: { type: Boolean, required: false },
  unmountOnHide: { type: Boolean, required: false, default: false }
});
const emits = defineEmits(["update:open"]);
defineSlots();
const props = useComponentProps("chatReasoning", _props);
const { t, code } = useLocale();
const appConfig = useAppConfig();
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.chatReasoning || {} })({
  chevron: props.chevron
}));
const isControlled = computed(() => props.open !== void 0);
const internalOpen = ref(props.defaultOpen ?? props.streaming);
const startTime = ref(props.streaming ? Date.now() : null);
const internalDuration = ref(void 0);
const autoCloseTimeout = ref(null);
watch(() => props.streaming, (streaming, wasStreaming) => {
  if (streaming) {
    if (autoCloseTimeout.value) {
      clearTimeout(autoCloseTimeout.value);
      autoCloseTimeout.value = null;
    }
    if (!wasStreaming) {
      setOpen(true);
      startTime.value = Date.now();
    }
  } else if (wasStreaming) {
    if (startTime.value !== null) {
      internalDuration.value = Math.ceil((Date.now() - startTime.value) / 1e3);
      startTime.value = null;
    }
    if (props.autoCloseDelay > 0) {
      autoCloseTimeout.value = setTimeout(() => {
        setOpen(false);
      }, props.autoCloseDelay);
    }
  }
}, { immediate: true });
const actualDuration = computed(() => props.duration ?? internalDuration.value);
const thinkingText = computed(() => {
  if (props.streaming || actualDuration.value === 0) {
    return t("chatReasoning.thinking");
  }
  if (actualDuration.value === void 0) {
    return t("chatReasoning.thought");
  }
  const d = actualDuration.value;
  const unit = d < 60 ? "second" : "minute";
  const value = d < 60 ? d : Math.floor(d / 60);
  const duration = new Intl.NumberFormat(code.value, { style: "unit", unit, unitDisplay: "long" }).format(value);
  return t("chatReasoning.thoughtFor", { duration });
});
const resolvedOpen = computed(() => isControlled.value ? props.open : internalOpen.value);
function setOpen(value) {
  if (autoCloseTimeout.value) {
    clearTimeout(autoCloseTimeout.value);
    autoCloseTimeout.value = null;
  }
  internalOpen.value = value;
  emits("update:open", value);
}
onUnmounted(() => {
  if (autoCloseTimeout.value) {
    clearTimeout(autoCloseTimeout.value);
  }
});
const hasContent = computed(() => !!props.text || props.streaming);
const chevronIconName = computed(() => props.chevronIcon || appConfig.ui.icons?.chevronDown);
const bodyRef = useTemplateRef("bodyRef");
const { style: scrollShadowStyle } = useScrollShadow(bodyRef);
watch(() => props.text, () => {
  if (!props.streaming || !bodyRef.value) return;
  const el = bodyRef.value;
  const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
  if (distanceFromBottom < 50) {
    nextTick(() => {
      el.scrollTop = el.scrollHeight;
    });
  }
});
</script>

<template>
  <CollapsibleRoot
    v-if="hasContent"
    v-slot="{ open: isOpen }"
    :open="resolvedOpen"
    :disabled="props.disabled"
    :unmount-on-hide="props.unmountOnHide"
    data-slot="root"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
    @update:open="setOpen"
  >
    <CollapsibleTrigger as-child :disabled="!hasContent">
      <button
        type="button"
        data-slot="trigger"
        :class="ui.trigger({ class: props.ui?.trigger })"
      >
        <span v-if="props.icon || hasContent && props.chevron === 'leading'" data-slot="leading" :class="ui.leading({ class: props.ui?.leading })">
          <UIcon
            v-if="props.icon"
            :name="props.icon"
            data-slot="leadingIcon"
            :class="ui.leadingIcon({ class: props.ui?.leadingIcon, alone: !(hasContent && props.chevron === 'leading') })"
          />
          <UIcon
            v-if="hasContent && props.chevron === 'leading'"
            :name="chevronIconName"
            data-slot="chevronIcon"
            :class="ui.chevronIcon({ class: props.ui?.chevronIcon, alone: !props.icon })"
          />
        </span>

        <UChatShimmer v-if="props.streaming" :text="thinkingText" v-bind="props.shimmer" data-slot="label" :class="ui.label({ class: props.ui?.label })" />
        <span v-else data-slot="label" :class="ui.label({ class: props.ui?.label })">{{ thinkingText }}</span>

        <UIcon
          v-if="hasContent && props.chevron === 'trailing'"
          :name="chevronIconName"
          data-slot="trailingIcon"
          :class="ui.trailingIcon({ class: props.ui?.trailingIcon })"
        />
      </button>
    </CollapsibleTrigger>

    <CollapsibleContent data-slot="content" :class="ui.content({ class: props.ui?.content })">
      <div ref="bodyRef" data-slot="body" :class="ui.body({ class: props.ui?.body })" :style="scrollShadowStyle">
        <slot :open="isOpen">
          {{ props.text }}
        </slot>
      </div>
    </CollapsibleContent>
  </CollapsibleRoot>
</template>
