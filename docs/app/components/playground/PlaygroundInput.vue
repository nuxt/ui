<script setup lang="ts">
const email = ref('')
</script>

<template>
  <div class="flex flex-col gap-4 p-4">
    <UFormField label="Your email" description="We won't share your email." required>
      <UInput v-model="email" type="email" placeholder="john@example.com" icon="i-lucide-mail" class="w-full" />
    </UFormField>

    <UFormField label="Search" hint="⌘K">
      <UInput placeholder="Search documentation…" icon="i-lucide-search" class="w-full">
        <template #trailing>
          <UKbd value="meta" />
          <UKbd value="K" />
        </template>
      </UInput>
    </UFormField>
  </div>
</template>
