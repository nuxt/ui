<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const appConfig = useAppConfig()
const studioIcons = useStudioIcons()

const toast = useToast()

const input = ref('')
const awsMarketplace = ref(true)
const claudeInChrome = ref(true)
const webSearch = ref(true)

const models = [
  { value: 'opus-5', label: 'Opus 5', description: 'Deep reasoning and hard problems' },
  { value: 'sonnet-5', label: 'Sonnet 5', description: 'Balanced speed and intelligence' },
  { value: 'haiku-4-5', label: 'Haiku 4.5', description: 'Fastest for everyday tasks' }
]
const legacyModels = [
  { value: 'opus-4-8', label: 'Opus 4.8' },
  { value: 'sonnet-4-6', label: 'Sonnet 4.6' }
]
const efforts = ['Low', 'Medium', 'High', 'Max']

const model = ref('opus-5')
const effort = ref('High')

const activeModel = computed(() => [...models, ...legacyModels].find(m => m.value === model.value))

const modelItems = computed<DropdownMenuItem[][]>(() => [
  models.map(m => ({
    label: m.label,
    description: m.description,
    type: 'checkbox',
    checked: model.value === m.value,
    onUpdateChecked() {
      model.value = m.value
    }
  })),
  [
    {
      label: 'Legacy models',
      icon: studioIcons.clock,
      children: legacyModels.map(m => ({
        label: m.label,
        type: 'checkbox',
        checked: model.value === m.value,
        onUpdateChecked() {
          model.value = m.value
        }
      }))
    },
    {
      label: 'Effort',
      icon: studioIcons.zap,
      slot: 'effort',
      children: efforts.map(e => ({
        label: e,
        type: 'checkbox',
        checked: effort.value === e,
        onUpdateChecked() {
          effort.value = e
        }
      }))
    }
  ]
])

const items = computed<DropdownMenuItem[][]>(() => [
  [
    { label: 'Add files or photos', icon: studioIcons.paperclip, kbds: ['meta', 'U'] },
    {
      label: 'Add to project',
      icon: appConfig.ui.icons.folder,
      children: [
        { label: 'New project', icon: appConfig.ui.icons.plus },
        { label: 'Nuxt UI', icon: appConfig.ui.icons.folder }
      ]
    }
  ],
  [
    {
      label: 'Skills',
      icon: studioIcons.shapes,
      children: [
        { label: 'Canvas design', icon: studioIcons.palette },
        { label: 'Slides', icon: studioIcons.presentation },
        { label: 'PDF', icon: appConfig.ui.icons.file }
      ]
    },
    {
      label: 'Connectors',
      icon: studioIcons.grid,
      children: [
        [
          { label: 'Add connector', icon: appConfig.ui.icons.plus },
          { label: 'Manage connectors', icon: studioIcons.briefcase }
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
          { label: 'Tool access', icon: appConfig.ui.icons.search }
        ]
      ]
    },
    { label: 'Add plugins…', icon: studioIcons.plug }
  ],
  [
    { label: 'Ask Vercel',
      icon: 'i-simple-icons-vercel',
      onSelect(e: Event) {
        e.preventDefault()
      }
    },
    {
      label: 'Research', icon: studioIcons.activity,
      onSelect(e: Event) {
        e.preventDefault()
      }
    },
    {
      label: 'Web search',
      icon: studioIcons.globe,
      type: 'checkbox',
      checked: webSearch.value,
      onUpdateChecked(checked: boolean) {
        webSearch.value = checked
      },
      onSelect(e: Event) {
        e.preventDefault()
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
    :autofocus="false"
    placeholder="Paste a doc, an email, or a question to get started"
    :ui="{ root: 'rounded-none p-2.5 backdrop-filter-none', body: 'p-1.5', base: 'p-0' }"
    @submit="onSubmit"
  >
    <template #footer>
      <div class="flex items-center justify-between gap-1.5 w-full">
        <div class="flex items-center gap-1">
          <UDropdownMenu :items="items" :content="{ align: 'start', side: 'top' }" :modal="false">
            <template #default="{ open }">
              <UButton
                :icon="appConfig.ui.icons.plus"
                color="neutral"
                variant="ghost"
                aria-label="Add content"
                :class="[open && 'bg-elevated']"
              />
            </template>

            <template #switch-trailing="{ item }">
              <USwitch :model-value="(item as DropdownMenuItem).checked" tabindex="-1" />
            </template>
          </UDropdownMenu>

          <UDropdownMenu :items="modelItems" :content="{ align: 'start', side: 'top' }" :modal="false">
            <template #default="{ open }">
              <UButton
                color="neutral"
                variant="ghost"
                :trailing-icon="appConfig.ui.icons.chevronDown"
                :class="['group', open && 'bg-elevated']"
                :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
              >
                {{ activeModel?.label }} <span class="text-dimmed">{{ effort }}</span>
              </UButton>
            </template>

            <template #effort-trailing="{ ui }">
              <span class="text-dimmed">{{ effort }}</span>
              <UIcon :name="appConfig.ui.icons.chevronRight" :class="ui.itemTrailingIcon()" />
            </template>
          </UDropdownMenu>
        </div>

        <div class="flex items-center gap-1">
          <UButton :icon="studioIcons.mic" color="neutral" variant="ghost" square aria-label="Dictate" />
          <UButton
            v-if="input.trim()"
            :icon="appConfig.ui.icons.arrowUp"
            color="primary"
            square
            aria-label="Send"
            @click="onSubmit"
          />
          <UButton
            v-else
            :icon="studioIcons.audioLines"
            color="neutral"
            variant="ghost"
            square
            aria-label="Voice mode"
          />
        </div>
      </div>
    </template>
  </UChatPrompt>
</template>
