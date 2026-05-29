<script>
import theme from "#build/ui/chat-tool";
</script>

<script setup>
import { ref, computed } from "vue";
import { CollapsibleRoot, CollapsibleTrigger, CollapsibleContent } from "reka-ui";
import { useAppConfig } from "#imports";
import { useComponentProps } from "../composables/useComponentProps";
import { tv } from "../utils/tv";
import UIcon from "./Icon.vue";
import UChatShimmer from "./ChatShimmer.vue";
const _props = defineProps({
  text: { type: String, required: false },
  suffix: { type: String, required: false },
  icon: { type: null, required: false },
  loading: { type: Boolean, required: false, default: false },
  loadingIcon: { type: null, required: false },
  streaming: { type: Boolean, required: false, default: false },
  variant: { type: null, required: false, default: "inline" },
  chevron: { type: String, required: false, default: "trailing" },
  chevronIcon: { type: null, required: false },
  shimmer: { type: Object, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false },
  defaultOpen: { type: Boolean, required: false },
  open: { type: Boolean, required: false, default: void 0 },
  disabled: { type: Boolean, required: false },
  unmountOnHide: { type: Boolean, required: false, default: false }
});
const emits = defineEmits(["update:open"]);
const slots = defineSlots();
const props = useComponentProps("chatTool", _props);
const appConfig = useAppConfig();
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.chatTool || {} })({
  variant: props.variant,
  chevron: props.chevron,
  loading: props.loading
}));
const isControlled = computed(() => props.open !== void 0);
const internalOpen = ref(props.defaultOpen ?? false);
const resolvedOpen = computed(() => isControlled.value ? props.open : internalOpen.value);
function setOpen(value) {
  internalOpen.value = value;
  emits("update:open", value);
}
const hasContent = computed(() => !!slots.default);
const resolvedLoadingIcon = computed(() => props.loadingIcon || appConfig.ui.icons?.loading);
const resolvedIcon = computed(() => props.loading ? resolvedLoadingIcon.value : props.icon);
const chevronIconName = computed(() => props.chevronIcon || appConfig.ui.icons?.chevronDown);
</script>

<template>
  <CollapsibleRoot
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
        <span v-if="resolvedIcon || hasContent && props.chevron === 'leading'" data-slot="leading" :class="ui.leading({ class: props.ui?.leading })">
          <UIcon
            v-if="resolvedIcon"
            :name="resolvedIcon"
            data-slot="leadingIcon"
            :class="ui.leadingIcon({ class: props.ui?.leadingIcon, alone: !(hasContent && props.chevron === 'leading') })"
          />
          <UIcon
            v-if="hasContent && props.chevron === 'leading'"
            :name="chevronIconName"
            data-slot="chevronIcon"
            :class="ui.chevronIcon({ class: props.ui?.chevronIcon, alone: !resolvedIcon })"
          />
        </span>

        <span data-slot="label" :class="ui.label({ class: props.ui?.label })">
          <UChatShimmer v-if="props.streaming && props.text" :text="props.text" v-bind="props.shimmer" />
          <template v-else>{{ props.text }}</template>
          <span v-if="props.suffix" data-slot="suffix" :class="ui.suffix({ class: props.ui?.suffix })">{{ props.suffix }}</span>
        </span>

        <UIcon
          v-if="hasContent && props.chevron === 'trailing'"
          :name="chevronIconName"
          data-slot="trailingIcon"
          :class="ui.trailingIcon({ class: props.ui?.trailingIcon })"
        />
      </button>
    </CollapsibleTrigger>

    <CollapsibleContent data-slot="content" :class="ui.content({ class: props.ui?.content })">
      <div data-slot="body" :class="ui.body({ class: props.ui?.body })">
        <slot :open="isOpen" />
      </div>
    </CollapsibleContent>
  </CollapsibleRoot>
</template>
