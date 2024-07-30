<script setup lang="ts">
const statuses = ['online', 'away', 'busy', 'offline']
const status = ref(statuses[0])

const color = computed(() => ({
  online: 'green',
  away: 'amber',
  busy: 'red',
  offline: 'gray'
})[status.value] as any)

const show = computed(() => status.value !== 'offline')

// Note: This is for demonstration purposes only. Don't do this at home.
onMounted(() => {
  setInterval(() => {
    status.value = statuses[(statuses.indexOf(status.value) + 1) % statuses.length]
  }, 1000)
})
</script>

<template>
  <UChip :color="color" :show="show" inset>
    <UAvatar src="https://avatars.githubusercontent.com/u/739984?v=4" />
  </UChip>
</template>
