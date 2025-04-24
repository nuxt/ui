<script setup lang="ts">
import { upperFirst } from 'scule'
import { Time } from '@internationalized/date'

const sizes = ['xs', 'sm', 'md', 'lg', 'xl']
const variants = ['outline', 'soft', 'subtle', 'ghost', 'none']

// Default time values
const defaultTime = ref(new Time(10, 30))
const hourOnlyTime = ref(new Time(14, 0))
const secondsTime = ref(new Time(9, 45, 30))
const cycle24Time = ref(new Time(16, 30))
</script>

<template>
  <div class="flex flex-col items-center gap-8">
    <div class="flex flex-col gap-4 w-48">
      <h3 class="text-lg font-medium">
        Default TimeField
      </h3>
      <UTimeField v-model="defaultTime" />
    </div>

    <div class="flex items-center gap-2 flex-wrap justify-center">
      <div v-for="variant in variants" :key="variant" class="flex flex-col items-center">
        <p class="text-sm mb-2">
          {{ upperFirst(variant) }}
        </p>
        <UTimeField
          v-model="defaultTime"
          :variant="variant"
          class="w-48"
        />
      </div>
    </div>

    <div class="flex items-center gap-2 flex-wrap justify-center">
      <div v-for="variant in variants" :key="variant" class="flex flex-col items-center">
        <p class="text-sm mb-2">
          {{ upperFirst(variant) }} (Neutral)
        </p>
        <UTimeField
          v-model="defaultTime"
          :variant="variant"
          color="neutral"
          class="w-48"
        />
      </div>
    </div>

    <div class="flex items-center gap-2 flex-wrap justify-center">
      <div v-for="variant in variants" :key="variant" class="flex flex-col items-center">
        <p class="text-sm mb-2">
          {{ upperFirst(variant) }} (Error)
        </p>
        <UTimeField
          v-model="defaultTime"
          :variant="variant"
          color="error"
          highlight
          class="w-48"
        />
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <h3 class="text-lg font-medium">
        TimeField Variants
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="flex flex-col gap-2">
          <p class="text-sm">
            Disabled
          </p>
          <UTimeField v-model="defaultTime" disabled />
        </div>
        <div class="flex flex-col gap-2">
          <p class="text-sm">
            Required
          </p>
          <UTimeField v-model="defaultTime" required />
        </div>
        <div class="flex flex-col gap-2">
          <p class="text-sm">
            Readonly
          </p>
          <UTimeField v-model="defaultTime" readonly />
        </div>
        <div class="flex flex-col gap-2">
          <p class="text-sm">
            Hour only
          </p>
          <UTimeField v-model="hourOnlyTime" granularity="hour" />
        </div>
        <div class="flex flex-col gap-2">
          <p class="text-sm">
            With seconds
          </p>
          <UTimeField v-model="secondsTime" granularity="second" />
        </div>
        <div class="flex flex-col gap-2">
          <p class="text-sm">
            24 hour cycle
          </p>
          <UTimeField v-model="cycle24Time" :hour-cycle="24" />
        </div>
        <div class="flex flex-col gap-2">
          <p class="text-sm">
            Loading
          </p>
          <UTimeField v-model="defaultTime" loading />
        </div>
        <div class="flex flex-col gap-2">
          <p class="text-sm">
            Loading (trailing)
          </p>
          <UTimeField v-model="defaultTime" loading trailing />
        </div>
        <div class="flex flex-col gap-2">
          <p class="text-sm">
            With icons
          </p>
          <UTimeField v-model="defaultTime" icon="i-lucide-clock" trailing-icon="i-lucide-chevron-down" />
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <h3 class="text-lg font-medium">
        TimeField Sizes
      </h3>
      <div class="flex flex-wrap gap-4 justify-center">
        <div v-for="size in sizes" :key="size" class="flex flex-col items-center">
          <p class="text-sm mb-2">
            {{ upperFirst(size) }}
          </p>
          <UTimeField v-model="defaultTime" :size="size" />
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <h3 class="text-lg font-medium">
        TimeField with Leading Icon
      </h3>
      <div class="flex flex-wrap gap-4 justify-center">
        <div v-for="size in sizes" :key="size" class="flex flex-col items-center">
          <p class="text-sm mb-2">
            {{ upperFirst(size) }}
          </p>
          <UTimeField v-model="defaultTime" icon="i-lucide-clock" :size="size" />
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <h3 class="text-lg font-medium">
        TimeField with Trailing Icon
      </h3>
      <div class="flex flex-wrap gap-4 justify-center">
        <div v-for="size in sizes" :key="size" class="flex flex-col items-center">
          <p class="text-sm mb-2">
            {{ upperFirst(size) }}
          </p>
          <UTimeField v-model="defaultTime" icon="i-lucide-clock" trailing :size="size" />
        </div>
      </div>
    </div>
  </div>
</template>
