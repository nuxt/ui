<template>
  <UPopover v-model:open="open" arrow mode="hover">
    <UButton label="Hover me" color="white" />

    <template #content>
      <div class="flex gap-2 p-4">
        <UButton label="Close" color="gray" @click="open = false" />
        <UButton label="Send" color="black" trailing-icon="i-heroicons-paper-airplane" :loading="loading" @click="send" />
      </div>
    </template>
  </UPopover>
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