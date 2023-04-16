<template>
  <div class="mt-12">
    <p>Color</p>

    <div class="flex items-center gap-3 mt-3">
      <button type="button" class="shadow-sm border border-transparent text-white bg-primary-600 hover:bg-primary-500 dark:bg-primary-500 dark:hover:bg-primary-400" :class="base">
        Solid
      </button>

      <button type="button" class="border border-current text-primary-500 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950" :class="base">
        Outline
      </button>

      <button type="button" class="border border-transparent text-primary-500 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950" :class="base">
        Ghost
      </button>

      <button type="button" class="border border-transparent text-primary-500 dark:text-primary-400 underline-offset-4 hover:underline" :class="base">
        Link
      </button>
    </div>

    <p class="mt-3">
      White
    </p>

    <div class="flex items-center gap-3 mt-3">
      <!-- white: 'shadow-sm border u-border-gray-300 u-text-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 disabled:bg-white dark:disabled:bg-gray-900 focus-visible:border-primary-500', -->

      <button type="button" class="shadow-sm border u-border-gray-300 u-text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800/50" :class="base">
        Solid
      </button>

      <!-- 'white-hover': 'border border-transparent u-text-gray-700 hover:bg-white dark:hover:bg-gray-900 hover:shadow-sm focus-visible:border-primary-500', -->

      <button type="button" class="border border-transparent u-text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50" :class="base">
        Ghost
      </button>
    </div>

    <p class="mt-3">
      Gray
    </p>

    <div class="flex items-center gap-3 mt-3">
      <!-- gray: 'shadow-sm border u-border-gray-300 u-text-gray-700 bg-gray-50 hover:bg-gray-100 disabled:bg-gray-50 dark:bg-gray-800 dark:hover:bg-opacity-75 dark:disabled:bg-opacity-75 focus-visible:border-primary-500', -->

      <button type="button" class="shadow-sm border u-border-gray-300 u-text-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700/50" :class="base">
        Solid
      </button>

      <!-- 'gray-hover': 'border border-transparent u-text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800/75 hover:u-border-gray-300 hover:shadow-sm focus-visible:border-primary-500', -->

      <button type="button" class="border border-transparent u-text-gray-700 hover:u-text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700/50" :class="base">
        Ghost
      </button>

      <button type="button" class="border border-transparent u-text-gray-500 hover:u-text-gray-700 underline-offset-4 hover:underline" :class="base">
        Link
      </button>
    </div>

    <p class="mt-3">
      Black
    </p>

    <div class="flex items-center gap-3 mt-3">
      <button type="button" class="shadow-sm border border-transparent text-white dark:text-gray-900 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100" :class="base">
        Solid
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const base = 'rounded-md px-2.5 py-1.5 text-sm font-medium'
</script>
