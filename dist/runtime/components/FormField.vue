<script>
import theme from "#build/ui/form-field";
</script>

<script setup>
import { computed, ref, inject, provide, useId, watch } from "vue";
import { Primitive, Label } from "reka-ui";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { formFieldInjectionKey, inputIdInjectionKey, formErrorsInjectionKey, formInputsInjectionKey } from "../composables/useFormField";
import { tv } from "../utils/tv";
const props = defineProps({
  as: { type: null, required: false },
  name: { type: String, required: false },
  errorPattern: { type: null, required: false },
  label: { type: String, required: false },
  description: { type: String, required: false },
  help: { type: String, required: false },
  error: { type: [Boolean, String], required: false, default: void 0 },
  hint: { type: String, required: false },
  size: { type: null, required: false },
  required: { type: Boolean, required: false },
  eagerValidation: { type: Boolean, required: false },
  validateOnInputDelay: { type: Number, required: false },
  orientation: { type: null, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
const slots = defineSlots();
const appConfig = useAppConfig();
const uiProp = useComponentUI("formField", props);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.formField || {} })({
  size: props.size,
  required: props.required,
  orientation: props.orientation
}));
const formErrors = inject(formErrorsInjectionKey, null);
const error = computed(() => props.error || formErrors?.value?.find((error2) => error2.name === props.name || props.errorPattern && error2.name?.match(props.errorPattern))?.message);
const id = ref(useId());
const ariaId = id.value;
const formInputs = inject(formInputsInjectionKey, void 0);
watch(id, () => {
  if (formInputs && props.name) {
    formInputs.value[props.name] = { id: id.value, pattern: props.errorPattern };
  }
}, { immediate: true });
provide(inputIdInjectionKey, id);
provide(formFieldInjectionKey, computed(() => ({
  error: error.value,
  name: props.name,
  size: props.size,
  eagerValidation: props.eagerValidation,
  validateOnInputDelay: props.validateOnInputDelay,
  errorPattern: props.errorPattern,
  hint: props.hint,
  description: props.description,
  help: props.help,
  ariaId
})));
</script>

<template>
  <Primitive :as="as" :data-orientation="orientation" data-slot="root" :class="ui.root({ class: [uiProp?.root, props.class] })">
    <div data-slot="wrapper" :class="ui.wrapper({ class: uiProp?.wrapper })">
      <div v-if="label || !!slots.label" data-slot="labelWrapper" :class="ui.labelWrapper({ class: uiProp?.labelWrapper })">
        <Label :for="id" data-slot="label" :class="ui.label({ class: uiProp?.label })">
          <slot name="label" :label="label">
            {{ label }}
          </slot>
        </Label>
        <span v-if="hint || !!slots.hint" :id="`${ariaId}-hint`" data-slot="hint" :class="ui.hint({ class: uiProp?.hint })">
          <slot name="hint" :hint="hint">
            {{ hint }}
          </slot>
        </span>
      </div>

      <p v-if="description || !!slots.description" :id="`${ariaId}-description`" data-slot="description" :class="ui.description({ class: uiProp?.description })">
        <slot name="description" :description="description">
          {{ description }}
        </slot>
      </p>
    </div>

    <div :class="[(label || !!slots.label || description || !!slots.description) && ui.container({ class: uiProp?.container })]">
      <slot :error="error" />
      <div v-if="props.error !== false && (typeof error === 'string' && error || !!slots.error)" :id="`${ariaId}-error`" data-slot="error" :class="ui.error({ class: uiProp?.error })">
        <slot name="error" :error="error">
          {{ error }}
        </slot>
      </div>
      <div v-else-if="help || !!slots.help" :id="`${ariaId}-help`" data-slot="help" :class="ui.help({ class: uiProp?.help })">
        <slot name="help" :help="help">
          {{ help }}
        </slot>
      </div>
    </div>
  </Primitive>
</template>
