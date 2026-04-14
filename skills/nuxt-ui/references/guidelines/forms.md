# Forms

## Basic pattern

Nuxt UI forms use `UForm` + `UFormField` + Standard Schema validation (Zod, Valibot, Yup, or Joi).

```vue
<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const schema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters')
})

type Schema = z.output<typeof schema>
const state = reactive<Partial<Schema>>({ email: '', password: '' })

function onSubmit(event: FormSubmitEvent<Schema>) {
  // UForm validates before emitting @submit — access validated data via event.data
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormField name="email" label="Email" required>
      <UInput v-model="state.email" type="email" placeholder="you@example.com" />
    </UFormField>

    <UFormField name="password" label="Password" required>
      <UInput v-model="state.password" type="password" placeholder="Min 8 characters" />
    </UFormField>

    <UButton type="submit" label="Sign in" />
  </UForm>
</template>
```

## Key rules

- Always use `UFormField` around inputs — it connects validation errors via the `name` prop
- The `name` prop on `UFormField` must match the schema field name exactly
- Use `reactive<Partial<Schema>>({})` for state — `Partial` allows empty initial values
- `@submit` only fires when validation passes
- For nested objects, use dot notation: `name="address.city"`

## UFormField props

| Prop | Purpose |
|---|---|
| `name` | Links to schema field for validation errors |
| `label` | Visible label text |
| `description` | Help text below the input |
| `hint` | Right-aligned hint text (e.g., "Optional") |
| `required` | Shows required indicator |
| `size` | Inherits to child input |

## Field layout patterns

### Vertical stack (default)

```vue
<UForm :schema="schema" :state="state" class="space-y-4">
  <UFormField name="name" label="Name">
    <UInput v-model="state.name" />
  </UFormField>
  <UFormField name="email" label="Email">
    <UInput v-model="state.email" />
  </UFormField>
</UForm>
```

### Inline fields with UFieldGroup

```vue
<UFieldGroup>
  <UFormField name="firstName" label="First name">
    <UInput v-model="state.firstName" />
  </UFormField>
  <UFormField name="lastName" label="Last name">
    <UInput v-model="state.lastName" />
  </UFormField>
</UFieldGroup>
```

### Grid layout

```vue
<UForm :schema="schema" :state="state" class="grid grid-cols-2 gap-4">
  <UFormField name="firstName" label="First name">
    <UInput v-model="state.firstName" />
  </UFormField>
  <UFormField name="lastName" label="Last name">
    <UInput v-model="state.lastName" />
  </UFormField>
  <UFormField name="email" label="Email" class="col-span-2">
    <UInput v-model="state.email" type="email" />
  </UFormField>
</UForm>
```

## Common field patterns

### Select

```vue
<UFormField name="role" label="Role">
  <USelect v-model="state.role" :items="['Admin', 'Editor', 'Viewer']" placeholder="Choose role" />
</UFormField>
```

### Checkbox

```vue
<UFormField name="terms">
  <UCheckbox v-model="state.terms" label="I agree to the terms and conditions" />
</UFormField>
```

### Radio group

```vue
<UFormField name="plan" label="Plan">
  <URadioGroup
    v-model="state.plan"
    :items="[
      { label: 'Free', value: 'free', description: 'For personal projects' },
      { label: 'Pro', value: 'pro', description: 'For teams' }
    ]"
  />
</UFormField>
```

### Switch

```vue
<UFormField name="notifications" label="Email notifications">
  <USwitch v-model="state.notifications" />
</UFormField>
```

### Textarea

```vue
<UFormField name="bio" label="Bio" description="Brief description for your profile.">
  <UTextarea v-model="state.bio" :rows="3" autoresize :maxrows="6" />
</UFormField>
```

### File upload

```vue
<UFormField name="avatar" label="Avatar">
  <UFileUpload v-model="state.avatar" accept="image/*" />
</UFormField>

<!-- Or as a drop area -->
<UFormField name="documents" label="Documents">
  <UFileUpload v-model="state.documents" multiple variant="area" />
</UFormField>
```

### Date

```vue
<UFormField name="date" label="Date">
  <UInputDate v-model="state.date" />
</UFormField>

<!-- Date range -->
<UFormField name="dateRange" label="Date range">
  <UInputDate v-model="state.dateRange" range />
</UFormField>
```

## Programmatic validation

```vue
<script setup lang="ts">
const form = useTemplateRef('form')

async function validateAndSubmit() {
  const result = await form.value?.validate()
  if (result) {
    // valid — submit
  }
}

async function validateEmail() {
  await form.value?.validate({ name: 'email' })
}

function setServerError() {
  form.value?.setErrors([
    { name: 'email', message: 'Email already taken' }
  ])
}

function resetErrors() {
  form.value?.clearErrors()
}
</script>

<template>
  <UForm ref="form" :schema="schema" :state="state" @submit="onSubmit">
    <!-- fields -->
  </UForm>
</template>
```

## Form in a modal

Use `#footer="{ close }"` scoped slot for cancel/submit actions. Wrap the modal body in `UForm` with a `type="submit"` button in the footer so validation runs on submit.

```vue
<UModal v-model:open="isOpen" title="Edit profile" description="Update your information." :ui="{ footer: 'justify-end' }">
  <template #body>
    <UForm id="profile-form" :schema="schema" :state="state" class="space-y-4" @submit="onSave">
      <UFormField name="name" label="Name">
        <UInput v-model="state.name" />
      </UFormField>
      <UFormField name="email" label="Email">
        <UInput v-model="state.email" type="email" />
      </UFormField>
    </UForm>
  </template>
  <template #footer="{ close }">
    <UButton label="Cancel" color="neutral" variant="outline" @click="close" />
    <UButton type="submit" form="profile-form" label="Save" />
  </template>
</UModal>
```
