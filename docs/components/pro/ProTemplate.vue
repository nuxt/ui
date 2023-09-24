<template>
  <div class="rounded-xl border border-gray-200/10 bg-gray-700/20 p-4 flex-1 w-full">
    <div class="relative h-full">
      <TransitionGroup name="fade">
        <div
          v-for="(component, index) in components"
          :id="component.name"
          :key="index"
          class="absolute rounded-lg shadow-sm flex items-center justify-center transition-[background] duration-500"
          :class="[component.class, !component.transparent && (component.inactive ? 'border border-gray-200/10 bg-gray-700/20' : 'bg-primary')]"
        >
          <template v-if="component.inactive">
            <div v-for="(subComponent, subIndex) in component.children" :key="subIndex" class="absolute rounded-lg shadow-sm flex items-center justify-center transition-[background] duration-500" :class="[subComponent.class, !subComponent.inactive && 'border border-gray-200/10 bg-gray-700/20']">
              <p v-if="!subComponent.inactive" class="font-semibold text-white">
                {{ subComponent.name }}
              </p>
            </div>
          </template>
          <template v-else-if="component.slot">
            <slot :name="component.slot" />
          </template>
          <p v-else class="font-semibold text-white dark:text-gray-900">
            {{ component.name }}
          </p>
        </div>
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

defineProps({
  components: {
    type: Array as PropType<Component[]>,
    default: () => []
  }
})
</script>
