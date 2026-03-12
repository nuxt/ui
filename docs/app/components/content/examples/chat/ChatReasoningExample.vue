<script setup lang="ts">
const streaming = ref(false)
const text = ref('')

async function simulateStreaming() {
  streaming.value = true
  text.value = ''

  const content = 'The user is asking about Vue components. I should explain the Composition API pattern and how it relates to their question about reactive state management. Let me think about the best way to structure this response.\n\nFirst, I need to consider the key differences between the Options API and Composition API. The Composition API was introduced in Vue 3 to address limitations of the Options API when building large-scale applications.\n\nFor reactive state management specifically, the Composition API offers ref() for primitive values and reactive() for objects.'

  for (const char of content) {
    text.value += char
    await new Promise(resolve => setTimeout(resolve, 10))
  }

  streaming.value = false
}

onMounted(simulateStreaming)
</script>

<template>
  <UChatReasoning
    :text="text"
    :streaming="streaming"
    class="w-60"
  />
</template>
