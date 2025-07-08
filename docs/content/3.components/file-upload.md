---
title: FileUpload
description: A drag-and-drop file upload component.
category: form
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/tree/v3/src/runtime/components/FileUpload.vue
navigation.badge: Soon
---

## Usage

Use the `v-model` directive to control the value of the Input.

::component-code
---
ignore:
  - modelValue
external:
  - modelValue
externalTypes:
  - FileUploadItem[]
props:
  modelValue: []
---
::

### Accept

Use the `accept` prop to specify the types of files that can be uploaded.

::component-code
---
ignore:
  - modelValue
external:
  - modelValue
externalTypes:
  - FileUploadItem[]
props:
  modelValue: []
  accept: 'image/*'
---
::

### Label

Use the `label` prop to set the label of the component.

::component-code
---
ignore:
  - modelValue
external:
  - modelValue
externalTypes:
  - FileUploadItem[]
props:
  modelValue: []
  label: 'Upload your image'
---
::

### Upload Icon

Use the `uploadIcon` prop to set a custom upload icon.

::component-code
---
ignore:
  - modelValue
external:
  - modelValue
externalTypes:
  - FileUploadItem[]
props:
  modelValue: []
  uploadIcon: 'i-heroicons-cloud-arrow-up-solid'
---
::

::framework-only
#nuxt
:::tip{to="/getting-started/icons/nuxt#theme"}
You can customize this icon globally in your `app.config.ts` under `ui.icons.upload` key.
:::

#vue
:::tip{to="/getting-started/icons/vue#theme"}
You can customize this icon globally in your `vite.config.ts` under `ui.icons.upload` key.
:::
::

### Size

Use the `size` prop to set the size of the component.

::component-code
---
ignore:
  - modelValue
external:
  - modelValue
externalTypes:
  - FileUploadItem[]
props:
  modelValue: []
  size: xl
---
::

### Multiple

Use the `multiple` prop to allow multiple file uploads.

::component-code
---
ignore:
  - modelValue
  - multiple
external:
  - modelValue
externalTypes:
  - FileUploadItem[]
props:
  modelValue: []
  multiple: true
---
::

### File Icon

Use the `fileIcon` prop to set a custom file icon.

::component-code
---
ignore:
  - modelValue
  - accept
external:
  - modelValue
externalTypes:
  - FileUploadItem[]
props:
  modelValue:
    - file:
        name: 'example.txt'
        size: 3145728
        type: 'text/plain'
  fileIcon: 'i-heroicons-document-text-solid'
  accept: 'text/plain'
---
::

::framework-only
#nuxt
:::tip{to="/getting-started/icons/nuxt#theme"}
You can customize this icon globally in your `app.config.ts` under `ui.icons.file` key.
:::

#vue
:::tip{to="/getting-started/icons/vue#theme"}
You can customize this icon globally in your `vite.config.ts` under `ui.icons.file` key.
:::
::

### Disabled

Use the `disabled` prop to disable the component.

::component-code
---
ignore:
  - modelValue
external:
  - modelValue
externalTypes:
  - FileUploadItem[]
props:
  modelValue: []
  disabled: true
---
::

## Examples

### With custom type

You can extend the type to include additional properties.

::component-example
---
name: 'file-upload-extend-type-example'
---
::

### Within a FormField

You can use the FileUpload within a [FormField](/components/form-field) component to display a label, help text, required indicator, etc.

::component-example
---
name: 'file-upload-form-field-example'
---
::

::tip{to="/components/form"}
It also provides validation and error handling when used within a **Form** component.
::

### With file validation

You can build a custom validation function to check the file type and size.

::component-example
---
collapse: true
name: 'file-upload-file-validation-example'
---
::


## API

### Props

:component-props

### Slots

:component-slots

### Emits

:component-emits

### Expose

When accessing the component via a template ref, you can use the following:

| Name | Type |
| ---- | ---- |
| `fileInputRef`{lang="ts-type"} | `Ref<HTMLInputElement \| null>`{lang="ts-type"} |

## Theme

:component-theme
