<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'

const state = reactive({
  email: undefined,
  age: undefined
})

type Schema = typeof state

const form = useTemplateRef('form')

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
  console.log(event.data)
}
</script>

<template>
  <div class="space-y-4">
    <UForm ref="form" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField label="Email" name="email">
        <UInput v-model="state.email" type="email" required />
      </UFormField>

      <UFormField label="Age" name="age">
        <UInput v-model="state.age" type="number" min="18" max="100" required />
      </UFormField>
    </UForm>

    <UButton @click="form?.submit()">
      Submit
    </UButton>
  </div>
</template>
