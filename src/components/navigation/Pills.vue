<template>
  <nav class="flex items-center space-x-1.5">
    <div v-for="(link, index) of links" :key="index">
      <Button
        :size="size"
        :to="link.to"
        :label="link.label"
        :icon="link.icon"
        :variant="isActive(link) ? activeVariant : variant"
        :custom-class="isActive(link) ? activeClass : ''"
        @click="click(link)"
      />
    </div>
  </nav>
</template>

<script>
import Button from '../elements/Button'

export default {
  components: {
    Button
  },
  props: {
    links: {
      type: Array,
      required: true
    },
    size: {
      type: String,
      default: 'md'
    },
    variant: {
      type: String,
      default: 'gray-hover'
    },
    activeVariant: {
      type: String,
      default: 'gray'
    },
    activeClass: {
      type: String,
      default: 'text-tw-gray-700 hover:text-tw-gray-700 focus:text-tw-gray-700'
    }
  },
  computed: {
    options () {
      return this.links.map(link => ({ value: link.to, text: link.label }))
    }
  },
  methods: {
    click (link) {
      this.$emit('input', link)
    },
    isActive (link) {
      if (link.exact === false) {
        return !!this.$route.path.startsWith(link.to)
      } else {
        return this.$route.path === link.to
      }
    }
  }
}
</script>
