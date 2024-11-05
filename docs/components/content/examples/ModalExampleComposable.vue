<script setup lang="ts">
import { ModalExampleComponent } from '#components'

const toast = useToast()
const modal = useModal()
const count = ref(0)

function openModal() {
  count.value += 1
  modal.open(ModalExampleComponent, {
    count: count.value,
    onSuccess() {
      toast.add({
        title: 'Success !',
        id: 'modal-success'
      })
    }
  })
}
</script>

<template>
  <UButton label="Reveal modal" @click="openModal" />
</template>
