<template>
  <nav>
    <h3
      v-if="title || $slots.title"
      class="flex items-center justify-between px-2 mb-1 text-xs font-semibold tracking-wider uppercase u-text-gray-500"
    >
      <slot name="title">
        {{ title }}
      </slot>
    </h3>

    <div class="space-y-1">
      <Link
        v-for="link of links"
        v-slot="{ isActive }"
        :key="link.to || link.label"
        :to="link.to"
        :exact="link.exact"
        class="flex items-center px-2 py-2 text-sm font-medium rounded-md group focus:outline-none"
        :active-class="activeVariantClass"
        :inactive-class="variantClass"
        @click="link.click && link.click()"
        @keyup.enter="$event.target.blur()"
      >
        <slot name="icon" :link="link">
          <Icon
            v-if="link.icon"
            :name="link.icon"
            class="w-6 h-6 mr-3"
            :class="isActive ? activeIconClass : iconClass"
          />
        </slot>
        <slot :link="link">
          <span class="truncate">{{ link.label }}</span>
        </slot>
        <div v-if="link.shortcuts" class="hidden ml-3 space-x-1 lg:flex">
          <span v-for="shortcut of link.shortcuts" :key="shortcut" class="flex items-center justify-center w-4 h-4 font-normal bg-gray-200 rounded text-xxs dark:bg-gray-700 u-text-gray-600">
            {{ shortcut }}
          </span>
        </div>
        <span class="inline-block ml-auto">
          <slot name="badge" :link="link">
            <span
              v-if="link.badge"
              class="ml-auto inline-block py-0.5 px-3 text-xs rounded-full"
              :class="{
                'u-bg-gray-50': isActive,
                'bg-gray-200 dark:bg-gray-700 u-text-gray-600': !isActive
              }"
            >
              {{ link.badge }}
            </span>
          </slot>
        </span>
      </Link>
    </div>
  </nav>
</template>

<script>
import Icon from '../elements/Icon'
import Link from '../elements/Link'

export default {
  components: {
    Icon,
    Link
  },
  props: {
    links: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      default: null
    },
    variant: {
      type: String,
      default: 'white',
      validator (value) {
        return ['white', 'gray'].includes(value)
      }
    }
  },
  computed: {
    options () {
      return this.links.map(link => ({ value: link.to, text: link.label }))
    },
    variantClass () {
      return ({
        white: 'u-text-gray-600 hover:u-text-gray-900 hover:u-bg-gray-50 focus:u-bg-gray-50',
        gray: 'u-text-gray-600 hover:u-text-gray-900 hover:u-bg-gray-50 focus:u-bg-gray-50'
      })[this.variant]
    },
    activeVariantClass () {
      return ({
        white: 'u-text-gray-900 u-bg-gray-100 hover:u-text-gray-900 hover:u-bg-gray-100 focus:u-bg-gray-100',
        gray: 'u-text-gray-900 bg-gray-200 dark:bg-gray-800 hover:u-text-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 focus:bg-gray-200 dark:focus:bg-gray-800'
      })[this.variant]
    },
    iconClass () {
      return ({
        white: 'u-text-gray-400 group-hover:u-text-gray-500',
        gray: 'u-text-gray-400 group-hover:u-text-gray-500'
      })[this.variant]
    },
    activeIconClass () {
      return ({
        white: 'u-text-gray-500 group-hover:u-text-gray-500',
        gray: 'u-text-gray-500 group-hover:u-text-gray-500'
      })[this.variant]
    }
  },
  methods: {
    changeRoute (to) {
      this.$router.push(to)
    }
  }
}
</script>
