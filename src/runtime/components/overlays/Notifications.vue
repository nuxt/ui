<template>
  <div :class="ui.wrapper">
    <div v-if="notifications.length" :class="ui.container">
      <div v-for="notification of notifications" :key="notification.id">
        <Notification
          v-bind="notification"
          :class="notification.click && 'cursor-pointer'"
          @click="notification.click && notification.click(notification)"
          @close="toast.remove(notification.id)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import { defu } from 'defu'
import type { ToastNotification } from '../../types'
import { useToast } from '../../composables/useToast'
import Notification from './Notification.vue'
import { useState, useAppConfig } from '#imports'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'

// const appConfig = useAppConfig()

export default defineComponent({
  components: {
    Notification
  },
  props: {
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.notifications>>,
      default: () => appConfig.ui.notifications
    }
  },
  setup (props) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.notifications>>(() => defu({}, props.ui, appConfig.ui.notifications))

    const toast = useToast()
    const notifications = useState<ToastNotification[]>('notifications', () => [])

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      toast,
      notifications
    }
  }
})
</script>
