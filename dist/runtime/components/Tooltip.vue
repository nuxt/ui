<script>
import theme from "#build/ui/tooltip";
</script>

<script setup>
import { computed, toRef } from "vue";
import { defu } from "defu";
import { TooltipRoot, TooltipTrigger, TooltipPortal, TooltipContent, TooltipArrow, injectTooltipProviderContext } from "reka-ui";
import { reactivePick } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useComponentProps } from "../composables/useComponentProps";
import { useForwardProps } from "../composables/useForwardProps";
import { FieldGroupReset } from "../composables/useFieldGroup";
import { usePortal } from "../composables/usePortal";
import { tv } from "../utils/tv";
import UKbd from "./Kbd.vue";
const _props = defineProps({
  text: { type: String, required: false },
  kbds: { type: Array, required: false },
  content: { type: Object, required: false },
  arrow: { type: [Boolean, Object], required: false },
  portal: { type: [Boolean, String], required: false, skipCheck: true, default: true },
  reference: { type: null, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false },
  defaultOpen: { type: Boolean, required: false },
  open: { type: Boolean, required: false },
  delayDuration: { type: Number, required: false },
  disableHoverableContent: { type: Boolean, required: false },
  disableClosingTrigger: { type: Boolean, required: false },
  disabled: { type: Boolean, required: false },
  ignoreNonKeyboardFocus: { type: Boolean, required: false }
});
const emits = defineEmits(["update:open"]);
const slots = defineSlots();
const props = useComponentProps("tooltip", _props);
const appConfig = useAppConfig();
const providerContext = injectTooltipProviderContext();
const rootProps = useForwardProps(reactivePick(props, "defaultOpen", "open", "delayDuration", "disableHoverableContent", "disableClosingTrigger", "ignoreNonKeyboardFocus"), emits);
const portalProps = usePortal(toRef(() => props.portal));
const contentProps = toRef(() => defu(props.content, providerContext.content.value, { side: "bottom", sideOffset: 8, collisionPadding: 8 }));
const arrowProps = toRef(() => defu(props.arrow, { rounded: true }));
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.tooltip || {} })({
  side: contentProps.value.side
}));
</script>

<template>
  <TooltipRoot v-slot="{ open }" v-bind="rootProps" :disabled="!(props.text || props.kbds?.length || !!slots.content) || props.disabled">
    <TooltipTrigger v-if="!!slots.default || !!props.reference" v-bind="$attrs" as-child :reference="props.reference" :class="props.class">
      <slot :open="open" />
    </TooltipTrigger>

    <TooltipPortal v-bind="portalProps">
      <FieldGroupReset>
        <TooltipContent v-bind="contentProps" data-slot="content" :class="ui.content({ class: [!slots.default && props.class, props.ui?.content] })">
          <slot name="content" :ui="ui">
            <span v-if="props.text" data-slot="text" :class="ui.text({ class: props.ui?.text })">{{ props.text }}</span>

            <span v-if="props.kbds?.length" data-slot="kbds" :class="ui.kbds({ class: props.ui?.kbds })">
              <UKbd v-for="(kbd, index) in props.kbds" :key="index" :size="props.ui?.kbdsSize || ui.kbdsSize()" v-bind="typeof kbd === 'string' ? { value: kbd } : kbd" />
            </span>
          </slot>

          <TooltipArrow v-if="!!props.arrow" v-bind="arrowProps" data-slot="arrow" :class="ui.arrow({ class: props.ui?.arrow })" />
        </TooltipContent>
      </FieldGroupReset>
    </TooltipPortal>
  </TooltipRoot>
</template>
