import type { Component } from 'vue'

/**
 * Field types supported by the filter system
 * Each type determines available operators and the input component used
 */
export type FilterFieldType
  = | 'select'
    | 'multiselect'
    | 'date'
    | 'text'
    | 'number'
    | 'boolean'
    | 'email'
    | 'url'
    | 'tel'
    | 'time'
    | 'datetime'
    | 'custom'
    | 'separator'

/**
 * Possible values for filter operators
 * Covers comparison operations, text search, ranges, etc.
 */
export type FilterOperatorValue
  = | 'is'
    | 'is_not'
    | 'is_any_of'
    | 'is_not_any_of'
    | 'includes_all'
    | 'excludes_all'
    | 'before'
    | 'after'
    | 'between'
    | 'not_between'
    | 'contains'
    | 'not_contains'
    | 'starts_with'
    | 'ends_with'
    | 'is_exactly'
    | 'equals'
    | 'not_equals'
    | 'greater_than'
    | 'less_than'
    | 'overlaps'
    | 'includes'
    | 'excludes'
    | 'includes_all_of'
    | 'includes_any_of'
    | 'empty'
    | 'not_empty'

/**
 * Visual variants for filter components
 */
export type FiltersVariant = 'solid' | 'outline'
export type FiltersSize = 'sm' | 'md' | 'lg'
export type FiltersRadius = 'md' | 'full'

/**
 * Option available for a select or multiselect field type
 * @template T - Type of the option value
 */
export interface FilterOption<T = unknown> {
  value: T
  label: string
  icon?: string | Component
}

/**
 * Definition of a filter operator with its label and capabilities
 */
export interface FilterOperator {
  value: FilterOperatorValue
  label: string
  supportsMultiple?: boolean
}

/**
 * Complete configuration of a filterable field
 * Defines the type, options, available operators, validation constraints, etc.
 * @template T - Type of field values
 */
export interface FilterFieldConfig<T = unknown> {
  key: string
  label: string
  icon?: string | Component
  type?: FilterFieldType
  options?: FilterOption<T>[]
  operators?: FilterOperator[]
  placeholder?: string
  searchable?: boolean
  className?: string
  defaultOperator?: FilterOperatorValue
  popoverContentClassName?: string
  maxSelections?: number
  min?: number
  max?: number
  step?: number
  prefix?: string | Component
  suffix?: string | Component
  pattern?: string
  validation?: (value: unknown) => boolean | string | null | undefined
  allowCustomValues?: boolean
  onLabel?: string
  offLabel?: string
  customRenderer?: Component
  children?: FilterFieldConfig<T>[] // Allows creation of nested/hierarchical fields
}

/**
 * Field group for organization in the interface
 * Allows grouping fields by category
 */
export interface FilterFieldGroup {
  group: string
  fields: FilterFieldConfig[]
}

/**
 * Configuration of filterable fields
 * Can be either a simple array of fields, or an array of groups
 */
export type FilterFieldsConfig = FilterFieldConfig[] | FilterFieldGroup[]

/**
 * Internationalization configuration for the filter system
 */
export interface FilterI18nConfig {
  addFilter: string
  searchFields: string
  noFieldsFound: string
  noResultsFound: string
  select: string
  true: string
  false: string
  min: string
  max: string
  to: string
  toAlt: string
  typeAndPressEnter: string
  selected: string
  selectedCount: string
  percent: string
  defaultCurrency: string
  defaultColor: string
  addFilterTitle: string
  operators: {
    is: string
    isNot: string
    isAnyOf: string
    isNotAnyOf: string
    includesAll: string
    excludesAll: string
    before: string
    after: string
    between: string
    notBetween: string
    contains: string
    notContains: string
    startsWith: string
    endsWith: string
    isExactly: string
    equals: string
    notEquals: string
    greaterThan: string
    lessThan: string
    overlaps: string
    includes: string
    excludes: string
    includesAllOf: string
    includesAnyOf: string
    empty: string
    notEmpty: string
  }
  placeholders: { // Contextual help texts for input fields
    enterField: (fieldType: string) => string
    selectField: string
    searchField: (fieldName: string) => string
    enterKey: string
    enterValue: string
  }
  helpers: {
    formatOperator: (operator: string) => string
  }
  validation: {
    invalidEmail: string
    invalidUrl: string
    invalidTel: string
    invalid: string
  }
}

/**
 * Represents an active filter with its field, operator and values
 * @template T - Type of filter values (default unknown for flexibility)
 */
export interface Filter<T = unknown> {
  id: string
  field: string
  operator: FilterOperatorValue
  values: T[]
}
