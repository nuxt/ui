<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui/dist/runtime/types'

const schema = z.object({
  password: z.string().min(8, 'Must be at least 8 characters'),
  passwordConfirmation: z.string().min(8, 'Must be at least 8 characters')
}).refine((v) => v.password === v.passwordConfirmation, {
  message: 'Passwords does not match'
})

type Schema = z.output<typeof schema>

const state = reactive({
  email: undefined,
  password: undefined,
  passwordConfirmation: undefined
})

async function submit (event: FormSubmitEvent<Schema>) {
  // Do something with data
  console.log(event.data)
}
</script>

<template>
  <UForm :schema="schema" :state="state" @submit="submit">
    <UFormGroup label="Password" name="password">
      <UInput v-model="state.password" type="password" />
    </UFormGroup>

    <UFormGroup label="Password Confirmation" name="passwordConfirmation">
      <UInput v-model="state.passwordConfirmation" type="password" />
    </UFormGroup>

    <UButton type="submit">
      Submit
    </UButton>
  </UForm>
</template>
