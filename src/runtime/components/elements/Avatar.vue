<template>
  <span :class="wrapperClass">
    <img
      v-if="url && !error"
      :class="imgClass"
      :alt="alt"
      :src="url"
      v-bind="attrs"
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
import { twMerge, twJoin } from 'tailwind-merge'
import UIcon from '../elements/Icon.vue'
import { defuTwMerge } from '../../utils'
import { useAppConfig } from '#imports'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'
import { omit } from 'lodash-es'

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
    imgClass: {
      type: String,
      default: ''
    },
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.avatar>>,
      default: () => ({})
    }
  },
  setup (props, { attrs }) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.avatar>>(() => defuTwMerge({}, props.ui, appConfig.ui.avatar))

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
      return twMerge(twJoin(
        ui.value.wrapper,
        (error.value || !url.value) && ui.value.background,
        ui.value.rounded,
        ui.value.size[props.size]
      ), attrs.class as string)
    })

    const imgClass = computed(() => {
      return twMerge(twJoin(
        ui.value.rounded,
        ui.value.size[props.size]
      ), props.imgClass)
    })

    const iconClass = computed(() => {
      return twJoin(
        ui.value.icon.base,
        ui.value.icon.size[props.size]
      )
    })

    const chipClass = computed(() => {
      return twJoin(
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
      attrs: computed(() => omit(attrs, ['class'])),
      wrapperClass,
      // eslint-disable-next-line vue/no-dupe-keys
      imgClass,
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
