<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/auth-form'
import type { ButtonProps, FormProps, FormFieldProps, SeparatorProps, PinInputProps } from '../types'
import type { FormSchema, FormSubmitEvent, InferInput } from '../types/form'
import type { ComponentConfig } from '../types/tv'

type AuthForm = ComponentConfig<typeof theme, AppConfig, 'authForm'>

type AuthFormField = FormFieldProps & {
  name: string
  type?: 'checkbox' | 'select' | 'password' | 'text' | 'otp' | 'email'
  defaultValue?: any
  /*
   * The optional props for the `otp` type.
   * `{ otp: true }`{lang="ts-type"}
   */
  otp?: PinInputProps
}

export interface AuthFormProps<T extends FormSchema = FormSchema<object>, F extends AuthFormField = AuthFormField> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * The icon displayed above the title.
   * @IconifyIcon
   */
  icon?: string
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
  submit?: ButtonProps
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
  leading(props?: {}): any
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
import { omit } from '../utils'
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

const formRef = useTemplateRef('formRef')
const passwordVisibility = ref(false)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.authForm || {}) })())

defineExpose({
  formRef,
  state
})
</script>

<template>
  <Primitive :as="as" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div v-if="(icon || !!slots.icon) || (title || !!slots.title) || (description || !!slots.description) || !!slots.header" :class="ui.header({ class: props.ui?.header })">
      <slot name="header">
        <div v-if="icon || !!slots.leading" :class="ui.leading({ class: props.ui?.leading })">
          <slot name="leading">
            <UIcon v-if="icon" :name="icon" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
          </slot>
        </div>

        <div v-if="title || !!slots.title" :class="ui.title({ class: props.ui?.title })">
          <slot name="title">
            {{ title }}
          </slot>
        </div>

        <div v-if="description || !!slots.description" :class="ui.description({ class: props.ui?.description })">
          <slot name="description">
            {{ description }}
          </slot>
        </div>
      </slot>
    </div>

    <div :class="ui.body({ class: props.ui?.body })">
      <div v-if="providers?.length || !!slots.providers" :class="ui.providers({ class: props.ui?.providers })">
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
        :class="ui.separator({ class: props.ui?.separator })"
      />

      <UForm
        v-if="fields?.length"
        ref="formRef"
        :state="state"
        :schema="schema"
        :validate="validate"
        :validate-on="validateOn"
        :class="ui.form({ class: props.ui?.form })"
        :disabled="disabled"
        :loading-auto="loadingAuto"
        @submit="onSubmit"
      >
        <UFormField
          v-for="field in fields"
          :key="field.name"
          :label="field.type === 'checkbox' ? '' : field.label ?? ''"
          :description="field.description"
          :help="field.help"
          :hint="field.hint"
          :name="field.name"
          :size="field.size"
          :required="field.required"
          :error="field.error"
        >
          <slot :name="`${field.name}-field`" v-bind="{ state, field }">
            <UCheckbox
              v-if="field.type === 'checkbox'"
              v-model="state[field.name]"
              :class="ui.checkbox({ class: props.ui?.checkbox })"
              v-bind="omit(field, ['description', 'help', 'hint', 'size'])"
            />
            <USelectMenu
              v-else-if="field.type === 'select'"
              v-model="state[field.name]"
              :class="ui.select({ class: props.ui?.select })"
              v-bind="omit(field, ['description', 'help', 'hint', 'size'])"
            />
            <UInput
              v-else-if="field.type === 'password'"
              v-model="state[field.name]"
              :class="ui.password({ class: props.ui?.password })"
              :type="passwordVisibility ? 'text' : 'password'"
              v-bind="omit(field, ['label', 'description', 'help', 'hint', 'size', 'type', 'required', 'defaultValue'])"
              :ui="{ root: 'w-full' }"
            >
              <template #trailing>
                <UButton
                  color="neutral"
                  variant="link"
                  size="sm"
                  :icon="passwordVisibility ? appConfig.ui.icons.eyeOff : appConfig.ui.icons.eye"
                  :aria-label="passwordVisibility ? t('authForm.hidePassword') : t('authForm.showPassword')"
                  :aria-pressed="passwordVisibility"
                  aria-controls="password"
                  @click="passwordVisibility = !passwordVisibility"
                />
              </template>
            </UInput>
            <UPinInput
              v-else-if="field.type === 'otp'"
              :id="field.name"
              v-model="state[field.name]"
              :class="ui.otp({ class: props.ui?.otp })"
              otp
              v-bind="field.otp"
            />
            <UInput
              v-else
              v-model="state[field.name]"
              :class="ui.input({ class: props.ui?.input })"
              v-bind="omit(field, ['label', 'description', 'help', 'hint', 'size', 'required', 'defaultValue'])"
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

    <div v-if="!!slots.footer" :class="ui.footer({ class: props.ui?.footer })">
      <slot name="footer" />
    </div>
  </Primitive>
</template>
