<template>
  <Teleport to="body">
    <div v-if="notifications.length" :class="wrapperClass" role="region" v-bind="attrs">
      <div :class="ui.container">
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
  </Teleport>
</template>

<script lang="ts">
import { computed, toRef, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { twMerge, twJoin } from 'tailwind-merge'
import { useUI } from '../../composables/useUI'
import { useToast } from '../../composables/useToast'
import { mergeConfig } from '../../utils'
import type { DeepPartial, Notification, Strategy } from '../../types/index'
import UNotification from './Notification.vue'
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
    class: {
      type: [String, Object, Array] as PropType<any>,
      default: () => ''
    },
    ui: {
      type: Object as PropType<DeepPartial<typeof config> & { strategy?: Strategy }>,
      default: () => ({})
    }
  },
  setup(props) {
    const { ui, attrs } = useUI('notifications', toRef(props, 'ui'), config)

    const toast = useToast()
    const notifications = useState<Notification[]>('notifications', () => [])

    const wrapperClass = computed(() => {
      return twMerge(twJoin(
        ui.value.wrapper,
        ui.value.position,
        ui.value.width
      ), props.class)
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
