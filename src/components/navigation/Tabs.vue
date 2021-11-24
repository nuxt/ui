<template>
  <nav class="flex items-center gap-6">
    <Link
      v-for="(link, index) of links"
      :key="index"
      :to="link.to"
      :exact="link.exact"
      class="pt-2 pb-3 text-sm font-medium border-b-2 whitespace-nowrap"
      :active-class="activeClass"
      :inactive-class="inactiveClass"
    >
      {{ link.label }}
    </Link>
  </nav>
</template>

<script>
import Link from '../elements/Link'

export default {
  components: {
    Link
  },
  props: {
    links: {
      type: Array,
      required: true
    },
    activeClass: {
      type: String,
      default: 'border-black dark:border-white text-black dark:text-white hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white'
    },
    inactiveClass: {
      type: String,
      default: 'border-transparent text-tw-gray-500 hover:text-tw-gray-700 hover:border-tw-gray-300'
    }
  }
}
</script>
