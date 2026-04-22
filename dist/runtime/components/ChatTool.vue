<script>
import theme from "#build/ui/chat-tool";
</script>

<script setup>
import { ref, computed } from "vue";
import { CollapsibleRoot, CollapsibleTrigger, CollapsibleContent } from "reka-ui";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { tv } from "../utils/tv";
import UIcon from "./Icon.vue";
import UChatShimmer from "./ChatShimmer.vue";
const props = defineProps({
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
const appConfig = useAppConfig();
const uiProp = useComponentUI("chatTool", props);
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
    :disabled="disabled"
    :unmount-on-hide="unmountOnHide"
    data-slot="root"
    :class="ui.root({ class: [uiProp?.root, props.class] })"
    @update:open="setOpen"
  >
    <CollapsibleTrigger as-child :disabled="!hasContent">
      <button
        type="button"
        data-slot="trigger"
        :class="ui.trigger({ class: uiProp?.trigger })"
      >
        <span v-if="resolvedIcon || hasContent && chevron === 'leading'" data-slot="leading" :class="ui.leading({ class: uiProp?.leading })">
          <UIcon
            v-if="resolvedIcon"
            :name="resolvedIcon"
            data-slot="leadingIcon"
            :class="ui.leadingIcon({ class: uiProp?.leadingIcon, alone: !(hasContent && chevron === 'leading') })"
          />
          <UIcon
            v-if="hasContent && chevron === 'leading'"
            :name="chevronIconName"
            data-slot="chevronIcon"
            :class="ui.chevronIcon({ class: uiProp?.chevronIcon, alone: !resolvedIcon })"
          />
        </span>

        <span data-slot="label" :class="ui.label({ class: uiProp?.label })">
          <UChatShimmer v-if="streaming && text" :text="text" v-bind="props.shimmer" />
          <template v-else>{{ text }}</template>
          <span v-if="suffix" data-slot="suffix" :class="ui.suffix({ class: uiProp?.suffix })">{{ suffix }}</span>
        </span>

        <UIcon
          v-if="hasContent && chevron === 'trailing'"
          :name="chevronIconName"
          data-slot="trailingIcon"
          :class="ui.trailingIcon({ class: uiProp?.trailingIcon })"
        />
      </button>
    </CollapsibleTrigger>

    <CollapsibleContent data-slot="content" :class="ui.content({ class: uiProp?.content })">
      <div data-slot="body" :class="ui.body({ class: uiProp?.body })">
        <slot :open="isOpen" />
      </div>
    </CollapsibleContent>
  </CollapsibleRoot>
</template>
