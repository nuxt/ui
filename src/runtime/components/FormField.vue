<script lang="ts">
import type { Ref } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/form-field'
import type { ComponentConfig } from '../types/tv'

type FormField = ComponentConfig<typeof theme, AppConfig, 'formField'>

export interface FormFieldProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /** The name of the FormField. Also used to match form errors. */
  name?: string
  /** A regular expression to match form error names. */
  errorPattern?: RegExp
  label?: string
  description?: string
  help?: string
  error?: boolean | string
  hint?: string
  /**
   * @defaultValue 'md'
   */
  size?: FormField['variants']['size']
  required?: boolean
  /** If true, validation on input will be active immediately instead of waiting for a blur event. */
  eagerValidation?: boolean
  /**
   * Delay in milliseconds before validating the form on input events.
   * @defaultValue `300`
   */
  validateOnInputDelay?: number
  /**
   * The orientation of the form field.
   * @defaultValue 'vertical'
   */
  orientation?: FormField['variants']['orientation']
  class?: any
  ui?: FormField['slots']
}

export interface FormFieldSlots {
  label(props: { label?: string }): any
  hint(props: { hint?: string }): any
  description(props: { description?: string }): any
  help(props: { help?: string }): any
  error(props: { error?: boolean | string }): any
  default(props: { error?: boolean | string }): any
}
</script>

<script setup lang="ts">
import { computed, ref, inject, provide, useId, watch } from 'vue'
import { Primitive, Label } from 'reka-ui'
import { useAppConfig } from '#imports'
import { useComponentUI } from '../composables/useComponentUI'
import { formFieldInjectionKey, inputIdInjectionKey, formErrorsInjectionKey, formInputsInjectionKey } from '../composables/useFormField'
import { tv } from '../utils/tv'
import type { FormError, FormFieldInjectedOptions } from '../types/form'

const props = withDefaults(defineProps<FormFieldProps>(), {
  error: undefined
})
const slots = defineSlots<FormFieldSlots>()

const appConfig = useAppConfig() as FormField['AppConfig']
const uiProp = useComponentUI('formField', props)

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.formField || {}) })({
  size: props.size,
  required: props.required,
  orientation: props.orientation
}))

const formErrors = inject<Ref<FormError[]> | null>(formErrorsInjectionKey, null)

const error = computed(() => props.error || formErrors?.value?.find(error => error.name === props.name || (props.errorPattern && error.name?.match(props.errorPattern)))?.message)

const id = ref(useId())
// Copies id's initial value to bind aria-attributes such as aria-describedby.
// This is required for the RadioGroup component which unsets the id value.
const ariaId = id.value

const formInputs = inject(formInputsInjectionKey, undefined)
watch(id, () => {
  if (formInputs && props.name) {
    formInputs.value[props.name] = { id: id.value, pattern: props.errorPattern }
  }
}, { immediate: true })

provide(inputIdInjectionKey, id)

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
}) as FormFieldInjectedOptions<FormFieldProps>))
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
      <div v-if="props.error !== false && ((typeof error === 'string' && error) || !!slots.error)" :id="`${ariaId}-error`" data-slot="error" :class="ui.error({ class: uiProp?.error })">
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
