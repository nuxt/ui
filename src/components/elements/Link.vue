<template>
  <NuxtLink v-slot="{ href, navigate }" v-bind="$props" custom>
    <a
      v-bind="$attrs"
      :href="href"
      :class="isActive ? activeClass : inactiveClass"
      @click="navigate"
    >
      <slot v-bind="{ isActive }" />
    </a>
  </NuxtLink>
</template>

<script>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useRoute } from '#imports'

export default {
  name: 'Link',
  inheritAttrs: false,
  props: {
    ...RouterLink.props,
    inactiveClass: {
      type: String,
      default: ''
    },
    exact: {
      type: Boolean,
      default: false
    }
  },
  setup (props) {
    const route = useRoute()
    const isActive = computed(() => {
      if (props.exact) {
        return [props.to, `${props.to}/`].includes(route.path)
      } else {
        return !!route.path.startsWith(props.to)
      }
    })

    return {
      isActive
    }
  }
}
</script>
