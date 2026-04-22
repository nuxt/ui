<script>
import theme from "#build/ui/switch";
</script>

<script setup>
import { computed, useAttrs, useId } from "vue";
import { Primitive, SwitchRoot, SwitchThumb, useForwardPropsEmits, Label } from "reka-ui";
import { reactivePick } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { useFormField } from "../composables/useFormField";
import { tv } from "../utils/tv";
import UIcon from "./Icon.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  as: { type: null, required: false },
  color: { type: null, required: false },
  size: { type: null, required: false },
  loading: { type: Boolean, required: false },
  loadingIcon: { type: null, required: false },
  checkedIcon: { type: null, required: false },
  uncheckedIcon: { type: null, required: false },
  label: { type: String, required: false },
  description: { type: String, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false },
  disabled: { type: Boolean, required: false },
  id: { type: String, required: false },
  name: { type: String, required: false },
  required: { type: Boolean, required: false },
  value: { type: String, required: false },
  defaultValue: { type: null, required: false },
  modelValue: { type: null, required: false },
  trueValue: { type: null, required: false },
  falseValue: { type: null, required: false }
});
const slots = defineSlots();
const emits = defineEmits(["change", "update:modelValue"]);
const appConfig = useAppConfig();
const uiProp = useComponentUI("switch", props);
const rootProps = useForwardPropsEmits(reactivePick(props, "required", "value", "defaultValue", "modelValue", "trueValue", "falseValue"), emits);
const { id: _id, emitFormChange, emitFormInput, size, color, name, disabled, ariaAttrs } = useFormField(props);
const id = _id.value ?? useId();
const attrs = useAttrs();
const forwardedAttrs = computed(() => {
  const { "data-state": _, ...rest } = attrs;
  return rest;
});
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.switch || {} })({
  size: size.value,
  color: color.value,
  required: props.required,
  loading: props.loading,
  disabled: disabled.value || props.loading
}));
function onUpdate(value) {
  const event = new Event("change", { target: { value } });
  emits("change", event);
  emitFormChange();
  emitFormInput();
}
</script>

<template>
  <Primitive :as="as" data-slot="root" :class="ui.root({ class: [uiProp?.root, props.class] })">
    <div data-slot="container" :class="ui.container({ class: uiProp?.container })">
      <SwitchRoot
        :id="id"
        v-bind="{ ...rootProps, ...forwardedAttrs, ...ariaAttrs }"
        :name="name"
        :disabled="disabled || loading"
        data-slot="base"
        :class="ui.base({ class: uiProp?.base })"
        @update:model-value="onUpdate"
      >
        <SwitchThumb data-slot="thumb" :class="ui.thumb({ class: uiProp?.thumb })">
          <UIcon v-if="loading" :name="loadingIcon || appConfig.ui.icons.loading" data-slot="icon" :class="ui.icon({ class: uiProp?.icon, checked: true, unchecked: true })" />
          <template v-else>
            <UIcon v-if="checkedIcon" :name="checkedIcon" data-slot="icon" :class="ui.icon({ class: uiProp?.icon, checked: true })" />
            <UIcon v-if="uncheckedIcon" :name="uncheckedIcon" data-slot="icon" :class="ui.icon({ class: uiProp?.icon, unchecked: true })" />
          </template>
        </SwitchThumb>
      </SwitchRoot>
    </div>
    <div v-if="label || !!slots.label || (description || !!slots.description)" data-slot="wrapper" :class="ui.wrapper({ class: uiProp?.wrapper })">
      <Label v-if="label || !!slots.label" :for="id" data-slot="label" :class="ui.label({ class: uiProp?.label })">
        <slot name="label" :label="label">
          {{ label }}
        </slot>
      </Label>
      <p v-if="description || !!slots.description" data-slot="description" :class="ui.description({ class: uiProp?.description })">
        <slot name="description" :description="description">
          {{ description }}
        </slot>
      </p>
    </div>
  </Primitive>
</template>
