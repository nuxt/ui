import type { Filter } from '../types/filter'

/**
 * Validation utilities and ID generation for filters
 * Provides functions to validate filters and their values
 */

/**
 * Generates a unique identifier for a filter
 * Combines timestamp and random string to ensure uniqueness
 * @returns Unique identifier in format "filter-{timestamp}-{random}"
 */
export function generateFilterId(): string {
  return `filter-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Validates that a filter contains all required properties
 * @param filter - Filter to validate
 * @returns true if the filter is valid, false otherwise
 */
export function validateFilter(filter: Filter): boolean {
  if (!filter.id || !filter.field || !filter.operator) {
    return false
  }
  return true
}

/**
 * Result of a validation with optional error message
 */
export interface ValidationResult {
  isValid: boolean
  errorMessage?: string | null
}

/**
 * Validates a filter value according to a regex pattern or custom validation function
 * @param value - Value to validate
 * @param pattern - Optional regex pattern for validation
 * @param validation - Optional custom validation function
 *   - Returns `undefined`, `null` or `false`: value is valid
 *   - Returns `true`: value is invalid (default error message)
 *   - Returns `string`: value is invalid with custom error message
 * @returns Validation result with optional error message
 */
export function validateFilterValue(
  value: unknown,
  pattern?: string,
  validation?: (value: unknown) => boolean | string | null | undefined
): ValidationResult {
  if (validation) {
    const result = validation(value)
    // undefined, null or false = valid (no need to return explicitly)
    if (result === undefined || result === null || result === false) {
      return { isValid: true }
    }
    // string = invalid with custom message
    if (typeof result === 'string') {
      return { isValid: false, errorMessage: result }
    }
    // true = invalid without custom message
    return { isValid: false }
  }
  if (pattern && typeof value === 'string') {
    const regex = new RegExp(pattern)
    const isValid = regex.test(value)
    return { isValid }
  }
  return { isValid: true }
}

/**
 * Validates email format
 * @param email - Email address to validate
 * @returns true if email is valid, false otherwise
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates URL format via regular expression
 * Allows URLs with or without schema (http, https)
 * Supports multiple subdomains (N subdomains)
 * @param url - URL to validate
 * @returns true if URL appears valid, false otherwise
 */
export function validateUrl(url: string): boolean {
  // Supports http(s)://, N subdomains, TLD 2+ characters, optionally a path
  const urlRegex = /^(?:https?:\/\/)?(?:[\w-]+\.)+[\w-]{2,}(?:\/\S*)?$/i
  return urlRegex.test(url)
}

/**
 * Validates phone number format
 * Accepts digits, spaces, dashes, parentheses and the + sign
 * @param tel - Phone number to validate
 * @returns true if number is valid, false otherwise
 */
export function validateTel(tel: string): boolean {
  const telRegex = /^[\d\s\-+()]+$/
  return telRegex.test(tel)
}
