<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const toast = useToast()

const input = ref('')
const awsMarketplace = ref(true)
const claudeInChrome = ref(true)
const webSearch = ref(true)

const items = computed<DropdownMenuItem[][]>(() => [
  [
    { label: 'Add files or photos', icon: 'i-lucide-paperclip', kbds: ['meta', 'U'] },
    {
      label: 'Add to project',
      icon: 'i-lucide-folder',
      children: [
        { label: 'New project', icon: 'i-lucide-plus' },
        { label: 'Nuxt UI', icon: 'i-lucide-folder' }
      ]
    }
  ],
  [
    {
      label: 'Skills',
      icon: 'i-lucide-shapes',
      children: [
        { label: 'Canvas design', icon: 'i-lucide-palette' },
        { label: 'Slides', icon: 'i-lucide-presentation' },
        { label: 'PDF', icon: 'i-lucide-file-text' }
      ]
    },
    {
      label: 'Connectors',
      icon: 'i-lucide-blocks',
      children: [
        [
          { label: 'Add connector', icon: 'i-lucide-plus' },
          { label: 'Manage connectors', icon: 'i-lucide-briefcase' }
        ],
        [
          {
            label: 'AWS Marketplace',
            icon: 'i-simple-icons-amazon',
            slot: 'switch',
            checked: awsMarketplace.value,
            onSelect(e: Event) {
              e.preventDefault()
              awsMarketplace.value = !awsMarketplace.value
            }
          },
          {
            label: 'Claude in Chrome',
            icon: 'i-simple-icons-googlechrome',
            slot: 'switch',
            checked: claudeInChrome.value,
            onSelect(e: Event) {
              e.preventDefault()
              claudeInChrome.value = !claudeInChrome.value
            }
          }
        ],
        [
          { label: 'Tool access', icon: 'i-lucide-search' }
        ]
      ]
    },
    { label: 'Add plugins…', icon: 'i-lucide-plug' }
  ],
  [
    { label: 'Ask Vercel', icon: 'i-simple-icons-vercel' },
    { label: 'Research', icon: 'i-lucide-activity' },
    {
      label: 'Web search',
      icon: 'i-lucide-globe',
      type: 'checkbox',
      checked: webSearch.value,
      onUpdateChecked(checked: boolean) {
        webSearch.value = checked
      }
    }
  ]
])

function onSubmit() {
  if (!input.value.trim()) return

  toast.add({ title: 'Message sent', description: input.value })
  input.value = ''
}
</script>

<template>
  <UChatPrompt
    v-model="input"
    variant="naked"
    :rows="3"
    autoresize
    placeholder="Paste a doc, an email, or a question to get started"
    :ui="{ root: 'rounded-none p-2.5', footer: 'pt-1' }"
    @submit="onSubmit"
  >
    <template #footer>
      <div class="flex items-center justify-between gap-2 w-full">
        <div class="flex items-center gap-1">
          <UDropdownMenu :items="items" :content="{ align: 'start', side: 'top' }" :ui="{ content: 'w-60' }">
            <UButton
              icon="i-lucide-plus"
              color="neutral"
              variant="ghost"
              size="sm"
              square
              aria-label="Add content"
            />

            <template #switch-trailing="{ item }">
              <USwitch :model-value="(item as DropdownMenuItem).checked" size="sm" tabindex="-1" />
            </template>
          </UDropdownMenu>

          <UButton color="neutral" variant="ghost" size="sm" trailing-icon="i-lucide-chevron-down">
            Opus 4.8 <span class="text-dimmed">High</span>
          </UButton>
        </div>

        <div class="flex items-center gap-1">
          <UButton
            icon="i-lucide-mic"
            color="neutral"
            variant="ghost"
            size="sm"
            square
            aria-label="Dictate"
          />
          <UButton
            icon="i-lucide-audio-lines"
            color="neutral"
            variant="ghost"
            size="sm"
            square
            aria-label="Voice mode"
          />
          <UButton
            icon="i-lucide-arrow-up"
            color="primary"
            size="sm"
            square
            aria-label="Send"
            @click="onSubmit"
          />
        </div>
      </div>
    </template>
  </UChatPrompt>
</template>
