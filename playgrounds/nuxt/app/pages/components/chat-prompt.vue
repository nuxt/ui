<script setup lang="ts">
import theme from '#build/ui/chat-prompt'

const variants = Object.keys(theme.variants.variant)
const colors = Object.keys(theme.variants.color)

const attrs = reactive({
  color: [theme.defaultVariants.color],
  variant: [theme.defaultVariants.variant]
})

const input = ref('')

function onSubmit() {
  console.log('submit', input.value)
  input.value = ''
}
</script>

<template>
  <Navbar>
    <USelect v-model="attrs.color" :items="colors" multiple />
    <USelect v-model="attrs.variant" :items="variants" multiple />
  </Navbar>

  <Matrix v-slot="props" :attrs="attrs" class="flex-col" container-class="w-80">
    <UChatPrompt
      v-model="input"
      placeholder="Type your message here..."
      v-bind="props"
      @submit="onSubmit"
    >
      <UChatPromptSubmit :color="props?.color" />
    </UChatPrompt>
  </Matrix>
</template>
