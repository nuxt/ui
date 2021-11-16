<template>
  <div class="rounded-md p-4" :class="variantClass">
    <div class="flex">
      <div class="flex-shrink-0">
        <Icon :name="iconName" :class="iconClass" class="h-5 w-5" />
      </div>
      <div class="ml-3 flex-1 md:flex md:justify-between">
        <p v-if="title" class="text-sm leading-5" :class="titleClass">
          {{ title }}
        </p>
        <p v-if="link" class="mt-3 text-sm leading-5 md:mt-0 md:ml-6">
          <NuxtLink
            :to="to"
            class="whitespace-nowrap font-medium"
            :class="linkClass"
          >
            {{ link }} &rarr;
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from '../elements/icon'

export default {
  components: { Icon },
  props: {
    variant: {
      type: String,
      default: 'info',
      validator (value) {
        return ['info', 'warning', 'error', 'success'].includes(value)
      }
    },
    to: {
      type: [String, Object],
      default: null
    },
    title: {
      type: String,
      default: null
    },
    link: {
      type: String,
      default: null
    }
  },
  computed: {
    iconName () {
      return ({
        info: 'solid/information-circle',
        warning: 'solid/exclamation',
        error: 'solid/x-circle',
        success: 'solid/check-circle'
      })[this.variant]
    },
    variantClass () {
      return ({
        info: 'bg-blue-50',
        warning: 'bg-orange-50',
        error: 'bg-red-50',
        success: 'bg-green-50'
      })[this.variant]
    },
    iconClass () {
      return ({
        info: 'text-blue-400',
        warning: 'text-orange-400',
        error: 'text-red-400',
        success: 'text-green-400'
      })[this.variant]
    },
    titleClass () {
      return ({
        info: 'text-blue-700',
        warning: 'text-orange-700',
        error: 'text-red-700',
        success: 'text-green-700'
      })[this.variant]
    },
    linkClass () {
      return ({
        info: 'text-blue-700 hover:text-blue-600',
        warning: 'text-orange-700 hover:text-orange-600',
        error: 'text-red-700 hover:text-red-600',
        success: 'text-green-700 hover:text-green-600'
      })[this.variant]
    }
  }
}
</script>
