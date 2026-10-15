<script setup lang="ts">
import { z } from 'zod'
import { reactive, useTemplateRef } from 'vue'

defineProps<{ nestedName?: string }>()

const state = reactive<any>({ field: 'abc', nested: { field: 'abc' } })
const nestedSchema = z.object({
  field: z.string().transform(value => value.toUpperCase())
})

const form = useTemplateRef('form')
</script>

<template>
  <UForm ref="form" :state="state">
    <UForm :name="nestedName" :schema="nestedSchema" nested />
  </UForm>
</template>
