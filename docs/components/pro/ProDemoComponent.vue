<template>
  <div
    :id="component.name"
    class="absolute rounded-lg flex items-center justify-center transition-[background,text] duration-500"
    :class="[
      component.class,
      !component.slot && (component.inactive || component.inactive === undefined ? 'border border-gray-800/10 dark:border-gray-200/10 bg-gray-200/20 dark:bg-gray-700/20' : 'bg-primary'),
      component.name?.startsWith('#') && 'border-dashed'
    ]"
  >
    <NuxtLink v-if="component.to" :to="component.to" class="focus:outline-none" tabindex="-1">
      <span class="absolute inset-0" aria-hidden="true" />
    </NuxtLink>

    <template v-if="component.inactive">
      <TransitionGroup name="fade">
        <ProDemoComponent v-for="(subComponent, subIndex) in component.children" :key="subIndex" :component="subComponent">
          <template v-for="(_, name) in $slots" #[name]="slotData">
            <slot :name="name" v-bind="slotData" />
          </template>
        </ProDemoComponent>
      </TransitionGroup>
    </template>
    <template v-else-if="component.slot">
      <slot :name="component.slot" />
    </template>
    <p v-else class="font-semibold" :class="[!component.slot && (component.inactive || component.inactive === undefined ? 'text-gray-900 dark:text-white' : 'text-white dark:text-gray-900')]">
      {{ component.name }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { ProComponent } from '~/types'

defineProps<{ component: ProComponent }>()
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
