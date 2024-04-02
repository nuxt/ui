<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types/form'

const form = ref()

const state = reactive({
  input: undefined,
  inputMenu: undefined,
  textarea: undefined,
  select: undefined,
  selectMenu: undefined,
  checkbox: undefined,
  toggle: undefined,
  radio: undefined,
  radioGroup: undefined,
  switch: undefined,
  range: undefined
})

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
  // toggle: z.boolean().refine(value => value === true, {
  //   message: 'Toggle me'
  // }),
  checkbox: z.boolean().refine(value => value === true, {
    message: 'Check me'
  }),
  radioGroup: z.string().refine(value => value === 'option-2', {
    message: 'Select Option 2'
  })
  // range: z.number().max(20, { message: 'Must be less than 20' })
})

type Schema = z.output<typeof schema>

const options = [
  { label: 'Option 1', value: 'option-1' },
  { label: 'Option 2', value: 'option-2' },
  { label: 'Option 3', value: 'option-3' }
]

function onSubmit (event: FormSubmitEvent<Schema>) {
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

    <div class="flex gap-2">
      <UButton color="gray" type="submit">
        Submit
      </UButton>

      <UButton variant="outline" @click="form.clear()">
        Clear
      </UButton>
    </div>
  </UForm>
</template>
