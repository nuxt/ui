<script setup lang="ts">
import { ref } from 'vue'
import Joi from 'joi'

const schema = Joi.object({
  emailJoi: Joi.string().required(),
  passwordJoi: Joi.string()
    .min(8)
    .required()
})

const state = ref({
  emailJoi: undefined,
  passwordJoi: undefined
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
    <UFormGroup label="Email" name="emailJoi">
      <UInput v-model="state.emailJoi" />
    </UFormGroup>

    <UFormGroup label="Password" name="passwordJoi">
      <UInput v-model="state.passwordJoi" type="password" />
    </UFormGroup>

    <UButton type="submit">
      Submit
    </UButton>
  </UForm>
</template>
