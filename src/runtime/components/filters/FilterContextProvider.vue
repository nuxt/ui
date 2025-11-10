<!--
  Context provider for the filter system
  Provides shared configuration (variant, size, i18n) to all child components
  Uses Vue's provide/inject API for context propagation
-->
<template>
  <slot />
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import type {
  FilterI18nConfig,
  FiltersVariant,
  FiltersSize,
  FiltersRadius
} from '../../types/filter'
import { computed, provide } from 'vue'
import { FilterContext } from '../../composables/useFilterContext'

interface Props {
  variant: FiltersVariant
  size: FiltersSize
  radius: FiltersRadius
  i18n: FilterI18nConfig
  cursorPointer: boolean
  className?: string
  showAddButton?: boolean
  addButtonText?: string
  addButtonIcon?: string
  addButtonClassName?: string
  addButton?: Component
  showSearchInput?: boolean
  trigger?: Component
  allowMultiple?: boolean
}

const props = defineProps<Props>()

// Creates the reactive context value that will be provided to child components
const contextValue = computed(() => ({
  variant: props.variant,
  size: props.size,
  radius: props.radius,
  i18n: props.i18n,
  cursorPointer: props.cursorPointer,
  className: props.className,
  showAddButton: props.showAddButton,
  addButtonText: props.addButtonText,
  addButtonIcon: props.addButtonIcon,
  addButtonClassName: props.addButtonClassName,
  addButton: props.addButton,
  showSearchInput: props.showSearchInput,
  trigger: props.trigger,
  allowMultiple: props.allowMultiple
}))

provide(FilterContext, contextValue)
</script>
