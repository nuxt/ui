<template>
  <div class="rounded-xl border border-gray-800/10 dark:border-gray-200/10 bg-gray-200/20 dark:bg-gray-700/20 p-4 flex-1 w-full">
    <div class="relative h-full">
      <TransitionGroup name="fade">
        <ProTemplateComponent v-for="(component, index) in components" :key="index" :component="component">
          <template v-for="(_, name) in $slots" #[name]="slotData">
            <slot :name="name" v-bind="slotData" />
          </template>
        </ProTemplateComponent>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
type Component = {
  name?: string
  slot?: string
  class?: string
  inactive?: boolean
  transparent?: boolean
  children?: Component[]
}

defineProps<{ components: Component[] }>()
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
