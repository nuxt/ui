<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>Slot</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="slot in (meta.meta.slots as any[])" :key="slot.name">
          <td class="whitespace-nowrap">
            <code>{{ slot.name }}</code>
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

const meta = await fetchComponentMeta(name)
</script>
