<script setup lang="ts">
import { z } from 'zod'
import { reactive, ref, useTemplateRef } from 'vue'

const state = reactive<any>({
  nested: { }
})

const schema = z.object({
  email: z.email(),
  password: z.string().min(8)
})

const showNested = ref(true)
const nestedSchema = z.object({
  field: z.string().min(1)
})

const form = useTemplateRef('form')
</script>

<template>
  <UForm ref="form" :state="state" :schema="schema">
    <UFormField id="emailField" name="email">
      <UInput id="email" v-model="state.email" />
    </UFormField>
    <UFormField id="passwordField" name="password">
      <UInput id="password" v-model="state.password" />
    </UFormField>

    <UForm v-if="showNested" ref="nestedForm" name="nested" :schema="nestedSchema" nested>
      <UFormField id="nestedField" name="field">
        <UInput id="nested" v-model="state.nested.field" />
      </UFormField>
    </UForm>
  </UForm>
</template>
