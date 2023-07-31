<script setup lang="ts">
import { ref } from 'vue'
import Joi from 'joi'

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

const form = ref()

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
