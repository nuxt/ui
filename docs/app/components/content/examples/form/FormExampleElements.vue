<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const schema = z.object({
  input: z.string({ message: 'Please enter your email' }).min(10, 'Must be at least 10 characters'),
  inputNumber: z.number({ message: 'Please enter a number' }).min(10, 'Must be at least 10'),
  inputMenu: z.any().refine(option => option?.value === 'option-2', {
    message: 'Please select Option 2'
  }),
  inputMenuMultiple: z.any().refine(values => !!values?.find((option: any) => option.value === 'option-2'), {
    message: 'Option 2 must be included'
  }),
  textarea: z.string({ message: 'Please enter a message' }).min(10, 'Must be at least 10 characters'),
  select: z.string({ message: 'Please select an option' }).refine(value => value === 'option-2', {
    message: 'Please select Option 2'
  }),
  selectMultiple: z.array(z.string(), { message: 'Please select at least one option' }).refine(values => values.includes('option-2'), {
    message: 'Option 2 must be included'
  }),
  selectMenu: z.any().refine(option => option?.value === 'option-2', {
    message: 'Please select Option 2'
  }),
  selectMenuMultiple: z.any().refine(values => !!values?.find((option: any) => option.value === 'option-2'), {
    message: 'Option 2 must be included'
  }),
  switch: z.boolean().refine(value => value === true, {
    message: 'Must be enabled'
  }),
  checkbox: z.boolean().refine(value => value === true, {
    message: 'Must be checked'
  }),
  radioGroup: z.string({ message: 'Please select an option' }).refine(value => value === 'option-2', {
    message: 'Please select Option 2'
  }),
  checkboxGroup: z.any().refine(values => !!values?.find((option: any) => option === 'option-2'), {
    message: 'Option 2 must be included'
  }),
  listbox: z.any().refine(option => option?.value === 'option-2', {
    message: 'Please select Option 2'
  }),
  listboxMultiple: z.any().refine(values => !!values?.find((option: any) => option.value === 'option-2'), {
    message: 'Option 2 must be included'
  }),
  inputTags: z.array(z.string(), { message: 'Please add at least one tag' }).min(1, 'Please add at least one tag'),
  inputDate: z.any().refine(value => !!value, {
    message: 'Please select a date'
  }),
  inputTime: z.any().refine(value => !!value, {
    message: 'Please select a time'
  }),
  slider: z.number().min(1, 'Must be greater than 0').max(20, 'Must be less than 20'),
  pin: z.string().regex(/^\d$/, 'Must be a digit').array().length(5, 'All 5 digits are required'),
  file: z.file({ message: 'Please upload a file' }).min(1, 'File is required').max(1024 * 1024, 'File must be less than 1MB').mime('image/png', 'Only PNG images are allowed')
})

type Schema = z.input<typeof schema>

const state = reactive<Partial<Schema>>({
  switch: false,
  checkbox: false,
  slider: 0,
  pin: []
})

const form = useTemplateRef('form')

const items = [
  { label: 'Option 1', value: 'option-1' },
  { label: 'Option 2', value: 'option-2' },
  { label: 'Option 3', value: 'option-3' }
]

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
  console.log(event.data)
}
</script>

<template>
  <UForm ref="form" :state="state" :schema="schema" class="w-full" @submit="onSubmit">
    <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
      <UFormField label="Input" name="input">
        <UInput v-model="state.input" placeholder="you@example.com" class="w-full" />
      </UFormField>

      <UFormField name="inputNumber" label="InputNumber">
        <UInputNumber v-model="state.inputNumber" placeholder="Enter a number" class="w-full" />
      </UFormField>

      <UFormField name="pin" label="PinInput" :error-pattern="/(pin)\..*/">
        <UPinInput v-model="state.pin" placeholder="○" />
      </UFormField>

      <UFormField name="inputDate" label="InputDate">
        <UInputDate v-model="state.inputDate" class="w-full" />
      </UFormField>

      <UFormField name="inputTime" label="InputTime">
        <UInputTime v-model="state.inputTime" class="w-full" />
      </UFormField>

      <UFormField name="inputTags" label="InputTags">
        <UInputTags v-model="state.inputTags" placeholder="Add a tag..." class="w-full" />
      </UFormField>

      <UFormField name="inputMenu" label="InputMenu">
        <UInputMenu v-model="state.inputMenu" :items="items" placeholder="Search an option..." class="w-full" />
      </UFormField>

      <UFormField name="inputMenuMultiple" label="InputMenu (Multiple)">
        <UInputMenu v-model="state.inputMenuMultiple" multiple :items="items" placeholder="Search options..." class="w-full" />
      </UFormField>

      <UFormField label="Textarea" name="textarea">
        <UTextarea v-model="state.textarea" placeholder="Write your message..." class="w-full" :rows="1" />
      </UFormField>

      <UFormField name="select" label="Select">
        <USelect v-model="state.select" :items="items" placeholder="Choose an option" class="w-full" />
      </UFormField>

      <UFormField name="selectMultiple" label="Select (Multiple)">
        <USelect v-model="state.selectMultiple" multiple :items="items" placeholder="Choose options" class="w-full" />
      </UFormField>

      <div class="hidden md:block" />

      <UFormField name="selectMenu" label="SelectMenu">
        <USelectMenu v-model="state.selectMenu" :items="items" placeholder="Search an option..." class="w-full" />
      </UFormField>

      <UFormField name="selectMenuMultiple" label="SelectMenu (Multiple)">
        <USelectMenu v-model="state.selectMenuMultiple" multiple :items="items" placeholder="Search options..." class="w-full" />
      </UFormField>

      <div class="hidden md:block" />

      <UFormField name="listbox" label="Listbox">
        <UListbox v-model="state.listbox" :items="items" class="w-full" />
      </UFormField>

      <UFormField name="listboxMultiple" label="Listbox (Multiple)">
        <UListbox v-model="state.listboxMultiple" :items="items" multiple class="w-full" />
      </UFormField>

      <UFormField name="file" label="FileUpload">
        <UFileUpload
          v-model="state.file"
          label="Drop your image here"
          description="PNG (max. 1MB)"
          class="w-full"
        />
      </UFormField>

      <UFormField name="checkbox" label="Checkbox">
        <UCheckbox v-model="state.checkbox" label="Check me" />
      </UFormField>

      <UFormField name="switch" label="Switch">
        <USwitch v-model="state.switch" label="Switch me" />
      </UFormField>

      <UFormField name="slider" label="Slider">
        <USlider v-model="state.slider" class="mt-2.5" />
      </UFormField>

      <UFormField name="checkboxGroup">
        <UCheckboxGroup v-model="state.checkboxGroup" legend="CheckboxGroup" :items="items" />
      </UFormField>

      <UFormField name="radioGroup">
        <URadioGroup v-model="state.radioGroup" legend="RadioGroup" :items="items" />
      </UFormField>
    </div>

    <div class="flex gap-2 mt-8">
      <UButton type="submit">
        Submit
      </UButton>

      <UButton variant="outline" @click="form?.clear()">
        Clear
      </UButton>
    </div>
  </UForm>
</template>
