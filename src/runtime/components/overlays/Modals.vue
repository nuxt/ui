<template>
  <Teleport to="body">
    <component :is="modalState.component" v-bind="modalState.props" v-model="isOpen" />
  </Teleport>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import { useModal, modalInjectionKey } from '../../composables/useModal'

const modalState = inject(modalInjectionKey)

const { isOpen } = useModal()
</script>