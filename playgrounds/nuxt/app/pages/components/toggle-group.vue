<script setup lang="ts">
const align = ref('left')
const marks = ref(['bold'])

const alignItems = [{
  'value': 'left',
  'icon': 'i-lucide-align-left',
  'aria-label': 'Align left'
}, {
  'value': 'center',
  'icon': 'i-lucide-align-center',
  'aria-label': 'Align center'
}, {
  'value': 'right',
  'icon': 'i-lucide-align-right',
  'aria-label': 'Align right'
}]

const markItems = [{
  'value': 'bold',
  'icon': 'i-lucide-bold',
  'aria-label': 'Toggle bold'
}, {
  'value': 'italic',
  'icon': 'i-lucide-italic',
  'aria-label': 'Toggle italic'
}, {
  'value': 'underline',
  'icon': 'i-lucide-underline',
  'aria-label': 'Toggle underline',
  'disabled': true
}]

const periodItems = [{ label: 'Day', value: 'day' }, { label: 'Week', value: 'week' }, { label: 'Month', value: 'month' }]
</script>

<template>
  <Navbar />

  <div class="flex flex-col gap-4">
    <UToggleGroup v-model="align" :items="alignItems" />
    <UToggleGroup v-model="marks" type="multiple" :items="markItems" />
    <UToggleGroup :items="periodItems" default-value="week" variant="outline" active-variant="subtle" />
    <UToggleGroup :items="periodItems" default-value="week" variant="outline" active-variant="subtle" attached />
    <UToggleGroup :items="periodItems" default-value="week" orientation="vertical" class="w-32" />
    <UToggleGroup
      :items="periodItems"
      default-value="week"
      variant="outline"
      active-variant="subtle"
      orientation="vertical"
      attached
      class="w-32"
    />
  </div>
</template>
