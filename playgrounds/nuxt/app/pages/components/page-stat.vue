<script setup lang="ts">
import theme from '#build/ui/page-stat'

const colors = Object.keys(theme.variants.color)
const sizes = Object.keys(theme.variants.size)
const variants = Object.keys(theme.variants.variant) as Array<keyof typeof theme.variants.variant>

const color = ref(theme.defaultVariants.color)
const size = ref(theme.defaultVariants.size)
const variant = ref(theme.defaultVariants.variant)
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
        <UPageStat
          icon="i-lucide-users"
          title="Total Users"
          value="12,345"
          :trend="12.5"
          :color="color"
          :size="size"
          :variant="variant"
        />
        <UPageStat
          icon="i-lucide-shopping-cart"
          title="Sales"
          value="$45,231"
          :trend="-8.2"
          :color="color"
          :size="size"
          :variant="variant"
        />
        <UPageStat
          icon="i-lucide-dollar-sign"
          title="Revenue"
          value="$125,430"
          :color="color"
          :size="size"
          :variant="variant"
        />
        <UPageStat
          icon="i-lucide-activity"
          title="Active Sessions"
          value="1,234"
          :trend="15.3"
          :color="color"
          :size="size"
          :variant="variant"
        />
      </div>
    </div>

    <USeparator />

    <div class="flex flex-col gap-4">
      <h2 class="font-semibold text-highlighted">
        With Progress Bar
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        <UPageStat
          v-for="v in variants"
          :key="v"
          icon="i-lucide-dollar-sign"
          :title="v"
          :current="8000"
          :max="10000"
          :color="color"
          :size="size"
          :variant="v"
        />
      </div>
    </div>

    <USeparator />

    <div class="flex flex-col gap-4">
      <h2 class="font-semibold text-highlighted">
        With Sparkline Chart
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        <UPageStat
          v-for="v in variants"
          :key="v"
          icon="i-lucide-trending-up"
          :title="v"
          value="$45,231"
          :data="[20, 35, 30, 45, 50, 40, 55, 60, 55, 65, 70, 75]"
          show-area
          :color="color"
          :size="size"
          :variant="v"
        />
      </div>
    </div>

    <USeparator />

    <div class="flex flex-col gap-4">
      <h2 class="font-semibold text-highlighted">
        With Negative Values
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        <UPageStat
          icon="i-lucide-trending-up"
          title="Net Profit"
          value="$12,450"
          :data="[15, -20, 25, -30, 35, 40, 45, 50, 55, 60, 65, 70]"
          :trend="366.7"
          :color="color"
          :size="size"
          :variant="variant"
        />
        <UPageStat
          icon="i-lucide-line-chart"
          title="Revenue Change"
          value="+24.5%"
          :data="[-10, -5, 5, -8, 12, 15, 20, 18, 25, 30, 35, 40]"
          :trend="500"
          show-area
          :color="color"
          :size="size"
          :variant="variant"
        />
        <UPageStat
          icon="i-lucide-bar-chart"
          title="Growth Rate"
          value="8.2%"
          :data="[-15, 10, -5, 20, -10, 15, 25, 30, 35, 40, 45, 50]"
          :trend="433.3"
          show-area
          :color="color"
          :size="size"
          :variant="variant"
        />
      </div>
    </div>

    <USeparator />

    <div class="flex flex-col gap-4">
      <h2 class="font-semibold text-highlighted">
        Custom Slots
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <UPageStat
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
        </UPageStat>
        <UPageStat
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
        </UPageStat>
      </div>
    </div>
  </div>
</template>
