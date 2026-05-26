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
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.formField || {}) })({
  size: props.size,
  required: props.required,
  orientation: props.orientation
}))

const formErrors = inject<Ref<FormError[]> | null>(formErrorsInjectionKey, null)

// eslint-disable-next-line vue/no-dupe-keys
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
      <div v-if="props.error !== false && ((typeof error === 'string' && error) || !!slots.error)" :id="`${ariaId}-error`" data-slot="error" :class="ui.error({ class: props.ui?.error })">
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
