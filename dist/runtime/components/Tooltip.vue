<script>
import theme from "#build/ui/tooltip";
</script>

<script setup>
import { computed, toRef } from "vue";
import { defu } from "defu";
import { TooltipRoot, TooltipTrigger, TooltipPortal, TooltipContent, TooltipArrow, useForwardPropsEmits, injectTooltipProviderContext } from "reka-ui";
import { reactivePick } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { FieldGroupReset } from "../composables/useFieldGroup";
import { usePortal } from "../composables/usePortal";
import { tv } from "../utils/tv";
import UKbd from "./Kbd.vue";
const props = defineProps({
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
const appConfig = useAppConfig();
const uiProp = useComponentUI("tooltip", props);
const providerContext = injectTooltipProviderContext();
const rootProps = useForwardPropsEmits(reactivePick(props, "defaultOpen", "open", "delayDuration", "disableHoverableContent", "disableClosingTrigger", "ignoreNonKeyboardFocus"), emits);
const portalProps = usePortal(toRef(() => props.portal));
const contentProps = toRef(() => defu(props.content, providerContext.content.value, { side: "bottom", sideOffset: 8, collisionPadding: 8 }));
const arrowProps = toRef(() => defu(props.arrow, { rounded: true }));
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.tooltip || {} })({
  side: contentProps.value.side
}));
</script>

<template>
  <TooltipRoot v-slot="{ open }" v-bind="rootProps" :disabled="!(text || kbds?.length || !!slots.content) || props.disabled">
    <TooltipTrigger v-if="!!slots.default || !!reference" v-bind="$attrs" as-child :reference="reference" :class="props.class">
      <slot :open="open" />
    </TooltipTrigger>

    <TooltipPortal v-bind="portalProps">
      <FieldGroupReset>
        <TooltipContent v-bind="contentProps" data-slot="content" :class="ui.content({ class: [!slots.default && props.class, uiProp?.content] })">
          <slot name="content" :ui="ui">
            <span v-if="text" data-slot="text" :class="ui.text({ class: uiProp?.text })">{{ text }}</span>

            <span v-if="kbds?.length" data-slot="kbds" :class="ui.kbds({ class: uiProp?.kbds })">
              <UKbd v-for="(kbd, index) in kbds" :key="index" :size="uiProp?.kbdsSize || ui.kbdsSize()" v-bind="typeof kbd === 'string' ? { value: kbd } : kbd" />
            </span>
          </slot>

          <TooltipArrow v-if="!!arrow" v-bind="arrowProps" data-slot="arrow" :class="ui.arrow({ class: uiProp?.arrow })" />
        </TooltipContent>
      </FieldGroupReset>
    </TooltipPortal>
  </TooltipRoot>
</template>
