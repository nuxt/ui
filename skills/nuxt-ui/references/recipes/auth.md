# Auth Forms

Complete patterns for login, signup, and password reset.

## Login

```vue [pages/login.vue]
<script setup lang="ts">
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required')
})

type Schema = z.output<typeof schema>
const state = reactive<Partial<Schema>>({ email: '', password: '' })
const remember = ref(false)

async function onSubmit() {
  // authenticate
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

        <UCheckbox v-model="remember" label="Remember me" />

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

## Signup

```vue [pages/signup.vue]
<script setup lang="ts">
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
  terms: z.literal(true, { errorMap: () => ({ message: 'You must accept the terms' }) })
})

type Schema = z.output<typeof schema>
const state = reactive<Partial<Schema>>({ name: '', email: '', password: '' })

async function onSubmit() {
  // create account
}
</script>

<template>
  <div class="flex min-h-dvh items-center justify-center">
    <UCard class="w-full max-w-sm">
      <template #header>
        <div class="text-center">
          <h1 class="text-xl font-semibold text-default">Create an account</h1>
          <p class="mt-1 text-sm text-muted">Start your free trial</p>
        </div>
      </template>

      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField name="name" label="Name">
          <UInput v-model="state.name" placeholder="John Doe" />
        </UFormField>

        <UFormField name="email" label="Email">
          <UInput v-model="state.email" type="email" placeholder="you@example.com" />
        </UFormField>

        <UFormField name="password" label="Password" hint="Min 8 characters">
          <UInput v-model="state.password" type="password" />
        </UFormField>

        <UFormField name="terms">
          <UCheckbox v-model="state.terms" label="I agree to the terms and conditions" />
        </UFormField>

        <UButton type="submit" label="Create account" block />
      </UForm>

      <template #footer>
        <p class="text-center text-sm text-muted">
          Already have an account?
          <NuxtLink to="/login" class="text-primary font-medium">Sign in</NuxtLink>
        </p>
      </template>
    </UCard>
  </div>
</template>
```

## Forgot password

```vue [pages/forgot-password.vue]
<script setup lang="ts">
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Invalid email')
})

type Schema = z.output<typeof schema>
const state = reactive<Partial<Schema>>({ email: '' })
const sent = ref(false)

async function onSubmit() {
  // send reset email
  sent.value = true
}
</script>

<template>
  <div class="flex min-h-dvh items-center justify-center">
    <UCard class="w-full max-w-sm">
      <template #header>
        <div class="text-center">
          <h1 class="text-xl font-semibold text-default">Reset password</h1>
          <p class="mt-1 text-sm text-muted">We'll send you a reset link</p>
        </div>
      </template>

      <UAlert v-if="sent" title="Check your email" description="We sent a password reset link." color="success" icon="i-lucide-mail-check" />

      <UForm v-else :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField name="email" label="Email">
          <UInput v-model="state.email" type="email" placeholder="you@example.com" />
        </UFormField>

        <UButton type="submit" label="Send reset link" block />
      </UForm>

      <template #footer>
        <p class="text-center text-sm text-muted">
          <NuxtLink to="/login" class="text-primary font-medium">Back to sign in</NuxtLink>
        </p>
      </template>
    </UCard>
  </div>
</template>
```

## Tips

- Center auth forms with `flex min-h-dvh items-center justify-center`
- Use `max-w-sm` for auth cards — keeps forms compact and focused
- Use `UCard` with `#header` and `#footer` slots for title and footer links
- Always use `block` prop on the submit button to make it full-width
- Place "Forgot password?" link as a `#hint` slot on the password field
- Social login buttons go below the form with a separator: `<USeparator label="or" />`
