<script setup lang="ts">
import { string, objectAsync, email, minLength, type Input } from 'valibot'
import type { FormSubmitEvent } from '#ui/types'

const schema = objectAsync({
  email: string([email('Invalid email')]),
  password: string([minLength(8, 'Must be at least 8 characters')])
})

type Schema = Input<typeof schema>

const state = reactive({
  email: '',
  password: ''
})

async function onSubmit (event: FormSubmitEvent<Schema>) {
  // Do something with event.data
  console.log(event.data)
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
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
