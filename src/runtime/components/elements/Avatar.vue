<template>
  <span :class="wrapperClass">
    <img
      v-if="url && !error"
      :class="avatarClass"
      :alt="alt"
      :src="url"
      v-bind="$attrs"
      @error="onError"
    >
    <span v-else-if="text" :class="ui.text">{{ text }}</span>
    <UIcon v-else-if="icon" :name="icon" :class="iconClass" />
    <span v-else-if="placeholder" :class="ui.placeholder">{{ placeholder }}</span>

    <span v-if="chipColor" :class="chipClass">
      {{ chipText }}
    </span>
    <slot />
  </span>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue'
import type { PropType } from 'vue'
import { defu } from 'defu'
import UIcon from '../elements/Icon.vue'
import { classNames } from '../../utils'
import { useAppConfig } from '#imports'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'

// const appConfig = useAppConfig()

export default defineComponent({
  components: {
    UIcon
  },
  inheritAttrs: false,
  props: {
    src: {
      type: [String, Boolean],
      default: null
    },
    alt: {
      type: String,
      default: null
    },
    text: {
      type: String,
      default: null
    },
    icon: {
      type: String,
      default: () => appConfig.ui.avatar.default.icon
    },
    size: {
      type: String,
      default: () => appConfig.ui.avatar.default.size,
      validator (value: string) {
        return Object.keys(appConfig.ui.avatar.size).includes(value)
      }
    },
    chipColor: {
      type: String,
      default: () => appConfig.ui.avatar.default.chipColor,
      validator (value: string) {
        return ['gray', ...appConfig.ui.colors].includes(value)
      }
    },
    chipPosition: {
      type: String,
      default: () => appConfig.ui.avatar.default.chipPosition,
      validator (value: string) {
        return Object.keys(appConfig.ui.avatar.chip.position).includes(value)
      }
    },
    chipText: {
      type: [String, Number],
      default: null
    },
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.avatar>>,
      default: () => appConfig.ui.avatar
    }
  },
  setup (props) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.avatar>>(() => defu({}, props.ui, appConfig.ui.avatar))

    const url = computed(() => {
      if (typeof props.src === 'boolean') {
        return null
      }
      return props.src
    })

    const placeholder = computed(() => {
      return (props.alt || '').split(' ').map(word => word.charAt(0)).join('').substring(0, 2)
    })

    const wrapperClass = computed(() => {
      return classNames(
        ui.value.wrapper,
        (error.value || !url.value) && ui.value.background,
        ui.value.rounded,
        ui.value.size[props.size]
      )
    })

    const avatarClass = computed(() => {
      return classNames(
        ui.value.rounded,
        ui.value.size[props.size]
      )
    })

    const iconClass = computed(() => {
      return classNames(
        ui.value.icon.base,
        ui.value.icon.size[props.size]
      )
    })

    const chipClass = computed(() => {
      return classNames(
        ui.value.chip.base,
        ui.value.chip.size[props.size],
        ui.value.chip.position[props.chipPosition],
        ui.value.chip.background.replaceAll('{color}', props.chipColor)
      )
    })

    const error = ref(false)

    watch(() => props.src, () => {
      if (error.value) {
        error.value = false
      }
    })

    function onError () {
      error.value = true
    }

    return {
      wrapperClass,
      avatarClass,
      iconClass,
      chipClass,
      url,
      placeholder,
      error,
      onError
    }
  }
})
</script>
