<template>
  <div
    :id="block.id"
    :class="twMerge(
      'absolute rounded-lg flex items-center justify-center',
      block.class,
      !block.slot && (block.inactive || block.inactive === undefined ? 'border border-gray-800/10 dark:border-gray-200/10 bg-gray-200/20 dark:bg-gray-700/20 transition-[background,text] duration-500' : 'bg-primary transition-[background,text] duration-500'),
      block.name?.startsWith('#') && 'border-dashed'
    )"
    :style="block.style"
  >
    <NuxtLink v-if="block.to && !block.inactive" :to="block.to" class="focus:outline-none" tabindex="-1">
      <span class="absolute inset-0" aria-hidden="true" />
    </NuxtLink>

    <template v-if="block.inactive">
      <TransitionGroup name="fade">
        <HomeProDemoBlock v-for="(subComponent, subIndex) in block.children" :key="subIndex" :block="subComponent">
          <template v-for="(_, name) in $slots" #[name]="slotData: any">
            <slot :name="name" v-bind="slotData" />
          </template>
        </HomeProDemoBlock>
      </TransitionGroup>
    </template>
    <template v-else-if="block.slot">
      <slot :name="block.slot" />
    </template>
    <p
      v-else
      class="font-semibold flex flex-col gap-1 text-center"
      :class="[
        !block.slot && (block.inactive || block.inactive === undefined ? 'text-gray-900 dark:text-white' : 'text-white dark:text-gray-900')
      ]"
    >
      {{ block.name }}

      <span v-if="block.description" class="font-normal">{{ block.description }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { twMerge } from 'tailwind-merge'
import type { HomeProBlock } from '~/types'

defineProps<{ block: HomeProBlock }>()
</script>

<style scoped lang="postcss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
