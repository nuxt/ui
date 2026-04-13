# Settings Page

Complete patterns for settings pages with tabs and forms.

## Basic settings with tabs

```vue [pages/dashboard/settings.vue]
<script setup lang="ts">
import { z } from 'zod'

definePageMeta({ layout: 'dashboard' })

const items = [{
  label: 'Profile',
  icon: 'i-lucide-user',
  slot: 'profile' as const
}, {
  label: 'Notifications',
  icon: 'i-lucide-bell',
  slot: 'notifications' as const
}, {
  label: 'Security',
  icon: 'i-lucide-shield',
  slot: 'security' as const
}]

// Profile form
const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  bio: z.string().optional()
})

type ProfileSchema = z.output<typeof profileSchema>
const profileState = reactive<Partial<ProfileSchema>>({
  name: 'John Doe',
  email: 'john@example.com',
  bio: ''
})

// Notifications form
const notifications = reactive({
  email: true,
  push: false,
  marketing: false
})
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Settings" />
    </template>

    <template #body>
      <UContainer class="py-6">
        <UTabs :items="items">
          <template #profile>
            <UForm :schema="profileSchema" :state="profileState" class="space-y-4" @submit="saveProfile">
              <UFormField name="name" label="Name">
                <UInput v-model="profileState.name" />
              </UFormField>

              <UFormField name="email" label="Email">
                <UInput v-model="profileState.email" type="email" />
              </UFormField>

              <UFormField name="bio" label="Bio" description="Brief description for your profile." hint="Optional">
                <UTextarea v-model="profileState.bio" :rows="3" autoresize />
              </UFormField>

              <div class="flex justify-end">
                <UButton type="submit" label="Save changes" />
              </div>
            </UForm>
          </template>

          <template #notifications>
            <div class="space-y-4">
              <USwitch v-model="notifications.email" label="Email notifications" description="Receive updates via email" />
              <USwitch v-model="notifications.push" label="Push notifications" description="Receive push notifications" />
              <USeparator />
              <USwitch v-model="notifications.marketing" label="Marketing emails" description="Receive product news and tips" />

              <div class="flex justify-end">
                <UButton label="Save preferences" @click="saveNotifications" />
              </div>
            </div>
          </template>

          <template #security>
            <div class="space-y-6">
              <UCard>
                <template #header>
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="text-base font-semibold text-default">Password</h3>
                      <p class="text-sm text-muted">Update your password to keep your account secure.</p>
                    </div>
                    <UButton label="Change password" color="neutral" variant="outline" />
                  </div>
                </template>
              </UCard>

              <UCard>
                <template #header>
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="text-base font-semibold text-default">Two-factor authentication</h3>
                      <p class="text-sm text-muted">Add an extra layer of security.</p>
                    </div>
                    <UButton label="Enable" color="neutral" variant="outline" />
                  </div>
                </template>
              </UCard>

              <UCard>
                <template #header>
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="text-base font-semibold text-error">Delete account</h3>
                      <p class="text-sm text-muted">Permanently delete your account and all data.</p>
                    </div>
                    <UButton label="Delete account" color="error" variant="soft" />
                  </div>
                </template>
              </UCard>
            </div>
          </template>
        </UTabs>
      </UContainer>
    </template>
  </UDashboardPanel>
</template>
```

## Tips

- Use `UTabs` with named `slot` property to define tab content in separate template blocks
- Each tab section should have its own form with its own save button
- Use `UCard` for grouped settings (security section)
- Destructive actions (delete account) should use `color="error"` with `variant="soft"` — not solid unless it's in a confirmation dialog
- Use `USeparator` to visually group related toggles
- Place save buttons at the bottom-right with `flex justify-end`
