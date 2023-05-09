<template>
  <div ref="trigger" :class="ui.wrapper" @mouseover="onMouseOver" @mouseleave="onMouseLeave">
    <slot :open="open">
      hover
    </slot>

    <div v-if="open && !prevent" ref="container" :class="[ui.container, ui.width]">
      <transition appear v-bind="ui.transition">
        <div :class="[ui.base, ui.background, ui.rounded, ui.shadow, ui.ring]">
          <slot name="text">
            {{ text }}
          </slot>

          <span v-if="shortcuts?.length" :class="ui.shortcuts">
            <span class="mx-1 text-gray-700 dark:text-gray-200">&middot;</span>
            <UKbd v-for="shortcut of shortcuts" :key="shortcut" size="xs">
              {{ shortcut }}
            </Ukbd>
          </span>
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ref, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { defu } from 'defu'
import UKbd from '../elements/Kbd.vue'
import { usePopper } from '../../composables/usePopper'
import type { PopperOptions } from '../../types'
import { useAppConfig } from '#imports'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'

// const appConfig = useAppConfig()

export default defineComponent({
  components: {
    UKbd
  },
  props: {
    text: {
      type: String,
      default: null
    },
    prevent: {
      type: Boolean,
      default: false
    },
    shortcuts: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    openDelay: {
      type: Number,
      default: 0
    },
    closeDelay: {
      type: Number,
      default: 0
    },
    popper: {
      type: Object as PropType<PopperOptions>,
      default: () => ({})
    },
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.tooltip>>,
      default: () => appConfig.ui.tooltip
    }
  },
  setup (props) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.tooltip>>(() => defu({}, props.ui, appConfig.ui.tooltip))

    const popper = computed<PopperOptions>(() => defu({}, props.popper, ui.value.popper as PopperOptions))

    const [trigger, container] = usePopper(popper.value)

    const open = ref(false)

    let openTimeout: NodeJS.Timeout | null = null
    let closeTimeout: NodeJS.Timeout | null = null

    // Methods

    function onMouseOver () {
      // cancel programmed closing
      if (closeTimeout) {
        clearTimeout(closeTimeout)
        closeTimeout = null
      }
      // dropdown already open
      if (open.value) {
        return
      }
      openTimeout = openTimeout || setTimeout(() => {
        open.value = true
        openTimeout = null
      }, props.openDelay)
    }

    function onMouseLeave () {
      // cancel programmed opening
      if (openTimeout) {
        clearTimeout(openTimeout)
        openTimeout = null
      }
      // dropdown already closed
      if (!open.value) {
        return
      }
      closeTimeout = closeTimeout || setTimeout(() => {
        open.value = false
        closeTimeout = null
      }, props.closeDelay)
    }

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      trigger,
      container,
      open,
      onMouseOver,
      onMouseLeave
    }
  }
})
</script>
