<script setup lang="ts">
import { reactive, useTemplateRef } from 'vue'
import { UFormField, UInput, UForm } from '#components'

const state = reactive<any>({})
const form = useTemplateRef('form')
</script>

<template>
  <UForm id="42" ref="form" :state="state">
    <UFormField id="field" name="value">
      <UInput id="input" v-model="state.value" />
    </UFormField>
  </UForm>
</template>
