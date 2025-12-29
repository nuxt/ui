<script setup lang="ts">
const open = ref(true)
const step = ref(0)
const loop = ref(false)

const profileCard = ref<HTMLElement>()
const shortcuts = ref<HTMLElement>()

const steps = computed(() => [
  {
    target: '#tour-cta',
    title: 'Get started',
    description: 'First stop',
    body: 'The tour can be anchored to an element via id or CSS selector.',
    content: { side: 'bottom' as const, sideOffset: 12 },
    arrow: true
  },
  {
    target: () => profileCard.value,
    title: 'Profile',
    description: 'Step anchored to a ref',
    body: 'You can pass a function or a ref that returns an HTMLElement.',
    content: { side: 'right' as const, align: 'center' as const, sideOffset: 12 }
  },
  {
    target: () => shortcuts.value,
    title: 'Quick actions',
    description: 'Example with buttons',
    body: 'Another step with custom buttons labels.',
    nextLabel: 'Restart',
    finishLabel: 'Close',
    content: { side: 'top' as const, sideOffset: 12 }
  }
])
</script>

<template>
  <Navbar>
    <UButton icon="i-lucide-wand-2" color="primary" variant="soft" @click="open = true">
      Avvia tour
    </UButton>

    <div class="flex items-center gap-2 text-sm text-muted">
      Loop
      <USwitch v-model="loop" size="sm" />
    </div>
  </Navbar>

  <div class="space-y-6">
    <div id="tour-cta" class="flex flex-col gap-3 rounded-lg border border-[--ui-border] bg-[--ui-bg] p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs uppercase tracking-wide text-muted">
            Onboarding
          </p>
          <h2 class="text-lg font-semibold text-highlighted">
            Show the tour
          </h2>
        </div>
        <UButton color="neutral" variant="outline">
          Button
        </UButton>
      </div>
      <p class="text-sm text-muted">
        Each step can use an id of the DOM or a ref to position the tour modal.
      </p>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <div ref="profileCard" class="relative">
        <UCard>
          <template #header>
            <div class="flex items-center gap-3">
              <UAvatar
                src="https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?auto=format&fit=crop&w=80&q=80"
              />
              <div>
                <p class="text-sm font-semibold text-highlighted">
                  Alex Parker
                </p>
                <p class="text-xs text-muted">
                  Product Designer
                </p>
              </div>
            </div>
          </template>

          <div class="space-y-2">
            <div class="flex items-center justify-between text-sm">
              <span class="text-muted">Projects</span>
              <span class="font-medium text-highlighted">18</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-muted">Teams</span>
              <span class="font-medium text-highlighted">Design · Growth</span>
            </div>
          </div>

          <template #footer>
            <div class="flex gap-2">
              <UButton color="primary" size="sm" block>
                Edit
              </UButton>
              <UButton color="neutral" variant="ghost" size="sm" block>
                Share
              </UButton>
            </div>
          </template>
        </UCard>
      </div>

      <div ref="shortcuts" class="flex flex-col gap-3 rounded-lg border border-[--ui-border] bg-[--ui-bg] p-4">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold text-highlighted">
            Quick actions
          </h3>
          <UBadge color="primary" variant="subtle">
            New
          </UBadge>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <UButton icon="i-lucide-plus" variant="ghost">
            New task
          </UButton>
          <UButton icon="i-lucide-users" variant="ghost">
            Invite
          </UButton>
          <UButton icon="i-lucide-bell" variant="ghost">
            Notifications
          </UButton>
          <UButton icon="i-lucide-settings-2" variant="ghost">
            Settings
          </UButton>
        </div>
      </div>
    </div>
  </div>

  <UTour v-model:open="open" v-model:step="step" :steps="steps" :loop="loop" class="max-w-sm" />
</template>
