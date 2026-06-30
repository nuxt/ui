<script setup lang="ts">
type User = {
  id: number
  firstName: string
  lastName: string
  email: string
  image: string
}

const { data: users } = useLazyFetch('https://dummyjson.com/users?limit=100&select=firstName,lastName,email,image', {
  key: 'scroll-area-external-scroll-users',
  transform: (data?: { users: User[] }) => data?.users ?? [],
  default: () => [] as User[],
  server: false
})

// The container owns the scroll; the list virtualizes against it so everything shares one scrollbar.
const container = useTemplateRef('container')
const title = useTemplateRef('title')
const toolbar = useTemplateRef('toolbar')
const scrollArea = useTemplateRef('scrollArea')

const ITEM_SIZE = 88
const getScrollElement = () => container.value

// `scrollMargin` is the list's offset within the scroll element (border-box height of the title + toolbar above it).
const { height: titleHeight } = useElementSize(title, undefined, { box: 'border-box' })
const { height: toolbarHeight } = useElementSize(toolbar, undefined, { box: 'border-box' })
const scrollMargin = computed(() => titleHeight.value + toolbarHeight.value)

// Find: jump through the items whose name matches the query (like a find toolbar).
const query = ref('')
const matches = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return []
  return users.value.reduce<number[]>((acc, user, index) => {
    if (`${user.firstName} ${user.lastName}`.toLowerCase().includes(q)) acc.push(index)
    return acc
  }, [])
})
const cursor = ref(0)
const currentMatch = computed(() => matches.value[cursor.value] ?? -1)

function scrollToMatch() {
  if (currentMatch.value < 0) return
  scrollArea.value?.virtualizer?.scrollToIndex(currentMatch.value, { align: 'center', behavior: 'smooth' })
}

function step(delta: number) {
  if (!matches.value.length) return
  cursor.value = (cursor.value + delta + matches.value.length) % matches.value.length
  scrollToMatch()
}

function scrollToTop() {
  container.value?.scrollTo({ top: 0, behavior: 'smooth' })
}

// Re-runs on a new query and when `users` resolves, so the first match centers as soon as results arrive.
watch(matches, () => {
  cursor.value = 0
  scrollToMatch()
})
</script>

<template>
  <div
    ref="container"
    class="w-full h-128 overflow-y-auto"
  >
    <div
      ref="title"
      class="flex items-end justify-between gap-4 p-6 bg-elevated/50"
    >
      <div>
        <h2 class="text-2xl font-bold text-highlighted">
          Members
        </h2>
        <p class="text-muted">
          This header and the virtualized list share one scrollbar.
        </p>
      </div>
      <UBadge
        color="neutral"
        variant="subtle"
        :label="`${users.length} members`"
      />
    </div>

    <div
      ref="toolbar"
      class="sticky top-0 z-10 flex items-center px-6 py-3 border-y border-default bg-elevated/50 backdrop-blur"
    >
      <UFieldGroup>
        <UInput
          v-model="query"
          placeholder="Find a member..."
          icon="i-lucide-search"
          aria-describedby="scroll-area-find-count"
          class="w-64"
          :ui="{ trailing: 'pointer-events-none' }"
        >
          <template #trailing>
            <span
              id="scroll-area-find-count"
              class="text-xs text-muted tabular-nums"
              aria-live="polite"
              role="status"
            >
              {{ matches.length ? cursor + 1 : 0 }}/{{ matches.length }}
            </span>
          </template>
        </UInput>
        <UButton
          icon="i-lucide-chevron-up"
          color="neutral"
          variant="outline"
          aria-label="Previous match"
          :disabled="!matches.length"
          @click="step(-1)"
        />
        <UButton
          icon="i-lucide-chevron-down"
          color="neutral"
          variant="outline"
          aria-label="Next match"
          :disabled="!matches.length"
          @click="step(1)"
        />
      </UFieldGroup>

      <div class="ms-auto">
        <UButton
          icon="i-lucide-arrow-up-to-line"
          color="neutral"
          variant="outline"
          label="Top"
          @click="scrollToTop"
        />
      </div>
    </div>

    <UScrollArea
      ref="scrollArea"
      v-slot="{ item, index }"
      :items="users"
      :virtualize="{ scrollMargin, getScrollElement, estimateSize: ITEM_SIZE, skipMeasurement: true }"
    >
      <UPageCard
        orientation="horizontal"
        class="rounded-none"
        :class="[index === currentMatch && 'bg-primary/10']"
      >
        <UUser
          :name="`${item.firstName} ${item.lastName}`"
          :description="item.email"
          :avatar="{ src: item.image, alt: item.firstName, loading: 'lazy' as const }"
          size="lg"
        />
      </UPageCard>
    </UScrollArea>
  </div>
</template>
