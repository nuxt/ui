<script setup lang="ts">
import { isTextUIPart } from 'ai'
import type { UIMessage } from 'ai'
import { useChat } from '@ai-sdk/vue'
import { isPartStreaming } from '@nuxt/ui/utils/ai'
import { Markdown } from '@comark/vue'
import shiki from '@comark/vue/plugins/shiki'
import type { DropdownMenuItem, NavigationMenuItem } from '@nuxt/ui'

const appConfig = useAppConfig()
const studioIcons = useStudioIcons()

const input = ref('')

const initialMessages: UIMessage[] = [{
  id: '1',
  role: 'user',
  parts: [{ type: 'text', text: 'I want to build a dashboard with Nuxt UI. Where should I start?' }]
}, {
  id: '2',
  role: 'assistant',
  parts: [{ type: 'text', text: 'Great choice! Start with UDashboardGroup as the root layout, then add a UDashboardSidebar for navigation and a UDashboardPanel for each page. The sidebar is collapsible and resizable out of the box, so you get a polished shell before writing any custom code.' }]
}, {
  id: '3',
  role: 'user',
  parts: [{ type: 'text', text: 'Nice. And how do I make it match my brand colors?' }]
}, {
  id: '4',
  role: 'assistant',
  parts: [{ type: 'text', text: 'Define your palette once in @theme and map it to the primary and neutral aliases in app.config.ts. Every component reads from those semantic tokens, so buttons, badges, inputs and even this chat pick up your brand automatically, exactly what this preview is showing you right now.' }]
}]

const { messages, status, error, sendMessage, regenerate, stop, clearError } = useChat({
  messages: initialMessages
})

function onSubmit() {
  if (!input.value.trim()) {
    return
  }

  sendMessage({ text: input.value })

  input.value = ''
}

function newChat() {
  stop()
  clearError()
  messages.value = []
  input.value = ''
}

const menuItems: NavigationMenuItem[] = [
  { label: 'New chat', icon: appConfig.ui.icons.plus, kbds: ['meta', 'o'], onSelect: () => newChat() },
  { label: 'Search', icon: appConfig.ui.icons.search, kbds: ['meta', 'k'] }
]

// The per-chat menu, on the sidebar rows and behind the navbar title.
const chatActions: DropdownMenuItem[] = [
  { label: 'Rename', icon: studioIcons.pencil },
  { label: 'Delete', icon: studioIcons.trash, color: 'error' }
]

const userItems: DropdownMenuItem[][] = [
  [{ label: 'Benjamin Canac', avatar: { src: 'https://github.com/benjamincanac.png', alt: 'Benjamin Canac' }, type: 'label' }],
  [{ label: 'Settings', icon: studioIcons.settings }, { label: 'Log out', icon: studioIcons.logout }]
]

const historyItems: NavigationMenuItem[] = [
  { label: 'Today', type: 'label' },
  { label: 'Building a dashboard with Nuxt UI', active: true },
  { label: 'Theming buttons and badges' },
  { label: 'Yesterday', type: 'label' },
  { label: 'Form validation with UForm' },
  { label: 'Sidebar layout questions' },
  { label: 'Last week', type: 'label' },
  { label: 'Migrating an app to v4' },
  { label: 'Dark mode color tokens' },
  { label: 'Table sorting and pagination' }
]

// The template's ModelSelect, over its own list (chat/shared/utils/models.ts).
const models = [
  { label: 'Claude Haiku 4.5', value: 'anthropic/claude-haiku-4.5', icon: 'i-simple-icons-anthropic' },
  { label: 'Gemini 3 Flash', value: 'google/gemini-3-flash', icon: 'i-simple-icons-google' },
  { label: 'GPT-5 Nano', value: 'openai/gpt-5-nano', icon: 'i-simple-icons-openai' }
]

const model = ref('anthropic/claude-haiku-4.5')
const activeModel = computed(() => models.find(m => m.value === model.value))

const ui = {
  prose: {
    p: { base: 'my-2 leading-6' },
    li: { base: 'my-0.5 leading-6' },
    ul: { base: 'my-2' },
    ol: { base: 'my-2' },
    h1: { base: 'text-xl my-2' },
    h2: { base: 'text-lg my-2' },
    h3: { base: 'text-base my-2' },
    h4: { base: 'text-sm my-2' },
    pre: { root: 'my-2' },
    table: { root: 'my-2' },
    hr: { base: 'my-2' }
  }
}
</script>

<template>
  <!-- The template's layout: a collapsible sidebar beside a floating panel on a
       muted body. UDashboardGroup is `fixed inset-0` by default, so it gets
       contained in the preview pane instead. -->
  <UDashboardGroup
    unit="rem"
    :persistent="false"
    class="relative inset-auto h-full w-full bg-elevated/50"
  >
    <UDashboardSidebar
      collapsible
      resizable
      :min-size="12"
      :menu="{ inset: true }"
      class="border-r-0 py-4"
      :ui="{ root: 'flex min-h-0 bg-transparent' }"
    >
      <template #header="{ collapsed }">
        <div v-if="!collapsed" class="flex items-center gap-1.5 px-2.5 py-1">
          <UIcon :name="studioIcons.messageCircle" class="size-6 text-primary shrink-0" />
          <span class="text-xl font-bold text-highlighted">Chat</span>
        </div>

        <UDashboardSidebarCollapse class="ms-auto" />
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu :collapsed="collapsed" :items="menuItems" orientation="vertical">
          <template #item-trailing="{ item }">
            <div v-if="item.kbds?.length" class="flex items-center gap-px opacity-0 group-hover:opacity-100 transition-opacity">
              <UKbd
                v-for="kbd in item.kbds"
                :key="kbd"
                :value="kbd"
                size="sm"
                variant="soft"
                class="bg-accented/50"
              />
            </div>
          </template>
        </UNavigationMenu>

        <UNavigationMenu
          v-if="!collapsed"
          :items="historyItems"
          orientation="vertical"
          :ui="{
            link: 'overflow-hidden pr-7.5',
            linkTrailing: 'translate-x-full group-hover:translate-x-0 group-has-data-[state=open]:translate-x-0 transition-transform ms-0 absolute inset-e-px'
          }"
        >
          <template #item-trailing="{ item }">
            <UDropdownMenu v-if="item.type !== 'label'" :items="chatActions" :content="{ align: 'end' }">
              <UButton
                as="div"
                :icon="appConfig.ui.icons.ellipsis"
                color="neutral"
                variant="link"
                size="sm"
                class="rounded-[5px] hover:bg-accented/50 focus-visible:bg-accented/50 data-[state=open]:bg-accented/50"
                aria-label="Chat actions"
                tabindex="-1"
                @click.stop.prevent
              />
            </UDropdownMenu>
          </template>
        </UNavigationMenu>
      </template>

      <template #footer="{ collapsed }">
        <UDropdownMenu
          :items="userItems"
          :content="{ align: 'center', collisionPadding: 12 }"
          :ui="{ content: collapsed ? 'w-48' : 'w-(--reka-dropdown-menu-trigger-width)' }"
        >
          <UButton
            :label="collapsed ? undefined : 'Benjamin Canac'"
            :avatar="{ src: 'https://github.com/benjamincanac.png', alt: 'Benjamin Canac' }"
            :trailing-icon="collapsed ? undefined : studioIcons.sort"
            color="neutral"
            variant="ghost"
            block
            :square="collapsed"
            class="data-[state=open]:bg-elevated"
            :ui="{ trailingIcon: 'ms-auto text-dimmed' }"
          />
        </UDropdownMenu>
      </template>
    </UDashboardSidebar>

    <!-- The template's signature: the conversation floats over the body. -->
    <div class="flex-1 flex m-4 lg:ms-0 rounded-lg ring ring-default bg-default/75 shadow-sm min-w-0 overflow-hidden">
      <UDashboardPanel class="relative min-h-0" :ui="{ body: 'p-0 sm:p-0 overscroll-none' }">
        <template #header>
          <!-- Transparent and absolute, so the messages scroll under a blur. -->
          <UDashboardNavbar :ui="{ root: 'absolute top-0 inset-x-0 border-b-0 z-10 backdrop-blur-sm sm:px-4' }">
            <template #leading>
              <span />
            </template>

            <template #title>
              <UDropdownMenu :items="chatActions" :content="{ align: 'start' }">
                <UButton
                  label="Building a dashboard with Nuxt UI"
                  :trailing-icon="appConfig.ui.icons.chevronDown"
                  color="neutral"
                  variant="ghost"
                  class="max-w-3xs data-[state=open]:bg-elevated"
                  :ui="{ trailingIcon: 'text-dimmed shrink-0 group-data-[state=open]:rotate-180 transition-transform duration-200' }"
                />
              </UDropdownMenu>
            </template>

            <template #right>
              <UTooltip text="Share chat">
                <UButton :icon="studioIcons.share" color="neutral" variant="ghost" square aria-label="Share chat" />
              </UTooltip>
            </template>
          </UDashboardNavbar>
        </template>

        <template #body>
          <!-- The template caps the column at --ui-container: 3xl. -->
          <UContainer class="flex-1 flex flex-col gap-4 sm:gap-6" style="--ui-container: var(--container-3xl)">
            <UTheme :ui="ui">
              <UChatMessages
                :messages="messages"
                :status="status"
                should-auto-scroll
                :spacing-offset="200"
                class="pt-(--ui-header-height) pb-4 sm:pb-6"
              >
                <template #content="{ message }">
                  <template v-for="(part, index) in message.parts" :key="`${message.id}-${part.type}-${index}`">
                    <template v-if="isTextUIPart(part)">
                      <Markdown
                        v-if="message.role === 'assistant'"
                        :value="part.text"
                        :streaming="isPartStreaming(part)"
                        :plugins="[shiki()]"
                        class="*:first:mt-0 *:last:mb-0"
                      />
                      <p v-else class="whitespace-pre-wrap leading-6">
                        {{ part.text }}
                      </p>
                    </template>
                  </template>
                </template>
              </UChatMessages>
            </UTheme>

            <UChatPrompt
              v-model="input"
              :error="error"
              color="neutral"
              variant="subtle"
              placeholder="Ask anything about Nuxt UI..."
              class="sticky bottom-0 rounded-b-none z-10"
              :ui="{ base: 'px-1.5' }"
              @submit="onSubmit"
            >
              <template #footer>
                <div class="flex items-center gap-1">
                  <UTooltip text="Attach file" :content="{ side: 'top' }">
                    <UButton
                      :icon="studioIcons.paperclip"
                      color="neutral"
                      variant="ghost"
                      size="sm"
                      square
                      aria-label="Attach file"
                    />
                  </UTooltip>

                  <USelectMenu
                    v-model="model"
                    :items="models"
                    :icon="activeModel?.icon"
                    value-key="value"
                    color="neutral"
                    variant="ghost"
                    size="sm"
                    class="data-[state=open]:bg-elevated"
                    :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
                  />
                </div>

                <UChatPromptSubmit
                  :status="status"
                  color="neutral"
                  size="sm"
                  @stop="stop()"
                  @reload="regenerate()"
                />
              </template>
            </UChatPrompt>
          </UContainer>
        </template>
      </UDashboardPanel>
    </div>
  </UDashboardGroup>
</template>
