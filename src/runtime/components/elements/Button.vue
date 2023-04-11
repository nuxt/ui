<template>
  <component
    :is="buttonIs"
    ref="button"
    :class="buttonClass"
    :aria-label="ariaLabel"
    v-bind="buttonProps"
  >
    <Icon v-if="isLeading && leadingIconName" :name="leadingIconName" :class="leadingIconClass" aria-hidden="true" />
    <slot>
      <span v-if="label" :class="[truncate ? 'text-left break-all line-clamp-1' : '', compact ? 'hidden sm:block' : '']">
        <span :class="[labelCompact && 'hidden sm:block']">{{ label }}</span>
        <span v-if="labelCompact" class="sm:hidden">{{ labelCompact }}</span>
      </span>
    </slot>
    <Icon v-if="isTrailing && trailingIconName" :name="trailingIconName" :class="trailingIconClass" aria-hidden="true" />
  </component>
</template>

<script setup lang="ts">
import { ref, computed, useSlots } from 'vue'
import type { PropType } from 'vue'
import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'
import { defu } from 'defu'
import NuxtLink from '#app/components/nuxt-link'
import Icon from '../elements/Icon.vue'
import { classNames } from '../../utils'
import $appConfig from '#build/app.config'
import { useAppConfig } from '#imports'

const props = defineProps({
  type: {
    type: String,
    default: 'button'
  },
  block: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: null
  },
  labelCompact: {
    type: String,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'md',
    validator (value: string) {
      return Object.keys($appConfig.ui.button.size).includes(value)
    }
  },
  variant: {
    type: String,
    default: 'primary',
    validator (value: string) {
      return Object.keys($appConfig.ui.button.variant).includes(value)
    }
  },
  icon: {
    type: String,
    default: null
  },
  leadingIcon: {
    type: String,
    default: null
  },
  trailingIcon: {
    type: String,
    default: null
  },
  trailing: {
    type: Boolean,
    default: false
  },
  leading: {
    type: Boolean,
    default: false
  },
  to: {
    type: [String, Object] as PropType<string | RouteLocationNormalized | RouteLocationRaw>,
    default: null
  },
  target: {
    type: String,
    default: null
  },
  ariaLabel: {
    type: String,
    default: null
  },
  square: {
    type: Boolean,
    default: false
  },
  truncate: {
    type: Boolean,
    default: false
  },
  compact: {
    type: Boolean,
    default: false
  },
  ui: {
    type: Object as PropType<Partial<typeof $appConfig.ui.button>>,
    default: () => $appConfig.ui.button
  }
})

const appConfig = useAppConfig()

const ui = computed<Partial<typeof appConfig.ui.button>>(() => defu({}, props.ui, appConfig.ui.button))

const slots = useSlots()

const button = ref(null)

const buttonIs = computed(() => {
  if (props.to) {
    return NuxtLink
  }

  return 'button'
})

const buttonProps = computed(() => {
  if (props.to) {
    return { to: props.to, target: props.target }
  } else {
    return { disabled: props.disabled || props.loading, type: props.type }
  }
})

const isLeading = computed(() => {
  return (props.icon && props.leading) || (props.icon && !props.trailing) || (props.loading && !props.trailing) || props.leadingIcon
})

const isTrailing = computed(() => {
  return (props.icon && props.trailing) || (props.loading && props.trailing) || props.trailingIcon
})

const isSquare = computed(() => props.square || (!slots.default && !props.label))

const buttonClass = computed(() => {
  return classNames(
    ui.value.base,
    ui.value.rounded,
    ui.value.size[props.size],
    ui.value[isSquare.value ? 'square' : (props.compact ? 'compact' : 'spacing')][props.size],
    ui.value.variant[props.variant],
    props.block ? 'w-full flex justify-center items-center' : 'inline-flex items-center'
  )
})

const leadingIconName = computed(() => {
  if (props.loading) {
    return ui.value.icon.loading
  }

  return props.leadingIcon || props.icon
})

const trailingIconName = computed(() => {
  if (props.loading && !isLeading.value) {
    return ui.value.icon.loading
  }

  return props.trailingIcon || props.icon
})

const leadingIconClass = computed(() => {
  return classNames(
    ui.value.icon.base,
    ui.value.icon.size[props.size],
    (!!slots.default || !!props.label?.length) && ui.value.icon.leading[props.compact ? 'compactSpacing' : 'spacing'][props.size],
    ui.value.icon.leading.base,
    props.loading && 'animate-spin'
  )
})

const trailingIconClass = computed(() => {
  return classNames(
    ui.value.icon.base,
    ui.value.icon.size[props.size],
    (!!slots.default || !!props.label?.length) && ui.value.icon.trailing[props.compact ? 'compactSpacing' : 'spacing'][props.size],
    ui.value.icon.trailing.base,
    props.loading && !isLeading.value && 'animate-spin'
  )
})
</script>
