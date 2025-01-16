<script setup lang="ts">
const items = [{
  key: 'account',
  label: 'Account',
  description: 'Make changes to your account here. Click save when you\'re done.'
}, {
  key: 'password',
  label: 'Password',
  description: 'Change your password here. After saving, you\'ll be logged out.'
}]

const accountForm = reactive({ name: 'Benjamin', username: 'benjamincanac' })
const passwordForm = reactive({ currentPassword: '', newPassword: '' })

function onSubmit(form) {
  console.log('Submitted form:', form)
}
</script>

<template>
  <UTabs :items="items" class="w-full">
    <template #item="{ item }">
      <UCard @submit.prevent="() => onSubmit(item.key === 'account' ? accountForm : passwordForm)">
        <template #header>
          <p class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            {{ item.label }}
          </p>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ item.description }}
          </p>
        </template>

        <div v-if="item.key === 'account'" class="space-y-3">
          <UFormGroup label="Name" name="name">
            <UInput v-model="accountForm.name" />
          </UFormGroup>
          <UFormGroup label="Username" name="username">
            <UInput v-model="accountForm.username" />
          </UFormGroup>
        </div>
        <div v-else-if="item.key === 'password'" class="space-y-3">
          <UFormGroup label="Current Password" name="current" required>
            <UInput v-model="passwordForm.currentPassword" type="password" required />
          </UFormGroup>
          <UFormGroup label="New Password" name="new" required>
            <UInput v-model="passwordForm.newPassword" type="password" required />
          </UFormGroup>
        </div>

        <template #footer>
          <UButton type="submit" color="black">
            Save {{ item.key === 'account' ? 'account' : 'password' }}
          </UButton>
        </template>
      </UCard>
    </template>
  </UTabs>
</template>
