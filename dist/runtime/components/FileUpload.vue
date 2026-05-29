<script>
import theme from "#build/ui/file-upload";
</script>

<script setup>
import { computed, toRef, toRefs, watch } from "vue";
import { Primitive, VisuallyHidden } from "reka-ui";
import { createReusableTemplate } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useLocale } from "../composables/useLocale";
import { useComponentProps } from "../composables/useComponentProps";
import { useFormField } from "../composables/useFormField";
import { useFileUpload } from "../composables/useFileUpload";
import { tv } from "../utils/tv";
import UAvatar from "./Avatar.vue";
import UButton from "./Button.vue";
import UIcon from "./Icon.vue";
defineOptions({ inheritAttrs: false });
const _props = defineProps({
  as: { type: null, required: false },
  id: { type: String, required: false },
  name: { type: String, required: false },
  icon: { type: null, required: false },
  label: { type: String, required: false },
  description: { type: String, required: false },
  color: { type: null, required: false },
  variant: { type: null, required: false },
  size: { type: null, required: false },
  layout: { type: null, required: false, default: "grid" },
  position: { type: null, required: false, default: "outside" },
  highlight: { type: Boolean, required: false },
  accept: { type: String, required: false, default: "*" },
  multiple: { type: Boolean, required: false, default: false },
  reset: { type: Boolean, required: false, default: false },
  dropzone: { type: Boolean, required: false, default: true },
  interactive: { type: Boolean, required: false, default: true },
  required: { type: Boolean, required: false },
  disabled: { type: Boolean, required: false },
  fileIcon: { type: null, required: false },
  fileImage: { type: Boolean, required: false, default: true },
  fileDelete: { type: [Boolean, Object], required: false, default: true },
  fileDeleteIcon: { type: null, required: false },
  preview: { type: Boolean, required: false, default: true },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
const emits = defineEmits(["change"]);
const slots = defineSlots();
const modelValue = defineModel({ type: null });
const props = useComponentProps("fileUpload", _props);
const appConfig = useAppConfig();
const { t } = useLocale();
const [DefineFilesTemplate, ReuseFilesTemplate] = createReusableTemplate();
const { accept, multiple, reset } = toRefs(_props);
const { isDragging, open, inputRef, dropzoneRef } = useFileUpload({
  accept,
  reset,
  multiple,
  dropzone: props.dropzone,
  onUpdate
});
const { emitFormInput, emitFormChange, id, name, color, highlight, disabled, ariaAttrs } = useFormField(_props);
const variant = computed(() => props.multiple ? "area" : props.variant);
const layout = computed(() => props.variant === "button" && !props.multiple ? "grid" : props.layout);
const position = computed(() => {
  if (layout.value === "grid" && props.multiple) {
    return "inside";
  }
  if (variant.value === "button") {
    return "outside";
  }
  return props.position;
});
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.fileUpload || {} })({
  dropzone: props.dropzone,
  interactive: props.interactive,
  color: color.value ?? props.color,
  size: props.size,
  variant: variant.value,
  layout: layout.value,
  position: position.value,
  multiple: props.multiple,
  highlight: highlight.value ?? props.highlight,
  disabled: props.disabled
}));
function createObjectUrl(file) {
  if (!props.fileImage) return void 0;
  return URL.createObjectURL(file);
}
function formatFileSize(bytes) {
  if (bytes === 0) {
    return "0B";
  }
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = bytes / Math.pow(k, i);
  const formattedSize = i === 0 ? size.toString() : size.toFixed(0);
  return `${formattedSize}${sizes[i]}`;
}
function onUpdate(files, reset2 = false) {
  if (props.multiple) {
    if (reset2) {
      modelValue.value = files;
    } else {
      const existingFiles = modelValue.value || [];
      modelValue.value = [...existingFiles, ...files || []];
    }
  } else {
    modelValue.value = files?.[0] ?? null;
  }
  const event = new Event("change", { target: { value: modelValue.value } });
  emits("change", event);
  emitFormChange();
  emitFormInput();
}
function removeFile(index) {
  if (!modelValue.value) {
    return;
  }
  if (!props.multiple || index === void 0) {
    onUpdate([], true);
    dropzoneRef.value?.focus();
    return;
  }
  const files = [...modelValue.value];
  files.splice(index, 1);
  onUpdate(files, true);
  dropzoneRef.value?.focus();
}
watch(modelValue, (newValue) => {
  const hasModelReset = props.multiple ? !newValue?.length : !newValue;
  if (hasModelReset && inputRef.value?.$el) {
    inputRef.value.$el.value = "";
  }
});
defineExpose({
  inputRef: toRef(() => inputRef.value?.$el),
  dropzoneRef
});
</script>

<template>
  <DefineFilesTemplate>
    <template v-if="props.preview && modelValue && (Array.isArray(modelValue) ? modelValue.length : true)">
      <slot name="files-top" :files="modelValue" :open="open" :remove-file="removeFile" />

      <div data-slot="files" :class="ui.files({ class: props.ui?.files })">
        <slot name="files" :files="modelValue">
          <div v-for="(file, index) in Array.isArray(modelValue) ? modelValue : [modelValue]" :key="file.name" data-slot="file" :class="ui.file({ class: props.ui?.file })">
            <slot name="file" :file="file" :index="index">
              <slot name="file-leading" :file="file" :index="index" :ui="ui">
                <UAvatar
                  :as="{ img: 'img' }"
                  :src="createObjectUrl(file)"
                  :icon="props.fileIcon || appConfig.ui.icons.file"
                  :size="props.size"
                  data-slot="fileLeadingAvatar"
                  :class="ui.fileLeadingAvatar({ class: props.ui?.fileLeadingAvatar })"
                />
              </slot>

              <div data-slot="fileWrapper" :class="ui.fileWrapper({ class: props.ui?.fileWrapper })">
                <span data-slot="fileName" :class="ui.fileName({ class: props.ui?.fileName })">
                  <slot name="file-name" :file="file" :index="index">
                    {{ file.name }}
                  </slot>
                </span>

                <span data-slot="fileSize" :class="ui.fileSize({ class: props.ui?.fileSize })">
                  <slot name="file-size" :file="file" :index="index">
                    {{ formatFileSize(file.size) }}
                  </slot>
                </span>
              </div>

              <slot name="file-trailing" :file="file" :index="index" :ui="ui">
                <UButton
                  v-if="props.fileDelete"
                  color="neutral"
                  v-bind="{
  ...layout === 'grid' ? {
    variant: 'solid',
    size: 'xs'
  } : {
    variant: 'link',
    size: props.size
  },
  ...typeof props.fileDelete === 'object' ? props.fileDelete : void 0
}"
                  :aria-label="t('fileUpload.removeFile', { filename: file.name })"
                  :trailing-icon="props.fileDeleteIcon || appConfig.ui.icons.close"
                  data-slot="fileTrailingButton"
                  :class="ui.fileTrailingButton({ class: props.ui?.fileTrailingButton })"
                  @click.stop.prevent="removeFile(index)"
                />
              </slot>
            </slot>
          </div>
        </slot>
      </div>

      <slot name="files-bottom" :files="modelValue" :open="open" :remove-file="removeFile" />
    </template>
  </DefineFilesTemplate>

  <Primitive :as="props.as" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <slot :open="open" :remove-file="removeFile" :ui="ui">
      <component
        :is="variant === 'button' ? 'button' : 'div'"
        ref="dropzoneRef"
        :type="variant === 'button' ? 'button' : void 0"
        :role="variant === 'button' ? void 0 : 'button'"
        :disabled="variant === 'button' ? disabled : void 0"
        :data-dragging="isDragging"
        data-slot="base"
        :class="ui.base({ class: props.ui?.base })"
        :tabindex="props.interactive && !disabled ? 0 : -1"
        @click="props.interactive && !disabled && open()"
        @keydown.space.prevent
        @keyup.enter.space="props.interactive && !disabled && open()"
      >
        <ReuseFilesTemplate v-if="position === 'inside'" />

        <div v-if="position === 'inside' ? !props.preview || (multiple ? !modelValue?.length : !modelValue) : true" data-slot="wrapper" :class="ui.wrapper({ class: props.ui?.wrapper })">
          <slot name="leading" :ui="ui">
            <UIcon v-if="variant === 'button'" :name="props.icon || appConfig.ui.icons.upload" data-slot="icon" :class="ui.icon({ class: props.ui?.icon })" />
            <UAvatar v-else :icon="props.icon || appConfig.ui.icons.upload" :size="props.size" data-slot="avatar" :class="ui.avatar({ class: props.ui?.avatar })" />
          </slot>

          <template v-if="variant !== 'button'">
            <div v-if="props.label || !!slots.label" data-slot="label" :class="ui.label({ class: props.ui?.label })">
              <slot name="label">
                {{ props.label }}
              </slot>
            </div>
            <div v-if="props.description || !!slots.description" data-slot="description" :class="ui.description({ class: props.ui?.description })">
              <slot name="description">
                {{ props.description }}
              </slot>
            </div>

            <div v-if="!!slots.actions" data-slot="actions" :class="ui.actions({ class: props.ui?.actions })">
              <slot name="actions" :files="modelValue" :open="open" :remove-file="removeFile" />
            </div>
          </template>
        </div>
      </component>

      <ReuseFilesTemplate v-if="position === 'outside'" />
    </slot>

    <VisuallyHidden
      :id="id"
      ref="inputRef"
      as="input"
      type="file"
      feature="fully-hidden"
      :name="name"
      :accept="accept"
      :multiple="multiple"
      :required="props.required"
      :disabled="disabled"
      v-bind="{ ...$attrs, ...ariaAttrs }"
    />
  </Primitive>
</template>
