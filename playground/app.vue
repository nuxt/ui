<template>
  <UContainer padded class="py-8 bg-white dark:bg-black">
    <h1 class="font-extrabold text-2xl flex items-center justify-between">
      <span>
        {{ componentName }}
      </span>

      <span class="text-gray-200 dark:text-gray-800">
        #{{ currentIndex }}
      </span>
    </h1>

    <div class="flex items-center justify-between py-4">
      <UButton @click="set(previousComponent)">
        {{ previousComponent }}
      </UButton>

      <UButton @click="set(nextComponent)">
        {{ nextComponent }}
      </UButton>
    </div>

    <div>
      <ComponentPreview :key="componentName" :component="componentName" />
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const defaultProps = useDefaultProps()

const components = computed(() => Object.keys(defaultProps.value).sort())

const componentName = ref('Alert')

const set = (value: string) => (componentName.value = value)

const currentIndex = computed(() => components.value.indexOf(componentName.value))

const nextComponent = computed(() => {
  const index = currentIndex.value + 1

  if (index >= components.value.length) {
    return components.value[0]
  }

  return components.value[index]
})

const previousComponent = computed(() => {
  const index = currentIndex.value - 1

  if (index < 0) {
    return components.value[components.value.length - 1]
  }

  return components.value[index]
})
</script>
