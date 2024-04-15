<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent, Form } from '#ui/types/form'

const schema = z.object({
  input: z.string().min(10),
  // inputMenu: z.any().refine(option => option?.value === 'option-2', {
  //   message: 'Select Option 2'
  // }),
  textarea: z.string().min(10),
  // select: z.string().refine(value => value === 'option-2', {
  //   message: 'Select Option 2'
  // }),
  // selectMenu: z.any().refine(option => option?.value === 'option-2', {
  //   message: 'Select Option 2'
  // }),
  switch: z.boolean().refine(value => value === true, {
    message: 'Toggle me'
  }),
  checkbox: z.boolean().refine(value => value === true, {
    message: 'Check me'
  }),
  radioGroup: z.string().refine(value => value === 'option-2', {
    message: 'Select Option 2'
  })
  // range: z.number().max(20, { message: 'Must be less than 20' })
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({})
const form = ref<Form<Schema>>()

const options = [
  { label: 'Option 1', value: 'option-1' },
  { label: 'Option 2', value: 'option-2' },
  { label: 'Option 3', value: 'option-3' }
]

function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log(event.data)
}
</script>

<template>
  <UForm
    ref="form"
    :state="state"
    :schema="schema"
    class="gap-4 flex flex-col w-60"
    @submit="onSubmit"
  >
    <UFormField label="Input" name="input">
      <UInput v-model="state.input" placeholder="john@lennon.com" />
    </UFormField>

    <UFormField label="Text area" name="textarea">
      <UTextarea v-model="state.textarea" />
    </UFormField>

    <UFormField name="checkbox">
      <UCheckbox v-model="state.checkbox" label="I accept the terms and conditions" />
    </UFormField>

    <UFormField name="radioGroup">
      <URadioGroup v-model="state.radioGroup" legend="Radio group" :options="options" />
    </UFormField>

    <UFormField name="switch">
      <USwitch v-model="state.switch" />
    </UFormField>

    <div class="flex gap-2">
      <UButton color="gray" type="submit" :disabled="form?.disabled">
        Submit
      </UButton>

      <UButton variant="outline" :disabled="form?.disabled" @click="form?.clear()">
        Clear
      </UButton>
    </div>
  </UForm>
</template>
