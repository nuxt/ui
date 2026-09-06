<script setup lang="ts">
import { z } from 'zod'
import { reactive, useTemplateRef } from 'vue'

const state = reactive<any>({
  nested: { }
})

const nestedSchema = z.object({
  first: z.string().min(1),
  second: z.string().min(1)
})

const form = useTemplateRef('form')
</script>

<template>
  <UForm ref="form" :state="state">
    <UForm name="nested" :schema="nestedSchema" nested>
      <UFormField id="firstField" name="first">
        <UInput id="first" v-model="state.nested.first" />
      </UFormField>
      <UFormField id="secondField" name="second">
        <UInput id="second" v-model="state.nested.second" />
      </UFormField>
    </UForm>
  </UForm>
</template>
