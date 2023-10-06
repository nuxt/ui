<script setup lang="ts">
import { string, objectAsync, email, minLength, Input } from 'valibot'
import type { FormSubmitEvent } from '@nuxt/ui/dist/runtime/types'

const schema = objectAsync({
  email: string([email('Invalid email')]),
  password: string([minLength(8, 'Must be at least 8 characters')])
})

type Schema = Input<typeof schema>

const state = reactive({
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
