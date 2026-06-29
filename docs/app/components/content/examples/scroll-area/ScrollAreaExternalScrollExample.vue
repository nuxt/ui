<script setup lang="ts">
const props = withDefaults(defineProps<{
  orientation?: 'vertical' | 'horizontal'
}>(), {
  orientation: 'horizontal'
})

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

const isHorizontal = computed(() => props.orientation === 'horizontal')

// The container owns the scroll; the list virtualizes against it so everything shares one scrollbar.
const container = useTemplateRef('container')
const title = useTemplateRef('title')
const toolbar = useTemplateRef('toolbar')
const scrollArea = useTemplateRef('scrollArea')

// Item size along the scroll axis: card width when horizontal, row height when vertical.
const itemSize = computed(() => isHorizontal.value ? 256 : 88)
const getScrollElement = () => container.value

// `scrollMargin` is the list's offset along the scroll axis: the title + toolbar height when vertical, none when horizontal.
const { height: titleHeight } = useElementSize(title, undefined, { box: 'border-box' })
const { height: toolbarHeight } = useElementSize(toolbar, undefined, { box: 'border-box' })
const scrollMargin = computed(() => isHorizontal.value ? 0 : titleHeight.value + toolbarHeight.value)

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

function scrollToStart() {
  container.value?.scrollTo(isHorizontal.value ? { left: 0, behavior: 'smooth' } : { top: 0, behavior: 'smooth' })
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
    :class="isHorizontal ? 'w-full overflow-x-auto' : 'w-full h-128 overflow-y-auto'"
  >
    <div
      ref="title"
      class="z-10 flex items-end justify-between gap-4 p-6 bg-elevated/50"
      :class="isHorizontal && 'sticky left-0'"
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
      class="z-10 flex items-center px-6 py-3 border-y border-default bg-elevated/50 backdrop-blur"
      :class="isHorizontal ? 'sticky left-0' : 'sticky top-0'"
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
          :icon="isHorizontal ? 'i-lucide-chevron-left' : 'i-lucide-chevron-up'"
          color="neutral"
          variant="outline"
          aria-label="Previous match"
          :disabled="!matches.length"
          @click="step(-1)"
        />
        <UButton
          :icon="isHorizontal ? 'i-lucide-chevron-right' : 'i-lucide-chevron-down'"
          color="neutral"
          variant="outline"
          aria-label="Next match"
          :disabled="!matches.length"
          @click="step(1)"
        />
      </UFieldGroup>

      <div class="ms-auto">
        <UButton
          :icon="isHorizontal ? 'i-lucide-arrow-left-to-line' : 'i-lucide-arrow-up-to-line'"
          color="neutral"
          variant="outline"
          :label="isHorizontal ? 'Start' : 'Top'"
          @click="scrollToStart"
        />
      </div>
    </div>

    <UScrollArea
      ref="scrollArea"
      v-slot="{ item, index }"
      :orientation="orientation"
      :items="users"
      :class="isHorizontal && 'h-44'"
      :virtualize="{ scrollMargin, getScrollElement, estimateSize: itemSize, skipMeasurement: true }"
    >
      <UPageCard
        class="rounded-none h-full"
        :class="[isHorizontal && 'w-64', index === currentMatch && 'bg-primary/10']"
      >
        <div
          class="flex gap-3 h-full min-w-0"
          :class="isHorizontal ? 'flex-col items-center justify-center text-center' : 'items-center'"
        >
          <UAvatar
            :src="item.image"
            :alt="item.firstName"
            :size="isHorizontal ? '2xl' : 'lg'"
            loading="lazy"
          />
          <div class="min-w-0">
            <p class="font-medium text-highlighted truncate">
              {{ item.firstName }} {{ item.lastName }}
            </p>
            <p class="text-sm text-muted truncate">
              {{ item.email }}
            </p>
          </div>
        </div>
      </UPageCard>
    </UScrollArea>
  </div>
</template>
