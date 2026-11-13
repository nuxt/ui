<script setup lang="ts">
const { inset = true } = defineProps<{
  inset?: boolean
}>()

const snapPoints = ['20rem', 0.6, 1]
const snapPoint = ref<number | string | null>('20rem')

const places = [
  { name: 'Blue Bottle Coffee', category: 'Café', distance: '120 m', icon: 'i-lucide-coffee' },
  { name: 'Central Park', category: 'Park', distance: '350 m', icon: 'i-lucide-trees' },
  { name: 'City Library', category: 'Library', distance: '400 m', icon: 'i-lucide-library' },
  { name: 'Green Market', category: 'Grocery', distance: '550 m', icon: 'i-lucide-shopping-basket' },
  { name: 'Riverside Gym', category: 'Fitness', distance: '700 m', icon: 'i-lucide-dumbbell' },
  { name: 'Sakura Sushi', category: 'Restaurant', distance: '850 m', icon: 'i-lucide-utensils' },
  { name: 'Modern Art Museum', category: 'Museum', distance: '1.1 km', icon: 'i-lucide-landmark' },
  { name: 'Harbor Pharmacy', category: 'Pharmacy', distance: '1.3 km', icon: 'i-lucide-pill' },
  { name: 'Old Town Cinema', category: 'Cinema', distance: '1.6 km', icon: 'i-lucide-clapperboard' },
  { name: 'North Station', category: 'Train station', distance: '2 km', icon: 'i-lucide-train-front' }
]
</script>

<template>
  <UDrawer
    v-model:snap-point="snapPoint"
    :snap-points="snapPoints"
    :inset="inset"
    handle
    title="Nearby places"
    description="Drag the drawer between a peek, most of the screen and full height."
    :ui="{ container: 'max-w-xl mx-auto' }"
  >
    <UButton label="Open" color="neutral" variant="subtle" />

    <template #body>
      <ul class="divide-y divide-default">
        <li v-for="place in places" :key="place.name" class="flex items-center gap-3 py-3">
          <UIcon :name="place.icon" class="size-5 shrink-0 text-muted" />

          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium text-strong">
              {{ place.name }}
            </p>
            <p class="text-sm text-muted">
              {{ place.category }}
            </p>
          </div>

          <span class="text-sm text-muted">{{ place.distance }}</span>
        </li>
      </ul>
    </template>
  </UDrawer>
</template>
