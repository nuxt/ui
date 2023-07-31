<script setup lang="ts">
import { ref } from 'vue'
import { z } from 'zod'
import type { Form } from '@nuxthq/ui/dist/runtime/types'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters')
})

type Schema = z.output<typeof schema>

const state = ref({
  email: undefined,
  password: undefined
})

const form = ref<Form<Schema>>()

async function submit () {
  await form.value!.validate()
  // Do something with state.value
}
</script>

<template>
  <UForm
    ref="form"
    :schema="schema"
    :state="state"
    @submit.prevent="submit"
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
