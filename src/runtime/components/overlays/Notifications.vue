<template>
  <div class="fixed bottom-0 right-0 flex flex-col justify-end w-full z-[55] sm:w-96">
    <div v-if="notifications.length" class="px-4 py-6 space-y-3 overflow-y-auto sm:px-6">
      <div
        v-for="notification of notifications"
        :key="notification.id"
      >
        <Notification
          v-bind="notification"
          :class="notification.click && 'cursor-pointer'"
          @click="notification.click && notification.click(notification)"
          @close="$toast.removeNotification(notification.id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Notification from './Notification'
import { useNuxtApp, useState } from '#imports'

const { $toast } = useNuxtApp()
const notifications = useState('notifications', () => [])
</script>

<script lang="ts">
export default { name: 'UNotifications' }
</script>
