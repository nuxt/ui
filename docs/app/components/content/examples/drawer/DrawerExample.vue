<script setup lang="ts">
const open = ref(false)
const toast = useToast()

const items = [{
  value: 'asap',
  label: 'Standard delivery',
  description: '25 to 35 min, a driver is assigned now'
}, {
  value: '17:00',
  label: '5:00 PM to 5:15 PM',
  description: 'Prep starts at 4:45 PM'
}, {
  value: '17:30',
  label: '5:30 PM to 5:45 PM',
  description: 'Good if you are heading home'
}, {
  value: '18:00',
  label: '6:00 PM to 6:15 PM',
  description: 'Most popular, high demand'
}]

const value = ref('asap')

function onConfirm() {
  open.value = false

  toast.add({
    title: 'Delivery time confirmed',
    description: items.find(item => item.value === value.value)?.label
  })
}
</script>

<template>
  <UDrawer v-model:open="open" title="Pick a delivery time" description="We'll prepare your order as soon as possible." side="right">
    <UButton label="Open" color="neutral" variant="subtle" />

    <template #body>
      <URadioGroup v-model="value" :items="items" color="neutral" variant="card" indicator="end" />
    </template>

    <template #footer>
      <UButton label="Confirm delivery time" color="neutral" class="justify-center" @click="onConfirm" />
      <UButton label="Cancel" color="neutral" variant="outline" class="justify-center" @click="open = false" />
    </template>
  </UDrawer>
</template>
