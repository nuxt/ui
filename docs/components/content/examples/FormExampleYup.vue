<script setup lang="ts">
import { ref } from 'vue'
import { object, string, InferType } from 'yup'
import type { FormSubmitEvent } from '@nuxthq/ui/dist/runtime/types'

const schema = object({
  email: string().email('Invalid email').required('Required'),
  password: string()
    .min(8, 'Must be at least 8 characters')
    .required('Required')
})

type Schema = InferType<typeof schema>

const state = ref({
  email: undefined,
  password: undefined
})

async function submit (event: FormSubmitEvent<Schema>) {
  // Do something with event.data
  console.log(event.data)
}
</script>

<template>
  <UForm
    :schema="schema"
    :state="state"
    @submit="submit"
  >
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
