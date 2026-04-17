<script setup lang="ts">
const streaming = ref(false)
const text = ref('')

async function simulateStreaming() {
  streaming.value = true
  text.value = ''

  const content = 'The user is asking about Vue components. I should explain the Composition API pattern and how it relates to their question about reactive state management. Let me think about the best way to structure this response.\n\nFirst, I need to consider the key differences between the Options API and Composition API. The Composition API was introduced in Vue 3 to address limitations of the Options API when building large-scale applications. It provides better TypeScript support, code organization by logical concern rather than option type, and improved code reuse through composables.\n\nFor reactive state management specifically, the Composition API offers ref() for primitive values and reactive() for objects. The ref() function wraps the value and tracks changes through .value access, while reactive() uses Proxy to track property access on objects.\n\nI should also mention computed properties and watchers in the Composition API context, as they play a crucial role in derived state and side effects. The computed() function creates a cached reactive reference that automatically updates when its dependencies change.\n\nLet me also cover the provide/inject pattern for dependency injection across component trees, which is particularly useful for sharing state without prop drilling.'

  for (const char of content) {
    text.value += char
    await new Promise(resolve => setTimeout(resolve, 20))
  }

  streaming.value = false
}
</script>

<template>
  <Navbar>
    <UButton label="Simulate streaming" color="neutral" variant="outline" @click="simulateStreaming" />
  </Navbar>

  <div class="w-60 flex flex-col gap-4 items-start">
    <UChatReasoning
      text="The user is asking about Vue components..."
      :duration="12"
      default-open
    />

    <UChatReasoning
      text="Let me analyze the code structure..."
      icon="i-lucide-brain"
      :duration="5"
    />

    <UChatReasoning :text="text" :streaming="streaming" icon="i-lucide-brain" chevron="leading" />
  </div>
</template>
