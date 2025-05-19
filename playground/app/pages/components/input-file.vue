<script setup lang="ts">
const file = ref<File | File[]>()

const addExternalFile = () => {
  const newFile = new File(['content'], 'new-file.txt', { type: 'text/plain' })
  file.value = newFile
}
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div class="flex flex-col gap-4 w-48">
      <UFormField label="Single input">
        <UInputFile v-model="file" />
      </UFormField>
      <USeparator />
      <UFormField label="Multiple input">
        <UInputFile v-model="file" multiple autofocus />
      </UFormField>
      <USeparator />
      <UFormField label="Multiple with count">
        <UInputFile v-model="file" multiple count />
      </UFormField>
      <USeparator />
      <UFormField label="Disabled input">
        <UInputFile v-model="file" disabled />
      </UFormField>
      <USeparator />
      <UFormField label="Required input">
        <UInputFile v-model="file" required />
      </UFormField>
      <USeparator />
      <p>Add external File</p>
      <UButton @click="addExternalFile()">
        Add external file
      </UButton>
    </div>
  </div>
</template>
