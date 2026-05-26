<script setup lang="ts">
const route = useRoute()
const toast = useToast()
const { copy, copied } = useClipboard()
const site = useSiteConfig()
const { track } = useAnalytics()
const appConfig = useAppConfig()

const mdPath = computed(() => `${site.url}/raw${route.path}.md`)
const aiPrompt = computed(() => `I'm looking at this Nuxt UI documentation: ${mdPath.value}\nHelp me understand how to use it. Be ready to explain concepts, give examples, or help debug based on it.`)

const items = [
  {
    label: 'Copy Markdown link',
    icon: 'i-lucide-link',
    onSelect() {
      track('Page Action', { action: 'Copy Markdown Link', page: route.path })
      copy(mdPath.value)
      toast.add({
        title: 'Copied to clipboard',
        icon: 'i-lucide-check-circle'
      })
    }
  },
  {
    label: 'View as Markdown',
    icon: 'i-simple-icons:markdown',
    target: '_blank',
    to: `/raw${route.path}.md`,
    onSelect() {
      track('Page Action', { action: 'View as Markdown', page: route.path })
    }
  },
  {
    label: 'Open in ChatGPT',
    icon: 'i-simple-icons:openai',
    target: '_blank',
    to: `https://chatgpt.com/?prompt=${encodeURIComponent(aiPrompt.value)}`,
    onSelect() {
      track('Page Action', { action: 'Open in ChatGPT', page: route.path })
    }
  },
  {
    label: 'Open in Claude',
    icon: 'i-simple-icons:anthropic',
    target: '_blank',
    to: `https://claude.ai/new?q=${encodeURIComponent(aiPrompt.value)}`,
    onSelect() {
      track('Page Action', { action: 'Open in Claude', page: route.path })
    }
  }
]

async function copyPage() {
  track('Page Action', { action: 'Copy Page', page: route.path })
  copy(await $fetch<string>(`/raw${route.path}.md`))
}
</script>

<template>
  <UFieldGroup>
    <UButton
      label="Copy page"
      :icon="copied ? appConfig.ui.icons.copyCheck : appConfig.ui.icons.copy"
      color="neutral"
      variant="outline"
      :ui="{
        leadingIcon: [copied ? 'text-primary' : 'text-neutral', 'size-3.5']
      }"
      @click="copyPage"
    />
    <UDropdownMenu
      :items="items"
      :content="{
        align: 'end',
        side: 'bottom',
        sideOffset: 8
      }"
      :ui="{
        content: 'w-48'
      }"
    >
      <UButton
        :icon="appConfig.ui.icons.chevronDown"
        size="sm"
        color="neutral"
        variant="outline"
        aria-label="Open copy actions menu"
      />
    </UDropdownMenu>
  </UFieldGroup>
</template>
