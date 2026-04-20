# Auth Forms

## UAuthForm (recommended)

`UAuthForm` provides a complete auth form with fields, providers, validation, and submit — no manual `UForm` + `UFormField` wiring needed. Wrap it in `UPageCard` for a polished look.

```vue [pages/login.vue]
<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

const fields: AuthFormField[] = [{
  name: 'email',
  type: 'email',
  label: 'Email',
  placeholder: 'Enter your email',
  required: true
}, {
  name: 'password',
  label: 'Password',
  type: 'password',
  placeholder: 'Enter your password',
  required: true
}, {
  name: 'remember',
  label: 'Remember me',
  type: 'checkbox'
}]

const providers = [{
  label: 'Google',
  icon: 'i-simple-icons-google',
  onClick: () => navigateTo('/auth/google', { external: true })
}, {
  label: 'GitHub',
  icon: 'i-simple-icons-github',
  onClick: () => navigateTo('/auth/github', { external: true })
}]

const schema = z.object({
  email: z.email('Invalid email'),
  password: z.string('Password is required').min(8, 'Must be at least 8 characters')
})

type Schema = z.output<typeof schema>

function onSubmit(payload: FormSubmitEvent<Schema>) {
  // payload.data contains validated fields
}
</script>

<template>
  <div class="flex min-h-dvh items-center justify-center">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        :schema="schema"
        :fields="fields"
        :providers="providers"
        title="Welcome back!"
        description="Sign in to your account."
        icon="i-lucide-lock"
        @submit="onSubmit"
      >
        <template #password-hint>
          <ULink to="/forgot-password" class="text-primary font-medium">Forgot password?</ULink>
        </template>
        <template #footer>
          Don't have an account? <ULink to="/signup" class="text-primary font-medium">Sign up</ULink>.
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>
```

### UAuthForm key props

| Prop | Purpose |
|---|---|
| `title`, `description`, `icon` | Header content |
| `fields` | `AuthFormField[]` — each has `name`, `type`, `label`, `placeholder`, `required` |
| `providers` | `ButtonProps[]` — social login buttons shown above/below the form |
| `schema` | Zod/Valibot schema for validation |
| `submit` | Customize submit button: `{ label: 'Sign in', block: true }` |
| `separator` | Text between providers and fields (default: `'or'`) |

### UAuthForm key slots

| Slot | Purpose |
|---|---|
| `#description` | Override description (e.g., add sign-up link) |
| `#password-hint` | "Forgot password?" link on password field |
| `#validation` | Custom error display (e.g., `UAlert`) |
| `#footer` | Terms of service, sign-up link |
| `#<field>-field` | Override a specific field's rendering |

## Custom auth layout

For layouts where `UAuthForm` is too opinionated, use `UCard` + `UForm` + `UFormField` directly.

```vue [pages/login.vue]
<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const schema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(1, 'Password is required')
})

type Schema = z.output<typeof schema>
const state = reactive<Partial<Schema>>({ email: '', password: '' })

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // event.data contains validated fields
}
</script>

<template>
  <div class="flex min-h-dvh items-center justify-center">
    <UCard class="w-full max-w-sm">
      <template #header>
        <div class="text-center">
          <h1 class="text-xl font-semibold text-default">Welcome back</h1>
          <p class="mt-1 text-sm text-muted">Sign in to your account</p>
        </div>
      </template>

      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField name="email" label="Email">
          <UInput v-model="state.email" type="email" placeholder="you@example.com" />
        </UFormField>

        <UFormField name="password" label="Password">
          <template #hint>
            <NuxtLink to="/forgot-password" class="text-sm text-primary">Forgot password?</NuxtLink>
          </template>
          <UInput v-model="state.password" type="password" />
        </UFormField>

        <UButton type="submit" label="Sign in" block />
      </UForm>

      <template #footer>
        <p class="text-center text-sm text-muted">
          Don't have an account?
          <NuxtLink to="/signup" class="text-primary font-medium">Sign up</NuxtLink>
        </p>
      </template>
    </UCard>
  </div>
</template>
```

## Tips

- Prefer `UAuthForm` with `UPageCard` for standard auth pages — handles layout, providers, validation, and submit
- Use `import * as z from 'zod'` and `z.email()` (Zod 4 syntax)
- Type the submit handler: `function onSubmit(event: FormSubmitEvent<Schema>)` — access validated data via `event.data`
- Center auth forms with `flex min-h-dvh items-center justify-center`
- Place "Forgot password?" link as `#password-hint` slot on `UAuthForm`, or `#hint` slot on `UFormField`
- Social login buttons: use `providers` prop on `UAuthForm`, or add manually with `<USeparator label="or" />`
