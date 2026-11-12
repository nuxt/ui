<script setup lang="ts">
const items = [
  {
    label: 'Account',
    icon: 'i-lucide-user',
    slot: 'account'
  },
  {
    label: 'Password',
    icon: 'i-lucide-lock',
    slot: 'password'
  }
]

const state = reactive({
  name: 'Benjamin Canac',
  username: 'benjamincanac',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})
</script>

<template>
  <UTabs :items="items" :ui="{ root: 'w-full max-w-sm items-start', list: 'w-auto' }">
    <template #account>
      <UCard title="Account" description="Make changes to your account here. Click save when you're done.">
        <UForm :state="state" class="flex flex-col gap-4">
          <UFormField label="Name" name="name">
            <UInput v-model="state.name" class="w-full" />
          </UFormField>
          <UFormField label="Username" name="username">
            <UInput v-model="state.username" class="w-full" />
          </UFormField>
        </UForm>

        <template #footer>
          <UButton label="Save changes" />
        </template>
      </UCard>
    </template>

    <template #password>
      <UCard title="Password" description="Change your password here. After saving, you'll be logged out.">
        <UForm :state="state" class="flex flex-col gap-4">
          <UFormField label="Current Password" name="current" required>
            <UInput v-model="state.currentPassword" type="password" required class="w-full" />
          </UFormField>
          <UFormField label="New Password" name="new" required>
            <UInput v-model="state.newPassword" type="password" required class="w-full" />
          </UFormField>
          <UFormField label="Confirm Password" name="confirm" required>
            <UInput v-model="state.confirmPassword" type="password" required class="w-full" />
          </UFormField>
        </UForm>

        <template #footer>
          <UButton label="Save password" />
        </template>
      </UCard>
    </template>
  </UTabs>
</template>
