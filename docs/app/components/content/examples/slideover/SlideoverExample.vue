<script setup lang="ts">
const open = ref(false)
const toast = useToast()

const activity = [{
  key: 'comments',
  label: 'Comments',
  description: 'When someone replies to your comment.'
}, {
  key: 'mentions',
  label: 'Mentions',
  description: 'When someone mentions you in a thread.'
}, {
  key: 'assignments',
  label: 'Assignments',
  description: 'When a task is assigned to you.'
}] as const

const digests = [{
  label: 'Daily',
  value: 'daily'
}, {
  label: 'Weekly',
  value: 'weekly'
}, {
  label: 'Never',
  value: 'never'
}]

const channels = [{
  label: 'Email',
  value: 'email'
}, {
  label: 'Push',
  value: 'push'
}, {
  label: 'Slack',
  value: 'slack'
}]

const state = reactive({
  comments: true,
  mentions: true,
  assignments: false,
  digest: 'weekly',
  channels: ['email', 'push']
})

function onSave() {
  open.value = false

  toast.add({ title: 'Preferences saved', icon: 'i-lucide-check' })
}
</script>

<template>
  <USlideover v-model:open="open" title="Notifications" description="Choose what you want to hear about and where." :ui="{ footer: 'justify-end' }">
    <UButton label="Open" color="neutral" variant="subtle" />

    <template #body>
      <div class="flex flex-col gap-6">
        <UFormField label="Activity">
          <div class="flex flex-col gap-4 mt-2">
            <USwitch
              v-for="item in activity"
              :key="item.key"
              v-model="state[item.key]"
              :label="item.label"
              :description="item.description"
              color="neutral"
            />
          </div>
        </UFormField>

        <USeparator />

        <UFormField label="Digest" description="A summary of the activity in your workspace.">
          <URadioGroup
            v-model="state.digest"
            :items="digests"
            orientation="horizontal"
            color="neutral"
            variant="card"
            class="mt-2"
          />
        </UFormField>

        <USeparator />

        <UFormField label="Channels" description="Where we send your notifications.">
          <UCheckboxGroup v-model="state.channels" :items="channels" orientation="horizontal" color="neutral" class="mt-2" />
        </UFormField>
      </div>
    </template>

    <template #footer>
      <UButton label="Cancel" color="neutral" variant="outline" @click="open = false" />
      <UButton label="Save" color="neutral" @click="onSave" />
    </template>
  </USlideover>
</template>
