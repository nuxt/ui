<script setup lang="ts">
import theme from '#build/ui/alert-group'
import type { AlertProps } from '@nuxt/ui'

const alertItems: AlertProps[] = [
  {
    title: 'First Alert',
    description: 'This is the first alert in the group.',
    icon: 'i-lucide-info',
    color: 'primary'
  },
  {
    title: 'Second Alert',
    description: 'This is the second alert in the group. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, urna eu tincidunt consectetur, nisi nisl aliquam nunc, eget aliquam massa nisl quis neque. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Integer ac sem euismod, dictum erat at, dictum enim. Etiam euismod, urna eu tincidunt consectetur, nisi nisl aliquam nunc, eget aliquam massa nisl quis neque.',
    icon: 'i-lucide-alert-triangle',
    color: 'warning'
  },
  {
    title: 'Third Alert',
    description: 'This is the third alert in the group.',
    icon: 'i-lucide-check-circle',
    color: 'success'
  },
  {
    title: 'Fourth Alert',
    description: 'This is the fourth alert in the group.',
    icon: 'i-lucide-x-circle',
    color: 'error'
  },
  {
    title: 'Fifth Alert',
    description: 'This is the fifth alert in the group.',
    icon: 'i-lucide-help-circle',
    color: 'info'
  }
]

const attrs = reactive({
  expand: [false],
  max: [5]
})
</script>

<template>
  <Navbar>
    <UCheckbox v-model="attrs.expand[0]" label="Expand" />
    <UInputNumber v-model="attrs.max[0]" :min="1" :max="10" label="Max" />
  </Navbar>

  <Matrix v-slot="props" :attrs="attrs" container-class="max-w-196">
    <UAlertGroup :items="alertItems" v-bind="props" />
  </Matrix>
</template>
