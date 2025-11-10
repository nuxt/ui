import type { FilterFieldsConfig, FilterFieldConfig, FilterFieldGroup } from '../types/filter'

/**
 * Utilities for manipulating field configurations
 * Handles flattening, searching, and grouping of fields
 */

/**
 * Recursively processes a list of fields by applying a callback function
 * Allows traversing fields and their children recursively
 */
function processFieldsRecursively(
  fields: FilterFieldConfig[],
  onField: (field: FilterFieldConfig) => void
) {
  for (const field of fields) {
    onField(field)
    if (field.children && field.children.length > 0) {
      processFieldsRecursively(field.children, onField)
    }
  }
}

/**
 * Flattens a field configuration into a simple array
 * Converts groups and nested fields into a flat list
 * @param config - Field configuration (simple or grouped)
 * @returns Flat array of all fields that have a defined type
 */
export function flattenFieldsConfig(
  config: FilterFieldsConfig
): FilterFieldConfig[] {
  const flatFields: FilterFieldConfig[] = []

  const collect = (fields: FilterFieldConfig[]) => {
    processFieldsRecursively(fields, (field) => {
      if (field.type) {
        flatFields.push(field)
      }
    })
  }

  if (Array.isArray(config)) {
    collect(config as FilterFieldConfig[])
  } else {
    const groups = config as FilterFieldGroup[]
    for (const group of groups) {
      collect(group.fields)
    }
  }

  return flatFields
}

/**
 * Searches for a field by its key in the configuration
 * @param config - Field configuration
 * @param key - Key of the field to search for
 * @returns The found field configuration, or undefined
 */
export function findFieldConfig(
  config: FilterFieldsConfig,
  key: string
): FilterFieldConfig | undefined {
  const fields = flattenFieldsConfig(config)
  return fields.find(field => field.key === key)
}

/**
 * Extracts groups from a field configuration
 * @param config - Field configuration
 * @returns Array of groups (empty if config is not grouped)
 */
export function getFieldGroups(config: FilterFieldsConfig): FilterFieldGroup[] {
  if (Array.isArray(config)) {
    return []
  }
  return config as FilterFieldGroup[]
}

/**
 * Checks if a configuration contains groups
 * @param config - Field configuration
 * @returns true if the configuration is grouped, false otherwise
 */
export function hasGroups(config: FilterFieldsConfig): boolean {
  if (Array.isArray(config)) {
    return false
  }
  const groups = config as FilterFieldGroup[]
  return groups.length > 0 && groups[0] !== undefined && 'group' in groups[0]
}

/**
 * Creates a map of fields indexed by their key for quick access
 * @param config - Field configuration
 * @returns Object with field keys as properties
 */
export function getFieldsMap(config: FilterFieldsConfig): Record<string, FilterFieldConfig> {
  const flatFields = flattenFieldsConfig(config)
  return flatFields.reduce(
    (acc, field) => {
      if (field.key) {
        acc[field.key] = field
      }
      return acc
    },
    {} as Record<string, FilterFieldConfig>
  )
}

/**
 * Collects all fields from a configuration, including those without a type
 * Differs from flattenFieldsConfig which only returns fields with a type
 * @param config - Field configuration
 * @returns Array of all fields (including separators and parent fields)
 */
export function collectAllFields(config: FilterFieldsConfig): FilterFieldConfig[] {
  const allFields: FilterFieldConfig[] = []

  const collect = (fields: FilterFieldConfig[]) => {
    processFieldsRecursively(fields, (field) => {
      allFields.push(field)
    })
  }

  if (Array.isArray(config)) {
    collect(config as FilterFieldConfig[])
  } else {
    const groups = config as FilterFieldGroup[]
    for (const group of groups) {
      collect(group.fields)
    }
  }

  return allFields
}
