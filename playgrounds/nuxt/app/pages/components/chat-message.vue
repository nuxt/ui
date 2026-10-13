<script setup lang="ts">
import theme from '#build/ui/chat-message'

const colors = Object.keys(theme.variants.color)
const variants = Object.keys(theme.variants.variant)

const compact = ref(false)

const attrs = reactive({
  color: [theme.defaultVariants.color],
  variant: [theme.defaultVariants.variant]
})

const actions = [
  { label: 'Copy to clipboard', icon: 'i-lucide-copy' },
  { label: 'Regenerate', icon: 'i-lucide-refresh-cw' }
]
</script>

<template>
  <Navbar>
    <USwitch v-model="compact" label="Compact" />
    <USelect v-model="attrs.color" :items="colors" multiple />
    <USelect v-model="attrs.variant" :items="variants" multiple />
  </Navbar>

  <Matrix v-slot="props" :attrs="attrs" container-class="max-w-lg">
    <UChatMessage
      id="1"
      role="user"
      side="right"
      :parts="[{ type: 'text', text: 'Can you help me set up Nuxt UI in my project?' }]"
      :avatar="{ src: 'https://github.com/benjamincanac.png' }"
      :compact="compact"
      v-bind="props"
    />
    <UChatMessage
      id="2"
      role="assistant"
      :parts="[{ type: 'text', text: 'Sure! First, install the package with `npx nuxi@latest module add ui`. Then make sure Tailwind CSS v4 is set up in your project.' }]"
      icon="i-lucide-bot"
      :actions="actions"
      :compact="compact"
      v-bind="props"
    />
    <UChatMessage
      id="3"
      role="user"
      side="right"
      :parts="[{ type: 'text', text: 'Done! What about theming?' }]"
      :avatar="{ src: 'https://github.com/benjamincanac.png' }"
      :compact="compact"
      v-bind="props"
    />
    <UChatMessage
      id="4"
      role="assistant"
      :parts="[{ type: 'text', text: 'You can customize the primary color and other theme options in your app.config.ts file. All components use semantic colors so they adapt automatically.' }]"
      icon="i-lucide-bot"
      :actions="actions"
      :compact="compact"
      v-bind="props"
    />
  </Matrix>
</template>
