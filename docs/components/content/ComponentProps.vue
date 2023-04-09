<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Default</th>
          <th>Description</th>
          <th class="text-center">
            Required
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="prop in meta.meta.props" :key="prop.name">
          <td><code>{{ prop.name }}</code></td>
          <td><code>{{ prop.type }}</code></td>
          <td><code v-if="prop.default">{{ prop.default }}</code></td>
          <td>{{ prop.description }}</td>
          <td class="text-center">
            <UIcon v-if="prop.required" name="i-heroicons-check" class="w-4 h-4 text-primary-500 dark:text-primary-400 align-middle" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const name = `U${useUpperFirst(useCamelCase(route.params.slug[1]))}`

const { data: meta } = await useAsyncData(`${name}-meta`, () => $fetch(`/api/component-meta/${name}`))

console.log('meta.value', meta.value)
</script>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>
