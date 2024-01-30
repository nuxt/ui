<template>
  <UForm :schema="schema" :state="state" class="space-y-4">
    <UFormGroup label="Username" name="username" eager-validation>
      <UInput v-model="state.username" placeholder="Choose Username" />
    </UFormGroup>
  </UForm>
</template>

<script setup lang="ts">
import { z } from 'zod'

const schema = z.object({
  username: z.string().min(10, 'Must be at least 10 characters')
})

const state = reactive({
  username: undefined
})
</script>
