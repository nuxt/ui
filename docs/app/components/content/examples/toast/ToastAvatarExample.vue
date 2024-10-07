<script setup lang="ts">
import type { AvatarProps } from '@nuxt/ui'

const props = defineProps<{
  avatar: AvatarProps
}>()

const toast = useToast()

function showToast() {
  toast.add({
    title: 'User invited',
    description: 'benjamincanac was invited to the team.',
    avatar: props.avatar
  })
}
</script>

<template>
  <UButton label="Invite user" color="neutral" variant="outline" @click="showToast" />
</template>
