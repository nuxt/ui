<script setup lang="ts">
const open = ref(false)
const loading = ref(false)

function send() {
  loading.value = true

  setTimeout(() => {
    loading.value = false
    open.value = false
  }, 1000)
}
</script>

<template>
  <div class="text-center">
    <div>
      <UPopover arrow :content="{ side: 'top' }">
        <UButton label="Click me top" color="neutral" variant="outline" />

        <template #content>
          <div class="w-48 h-16" />
        </template>
      </UPopover>

      <div class="flex items-center gap-2 my-2">
        <UPopover arrow :content="{ side: 'left' }">
          <UButton label="Click me left" color="neutral" variant="outline" />

          <template #content>
            <div class="w-48 h-16" />
          </template>
        </UPopover>

        <UPopover arrow :content="{ side: 'right' }">
          <UButton label="Click me right" color="neutral" variant="outline" />

          <template #content>
            <div class="w-48 h-16" />
          </template>
        </UPopover>
      </div>

      <UPopover v-model:open="open" arrow>
        <UButton label="Click me bottom" color="neutral" variant="outline" />

        <template #content>
          <div class="flex justify-center gap-2 p-4 w-48">
            <UButton label="Close" color="neutral" @click="open = false" />
            <UButton label="Send" color="neutral" trailing-icon="i-lucide-send-horizontal" :loading="loading" @click="send" />
          </div>
        </template>
      </UPopover>
    </div>

    <div class="mt-24">
      <UPopover mode="hover" arrow :content="{ side: 'top' }">
        <UButton label="Hover me top" color="neutral" variant="outline" />

        <template #content>
          <div class="w-48 h-16" />
        </template>
      </UPopover>

      <div class="flex items-center gap-2 my-2">
        <UPopover mode="hover" arrow :content="{ side: 'left' }">
          <UButton label="Hover me left" color="neutral" variant="outline" />

          <template #content>
            <div class="w-48 h-16" />
          </template>
        </UPopover>

        <UPopover mode="hover" arrow :content="{ side: 'right' }">
          <UButton label="Hover me right" color="neutral" variant="outline" />

          <template #content>
            <div class="w-48 h-16" />
          </template>
        </UPopover>
      </div>

      <UPopover mode="hover" arrow>
        <UButton label="Hover me bottom" color="neutral" variant="outline" />

        <template #content>
          <div class="w-48 h-16" />
        </template>
      </UPopover>
    </div>
  </div>
</template>
