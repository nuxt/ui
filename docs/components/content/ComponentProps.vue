<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>Prop</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="prop in metaProps" :key="prop.name">
          <td class="whitespace-nowrap relative">
            <code>{{ prop.name }}</code><span v-if="prop.required" class="font-bold text-red-500 dark:text-red-400 absolute top-0 ml-1">*</span>
          </td>
          <td class="whitespace-nowrap">
            <code v-if="prop.default">{{ prop.default }}</code>
          </td>
          <td>
            <a v-if="prop.name === 'ui'" href="#preset">
              <code>{{ prop.type }}</code>
            </a>
            <code v-else class="break-all">
              {{ prop.type }}
            </code>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  slug: {
    type: String,
    default: null
  }
})

const route = useRoute()
const slug = props.slug || route.params.slug[1]
const camelName = useCamelCase(slug)
const name = `U${useUpperFirst(camelName)}`

const { data: meta } = await useAsyncData(`${name}-meta`, () => $fetch(`/api/component-meta/${name}`))

const metaProps = computed(() => useSortBy(meta.value?.meta?.props || [], [
  prop => ['string', 'number', 'boolean', 'any'].indexOf(prop.type)
]))
</script>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>
