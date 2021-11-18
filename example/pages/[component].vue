<template>
  <UCard background-class="bg-tw-gray-100">
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
            type="number"
            :value="prop.value"
            :name="prop.key"
            size="sm"
            autocomplete="off"
            @input="(value) => inputProp(prop.key, value)"
          />
          <p v-else class="text-sm text-tw-gray-400">
            This prop of type <span class="p-0.5 rounded bg-gray-100 dark:bg-gray-900">{{ prop.type }}</span> is not yet supported.
          </p>
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
  let value = prop.default
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

  if (type === 'Boolean') {
    value = value === 'true'
  } else if (type === 'String') {
    value = value === 'undefined' ? '' : value
    value = value === 'null' ? '' : value
    value = (value || '').replace(/^'(.*)'$/, '$1')
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
    bound[prop.key] = prop.value
  }
  return bound
})
</script>
