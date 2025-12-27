<script setup lang="ts">
import theme from '#build/ui/stat-card'

const colors = Object.keys(theme.variants.color)
const sizes = Object.keys(theme.variants.size)
const variants = Object.keys(theme.variants.variant)

const color = ref(theme.defaultVariants.color)
const size = ref(theme.defaultVariants.size)
const variant = ref(theme.defaultVariants.variant)

const stat1 = ref({
  icon: 'i-lucide-users',
  title: 'Total Users',
  value: '12,345',
  trend: 12.5,
  trendDirection: 'up' as const
})

const stat2 = ref({
  icon: 'i-lucide-shopping-cart',
  title: 'Sales',
  value: '$45,231',
  trend: 8.2,
  trendDirection: 'down' as const
})

const stat3 = ref({
  icon: 'i-lucide-dollar-sign',
  title: 'Revenue',
  value: '$125,430',
  trend: undefined
})

const stat4 = ref({
  icon: 'i-lucide-activity',
  title: 'Active Sessions',
  value: '1,234',
  trend: 15.3,
  trendDirection: 'up' as const
})
</script>

<template>
  <Navbar>
    <USelect v-model="color" :items="colors" placeholder="Color" />
    <USelect v-model="size" :items="sizes" placeholder="Size" />
    <USelect v-model="variant" :items="variants" placeholder="Variant" />
  </Navbar>

  <div class="flex flex-col gap-8 min-h-0">
    <div class="flex flex-col gap-4">
      <h2 class="font-semibold text-highlighted">
        Basic Usage
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <UStatCard
          :icon="stat1.icon"
          :title="stat1.title"
          :value="stat1.value"
          :trend="stat1.trend"
          :trend-direction="stat1.trendDirection"
          :color="color"
          :size="size"
          :variant="variant"
        />
        <UStatCard
          :icon="stat2.icon"
          :title="stat2.title"
          :value="stat2.value"
          :trend="stat2.trend"
          :trend-direction="stat2.trendDirection"
          :color="color"
          :size="size"
          :variant="variant"
        />
        <UStatCard
          :icon="stat3.icon"
          :title="stat3.title"
          :value="stat3.value"
          :color="color"
          :size="size"
          :variant="variant"
        />
        <UStatCard
          :icon="stat4.icon"
          :title="stat4.title"
          :value="stat4.value"
          :trend="stat4.trend"
          :trend-direction="stat4.trendDirection"
          :color="color"
          :size="size"
          :variant="variant"
        />
      </div>
    </div>

    <USeparator />

    <div class="flex flex-col gap-4">
      <h2 class="font-semibold text-highlighted">
        Different Colors
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <UStatCard
          icon="i-lucide-check-circle"
          title="Success"
          value="98.5%"
          :trend="2.1"
          color="success"
          :size="size"
          :variant="variant"
        />
        <UStatCard
          icon="i-lucide-alert-triangle"
          title="Warning"
          value="23"
          :trend="5.4"
          color="warning"
          :size="size"
          :variant="variant"
        />
        <UStatCard
          icon="i-lucide-x-circle"
          title="Error"
          value="12"
          :trend="3.2"
          trend-direction="down"
          color="error"
          :size="size"
          :variant="variant"
        />
        <UStatCard
          icon="i-lucide-info"
          title="Info"
          value="456"
          :trend="10.5"
          color="info"
          :size="size"
          :variant="variant"
        />
      </div>
    </div>

    <USeparator />

    <div class="flex flex-col gap-4">
      <h2 class="font-semibold text-highlighted">
        Different Sizes
      </h2>
      <div class="flex flex-col gap-4 w-full">
        <UStatCard
          icon="i-lucide-users"
          title="Extra Small"
          value="1,234"
          :trend="5.2"
          :color="color"
          size="xs"
          :variant="variant"
        />
        <UStatCard
          icon="i-lucide-users"
          title="Small"
          value="1,234"
          :trend="5.2"
          :color="color"
          size="sm"
          :variant="variant"
        />
        <UStatCard
          icon="i-lucide-users"
          title="Medium (default)"
          value="1,234"
          :trend="5.2"
          :color="color"
          size="md"
          :variant="variant"
        />
        <UStatCard
          icon="i-lucide-users"
          title="Large"
          value="1,234"
          :trend="5.2"
          :color="color"
          size="lg"
          :variant="variant"
        />
        <UStatCard
          icon="i-lucide-users"
          title="Extra Large"
          value="1,234"
          :trend="5.2"
          :color="color"
          size="xl"
          :variant="variant"
        />
      </div>
    </div>

    <USeparator />

    <div class="flex flex-col gap-4">
      <h2 class="font-semibold text-highlighted">
        Different Variants
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        <UStatCard
          icon="i-lucide-users"
          title="Outline (default)"
          value="1,234"
          :trend="5.2"
          :color="color"
          :size="size"
          variant="outline"
        />
        <UStatCard
          icon="i-lucide-users"
          title="Solid"
          value="1,234"
          :trend="5.2"
          :color="color"
          :size="size"
          variant="solid"
        />
        <UStatCard
          icon="i-lucide-users"
          title="Soft"
          value="1,234"
          :trend="5.2"
          :color="color"
          :size="size"
          variant="soft"
        />
        <UStatCard
          icon="i-lucide-users"
          title="Subtle"
          value="1,234"
          :trend="5.2"
          :color="color"
          :size="size"
          variant="subtle"
        />
        <UStatCard
          icon="i-lucide-users"
          title="Ghost"
          value="1,234"
          :trend="5.2"
          :color="color"
          :size="size"
          variant="ghost"
        />
        <UStatCard
          icon="i-lucide-users"
          title="Naked"
          value="1,234"
          :trend="5.2"
          :color="color"
          :size="size"
          variant="naked"
        />
      </div>
    </div>

    <USeparator />

    <div class="flex flex-col gap-4">
      <h2 class="font-semibold text-highlighted">
        Custom Slots
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <UStatCard
          icon="i-lucide-trending-up"
          title="Growth"
          value="24.5%"
          :color="color"
          :size="size"
          :variant="variant"
        >
          <template #trend>
            <span class="text-xs text-muted">
              vs last month
            </span>
          </template>
        </UStatCard>
        <UStatCard
          :color="color"
          :size="size"
          :variant="variant"
        >
          <template #icon>
            <div class="size-10 rounded-lg bg-primary-500/10 flex items-center justify-center">
              <UIcon name="i-lucide-sparkles" class="text-primary-500" />
            </div>
          </template>
          <template #title>
            Custom Title Slot
          </template>
          <template #value>
            <span class="text-3xl font-bold">
              Custom Value
            </span>
          </template>
        </UStatCard>
      </div>
    </div>

    <USeparator />

    <div class="flex flex-col gap-4">
      <h2 class="font-semibold text-highlighted">
        With Progress Bar
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        <UStatCard
          icon="i-lucide-dollar-sign"
          title="Outline"
          :current="8000"
          :max="10000"
          :color="color"
          :size="size"
          variant="outline"
        />
        <UStatCard
          icon="i-lucide-dollar-sign"
          title="Solid"
          :current="8000"
          :max="10000"
          :color="color"
          :size="size"
          variant="solid"
        />
        <UStatCard
          icon="i-lucide-dollar-sign"
          title="Soft"
          :current="8000"
          :max="10000"
          :color="color"
          :size="size"
          variant="soft"
        />
        <UStatCard
          icon="i-lucide-dollar-sign"
          title="Subtle"
          :current="8000"
          :max="10000"
          :color="color"
          :size="size"
          variant="subtle"
        />
        <UStatCard
          icon="i-lucide-dollar-sign"
          title="Ghost"
          :current="8000"
          :max="10000"
          :color="color"
          :size="size"
          variant="ghost"
        />
        <UStatCard
          icon="i-lucide-dollar-sign"
          title="Naked"
          :current="8000"
          :max="10000"
          :color="color"
          :size="size"
          variant="naked"
        />
      </div>
    </div>

    <USeparator />

    <div class="flex flex-col gap-4">
      <h2 class="font-semibold text-highlighted">
        With Sparkline Chart
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        <UStatCard
          icon="i-lucide-trending-up"
          title="Outline"
          value="$45,231"
          :data="[20, 35, 30, 45, 50, 40, 55, 60, 55, 65, 70, 75]"
          :color="color"
          :size="size"
          variant="outline"
        />
        <UStatCard
          icon="i-lucide-trending-up"
          title="Solid"
          value="$45,231"
          :data="[20, 35, 30, 45, 50, 40, 55, 60, 55, 65, 70, 75]"
          :color="color"
          :size="size"
          variant="solid"
        />
        <UStatCard
          icon="i-lucide-trending-up"
          title="Soft"
          value="$45,231"
          :data="[20, 35, 30, 45, 50, 40, 55, 60, 55, 65, 70, 75]"
          :color="color"
          :size="size"
          variant="soft"
        />
        <UStatCard
          icon="i-lucide-trending-up"
          title="Subtle"
          value="$45,231"
          :data="[20, 35, 30, 45, 50, 40, 55, 60, 55, 65, 70, 75]"
          :color="color"
          :size="size"
          variant="subtle"
        />
        <UStatCard
          icon="i-lucide-trending-up"
          title="Ghost"
          value="$45,231"
          :data="[20, 35, 30, 45, 50, 40, 55, 60, 55, 65, 70, 75]"
          :color="color"
          :size="size"
          variant="ghost"
        />
        <UStatCard
          icon="i-lucide-trending-up"
          title="Naked"
          value="$45,231"
          :data="[20, 35, 30, 45, 50, 40, 55, 60, 55, 65, 70, 75]"
          :color="color"
          :size="size"
          variant="naked"
        />
      </div>
    </div>

    <USeparator />

    <div class="flex flex-col gap-4">
      <h2 class="font-semibold text-highlighted">
        With Negative Values (Zero Line)
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        <UStatCard
          icon="i-lucide-trending-up"
          title="Net Profit"
          value="$12,450"
          :data="[15, -20, 25, -30, 35, 40, 45, 50, 55, 60, 65, 70]"
          :trend="366.7"
          :color="color"
          :size="size"
          variant="outline"
        />
        <UStatCard
          icon="i-lucide-line-chart"
          title="Revenue Change"
          value="+24.5%"
          :data="[-10, -5, 5, -8, 12, 15, 20, 18, 25, 30, 35, 40]"
          :trend="500"
          show-area
          :color="color"
          :size="size"
          variant="outline"
        />
        <UStatCard
          icon="i-lucide-bar-chart"
          title="Growth Rate"
          value="8.2%"
          :data="[-15, 10, -5, 20, -10, 15, 25, 30, 35, 40, 45, 50]"
          :trend="433.3"
          show-area
          :color="color"
          :size="size"
          variant="outline"
        />
      </div>
    </div>

    <USeparator />

    <div class="flex flex-col gap-4">
      <h2 class="font-semibold text-highlighted">
        Dashboard Example
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <UStatCard
          icon="i-lucide-users"
          title="Total Users"
          value="12,345"
          :trend="12.5"
          trend-direction="up"
          color="primary"
          :size="size"
          :variant="variant"
        />
        <UStatCard
          icon="i-lucide-shopping-cart"
          title="Total Sales"
          value="$45,231"
          :trend="8.2"
          trend-direction="up"
          color="success"
          :size="size"
          :variant="variant"
        />
        <UStatCard
          icon="i-lucide-trending-down"
          title="Bounce Rate"
          value="24.5%"
          :trend="3.2"
          trend-direction="down"
          color="success"
          :size="size"
          :variant="variant"
        />
        <UStatCard
          icon="i-lucide-clock"
          title="Avg. Session"
          value="3m 24s"
          :trend="15.3"
          trend-direction="up"
          color="info"
          :size="size"
          :variant="variant"
        />
      </div>
    </div>
  </div>
</template>
