<script lang="ts">
import { defineComponent } from '#imports'

export default defineComponent({
  props: {
    code: {
      type: String,
      default: ''
    },
    language: {
      type: String,
      default: null
    },
    filename: {
      type: String,
      default: null
    },
    highlights: {
      type: Array as () => number[],
      default: () => []
    },
    meta: {
      type: String,
      default: null
    }
  },
  setup (props) {
    const clipboard = useCopyToClipboard({ timeout: 2000 })
    const icon = ref('i-heroicons-clipboard-document')

    function copy () {
      clipboard.copy(props.code, { title: 'Copied to clipboard!' })

      icon.value = 'i-heroicons-clipboard-document-check'

      setTimeout(() => {
        icon.value = 'i-heroicons-clipboard-document'
      }, 2000)
    }

    return {
      icon,
      copy
    }
  }
})
</script>

<template>
  <div class="group relative" :class="`language-${language}`">
    <UButton
      :icon="icon"
      variant="link"
      class="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity z-[1]"
      size="xs"
      tabindex="-1"
      @click="copy"
    />

    <span v-if="filename" class="text-gray-400 dark:text-gray-500 absolute right-3 bottom-3 text-sm group-hover:opacity-0 transition-opacity">{{ filename }}</span>

    <slot />
  </div>
</template>

<style>
pre code .line {
  display: block;
  min-height: 1rem;
}
</style>
