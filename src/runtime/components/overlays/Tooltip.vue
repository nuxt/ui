<template>
  <div ref="trigger" :class="ui.wrapper" v-bind="attrs" @mouseover="onMouseOver" @mouseleave="onMouseLeave">
    <slot :open="open">
      Hover
    </slot>

    <div v-if="open && !prevent" ref="container" :class="[ui.container, ui.width]">
      <Transition appear v-bind="ui.transition">
        <div :class="[ui.base, ui.background, ui.color, ui.rounded, ui.shadow, ui.ring]">
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
      </Transition>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ref, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { defu } from 'defu'
import UKbd from '../elements/Kbd.vue'
import { useUI } from '../../composables/useUI'
import { usePopper } from '../../composables/usePopper'
import { mergeConfig } from '../../utils'
import type { PopperOptions, Strategy } from '../../types'
// @ts-expect-error
import appConfig from '#build/app.config'
import { tooltip } from '#ui/ui.config'

const config = mergeConfig<typeof tooltip>(appConfig.ui.strategy, appConfig.ui.tooltip, tooltip)

export default defineComponent({
  components: {
    UKbd
  },
  inheritAttrs: false,
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
      type: Object as PropType<Partial<typeof config & { strategy?: Strategy }>>,
      default: undefined
    }
  },
  setup (props) {
    const { ui, attrs } = useUI('tooltip', props.ui, config, { mergeWrapper: true })

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
      attrs,
      trigger,
      container,
      open,
      onMouseOver,
      onMouseLeave
    }
  }
})
</script>
