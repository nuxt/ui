---
title: AuthForm
description: 'A customizable Form to create login, register or password reset forms.'
category: page
links:
  - label: Form
    to: /docs/components/form
    icon: i-simple-icons-nuxtdotjs
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/AuthForm.vue
---

## Usage

Built on top of the [Form](/docs/components/form) component, the `AuthForm` component can be used in your pages or wrapped in a [PageCard](/docs/components/page-card).

The form will construct itself based on the `fields` prop and the state will be handled internally. You can pass all the props you would pass to a [FormField](/docs/components/form-field#props) or an [Input](/docs/components/input#props) to each field.

::component-example
---
name: 'auth-form-example'
collapse: true
---
::

### Title

Use the `title` prop to set the title of the form.

::component-code
---
prettier: true
ignore:
  - fields
  - class
external:
  - fields
props:
  class: 'max-w-md'
  title: 'Login'
  fields:
    - name: 'email'
      type: text
      label: 'Email'
    - name: 'password'
      type: 'password'
      label: 'Password'
---
::

### Description

Use the `description` prop to set the description of the form.

::component-code
---
prettier: true
ignore:
  - fields
  - title
  - class
external:
  - fields
props:
  class: 'max-w-md'
  title: 'Login'
  description: 'Enter your credentials to access your account.'
  fields:
    - name: 'email'
      type: text
      label: 'Email'
    - name: 'password'
      type: 'password'
      label: 'Password'
---
::

### Icon

Use the `icon` prop to set the icon of the form.

::component-code
---
prettier: true
ignore:
  - fields
  - title
  - description
  - class
external:
  - fields
props:
  class: 'max-w-md'
  title: 'Login'
  description: 'Enter your credentials to access your account.'
  icon: 'i-lucide-user'
  fields:
    - name: 'email'
      type: text
      label: 'Email'
    - name: 'password'
      type: 'password'
      label: 'Password'
---
::

### Providers

Use the `providers` prop to add providers to the form.

You can pass any property from the [Button](/docs/components/button) component such as `variant`, `color`, `to`, etc.

::component-code
---
prettier: true
ignore:
  - fields
  - title
  - description
  - icon
  - providers
  - headerAlign
  - class
external:
  - fields
  - providers
props:
  class: 'max-w-md'
  title: 'Login'
  description: 'Enter your credentials to access your account.'
  icon: 'i-lucide-user'
  providers:
    - label: 'Google'
      icon: 'i-simple-icons-google'
      color: 'neutral'
      variant: 'subtle'
    - label: 'GitHub'
      icon: 'i-simple-icons-github'
      color: 'neutral'
      variant: 'subtle'
  fields:
    - name: 'email'
      type: text
      label: 'Email'
    - name: 'password'
      type: 'password'
      label: 'Password'
---
::

### Separator

Use the `separator` prop to customize the [Separator](/docs/components/separator) between the providers and the fields. Defaults to `or`.

::component-code
---
prettier: true
ignore:
  - fields
  - title
  - description
  - icon
  - providers
  - class
external:
  - providers
  - fields
props:
  class: 'max-w-md'
  title: 'Login'
  description: 'Enter your credentials to access your account.'
  icon: 'i-lucide-user'
  providers:
    - label: 'Google'
      icon: 'i-simple-icons-google'
      color: 'neutral'
      variant: 'subtle'
    - label: 'GitHub'
      icon: 'i-simple-icons-github'
      color: 'neutral'
      variant: 'subtle'
  fields:
    - name: 'email'
      type: text
      label: 'Email'
    - name: 'password'
      type: 'password'
      label: 'Password'
  separator: 'Providers'
---
::

You can pass any property from the [Separator](/docs/components/separator#props) component to customize it.

::component-code
---
prettier: true
ignore:
  - fields
  - title
  - description
  - icon
  - providers
  - class
external:
  - providers
  - fields
props:
  class: 'max-w-md'
  title: 'Login'
  description: 'Enter your credentials to access your account.'
  icon: 'i-lucide-user'
  providers:
    - label: 'Google'
      icon: 'i-simple-icons-google'
      color: 'neutral'
      variant: 'subtle'
    - label: 'GitHub'
      icon: 'i-simple-icons-github'
      color: 'neutral'
      variant: 'subtle'
  fields:
    - name: 'email'
      type: text
      label: 'Email'
    - name: 'password'
      type: 'password'
      label: 'Password'
  separator:
    icon: 'i-lucide-user'
---
::

### Submit

Use the `submit` prop to change the submit button of the form.

You can pass any property from the [Button](/docs/components/button) component such as `variant`, `color`, `to`, etc.

::component-code
---
prettier: true
ignore:
  - fields
  - title
  - description
  - icon
  - providers
  - submit.label
  - submit.color
  - submit.variant
  - class
external:
  - fields
props:
  class: 'max-w-md'
  title: 'Login'
  description: 'Enter your credentials to access your account.'
  icon: 'i-lucide-user'
  fields:
    - name: 'email'
      type: text
      label: 'Email'
    - name: 'password'
      type: 'password'
      label: 'Password'
  submit:
    label: 'Submit'
    color: 'error'
    variant: 'subtle'
---
::

## Examples

### Within a page

You can wrap the `AuthForm` component with the [PageCard](/docs/components/page-card) component to display it within a `login.vue` page for example.

::component-example
---
name: 'auth-form-page-example'
collapse: true
---
::

### OTP / 2FA Example

You can add a One-Time Password (OTP) field for two-factor authentication by using the `otp` type in your fields array. The `otp` property allows you to pass any prop supported by the [PinInput](/docs/components/pin-input#api) component.

::component-code
---
prettier: true
ignore:
  - fields
  - title
  - description
  - icon
  - class
external:
  - fields
props:
  class: 'max-w-md'
  title: 'Login with 2FA'
  fields:
    - name: 'email'
      type: text
      label: 'Email'
    - name: 'password'
      type: 'password'
      label: 'Password'
    - name: 'otp'
      type: 'otp'
      otp:
        length: 6
        placeholder: '●'
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

You can access the typed component instance (exposing formRef and state) using [`useTemplateRef`](https://vuejs.org/api/composition-api-helpers.html#usetemplateref). For example, in a separate form (e.g. a "reset" form) you can do:

```vue
<script setup lang="ts">
const authForm = useTemplateRef('authForm')
</script>

<template>
  <UAuthForm ref="authForm" />
</template>
```

This gives you access to the following (exposed) properties:

| Name | Type |
| ---- | ---- |
| `formRef`{lang="ts-type"} | `Ref<HTMLFormElement \| null>`{lang="ts-type"} |
| `state`{lang="ts-type"} | `Reactive<FormStateType>`{lang="ts-type"} |

## Theme

:component-theme
