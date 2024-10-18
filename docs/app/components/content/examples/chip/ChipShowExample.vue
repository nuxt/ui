<script setup lang="ts">
const statuses = ['online', 'away', 'busy', 'offline']
const status = ref(statuses[0])

const color = computed(() => status.value ? { online: 'success', away: 'warning', busy: 'error', offline: 'neutral' }[status.value] as any : 'online')

const show = computed(() => status.value !== 'offline')

// Note: This is for demonstration purposes only. Don't do this at home.
onMounted(() => {
  setInterval(() => {
    if (status.value) {
      status.value = statuses[(statuses.indexOf(status.value) + 1) % statuses.length]
    }
  }, 1000)
})
</script>

<template>
  <UChip :color="color" :show="show" inset>
    <UAvatar src="https://github.com/benjamincanac.png" />
  </UChip>
</template>
