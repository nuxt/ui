<script setup lang="ts">
const logoRef = ref()

const toast = useToast()
const { copy } = useClipboard()

const items = [
  [{
    label: 'Copy logo as SVG',
    icon: 'i-simple-icons-nuxtdotjs',
    onSelect() {
      if (!logoRef.value) {
        return
      }

      copy(logoRef.value.$el.outerHTML)

      toast.add({
        title: 'Nuxt logo copied as SVG',
        description: 'You can now paste it into your project',
        icon: 'i-lucide-circle-check',
        color: 'success'
      })
    }
  }],
  [{
    label: 'Browse design kit',
    icon: 'i-lucide-shapes',
    to: 'https://nuxt.com/design-kit',
    target: '_blank'
  }]
]
</script>

<template>
  <UContextMenu :items="items">
    <NuxtLink to="/" class="flex items-end gap-2 font-bold text-xl text-highlighted min-w-0 focus-visible:outline-primary shrink-0" aria-label="Nuxt UI">
      <Logo ref="logoRef" class="w-auto h-6 shrink-0" />
    </NuxtLink>
  </UContextMenu>
</template>
