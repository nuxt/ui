<script>
import theme from "#build/ui/form-field";
</script>

<script setup>
import { computed, ref, inject, provide, useId, watch } from "vue";
import { Primitive, Label } from "reka-ui";
import { useAppConfig } from "#imports";
import { useComponentProps } from "../composables/useComponentProps";
import { formFieldInjectionKey, inputIdInjectionKey, formErrorsInjectionKey, formInputsInjectionKey } from "../composables/useFormField";
import { tv } from "../utils/tv";
const _props = defineProps({
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
  orientation: { type: null, required: false, default: "vertical" },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
const slots = defineSlots();
const props = useComponentProps("formField", _props);
const appConfig = useAppConfig();
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
  <Primitive :as="props.as" :data-orientation="props.orientation" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div data-slot="wrapper" :class="ui.wrapper({ class: props.ui?.wrapper })">
      <div v-if="props.label || !!slots.label" data-slot="labelWrapper" :class="ui.labelWrapper({ class: props.ui?.labelWrapper })">
        <Label :for="id" data-slot="label" :class="ui.label({ class: props.ui?.label })">
          <slot name="label" :label="props.label">
            {{ props.label }}
          </slot>
        </Label>
        <span v-if="props.hint || !!slots.hint" :id="`${ariaId}-hint`" data-slot="hint" :class="ui.hint({ class: props.ui?.hint })">
          <slot name="hint" :hint="props.hint">
            {{ props.hint }}
          </slot>
        </span>
      </div>

      <p v-if="props.description || !!slots.description" :id="`${ariaId}-description`" data-slot="description" :class="ui.description({ class: props.ui?.description })">
        <slot name="description" :description="props.description">
          {{ props.description }}
        </slot>
      </p>
    </div>

    <div :class="[(props.label || !!slots.label || props.description || !!slots.description) && ui.container({ class: props.ui?.container })]">
      <slot :error="error" />
      <div v-if="props.error !== false && (typeof error === 'string' && error || !!slots.error)" :id="`${ariaId}-error`" data-slot="error" :class="ui.error({ class: props.ui?.error })">
        <slot name="error" :error="error">
          {{ error }}
        </slot>
      </div>
      <div v-else-if="props.help || !!slots.help" :id="`${ariaId}-help`" data-slot="help" :class="ui.help({ class: props.ui?.help })">
        <slot name="help" :help="props.help">
          {{ props.help }}
        </slot>
      </div>
    </div>
  </Primitive>
</template>
