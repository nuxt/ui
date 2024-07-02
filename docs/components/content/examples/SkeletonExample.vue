<template>
  <div class="flex items-center space-x-4">
    <USkeleton
      class="h-16 w-16"
      :ui="{
        rounded: 'rounded-full',
        background: 'bg-gray-300 dark:bg-slate-300',
      }"
    />
    <div class="space-y-2">
      <USkeleton class="h-4 w-[200px] bg-gray-300 dark:bg-slate-300" />
      <USkeleton class="h-4 w-[150px] bg-gray-300 dark:bg-slate-300" />
    </div>
  </div>
</template>
