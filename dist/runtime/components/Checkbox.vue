<script>
import theme from "#build/ui/checkbox";
</script>

<script setup>
import { computed, useAttrs, useId } from "vue";
import { Primitive, CheckboxRoot, CheckboxIndicator, Label } from "reka-ui";
import { reactivePick } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useComponentProps } from "../composables/useComponentProps";
import { useForwardProps } from "../composables/useForwardProps";
import { useFormField } from "../composables/useFormField";
import { tv } from "../utils/tv";
import UIcon from "./Icon.vue";
defineOptions({ inheritAttrs: false });
const _props = defineProps({
  as: { type: null, required: false },
  label: { type: String, required: false },
  description: { type: String, required: false },
  color: { type: null, required: false },
  variant: { type: null, required: false },
  size: { type: null, required: false },
  indicator: { type: null, required: false },
  highlight: { type: Boolean, required: false },
  icon: { type: null, required: false },
  indeterminateIcon: { type: null, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false },
  disabled: { type: Boolean, required: false },
  required: { type: Boolean, required: false },
  name: { type: String, required: false },
  value: { type: null, required: false },
  id: { type: String, required: false },
  defaultValue: { type: null, required: false },
  modelValue: { type: null, required: false },
  trueValue: { type: null, required: false },
  falseValue: { type: null, required: false }
});
const slots = defineSlots();
const emits = defineEmits(["change", "update:modelValue"]);
const props = useComponentProps("checkbox", _props);
const appConfig = useAppConfig();
const rootProps = useForwardProps(reactivePick(props, "required", "value", "defaultValue", "modelValue", "trueValue", "falseValue"), emits);
const { id: _id, emitFormChange, emitFormInput, size, color, highlight, name, disabled, ariaAttrs } = useFormField(_props);
const id = _id.value ?? useId();
const attrs = useAttrs();
const forwardedAttrs = computed(() => {
  const { "data-state": _, ...rest } = attrs;
  return rest;
});
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.checkbox || {} })({
  size: size.value ?? props.size,
  color: color.value ?? props.color,
  variant: props.variant,
  indicator: props.indicator,
  highlight: highlight.value ?? props.highlight,
  required: props.required,
  disabled: disabled.value
}));
function onUpdate(value) {
  const event = new Event("change", { target: { value } });
  emits("change", event);
  emitFormChange();
  emitFormInput();
}
</script>

<template>
  <Primitive :as="!props.variant || props.variant === 'list' ? props.as : Label" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div data-slot="container" :class="ui.container({ class: props.ui?.container })">
      <CheckboxRoot
        :id="id"
        v-bind="{ ...rootProps, ...forwardedAttrs, ...ariaAttrs }"
        :name="name"
        :disabled="disabled"
        data-slot="base"
        :class="ui.base({ class: props.ui?.base })"
        @update:model-value="onUpdate"
      >
        <template #default="{ state }">
          <CheckboxIndicator data-slot="indicator" :class="ui.indicator({ class: props.ui?.indicator })">
            <UIcon v-if="state === 'indeterminate'" :name="props.indeterminateIcon || appConfig.ui.icons.minus" data-slot="icon" :class="ui.icon({ class: props.ui?.icon })" />
            <UIcon v-else :name="props.icon || appConfig.ui.icons.check" data-slot="icon" :class="ui.icon({ class: props.ui?.icon })" />
          </CheckboxIndicator>
        </template>
      </CheckboxRoot>
    </div>

    <div v-if="props.label || !!slots.label || (props.description || !!slots.description)" data-slot="wrapper" :class="ui.wrapper({ class: props.ui?.wrapper })">
      <component :is="!props.variant || props.variant === 'list' ? Label : 'p'" v-if="props.label || !!slots.label" :for="id" data-slot="label" :class="ui.label({ class: props.ui?.label })">
        <slot name="label" :label="props.label">
          {{ props.label }}
        </slot>
      </component>
      <p v-if="props.description || !!slots.description" data-slot="description" :class="ui.description({ class: props.ui?.description })">
        <slot name="description" :description="props.description">
          {{ props.description }}
        </slot>
      </p>
    </div>
  </Primitive>
</template>
