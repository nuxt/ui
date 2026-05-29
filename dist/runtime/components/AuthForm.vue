<script>
import theme from "#build/ui/auth-form";
</script>

<script setup>
import { reactive, ref, computed, useTemplateRef } from "vue";
import { Primitive } from "reka-ui";
import { useAppConfig } from "#imports";
import { useComponentProps } from "../composables/useComponentProps";
import { useLocale } from "../composables/useLocale";
import { omit, pick } from "../utils";
import { tv } from "../utils/tv";
import UButton from "./Button.vue";
import UIcon from "./Icon.vue";
import USeparator from "./Separator.vue";
import UForm from "./Form.vue";
import UFormField from "./FormField.vue";
import UCheckbox from "./Checkbox.vue";
import USelectMenu from "./SelectMenu.vue";
import UInput from "./Input.vue";
import UPinInput from "./PinInput.vue";
defineOptions({ inheritAttrs: false });
const _props = defineProps({
  as: { type: null, required: false },
  icon: { type: null, required: false },
  title: { type: String, required: false },
  description: { type: String, required: false },
  fields: { type: Array, required: false },
  providers: { type: Array, required: false },
  separator: { type: [String, Object], required: false, default: "or" },
  submit: { type: Object, required: false },
  schema: { type: null, required: false },
  validate: { type: Function, required: false },
  validateOn: { type: Array, required: false },
  validateOnInputDelay: { type: Number, required: false },
  disabled: { type: Boolean, required: false },
  loading: { type: Boolean, required: false },
  loadingAuto: { type: Boolean, required: false },
  class: { type: null, required: false },
  onSubmit: { type: Function, required: false },
  ui: { type: Object, required: false }
});
const state = reactive((_props.fields || []).reduce((acc, field) => {
  if (field.name) {
    acc[field.name] = field.defaultValue;
  }
  return acc;
}, {}));
defineEmits(["submit"]);
const slots = defineSlots();
const props = useComponentProps("authForm", _props);
const { t } = useLocale();
const appConfig = useAppConfig();
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.authForm || {} })());
const formRef = useTemplateRef("formRef");
const passwordVisibility = ref(false);
const passwordRef = useTemplateRef("passwordRef");
function pickFieldProps(field) {
  const fields = ["name", "errorPattern", "help", "error", "hint", "size", "required", "eagerValidation", "validateOnInputDelay"];
  if (field.type === "checkbox") {
    return pick(field, fields);
  }
  return pick(field, [...fields, "label", "description"]);
}
function omitFieldProps(field) {
  const fields = ["errorPattern", "help", "error", "hint", "size", "required", "eagerValidation", "validateOnInputDelay"];
  if (field.type === "checkbox" || field.type === "select" || field.type === "otp") {
    if (field.type === "checkbox") {
      return omit(field, [...fields, "type"]);
    }
    return omit(field, [...fields, "type", "label", "description"]);
  }
  return omit(field, [...fields, "label", "description"]);
}
defineExpose({
  formRef,
  state
});
</script>

<template>
  <Primitive :as="props.as" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div v-if="props.icon || !!slots.leading || (props.title || !!slots.title) || (props.description || !!slots.description) || !!slots.header" data-slot="header" :class="ui.header({ class: props.ui?.header })">
      <slot name="header">
        <div v-if="props.icon || !!slots.leading" data-slot="leading" :class="ui.leading({ class: props.ui?.leading })">
          <slot name="leading" :ui="ui">
            <UIcon v-if="props.icon" :name="props.icon" data-slot="leadingIcon" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
          </slot>
        </div>

        <div v-if="props.title || !!slots.title" data-slot="title" :class="ui.title({ class: props.ui?.title })">
          <slot name="title">
            {{ props.title }}
          </slot>
        </div>

        <div v-if="props.description || !!slots.description" data-slot="description" :class="ui.description({ class: props.ui?.description })">
          <slot name="description">
            {{ props.description }}
          </slot>
        </div>
      </slot>
    </div>

    <div data-slot="body" :class="ui.body({ class: props.ui?.body })">
      <div v-if="props.providers?.length || !!slots.providers" data-slot="providers" :class="ui.providers({ class: props.ui?.providers })">
        <slot name="providers">
          <UButton
            v-for="(provider, index) in props.providers"
            :key="index"
            block
            color="neutral"
            variant="subtle"
            v-bind="provider"
          />
        </slot>
      </div>

      <slot name="separator">
        <USeparator
          v-if="props.providers?.length && props.fields?.length"
          v-bind="typeof props.separator === 'object' ? props.separator : { label: props.separator }"
          data-slot="separator"
          :class="ui.separator({ class: props.ui?.separator })"
        />
      </slot>

      <UForm
        v-if="props.fields?.length"
        ref="formRef"
        :state="state"
        :schema="props.schema"
        :validate="props.validate"
        :validate-on="props.validateOn"
        :disabled="props.disabled"
        :loading-auto="props.loadingAuto"
        data-slot="form"
        :class="ui.form({ class: props.ui?.form })"
        v-bind="$attrs"
        @submit="props.onSubmit"
      >
        <UFormField
          v-for="field in props.fields"
          :key="field.name"
          v-bind="pickFieldProps(field)"
        >
          <slot :name="`${field.name}-field`" v-bind="{ state, field }">
            <UCheckbox
              v-if="field.type === 'checkbox'"
              v-model="state[field.name]"
              data-slot="checkbox"
              :class="ui.checkbox({ class: props.ui?.checkbox })"
              v-bind="omitFieldProps(field)"
            />
            <USelectMenu
              v-else-if="field.type === 'select'"
              v-model="state[field.name]"
              data-slot="select"
              :class="ui.select({ class: props.ui?.select })"
              v-bind="omitFieldProps(field)"
            />
            <UPinInput
              v-else-if="field.type === 'otp'"
              :id="field.name"
              v-model="state[field.name]"
              data-slot="otp"
              :class="ui.otp({ class: props.ui?.otp })"
              v-bind="Object.assign({}, omitFieldProps(field), typeof field.otp === 'object' ? field.otp : {})"
              otp
            />
            <UInput
              v-else-if="field.type === 'password'"
              ref="passwordRef"
              v-model="state[field.name]"
              data-slot="password"
              :class="ui.password({ class: props.ui?.password })"
              v-bind="omitFieldProps(field)"
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
              v-bind="omitFieldProps(field)"
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

        <slot name="submit" :loading="props.loading">
          <UButton
            type="submit"
            :label="t('authForm.submit')"
            block
            :loading="props.loading"
            :loading-auto="props.loadingAuto"
            v-bind="props.submit"
          />
        </slot>
      </UForm>
    </div>

    <div v-if="!!slots.footer" data-slot="footer" :class="ui.footer({ class: props.ui?.footer })">
      <slot name="footer" />
    </div>
  </Primitive>
</template>
