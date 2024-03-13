<template>
  <div class="flex gap-2">
    <UPopover v-model:open="open" arrow>
      <UButton label="Click me" color="white" />

      <template #content>
        <div class="flex justify-center gap-2 p-4 w-48">
          <UButton label="Close" color="gray" @click="open = false" />
          <UButton label="Send" color="black" trailing-icon="i-heroicons-paper-airplane" :loading="loading" @click="send" />
        </div>
      </template>
    </UPopover>

    <UPopover arrow mode="hover">
      <UButton label="Hover me" color="white" />

      <template #content>
        <div class="w-48 h-16" />
      </template>
    </UPopover>
  </div>
</template>

<script setup>
const open = ref(false)
const loading = ref(false)

function send () {
  loading.value = true

  setTimeout(() => {
    loading.value = false
    open.value = false
  }, 1000)
}
</script>
