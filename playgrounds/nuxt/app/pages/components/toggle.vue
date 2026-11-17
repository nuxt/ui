<script setup lang="ts">
const bold = ref(true)
</script>

<template>
  <Navbar />

  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-2">
      <UToggle v-model="bold" icon="i-lucide-bold" aria-label="Toggle bold" />
      <UToggle icon="i-lucide-italic" aria-label="Toggle italic" />
      <UToggle icon="i-lucide-underline" aria-label="Toggle underline" disabled />
    </div>

    <div class="flex items-center gap-2">
      <UToggle label="Bold" icon="i-lucide-bold" :default-value="true" />
      <UToggle label="Outline" variant="outline" active-variant="subtle" :default-value="true" />
      <UToggle label="Solid" active-color="neutral" active-variant="solid" :default-value="true" />
    </div>
  </div>
</template>
