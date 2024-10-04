<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent, Form } from '@nuxt/ui'

const schema = z.object({
  input: z.string().min(10),
  inputMenu: z.any().refine(option => option?.value === 'option-2', {
    message: 'Select Option 2'
  }),
  inputMenuMultiple: z.any().refine(values => !!values?.find((option: any) => option.value === 'option-2'), {
    message: 'Include Option 2'
  }),
  textarea: z.string().min(10),
  select: z.string().refine(value => value === 'option-2', {
    message: 'Select Option 2'
  }),
  selectMenu: z.any().refine(option => option?.value === 'option-2', {
    message: 'Select Option 2'
  }),
  selectMenuMultiple: z.any().refine(values => !!values?.find((option: any) => option.value === 'option-2'), {
    message: 'Include Option 2'
  }),
  switch: z.boolean().refine(value => value === true, {
    message: 'Toggle me'
  }),
  checkbox: z.boolean().refine(value => value === true, {
    message: 'Check me'
  }),
  radioGroup: z.string().refine(value => value === 'option-2', {
    message: 'Select Option 2'
  }),
  slider: z.number().max(20, { message: 'Must be less than 20' })
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({})
const form = ref<Form<Schema>>()

const items = [
  { label: 'Option 1', value: 'option-1' },
  { label: 'Option 2', value: 'option-2' },
  { label: 'Option 3', value: 'option-3' }
]

function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log(event.data)
}
</script>

<template>
  <UForm ref="form" :state="state" :schema="schema" class="gap-4 flex flex-col w-60" @submit="onSubmit">
    <UFormField label="Input" name="input">
      <UInput v-model="state.input" placeholder="john@lennon.com" />
    </UFormField>

    <UFormField label="Textarea" name="textarea">
      <UTextarea v-model="state.textarea" />
    </UFormField>

    <UFormField name="select" label="Select">
      <USelect v-model="state.select" class="w-44" :items="items" />
    </UFormField>

    <UFormField name="selectMenu" label="Select Menu">
      <USelectMenu v-model="state.selectMenu" class="w-44" :items="items" />
    </UFormField>

    <UFormField name="selectMenuMultiple" label="Select Menu (Multiple)">
      <USelectMenu v-model="state.selectMenuMultiple" class="w-44" multiple :items="items" />
    </UFormField>

    <UFormField name="inputMenu" label="Input Menu">
      <UInputMenu v-model="state.inputMenu" :items="items" />
    </UFormField>

    <UFormField name="inputMenuMultiple" label="Input Menu (Multiple)">
      <UInputMenu v-model="state.inputMenuMultiple" multiple :items="items" />
    </UFormField>

    <UFormField name="checkbox">
      <UCheckbox v-model="state.checkbox" label="Check me" />
    </UFormField>

    <UFormField name="radioGroup">
      <URadioGroup v-model="state.radioGroup" legend="Radio group" :items="items" />
    </UFormField>

    <UFormField name="switch">
      <USwitch v-model="state.switch" label="Switch me" />
    </UFormField>

    <UFormField name="slider" label="Slider">
      <USlider v-model="state.slider" />
    </UFormField>

    <div class="flex gap-2">
      <UButton color="neutral" type="submit">
        Submit
      </UButton>

      <UButton color="neutral" variant="outline" @click="form?.clear()">
        Clear
      </UButton>
    </div>
  </UForm>
</template>
