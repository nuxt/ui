<script setup lang="ts">
const open = ref(false)
</script>

<template>
  <UDrawer
    v-model:open="open"
    title="Terms of service"
    description="Please read and accept the terms to continue."
    close
    :dismissible="false"
    :modal="false"
    :ui="{ container: 'max-w-xl mx-auto' }"
  >
    <UButton label="Open" color="neutral" variant="subtle" />

    <template #body>
      <div class="space-y-3 text-sm text-muted">
        <p>By using this service, you agree to keep your account details accurate and to not share your credentials with anyone else.</p>
        <p>We may update these terms from time to time. When we do, we'll let you know before the changes take effect.</p>
      </div>
    </template>

    <template #footer>
      <UButton label="Accept" color="neutral" class="justify-center" @click="open = false" />
    </template>
  </UDrawer>
</template>
