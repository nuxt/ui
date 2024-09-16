<script setup lang="ts">
const state = reactive({ fullName: '' })

async function onSubmit() {
  return new Promise<void>(res => setTimeout(res, 1000))
}

async function validate(data: Partial<typeof state>) {
  if (!data.fullName?.length) return [{ name: 'fullName', message: 'Required' }]
  return []
}
</script>

<template>
  <UForm :state="state" :validate="validate" @submit="onSubmit">
    <UFormField name="fullName" label="Full name">
      <UInput v-model="state.fullName" />
    </UFormField>
    <UButton type="submit" class="mt-2" loading-auto>
      Submit
    </UButton>
  </UForm>
</template>
