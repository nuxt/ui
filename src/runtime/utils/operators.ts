import type {
  FilterFieldType,
  FilterOperator,
  FilterOperatorValue,
  FilterI18nConfig,
  FiltersSize
} from '../types/filter'

/**
 * Utilities for managing filter operators
 * Defines default operators for each field type and handles internationalization
 */

/**
 * Default operators available for each field type
 * Each field type has a set of logical operators adapted to its usage
 */
export const defaultOperators: Record<FilterFieldType, FilterOperator[]> = {
  text: [
    { value: 'contains', label: 'contains' },
    { value: 'not_contains', label: 'does not contain' },
    { value: 'starts_with', label: 'starts with' },
    { value: 'ends_with', label: 'ends with' },
    { value: 'is', label: 'is' },
    { value: 'empty', label: 'is empty' },
    { value: 'not_empty', label: 'is not empty' }
  ],
  number: [
    { value: 'equals', label: 'equals' },
    { value: 'not_equals', label: 'not equals' },
    { value: 'greater_than', label: 'greater than' },
    { value: 'less_than', label: 'less than' },
    { value: 'between', label: 'between' },
    { value: 'not_between', label: 'not between' },
    { value: 'empty', label: 'is empty' },
    { value: 'not_empty', label: 'is not empty' }
  ],
  date: [
    { value: 'before', label: 'before' },
    { value: 'after', label: 'after' },
    { value: 'is', label: 'is' },
    { value: 'is_not', label: 'is not' },
    { value: 'between', label: 'between' },
    { value: 'not_between', label: 'not between' },
    { value: 'empty', label: 'is empty' },
    { value: 'not_empty', label: 'is not empty' }
  ],
  select: [
    { value: 'is', label: 'is' },
    { value: 'is_not', label: 'is not' },
    { value: 'empty', label: 'is empty' },
    { value: 'not_empty', label: 'is not empty' }
  ],
  multiselect: [
    { value: 'is_any_of', label: 'is any of' },
    { value: 'is_not_any_of', label: 'is not any of' },
    { value: 'includes_all', label: 'includes all' },
    { value: 'excludes_all', label: 'excludes all' },
    { value: 'empty', label: 'is empty' },
    { value: 'not_empty', label: 'is not empty' }
  ],
  boolean: [
    { value: 'is', label: 'is' },
    { value: 'is_not', label: 'is not' },
    { value: 'empty', label: 'is empty' },
    { value: 'not_empty', label: 'is not empty' }
  ],
  email: [
    { value: 'contains', label: 'contains' },
    { value: 'not_contains', label: 'does not contain' },
    { value: 'starts_with', label: 'starts with' },
    { value: 'ends_with', label: 'ends with' },
    { value: 'is', label: 'is' },
    { value: 'empty', label: 'is empty' },
    { value: 'not_empty', label: 'is not empty' }
  ],
  url: [
    { value: 'contains', label: 'contains' },
    { value: 'not_contains', label: 'does not contain' },
    { value: 'starts_with', label: 'starts with' },
    { value: 'ends_with', label: 'ends with' },
    { value: 'is', label: 'is' },
    { value: 'empty', label: 'is empty' },
    { value: 'not_empty', label: 'is not empty' }
  ],
  tel: [
    { value: 'contains', label: 'contains' },
    { value: 'not_contains', label: 'does not contain' },
    { value: 'starts_with', label: 'starts with' },
    { value: 'ends_with', label: 'ends with' },
    { value: 'is', label: 'is' },
    { value: 'empty', label: 'is empty' },
    { value: 'not_empty', label: 'is not empty' }
  ],
  time: [
    { value: 'before', label: 'before' },
    { value: 'after', label: 'after' },
    { value: 'is', label: 'is' },
    { value: 'between', label: 'between' },
    { value: 'not_between', label: 'not between' },
    { value: 'empty', label: 'is empty' },
    { value: 'not_empty', label: 'is not empty' }
  ],
  datetime: [
    { value: 'before', label: 'before' },
    { value: 'after', label: 'after' },
    { value: 'is', label: 'is' },
    { value: 'between', label: 'between' },
    { value: 'not_between', label: 'not between' },
    { value: 'empty', label: 'is empty' },
    { value: 'not_empty', label: 'is not empty' }
  ],
  custom: [],
  separator: [] // Separators don't have operators
}

/**
 * Gets available operators for a given field type
 * Uses custom operators if provided, otherwise default operators
 * @param fieldType - Field type to get operators for
 * @param customOperators - Optional custom operators for this field
 * @returns List of available operators for this field type
 */
export function getOperatorsForFieldType(
  fieldType: FilterFieldType,
  customOperators?: FilterOperator[]
): FilterOperator[] {
  if (customOperators && customOperators.length > 0) {
    return customOperators
  }
  return defaultOperators[fieldType] || []
}

/**
 * Determines the default operator for a field type
 * @param fieldType - Field type
 * @param customDefault - Optional custom default operator
 * @returns The default operator (first in the list or 'is' if none)
 */
export function getDefaultOperatorForFieldType(
  fieldType: FilterFieldType,
  customDefault?: FilterOperatorValue
): FilterOperatorValue {
  if (customDefault) {
    return customDefault
  }
  const operators = defaultOperators[fieldType]
  if (operators && operators.length > 0 && operators[0]) {
    return operators[0].value
  }
  return 'is'
}

/**
 * Default internationalization configuration (English)
 * Contains all texts displayed in the filter interface
 */
export const defaultI18n: FilterI18nConfig = {
  addFilter: 'Filter',
  searchFields: 'Search...',
  noFieldsFound: 'No fields found.',
  noResultsFound: 'No results found.',
  select: 'Select...',
  true: 'True',
  false: 'False',
  min: 'Min',
  max: 'Max',
  to: 'to',
  toAlt: 'and',
  typeAndPressEnter: 'Type and press Enter to add a tag',
  selected: 'selected',
  selectedCount: 'selected',
  percent: '%',
  defaultCurrency: '$',
  defaultColor: '#000000',
  addFilterTitle: 'Filter',
  operators: {
    is: 'is',
    isNot: 'is not',
    isAnyOf: 'is any of',
    isNotAnyOf: 'is not any of',
    includesAll: 'includes all',
    excludesAll: 'excludes all',
    before: 'before',
    after: 'after',
    between: 'between',
    notBetween: 'not between',
    contains: 'contains',
    notContains: 'does not contain',
    startsWith: 'starts with',
    endsWith: 'ends with',
    isExactly: 'is exactly',
    equals: 'equals',
    notEquals: 'not equals',
    greaterThan: 'greater than',
    lessThan: 'less than',
    overlaps: 'overlaps',
    includes: 'includes',
    excludes: 'excludes',
    includesAllOf: 'includes all of',
    includesAnyOf: 'includes any of',
    empty: 'is empty',
    notEmpty: 'is not empty'
  },
  placeholders: {
    enterField: (fieldType: string) => `Enter ${fieldType}...`,
    selectField: 'Select...',
    searchField: (fieldName: string) => `Search ${fieldName.toLowerCase()}...`,
    enterKey: 'Enter a key...',
    enterValue: 'Enter a value...'
  },
  helpers: {
    formatOperator: (operator: string) => operator.replace(/_/g, ' ')
  },
  validation: {
    invalidEmail: 'Invalid email format',
    invalidUrl: 'Invalid URL format',
    invalidTel: 'Invalid phone format',
    invalid: 'Invalid input format'
  }
}

/**
 * Merges a custom i18n configuration with the default configuration
 * Custom values override default values
 * @param custom - Partial custom i18n configuration
 * @returns Complete merged i18n configuration
 */
export function mergeI18nConfig(
  custom?: Partial<FilterI18nConfig>
): FilterI18nConfig {
  if (!custom) {
    return defaultI18n
  }

  return {
    ...defaultI18n,
    ...custom,
    operators: {
      ...defaultI18n.operators,
      ...(custom.operators || {})
    },
    placeholders: {
      ...defaultI18n.placeholders,
      ...(custom.placeholders || {})
    },
    helpers: {
      ...defaultI18n.helpers,
      ...(custom.helpers || {})
    },
    validation: {
      ...defaultI18n.validation,
      ...(custom.validation || {})
    }
  }
}

/**
 * Determines badge size based on filter size
 * @param size - Filter size
 * @returns Badge size
 */
export function getBadgeSize(size: FiltersSize): 'md' | 'lg' | 'xl' {
  switch (size) {
    case 'sm':
      return 'md'
    case 'md':
      return 'lg'
    case 'lg':
      return 'xl'
  }
}
