import { inject, unref } from 'vue'
import type {
  FilterI18nConfig,
  FiltersVariant,
  FiltersSize,
  FiltersRadius
} from '../types/filter'
import type { Component } from 'vue'

/**
 * Composable and context for the filter system
 * Allows sharing configuration (variant, size, i18n) between all child components
 */

/**
 * Value of the context shared between all filter components
 * Contains visual and functional configuration
 */
export interface FilterContextValue {
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
  allowMultiple?: boolean // Allows multiple filters on the same field
}

/**
 * Unique symbol for Vue context injection
 * Ensures context uniqueness in the component tree
 */
export const FilterContext = Symbol('FilterContext') as symbol

/**
 * Composable to access the filter context
 * @throws Error if used outside a FilterContextProvider
 * @returns The filter context configuration
 */
export function useFilterContext(): FilterContextValue {
  const context = inject(FilterContext)
  if (!context) {
    throw new Error('useFilterContext must be used within FilterContextProvider')
  }
  return unref(context)
}
