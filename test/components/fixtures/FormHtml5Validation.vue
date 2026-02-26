<script setup lang="ts">
import { reactive, useTemplateRef } from 'vue'
import { UFormField, UInput, UForm } from '#components'

interface FormState {
  email?: string
  age?: string
  username?: string
}

const state = reactive<FormState>({})
const form = useTemplateRef('form')
</script>

<template>
  <UForm ref="form" :state="state" v-bind="$attrs">
    <UFormField id="emailField" name="email">
      <UInput id="email" v-model="state.email" type="email" required />
    </UFormField>
    <UFormField id="ageField" name="age">
      <UInput
        id="age"
        v-model="state.age"
        type="number"
        min="18"
        max="100"
        required
      />
    </UFormField>
    <UFormField id="usernameField" name="username">
      <UInput id="username" v-model="state.username" minlength="3" maxlength="20" required />
    </UFormField>
  </UForm>
</template>
