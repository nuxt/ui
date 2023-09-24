<template>
  <div
    :id="component.name"
    class="absolute rounded-lg flex items-center justify-center transition-[background,text] duration-500"
    :class="[component.class, !component.slot && (component.inactive || component.inactive === undefined ? 'border border-gray-800/10 dark:border-gray-200/10 bg-gray-200/20 dark:bg-gray-700/20' : 'bg-primary')]"
  >
    <template v-if="component.inactive">
      <TransitionGroup name="fade">
        <ProTemplateComponent v-for="(subComponent, subIndex) in component.children" :key="subIndex" :component="subComponent">
          <template v-for="(_, name) in $slots" #[name]="slotData">
            <slot :name="name" v-bind="slotData" />
          </template>
        </ProTemplateComponent>
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
type Component = {
  name?: string
  slot?: string
  class?: string
  inactive?: boolean
  transparent?: boolean
  children?: Component[]
}

defineProps<{ component: Component }>()
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
