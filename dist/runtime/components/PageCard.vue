<script>
import theme from "#build/ui/page-card";
</script>

<script setup>
import { computed, ref, watch } from "vue";
import { Primitive } from "reka-ui";
import { useMouseInElement, pausableFilter } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { getSlotChildrenText } from "../utils";
import { tv } from "../utils/tv";
import ULink from "./Link.vue";
import UIcon from "./Icon.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  as: { type: null, required: false },
  icon: { type: null, required: false },
  title: { type: String, required: false },
  description: { type: String, required: false },
  orientation: { type: null, required: false, default: "vertical" },
  reverse: { type: Boolean, required: false },
  highlight: { type: Boolean, required: false },
  highlightColor: { type: null, required: false },
  spotlight: { type: Boolean, required: false },
  spotlightColor: { type: null, required: false },
  variant: { type: null, required: false },
  to: { type: null, required: false },
  target: { type: [String, Object, null], required: false },
  onClick: { type: Function, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
const slots = defineSlots();
const cardRef = ref();
const motionControl = pausableFilter();
const appConfig = useAppConfig();
const uiProp = useComponentUI("pageCard", props);
const { elementX, elementY } = useMouseInElement(cardRef, {
  eventFilter: motionControl.eventFilter
});
const spotlight = computed(() => props.spotlight && (elementX.value !== 0 || elementY.value !== 0));
watch(() => props.spotlight, (value) => {
  if (value) {
    motionControl.resume();
  } else {
    motionControl.pause();
  }
}, { immediate: true });
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.pageCard || {} })({
  orientation: props.orientation,
  reverse: props.reverse,
  variant: props.variant,
  to: !!props.to || !!props.onClick,
  title: !!props.title || !!slots.title,
  highlight: props.highlight,
  highlightColor: props.highlightColor,
  spotlight: spotlight.value,
  spotlightColor: props.spotlightColor
}));
const ariaLabel = computed(() => {
  const slotText = slots.title && getSlotChildrenText(slots.title());
  return (slotText || props.title || "Card link").trim();
});
</script>

<template>
  <Primitive
    ref="cardRef"
    :as="as"
    :data-orientation="orientation"
    data-slot="root"
    :class="ui.root({ class: [uiProp?.root, props.class] })"
    :style="spotlight && { '--spotlight-x': `${elementX}px`, '--spotlight-y': `${elementY}px` }"
    @click="onClick"
  >
    <div v-if="props.spotlight" data-slot="spotlight" :class="ui.spotlight({ class: uiProp?.spotlight })" />

    <div data-slot="container" :class="ui.container({ class: uiProp?.container })">
      <div v-if="!!slots.header || (icon || !!slots.leading) || !!slots.body || (title || !!slots.title) || (description || !!slots.description) || !!slots.footer" data-slot="wrapper" :class="ui.wrapper({ class: uiProp?.wrapper })">
        <div v-if="!!slots.header" data-slot="header" :class="ui.header({ class: uiProp?.header })">
          <slot name="header" />
        </div>

        <div v-if="icon || !!slots.leading" data-slot="leading" :class="ui.leading({ class: uiProp?.leading })">
          <slot name="leading" :ui="ui">
            <UIcon v-if="icon" :name="icon" data-slot="leadingIcon" :class="ui.leadingIcon({ class: uiProp?.leadingIcon })" />
          </slot>
        </div>

        <div v-if="!!slots.body || (title || !!slots.title) || (description || !!slots.description)" data-slot="body" :class="ui.body({ class: uiProp?.body })">
          <slot name="body">
            <div v-if="title || !!slots.title" data-slot="title" :class="ui.title({ class: uiProp?.title })">
              <slot name="title">
                {{ title }}
              </slot>
            </div>

            <div v-if="description || !!slots.description" data-slot="description" :class="ui.description({ class: uiProp?.description })">
              <slot name="description">
                {{ description }}
              </slot>
            </div>
          </slot>
        </div>

        <div v-if="!!slots.footer" data-slot="footer" :class="ui.footer({ class: uiProp?.footer })">
          <slot name="footer" />
        </div>
      </div>

      <slot />
    </div>

    <ULink
      v-if="to"
      :aria-label="ariaLabel"
      v-bind="{ to, target, ...$attrs }"
      class="focus:outline-none peer"
      raw
    >
      <span class="absolute inset-0" aria-hidden="true" />
    </ULink>
  </Primitive>
</template>
