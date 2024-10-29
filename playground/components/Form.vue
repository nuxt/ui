<script setup>
import { object, string } from 'yup'

const emits = defineEmits(['error'])
const form = ref()

const state = reactive({
  project: null,
  filter: null
})
const schema = object({
  project: string().required('Please provide project name.')
})

function onError(event) {
  console.log({ event })
  emits('error', event)
}

async function validateInsideForm() {
  const state = await form.value.validate('', {
    emit: true
  })
  console.log(state)
}

defineExpose({
  validate: async () => {
    await form.value.validate()
  }
})
</script>

<template>
  <UForm
    ref="form"
    :schema="schema"
    :state="state"
    class="space-y-5"
    @error="onError"
  >
    <UFormGroup label="Project Name" name="project">
      <UInput v-model="state.project" placeholder="Type project name..." />
    </UFormGroup>
    <UButton type="submit" class="mr-5">
      submit
    </UButton>
    <UButton @click="validateInsideForm">
      Validate inside form
    </UButton>
  </UForm>
</template>
