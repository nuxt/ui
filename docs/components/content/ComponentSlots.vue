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
import { upperFirst, camelCase } from 'scule'

const props = defineProps({
  slug: {
    type: String,
    default: null
  }
})

const route = useRoute()
// eslint-disable-next-line vue/no-dupe-keys
const slug = props.slug || route.params.slug[route.params.slug.length - 1]
const camelName = camelCase(slug)
const name = `U${upperFirst(camelName)}`

const meta = await fetchComponentMeta(name)
</script>
