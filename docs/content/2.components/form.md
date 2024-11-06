---
description: Collect and validate form data.
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/dev/src/runtime/components/forms/Form.vue
---

## Usage

Use the Form component to validate form data using schema libraries such as [Yup](https://github.com/jquense/yup), [Zod](https://github.com/colinhacks/zod), [Joi](https://github.com/hapijs/joi), [Valibot](https://github.com/fabian-hiller/valibot), [Superstruct](https://github.com/ianstormtaylor/superstruct), or your own validation logic.

It works with the [FormGroup](/components/form-group) component to display error messages around form elements automatically.

The form component requires two props:
- `state` - a reactive object holding the form's state.
- `schema` - a schema object from a validation library like [Yup](https://github.com/jquense/yup), [Zod](https://github.com/colinhacks/zod), [Joi](https://github.com/hapijs/joi), [Valibot](https://github.com/fabian-hiller/valibot) or [Superstruct](https://github.com/ianstormtaylor/superstruct).

::callout{icon="i-heroicons-light-bulb"}
Note that **no validation library is included** by default, so ensure you **install the one you need**.
::

::tabs
  ::component-example{label="Yup"}
  ---
  component: 'form-example-yup'
  componentProps:
    class: 'w-60'
  ---
  ::

  ::component-example{label="Zod"}
  ---
  component: 'form-example-zod'
  componentProps:
    class: 'w-60'
  ---
  ::

  ::component-example{label="Joi"}
  ---
  component: 'form-example-joi'
  componentProps:
    class: 'w-60'
  ---
  ::

  ::component-example{label="Valibot"}
  ---
  component: 'form-example-valibot'
  componentProps:
    class: 'w-60'
  ---
  ::
  ::component-example{label="Superstruct"}
  ---
  component: 'form-example-superstruct'
  componentProps:
    class: 'w-60'
  ---
  ::
::

## Custom validation

Use the `validate` prop to apply your own validation logic.

The validation function must return a list of errors with the following attributes:
- `message` - Error message for display.
- `path` - Path to the form element corresponding to the `name` attribute.

::callout{icon="i-heroicons-light-bulb"}
Note that it can be used alongside the `schema` prop to handle complex use cases.
::

::component-example
---
component: 'form-example-basic'
componentProps:
  class: 'w-60'
---
::

This can also be used to integrate with other validation libraries. Here is an example with [Vuelidate](https://github.com/vuelidate/vuelidate):

```vue
<script setup lang="ts">
import useVuelidate from '@vuelidate/core'

const props = defineProps({
  rules: { type: Object, required: true },
  model: { type: Object, required: true }
})

const form = ref();
const v = useVuelidate(props.rules, props.model)

async function validateWithVuelidate() {
  v.value.$touch()
  await v.value.$validate()
  return v.value.$errors.map((error) => ({
    message: error.$message,
    path: error.$propertyPath,
  }))
}

defineExpose({
  validate: async () => {
    await form.value.validate()
  }
})
</script>

<template>
  <UForm ref="form" :state="model" :validate="validateWithVuelidate">
    <slot />
  </UForm>
</template>
```

## Backend validation

You can manually set errors after form submission if required. To do this, simply use the `form.setErrors` function to set the errors as needed.

```vue
<script setup lang="ts">
import type { Form, FormSubmitEvent } from '#ui/types'

interface Schema {
  email?: string
  password?: string
}

const state = reactive<Schema>({
  email: undefined,
  password: undefined
})

const form = ref<Form<Schema>>()

async function onSubmit (event: FormSubmitEvent<Schema>) {
  form.value!.clear()
  try {
    const response = await $fetch('...')
    // ...
  } catch (err) {
    if (err.statusCode === 422) {
      form.value!.setErrors(err.data.errors.map((err) => ({
        // Map validation errors to { path: string, message: string }
        message: err.message,
        path: err.path,
      })))
    }
  }
}
</script>

<template>
  <UForm ref="form" :state="state" @submit="onSubmit">
    <UFormGroup label="Email" name="email">
      <UInput v-model="state.email" />
    </UFormGroup>

    <UFormGroup label="Password" name="password">
      <UInput v-model="state.password" type="password" />
    </UFormGroup>

    <UButton type="submit">
      Submit
    </UButton>
  </UForm>
</template>
```
## Input events

The Form component automatically triggers validation upon `submit`, `input`, `blur` or `change` events.

This ensures that any errors are displayed as soon as the user interacts with the form elements. You can control when validation happens this using the `validate-on` prop.

::callout{icon="i-heroicons-light-bulb"}
Note that the `input` event is not triggered until after the initial `blur` event. This is to prevent the form from being validated as the user is typing. You can override this behavior by setting the [`eager-validation`](/components/form-group#eager-validation) prop on [`FormGroup`](/components/form-group) to `true`.
::

::component-example
---
component: 'form-example-elements'
componentProps:
  class: 'w-60'
hiddenCode: true
---
::

::callout{icon="i-simple-icons-github" to="https://github.com/nuxt/ui/blob/dev/docs/components/content/examples/FormExampleElements.vue" target="_blank"}
Take a look at the component!
::

## Error event

You can listen to the `@error` event to handle errors. This event is triggered when the form is submitted and contains an array of `FormError` objects with the following fields:

- `id` - the identifier of the form element.
- `path` - the path to the form element matching the `name`.
- `message` - the error message to display.

Here's an example that focuses the first input element with an error after the form is submitted:

::component-example
---
component: 'form-example-on-error'
componentProps:
  class: 'w-60'
---
::

## Props

:component-props

## API

When accessing the component via a template ref, you can use the following:

::field-group
  ::field{name="submit ()" type="Promise<void>"}
    Triggers form submission.
  ::
  ::field{name="validate (path?: string | string[], opts: { silent?: boolean })" type="Promise<T>"}
    Triggers form validation. Will raise any errors unless `opts.silent` is set to true.
  ::
  ::field{name="clear (path?: string)"}
    Clears form errors associated with a specific path. If no path is provided, clears all form errors.
  ::
  ::field{name="getErrors (path?: string)" type="FormError[]"}
    Retrieves form errors associated with a specific path. If no path is provided, returns all form errors.
  ::
  ::field{name="setErrors (errors: FormError[], path?: string)"}
    Sets form errors for a given path. If no path is provided, overrides all errors.
  ::
  ::field{name="errors" type="Ref<FormError[]>"}
    A reference to the array containing validation errors. Use this to access or manipulate the error information.
  ::
::
