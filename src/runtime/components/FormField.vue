<script lang="ts">
import type { Ref, VNode } from 'vue'
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
  /** A regular expression to match form error names. Useful for components with array values such as InputTags, where errors include array indices in their name (e.g. `tags.0`). */
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
  label?(props: { label: string | undefined }): VNode[]
  hint?(props: { hint: string | undefined }): VNode[]
  description?(props: { description: string | undefined }): VNode[]
  help?(props: { help: string | undefined }): VNode[]
  error?(props: { error: string | true | undefined }): VNode[]
  default?(props: { error: string | true | undefined }): VNode[]
}
</script>

<script setup lang="ts">
import { computed, ref, inject, provide, useId, watch } from 'vue'
import { Primitive, Label } from 'reka-ui'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../composables/useComponentProps'
import { formFieldInjectionKey, inputIdInjectionKey, formErrorsInjectionKey, formInputsInjectionKey } from '../composables/useFormField'
import { tv } from '../utils/tv'
import type { FormError, FormFieldInjectedOptions } from '../types/form'

const _props = withDefaults(defineProps<FormFieldProps>(), {
  error: undefined,
  orientation: 'vertical'
})
const slots = defineSlots<FormFieldSlots>()

const props = useComponentProps('formField', _props)

const appConfig = useAppConfig() as FormField['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: theme, ...(appConfig.ui?.formField || {}) })({
  size: props.size,
  required: props.required,
  orientation: props.orientation
}))

const formErrors = inject<Ref<FormError[]> | null>(formErrorsInjectionKey, null)

// The matching record is kept apart from its message: a form error with an empty message
// still makes the field invalid, it just has nothing to render for it.
const formError = computed(() => formErrors?.value?.find(error => error.name === props.name || (props.errorPattern && error.name?.match(props.errorPattern))))

// eslint-disable-next-line vue/no-dupe-keys
const error = computed(() => props.error || formError.value?.message)

// `error` declares `Boolean` before `String`, so Vue casts `:error="''"` — and a valueless
// `error` attribute — to `true`. "Is invalid" and "has a message to render" are therefore two
// different facts and must not share a truthiness check: `aria-invalid` follows the first,
// `aria-describedby` the second. The same holds for the other regions below: each renders
// under its own conditions, and one that is not rendered has no id to be described by.
const errorMessage = computed(() => typeof error.value === 'string' && error.value ? error.value : undefined)
const hasError = computed(() => props.error !== false && (!!errorMessage.value || !!slots.error))
const hasLabel = computed(() => !!props.label || !!slots.label)
// The hint used to render only inside the label wrapper, so a field with a hint and no label
// dropped it silently while still advertising `${ariaId}-hint`.
const hasHint = computed(() => !!props.hint || !!slots.hint)
const hasDescription = computed(() => !!props.description || !!slots.description)
// The error takes the help's place, so the help only describes the control while none is shown.
const hasHelp = computed(() => !hasError.value && (!!props.help || !!slots.help))

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
  // Truthy only while the matching region is rendered, so every id derived from these is
  // guaranteed to resolve in the DOM.
  error: hasError.value ? (errorMessage.value ?? true) : undefined,
  invalid: !!props.error || !!formError.value,
  name: props.name,
  size: props.size,
  eagerValidation: props.eagerValidation,
  validateOnInputDelay: props.validateOnInputDelay,
  errorPattern: props.errorPattern,
  hint: hasHint.value ? (props.hint ?? true) : undefined,
  description: hasDescription.value ? (props.description ?? true) : undefined,
  help: hasHelp.value ? (props.help ?? true) : undefined,
  ariaId
}) as FormFieldInjectedOptions<FormFieldProps>))
</script>

<template>
  <Primitive :as="props.as" :data-orientation="props.orientation" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div data-slot="wrapper" :class="ui.wrapper({ class: props.ui?.wrapper })">
      <div v-if="hasLabel || hasHint" data-slot="labelWrapper" :class="ui.labelWrapper({ class: props.ui?.labelWrapper })">
        <Label v-if="hasLabel" :for="id" data-slot="label" :class="ui.label({ class: props.ui?.label })">
          <slot name="label" :label="props.label">
            {{ props.label }}
          </slot>
        </Label>
        <span v-if="hasHint" :id="`${ariaId}-hint`" data-slot="hint" :class="ui.hint({ class: props.ui?.hint })">
          <slot name="hint" :hint="props.hint">
            {{ props.hint }}
          </slot>
        </span>
      </div>

      <p v-if="hasDescription" :id="`${ariaId}-description`" data-slot="description" :class="ui.description({ class: props.ui?.description })">
        <slot name="description" :description="props.description">
          {{ props.description }}
        </slot>
      </p>
    </div>

    <div data-slot="container" :class="[(hasLabel || hasHint || hasDescription) && ui.container({ class: props.ui?.container })]">
      <slot :error="error" />
      <div v-if="hasError" :id="`${ariaId}-error`" data-slot="error" :class="ui.error({ class: props.ui?.error })">
        <slot name="error" :error="error">
          {{ error }}
        </slot>
      </div>
      <div v-else-if="hasHelp" :id="`${ariaId}-help`" data-slot="help" :class="ui.help({ class: props.ui?.help })">
        <slot name="help" :help="props.help">
          {{ props.help }}
        </slot>
      </div>
    </div>
  </Primitive>
</template>
