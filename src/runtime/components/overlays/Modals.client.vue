<template>
  <component
    :is="modalState.component"
    v-if="modalState"
    v-bind="modalState.props"
    v-model="isOpen"
    @after-leave="reset"
  />
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import { useModal, modalInjectionKey } from '../../composables/useModal'

const modalState = inject(modalInjectionKey)

const { isOpen, reset } = useModal()
</script>
