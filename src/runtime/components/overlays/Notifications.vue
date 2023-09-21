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
import { twMerge, twJoin } from 'tailwind-merge'
import UNotification from './Notification.vue'
import { useUI } from '../../composables/useUI'
import { useToast } from '../../composables/useToast'
import { mergeConfig } from '../../utils'
import type { Notification, Strategy } from '../../types'
import { useState } from '#imports'
// @ts-expect-error
import appConfig from '#build/app.config'
import { notifications } from '#ui/ui.config'

const config = mergeConfig<typeof notifications>(appConfig.ui.strategy, appConfig.ui.notifications, notifications)

export default defineComponent({
  components: {
    UNotification
  },
  inheritAttrs: false,
  props: {
    ui: {
      type: Object as PropType<Partial<typeof config & { strategy?: Strategy }>>,
      default: undefined
    }
  },
  setup (props) {
    const { ui, attrs, attrsClass } = useUI('ui.notifications', props.ui, config)

    const toast = useToast()
    const notifications = useState<Notification[]>('notifications', () => [])

    const wrapperClass = computed(() => {
      return twMerge(twJoin(
        ui.value.wrapper,
        ui.value.position,
        ui.value.width
      ), attrsClass)
    })

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      toast,
      notifications,
      wrapperClass
    }
  }
})
</script>
