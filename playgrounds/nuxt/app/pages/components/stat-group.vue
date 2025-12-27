<script setup lang="ts">
import theme from '#build/ui/stat-group'

const gaps = Object.keys(theme.variants.gap)
const cols: (1 | 2 | 3 | 4)[] = [1, 2, 3, 4]

const gap = ref(theme.defaultVariants.gap)
const colsValue = ref<1 | 2 | 3 | 4>(4)

const stats = [
  { icon: 'i-lucide-users', title: 'Total Users', value: '12,345', trend: 12.5, trendDirection: 'up' as const },
  { icon: 'i-lucide-shopping-cart', title: 'Sales', value: '$45,231', trend: 8.2, trendDirection: 'down' as const },
  { icon: 'i-lucide-dollar-sign', title: 'Revenue', value: '$125,430' },
  { icon: 'i-lucide-activity', title: 'Active Sessions', value: '1,234', trend: 15.3, trendDirection: 'up' as const }
]
</script>

<template>
  <Navbar>
    <USelect v-model="gap" :items="gaps" placeholder="Gap" />
    <USelect v-model="colsValue" :items="cols" placeholder="Columns" />
  </Navbar>

  <div class="flex flex-col gap-8 min-h-0">
    <div class="flex flex-col gap-4">
      <h2 class="font-semibold text-highlighted">
        Basic Usage
      </h2>
      <UStatGroup :cols="colsValue" :gap="gap">
        <UStatCard
          v-for="stat in stats"
          :key="stat.title"
          :icon="stat.icon"
          :title="stat.title"
          :value="stat.value"
          :trend="stat.trend"
          :trend-direction="stat.trendDirection"
        />
      </UStatGroup>
    </div>

    <USeparator />

    <div class="flex flex-col gap-4">
      <h2 class="font-semibold text-highlighted">
        With Title
      </h2>
      <UStatGroup title="Dashboard Overview" :cols="colsValue" :gap="gap">
        <UStatCard
          v-for="stat in stats"
          :key="stat.title"
          :icon="stat.icon"
          :title="stat.title"
          :value="stat.value"
        />
      </UStatGroup>
    </div>

    <USeparator />

    <div class="flex flex-col gap-4">
      <h2 class="font-semibold text-highlighted">
        With Actions
      </h2>
      <UStatGroup title="Dashboard Overview" :cols="colsValue" :gap="gap">
        <template #actions>
          <UButton size="xs" variant="ghost">
            Last 30 days
          </UButton>
        </template>
        <UStatCard
          v-for="stat in stats"
          :key="stat.title"
          :icon="stat.icon"
          :title="stat.title"
          :value="stat.value"
        />
      </UStatGroup>
    </div>

    <USeparator />

    <div class="flex flex-col gap-4">
      <h2 class="font-semibold text-highlighted">
        Different Column Layouts
      </h2>
      <div class="flex flex-col gap-6">
        <div>
          <h3 class="text-sm font-medium text-muted mb-2">
            1 Column
          </h3>
          <UStatGroup :cols="1" :gap="gap">
            <UStatCard
              v-for="stat in stats.slice(0, 2)"
              :key="stat.title"
              :icon="stat.icon"
              :title="stat.title"
              :value="stat.value"
            />
          </UStatGroup>
        </div>
        <div>
          <h3 class="text-sm font-medium text-muted mb-2">
            2 Columns
          </h3>
          <UStatGroup :cols="2" :gap="gap">
            <UStatCard
              v-for="stat in stats.slice(0, 2)"
              :key="stat.title"
              :icon="stat.icon"
              :title="stat.title"
              :value="stat.value"
            />
          </UStatGroup>
        </div>
        <div>
          <h3 class="text-sm font-medium text-muted mb-2">
            3 Columns
          </h3>
          <UStatGroup :cols="3" :gap="gap">
            <UStatCard
              v-for="stat in stats.slice(0, 3)"
              :key="stat.title"
              :icon="stat.icon"
              :title="stat.title"
              :value="stat.value"
            />
          </UStatGroup>
        </div>
        <div>
          <h3 class="text-sm font-medium text-muted mb-2">
            4 Columns
          </h3>
          <UStatGroup :cols="4" :gap="gap">
            <UStatCard
              v-for="stat in stats"
              :key="stat.title"
              :icon="stat.icon"
              :title="stat.title"
              :value="stat.value"
            />
          </UStatGroup>
        </div>
      </div>
    </div>
  </div>
</template>
