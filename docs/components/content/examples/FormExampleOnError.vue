<script setup lang="ts">
import { object, string } from 'yup'
import type { FormErrorEvent } from '@nuxt/ui/dist/runtime/types'

const schema = object({ email: string().email('Invalid email').required('Required') })

const state = reactive({ email: undefined })

async function onError (event: FormErrorEvent) {
  console.log(event)

  const element = document.getElementById(event.errors[0].id)
  console.log(element)
  element.focus()
  element.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

</script>

<template>
  <UForm
    :schema="schema"
    :state="state"
    @submit="console.log"
    @error="onError"
  >
    <UFormGroup label="Email" name="email">
      <UInput v-model="state.email" />
    </UFormGroup>

    <UButton type="submit">
      Submit
    </UButton>
  </UForm>
</template>
