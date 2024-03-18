<template>
  <div class="text-center">
    <UPopover v-model:open="open" arrow>
      <UButton label="Click me" color="white" />

      <template #content>
        <div class="flex justify-center gap-2 p-4 w-48">
          <UButton label="Close" color="gray" @click="open = false" />
          <UButton label="Send" color="black" trailing-icon="i-heroicons-paper-airplane" :loading="loading" @click="send" />
        </div>
      </template>
    </UPopover>

    <div class="mt-24">
      <UPopover mode="hover" :content="{ side: 'top' }">
        <UButton label="Hover me top" color="white" />

        <template #content>
          <div class="w-48 h-16" />
        </template>
      </UPopover>

      <div class="flex items-center gap-2 my-2">
        <UPopover mode="hover" :content="{ side: 'left' }">
          <UButton label="Hover me left" color="white" />

          <template #content>
            <div class="w-48 h-16" />
          </template>
        </UPopover>

        <UPopover mode="hover" :content="{ side: 'right' }">
          <UButton label="Hover me right" color="white" />

          <template #content>
            <div class="w-48 h-16" />
          </template>
        </UPopover>
      </div>

      <UPopover mode="hover">
        <UButton label="Hover me bottom" color="white" />

        <template #content>
          <div class="w-48 h-16" />
        </template>
      </UPopover>
    </div>
  </div>
</template>

<script setup lang="ts">
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
