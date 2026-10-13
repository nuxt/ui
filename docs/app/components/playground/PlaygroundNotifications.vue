<script setup lang="ts">
const toast = useToast()

const settings = ref({
  transactions: true,
  security: true,
  marketing: false
})
</script>

<template>
  <div>
    <div class="p-4 space-y-4">
      <div>
        <p class="font-semibold text-highlighted">
          Notifications
        </p>
        <p class="text-sm text-muted">
          Choose what you want to be notified about.
        </p>
      </div>

      <div class="space-y-3">
        <USwitch v-model="settings.transactions" label="Transaction alerts" description="Deposits, withdrawals and transfers." />
        <USwitch v-model="settings.security" label="Security alerts" description="Login attempts and account changes." />
        <USwitch v-model="settings.marketing" label="Marketing emails" description="Product news and occasional updates." />
      </div>
    </div>

    <div class="flex justify-start border-t border-default px-4 py-3">
      <UButton label="Save preferences" variant="outline" @click="toast.add({ title: 'Preferences saved' })" />
    </div>
  </div>
</template>
