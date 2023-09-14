<template>
  <div :class="wrapperClass" v-bind="attrs">
    <div v-if="notifications.length" :class="ui.container">
      <div v-for="notification of notifications" :key="notification.id">
        <UNotification
          v-bind="notification"
          :class="notification.click && 'cursor-pointer'"
          @click="notification.click && notification.click(notification)"
          @close="toast.remove(notification.id)"
        >
          <template v-for="(_, name) in $slots" #[name]="slotData">
            <slot :name="name" v-bind="slotData" />
          </template>
        </UNotification>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { omit } from '../../utils/lodash'
import { twMerge, twJoin } from 'tailwind-merge'
import UNotification from './Notification.vue'
import { useToast } from '../../composables/useToast'
import { defuTwMerge } from '../../utils'
import type { Notification } from '../../types/notification'
import { useState, useAppConfig } from '#imports'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'

// const appConfig = useAppConfig()

export default defineComponent({
  components: {
    UNotification
  },
  inheritAttrs: false,
  props: {
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.notifications>>,
      default: () => ({})
    }
  },
  setup (props, { attrs }) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.notifications>>(() => defuTwMerge({}, props.ui, appConfig.ui.notifications))

    const toast = useToast()
    const notifications = useState<Notification[]>('notifications', () => [])

    const wrapperClass = computed(() => {
      return twMerge(twJoin(
        ui.value.wrapper,
        ui.value.position,
        ui.value.width
      ), attrs.class as string)
    })

    return {
      attrs: computed(() => omit(attrs, ['class'])),
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      toast,
      notifications,
      wrapperClass
    }
  }
})
</script>
