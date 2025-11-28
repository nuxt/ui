<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/auth-form'
import type { ButtonProps, FormProps, FormFieldProps, SeparatorProps, InputProps, CheckboxProps, SelectMenuProps, PinInputProps, IconProps, LinkPropsKeys } from '../types'
import type { FormSchema, FormSubmitEvent, InferInput } from '../types/form'
import type { FormHTMLAttributes } from '../types/html'
import type { NonUnion } from '../types/utils'
import type { ComponentConfig } from '../types/tv'

type AuthForm = ComponentConfig<typeof theme, AppConfig, 'authForm'>

export type AuthFormCheckboxField = Omit<FormFieldProps, 'name'> & CheckboxProps & {
  name: string
  type: 'checkbox'
}

export type AuthFormSelectField = Omit<FormFieldProps, 'name'> & SelectMenuProps & {
  name: string
  type: 'select'
}

export type AuthFormOtpField = Omit<FormFieldProps, 'name'> & Omit<PinInputProps, 'type' | 'otp'> & {
  name: string
  type: 'otp'
  /**
   * @deprecated Bind props directly in the field object.
   * The optional props for the `otp` type.
   * `{ otp: true }`{lang="ts-type"}
   */
  otp?: boolean | PinInputProps
}

export type AuthFormInputFieldType = 'password' | 'text' | 'email' | 'number'

export type AuthFormInputField<T extends AuthFormInputFieldType & NonUnion<T> = 'text'> = Omit<FormFieldProps, 'name'> & Omit<InputProps, 'type'> & {
  name: string
  type: T
}

export type AuthFormField = AuthFormCheckboxField | AuthFormSelectField | AuthFormOtpField | AuthFormInputField<'password'> | AuthFormInputField<'text'> | AuthFormInputField<'email'> | AuthFormInputField<'number'>

export interface AuthFormProps<T extends FormSchema = FormSchema<object>, F extends AuthFormField = AuthFormField> extends /** @vue-ignore */ FormHTMLAttributes {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * The icon displayed above the title.
   * @IconifyIcon
   */
  icon?: IconProps['name']
  title?: string
  description?: string
  fields?: F[]
  /**
   * Display a list of Button under the description.
   * `{ color: 'neutral', variant: 'subtle', block: true }`{lang="ts-type"}
   */
  providers?: ButtonProps[]
  /**
   * The text displayed in the separator.
   * @defaultValue 'or'
   */
  separator?: string | SeparatorProps
  /**
   * Display a submit button at the bottom of the form.
   * `{ label: 'Continue', block: true }`{lang="ts-type"}
   */
  submit?: Omit<ButtonProps, LinkPropsKeys>
  schema?: T
  validate?: FormProps<T>['validate']
  validateOn?: FormProps<T>['validateOn']
  validateOnInputDelay?: FormProps<T>['validateOnInputDelay']
  disabled?: FormProps<T>['disabled']
  loading?: ButtonProps['loading']
  loadingAuto?: FormProps<T>['loadingAuto']
  class?: any
  onSubmit?: FormProps<T>['onSubmit']
  ui?: AuthForm['slots']
}

export type AuthFormEmits<T extends object> = {
  submit: [payload: FormSubmitEvent<T>]
}

type DynamicFieldSlots<T, F, SlotProps = { field: F, state: T }> = Record<string, (props: SlotProps) => any> & Record<`${keyof T extends string ? keyof T : never}-field`, (props: SlotProps) => any>

type DynamicFormFieldSlots<T> = Record<string, (props?: {}) => any> & Record<`${keyof T extends string ? keyof T : never}-${'label' | 'description' | 'hint' | 'help' | 'error'}`, (props?: {}) => any>

export type AuthFormSlots<T extends object = object, F extends AuthFormField = AuthFormField> = {
  header(props?: {}): any
  leading(props: { ui: AuthForm['ui'] }): any
  title(props?: {}): any
  description(props?: {}): any
  providers(props?: {}): any
  validation(props?: {}): any
  submit(props: { loading: boolean }): any
  footer(props?: {}): any
} & DynamicFieldSlots<T, F> & DynamicFormFieldSlots<T>

</script>

<script setup lang="ts" generic="T extends FormSchema, F extends AuthFormField">
import { reactive, ref, computed, useTemplateRef } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { useLocale } from '../composables/useLocale'
import { omit, pick } from '../utils'
import { tv } from '../utils/tv'
import UButton from './Button.vue'
import UIcon from './Icon.vue'
import USeparator from './Separator.vue'
import UForm from './Form.vue'
import UFormField from './FormField.vue'
import UCheckbox from './Checkbox.vue'
import USelectMenu from './SelectMenu.vue'
import UInput from './Input.vue'
import UPinInput from './PinInput.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<AuthFormProps<T, F>>(), {
  separator: 'or'
})

type FormStateType = InferInput<T>

type TypedAuthFormField = AuthFormField & {
  name: keyof FormStateType
  defaultValue?: FormStateType[keyof FormStateType]
}

const state = reactive<FormStateType>((props.fields as TypedAuthFormField[] || []).reduce<FormStateType>((acc, field) => {
  if (field.name) {
    acc[field.name] = field.defaultValue
  }
  return acc
}, {} as FormStateType))

defineEmits<AuthFormEmits<typeof state>>()
const slots = defineSlots<AuthFormSlots<typeof state, F>>()

const { t } = useLocale()
const appConfig = useAppConfig() as AuthForm['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.authForm || {}) })())

const formRef = useTemplateRef('formRef')
const passwordVisibility = ref(false)
const passwordRef = useTemplateRef('passwordRef')

function pickFieldProps(field: F) {
  const fields = ['name', 'errorPattern', 'help', 'error', 'hint', 'size', 'required', 'eagerValidation', 'validateOnInputDelay'] as (keyof F)[]

  // Prevent binding `label` and `description` on Checkbox's FormField
  if (field.type === 'checkbox') {
    return pick(field, fields)
  }

  return pick(field, [...fields, 'label', 'description'])
}

function omitFieldProps(field: F) {
  const fields = ['errorPattern', 'help', 'error', 'hint', 'size', 'required', 'eagerValidation', 'validateOnInputDelay'] as (keyof F)[]

  // Prevent binding `type` on other fields than Input
  if (field.type === 'checkbox' || field.type === 'select' || field.type === 'otp') {
    // Prevent binding `label` and `description` on Checkbox's FormField
    if (field.type === 'checkbox') {
      return omit(field, [...fields, 'type'])
    }

    return omit(field, [...fields, 'type', 'label', 'description'])
  }

  return omit(field, [...fields, 'label', 'description'])
}

defineExpose({
  formRef,
  state
})
</script>

<template>
  <Primitive :as="as" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div v-if="(icon || !!slots.leading) || (title || !!slots.title) || (description || !!slots.description) || !!slots.header" data-slot="header" :class="ui.header({ class: props.ui?.header })">
      <slot name="header">
        <div v-if="icon || !!slots.leading" data-slot="leading" :class="ui.leading({ class: props.ui?.leading })">
          <slot name="leading" :ui="ui">
            <UIcon v-if="icon" :name="icon" data-slot="leadingIcon" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
          </slot>
        </div>

        <div v-if="title || !!slots.title" data-slot="title" :class="ui.title({ class: props.ui?.title })">
          <slot name="title">
            {{ title }}
          </slot>
        </div>

        <div v-if="description || !!slots.description" data-slot="description" :class="ui.description({ class: props.ui?.description })">
          <slot name="description">
            {{ description }}
          </slot>
        </div>
      </slot>
    </div>

    <div data-slot="body" :class="ui.body({ class: props.ui?.body })">
      <div v-if="providers?.length || !!slots.providers" data-slot="providers" :class="ui.providers({ class: props.ui?.providers })">
        <slot name="providers">
          <UButton
            v-for="(provider, index) in providers"
            :key="index"
            block
            color="neutral"
            variant="subtle"
            v-bind="provider"
          />
        </slot>
      </div>

      <USeparator
        v-if="providers?.length && fields?.length"
        v-bind="typeof separator === 'object' ? separator : { label: separator }"
        data-slot="separator"
        :class="ui.separator({ class: props.ui?.separator })"
      />

      <UForm
        v-if="fields?.length"
        ref="formRef"
        :state="state"
        :schema="schema"
        :validate="validate"
        :validate-on="validateOn"
        :disabled="disabled"
        :loading-auto="loadingAuto"
        data-slot="form"
        :class="ui.form({ class: props.ui?.form })"
        v-bind="$attrs"
        @submit="onSubmit"
      >
        <UFormField
          v-for="field in fields"
          :key="field.name"
          v-bind="pickFieldProps(field)"
        >
          <slot :name="`${field.name}-field`" v-bind="{ state, field }">
            <UCheckbox
              v-if="field.type === 'checkbox'"
              v-model="state[field.name]"
              data-slot="checkbox"
              :class="ui.checkbox({ class: props.ui?.checkbox })"
              v-bind="(omitFieldProps(field))"
            />
            <USelectMenu
              v-else-if="field.type === 'select'"
              v-model="state[field.name]"
              data-slot="select"
              :class="ui.select({ class: props.ui?.select })"
              v-bind="(omitFieldProps(field) as AuthFormSelectField)"
            />
            <UPinInput
              v-else-if="field.type === 'otp'"
              :id="field.name"
              v-model="state[field.name]"
              data-slot="otp"
              :class="ui.otp({ class: props.ui?.otp })"
              v-bind="(Object.assign({}, omitFieldProps(field), typeof (field as AuthFormOtpField).otp === 'object' ? (field as AuthFormOtpField).otp : {}) as any)"
              otp
            />
            <UInput
              v-else-if="field.type === 'password'"
              ref="passwordRef"
              v-model="state[field.name]"
              data-slot="password"
              :class="ui.password({ class: props.ui?.password })"
              v-bind="(omitFieldProps(field) as AuthFormInputField<'password'>)"
              :type="passwordVisibility ? 'text' : 'password'"
            >
              <template #trailing>
                <UButton
                  color="neutral"
                  variant="link"
                  size="sm"
                  :icon="passwordVisibility ? appConfig.ui.icons.eyeOff : appConfig.ui.icons.eye"
                  :aria-label="passwordVisibility ? t('authForm.hidePassword') : t('authForm.showPassword')"
                  :aria-pressed="passwordVisibility"
                  :aria-controls="passwordRef?.[0]?.inputRef?.id"
                  @click="passwordVisibility = !passwordVisibility"
                />
              </template>
            </UInput>
            <UInput
              v-else
              v-model="state[field.name]"
              data-slot="input"
              :class="ui.input({ class: props.ui?.input })"
              v-bind="(omitFieldProps(field) as AuthFormInputField)"
            />
          </slot>

          <template v-if="!!slots[`${field.name}-label`]" #label>
            <slot :name="`${field.name}-label`" />
          </template>
          <template v-if="!!slots[`${field.name}-description`]" #description>
            <slot :name="`${field.name}-description`" />
          </template>
          <template v-if="!!slots[`${field.name}-hint`]" #hint>
            <slot :name="`${field.name}-hint`" />
          </template>
          <template v-if="!!slots[`${field.name}-help`]" #help>
            <slot :name="`${field.name}-help`" />
          </template>
          <template v-if="!!slots[`${field.name}-error`]" #error>
            <slot :name="`${field.name}-error`" />
          </template>
        </UFormField>

        <slot v-if="!!slots.validation" name="validation" />

        <slot name="submit" :loading="loading">
          <UButton
            type="submit"
            :label="t('authForm.submit')"
            block
            :loading="loading"
            :loading-auto="loadingAuto"
            v-bind="submit"
          />
        </slot>
      </UForm>
    </div>

    <div v-if="!!slots.footer" data-slot="footer" :class="ui.footer({ class: props.ui?.footer })">
      <slot name="footer" />
    </div>
  </Primitive>
</template>
