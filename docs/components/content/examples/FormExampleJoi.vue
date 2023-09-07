<script setup lang="ts">
import { ref } from 'vue'
import Joi from 'joi'
import type { FormSubmitEvent } from '@nuxt/ui/dist/runtime/types'

const schema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string()
    .min(8)
    .required()
})

const state = ref({
  email: undefined,
  password: undefined
})

async function submit (event: FormSubmitEvent<any>) {
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
