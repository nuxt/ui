<template>
  <UModal v-model="model">
    <div class="p-4">
      <p>This modal was dynamically opened from the script</p>
      <p>Count: {{ count }}</p>
      <button @click="next">
        Open nested modal
      </button>
    </div>
  </UModal>
</template>

<script lang="ts" setup>
import { Next } from '#components'

const model = defineModel<boolean>()

defineProps<{
  count: number
}>()

const modal = useModal()

function next () {
  modal.reveal(Next)
}
</script>