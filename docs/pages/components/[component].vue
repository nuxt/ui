<template>
  <UCard v-if="component" footer-class="px-4 py-4 sm:px-6 bg-tw-gray-100">
    <div class="flex justify-center">
      <component :is="is" v-bind="boundProps" />
    </div>

    <template v-if="props.length" #footer>
      <div class="space-y-3">
        <UInputGroup
          v-for="prop of props"
          :key="prop.key"
          :name="prop.key"
          :label="prop.key"
        >
          <UToggle
            v-if="prop.type === 'Boolean'"
            v-model="prop.value"
            :name="prop.key"
            :label="prop.key"
          />
          <USelect
            v-else-if="prop.values"
            v-model="prop.value"
            :name="prop.key"
            placeholder="Choose one..."
            :options="prop.values"
            size="sm"
          />
          <UInput
            v-else-if="prop.type === 'String'"
            v-model="prop.value"
            :name="prop.key"
            size="sm"
            autocomplete="off"
          />
          <UInput
            v-else-if="prop.type === 'Number'"
            v-model="prop.value"
            type="number"
            :name="prop.key"
            size="sm"
          />
          <UTextarea
            v-else
            v-model="prop.value"
            :name="prop.key"
            size="sm"
          />
        </UInputGroup>
      </div>
    </template>
  </UCard>
</template>

<script setup>
const nuxtApp = useNuxtApp()
const { params } = useRoute()

const is = `U${params.component}`

const component = nuxtApp.vueApp.component(is)

const { props: componentProps } = await component.__asyncLoader()

const refProps = Object.entries(componentProps).map(([key, prop]) => {
  let value = typeof prop.default === 'function' ? prop.default() : prop.default
  let type = prop.type
  if (Array.isArray(type)) {
    type = type[0].name
  } else {
    type = type.name
  }

  let values
  if (prop.validator) {
    const result = prop.validator.toString().match(/\[.*\]/g, '')[0]
    values = JSON.parse(result.replace(/'/g, '"'))
  }

  if (value) {
    if (type === 'Boolean') {
      value = value === 'true'
    } else if (type === 'String') {
      value = value.replace(/^'(.*)'$/, '$1')
    } else if (type === 'Array') {
      value = JSON.stringify(value)
    }
  }

  return {
    key,
    type,
    value,
    values
  }
})

const props = ref(refProps)
const boundProps = computed(() => {
  const bound = {}
  for (const prop of props.value) {
    try {
      bound[prop.key] = prop.type === 'Array' ? JSON.parse(prop.value) : prop.value
    } catch (e) {
      continue
    }
  }
  return bound
})
</script>
