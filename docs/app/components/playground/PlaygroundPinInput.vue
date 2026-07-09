<script setup lang="ts">
const value = ref<string[]>(['4', '3', '2'])
</script>

<template>
  <div class="flex flex-col items-center gap-3 p-6 text-center">
    <UIcon name="i-lucide-shield-check" class="size-7 text-primary" />

    <div>
      <p class="font-semibold text-highlighted">
        Verify your account
      </p>
      <p class="text-sm text-muted">
        Enter the 6-digit code we sent you.
      </p>
    </div>

    <UPinInput v-model="value" :length="6" otp />

    <p class="text-sm text-muted">
      Didn't get a code? <UButton variant="link" size="sm" class="p-0" label="Resend" />
    </p>
  </div>
</template>
