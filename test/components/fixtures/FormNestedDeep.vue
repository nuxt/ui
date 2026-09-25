<script setup lang="ts">
import { reactive, useTemplateRef } from 'vue'

const state = reactive<any>({ address: {} })

const form = useTemplateRef('form')
</script>

<template>
  <UForm ref="form" :state="state">
    <UForm nested>
      <UForm name="address" nested>
        <UFormField id="streetField" name="street">
          <UInput id="street" v-model="state.address.street" />
        </UFormField>
      </UForm>
    </UForm>
  </UForm>
</template>
