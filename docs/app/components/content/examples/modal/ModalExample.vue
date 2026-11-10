<script setup lang="ts">
const open = ref(false)
const toast = useToast()

const roles = ['Admin', 'Member', 'Viewer']

const email = ref('')
const role = ref('Member')

const members = ref([{
  name: 'Benjamin Canac',
  email: 'benjamin@example.com',
  avatar: 'https://github.com/benjamincanac.png',
  role: 'Admin'
}, {
  name: 'Sébastien Chopin',
  email: 'sebastien@example.com',
  avatar: 'https://github.com/atinux.png',
  role: 'Member'
}, {
  name: 'Romain Hamel',
  email: 'romain@example.com',
  avatar: 'https://github.com/romhml.png',
  role: 'Viewer'
}])

const link = 'https://example.com/invite/8f3k2'

function onCopy() {
  navigator.clipboard?.writeText(link)

  toast.add({ title: 'Invite link copied', icon: 'i-lucide-check' })
}

function onSubmit() {
  open.value = false

  toast.add({
    title: 'Invitation sent',
    description: `${email.value || 'Your teammate'} joins as ${role.value.toLowerCase()}.`
  })
}
</script>

<template>
  <UModal v-model:open="open" title="Invite teammates" description="Add people to your workspace and manage who has access." :ui="{ footer: 'justify-end' }">
    <UButton label="Open" color="neutral" variant="subtle" />

    <template #body>
      <div class="flex flex-col gap-6">
        <UFieldGroup class="w-full">
          <UInput v-model="email" type="email" placeholder="jane@example.com" icon="i-lucide-mail" class="flex-1" />
          <USelect v-model="role" :items="roles" class="w-28" />
        </UFieldGroup>

        <div class="flex flex-col gap-3">
          <p class="text-sm font-medium text-strong">
            People with access
          </p>

          <div v-for="member in members" :key="member.email" class="flex items-center gap-3">
            <UAvatar :src="member.avatar" :alt="member.name" />

            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-medium text-strong">
                {{ member.name }}
              </p>
              <p class="truncate text-sm text-muted">
                {{ member.email }}
              </p>
            </div>

            <USelect v-model="member.role" :items="roles" variant="ghost" class="w-28" />
          </div>
        </div>

        <UInput :model-value="link" readonly icon="i-lucide-link" class="w-full" :ui="{ trailing: 'pe-1' }">
          <template #trailing>
            <UButton label="Copy" color="neutral" variant="ghost" size="sm" @click="onCopy" />
          </template>
        </UInput>
      </div>
    </template>

    <template #footer>
      <UButton label="Cancel" color="neutral" variant="outline" @click="open = false" />
      <UButton label="Send invite" color="neutral" @click="onSubmit" />
    </template>
  </UModal>
</template>
