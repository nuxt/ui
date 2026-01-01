<script setup lang="ts">
import { reactive, useTemplateRef } from 'vue'
import { UFormField, UInput, UForm } from '#components'

const state = reactive<any>({})
const form = useTemplateRef('form')
</script>

<template>
  <UForm id="42" ref="form" :state="state">
    <UFormField id="emailField" name="email">
      <UInput id="email" v-model="state.email" />
    </UFormField>
    <UFormField id="passwordField" name="password">
      <UInput id="password" v-model="state.password" />
    </UFormField>
  </UForm>
</template>
