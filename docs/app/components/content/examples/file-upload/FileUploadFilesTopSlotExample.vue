<script setup lang="ts">
const value = ref<File[]>([])
</script>

<template>
  <UFileUpload
    v-model="value"
    icon="i-lucide-image"
    label="Drop your images here"
    description="SVG, PNG, JPG or GIF (max. 2MB)"
    layout="grid"
    multiple
    :interactive="false"
    class="w-96 min-h-48"
  >
    <template #actions="{ open }">
      <UButton
        label="Select images"
        icon="i-lucide-upload"
        color="neutral"
        variant="outline"
        @click="open()"
      />
    </template>

    <template #files-top="{ open, files }">
      <div v-if="files?.length" class="mb-2 flex items-center justify-between">
        <p class="font-bold">
          Files ({{ files?.length }})
        </p>

        <UButton
          icon="i-lucide-plus"
          label="Add more"
          color="neutral"
          variant="outline"
          class="-my-2"
          @click="open()"
        />
      </div>
    </template>
  </UFileUpload>
</template>
