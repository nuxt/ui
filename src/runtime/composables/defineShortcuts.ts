import { ref, computed, toValue } from 'vue'
import type { MaybeRef } from 'vue'
import { useEventListener, useDebounceFn } from '@vueuse/core'
import { useShortcuts } from './useShortcuts'

type Handler = () => void

export interface ShortcutConfig {
  handler: Handler
  usingInput?: string | boolean
}

export interface ShortcutsConfig {
  [key: string]: ShortcutConfig | Handler | false | null | undefined
}

export interface ShortcutsOptions {
  chainDelay?: number
}

interface Shortcut {
  handler: Handler
  enabled: boolean
  chained: boolean
  // KeyboardEvent attributes
  key: string
  ctrlKey: boolean
  metaKey: boolean
  shiftKey: boolean
  altKey: boolean
  // code?: string
  // keyCode?: number
}

const chainedShortcutRegex = /^[^-]+.*-.*[^-]+$/
const combinedShortcutRegex = /^[^_]+.*_.*[^_]+$/

export const defineShortcuts = (config: MaybeRef<ShortcutsConfig>, options: ShortcutsOptions = {}) => {
  const { macOS, usingInput } = useShortcuts()

  const chainedInputs = ref<string[]>([])
  const clearChainedInput = () => {
    chainedInputs.value.splice(0, chainedInputs.value.length)
  }
  const debouncedClearChainedInput = useDebounceFn(clearChainedInput, options.chainDelay ?? 800)

  const onKeyDown = (e: KeyboardEvent) => {
    // Input autocomplete triggers a keydown event
    if (!e.key) {
      return
    }

    const alphabeticalKey = /^[a-z]{1}$/i.test(e.key)

    let chainedKey
    chainedInputs.value.push(e.key)
    // try matching a chained shortcut
    if (chainedInputs.value.length >= 2) {
      chainedKey = chainedInputs.value.slice(-2).join('-')

      for (const shortcut of shortcuts.value.filter(s => s.chained)) {
        if (shortcut.key !== chainedKey) {
          continue
        }

        if (shortcut.enabled) {
          e.preventDefault()
          shortcut.handler()
        }
        clearChainedInput()
        return
      }
    }

    // try matching a standard shortcut
    for (const shortcut of shortcuts.value.filter(s => !s.chained)) {
      if (e.key.toLowerCase() !== shortcut.key) {
        continue
      }
      if (e.metaKey !== shortcut.metaKey) {
        continue
      }
      if (e.ctrlKey !== shortcut.ctrlKey) {
        continue
      }
      // shift modifier is only checked in combination with alphabetical keys
      // (shift with non-alphabetical keys would change the key)
      if (alphabeticalKey && e.shiftKey !== shortcut.shiftKey) {
        continue
      }
      // alt modifier changes the combined key anyways
      // if (e.altKey !== shortcut.altKey) { continue }

      if (shortcut.enabled) {
        e.preventDefault()
        shortcut.handler()
      }
      clearChainedInput()
      return
    }

    debouncedClearChainedInput()
  }

  // Map config to full detailled shortcuts
  const shortcuts = computed<Shortcut[]>(() => {
    return Object.entries(toValue(config)).map(([key, shortcutConfig]) => {
      if (!shortcutConfig) {
        return null
      }

      // Parse key and modifiers
      let shortcut: Partial<Shortcut>

      if (key.includes('-') && key !== '-' && !key.match(chainedShortcutRegex)?.length) {
        console.trace(`[Shortcut] Invalid key: "${key}"`)
      }

      if (key.includes('_') && key !== '_' && !key.match(combinedShortcutRegex)?.length) {
        console.trace(`[Shortcut] Invalid key: "${key}"`)
      }

      const chained = key.includes('-') && key !== '-'
      if (chained) {
        shortcut = {
          key: key.toLowerCase(),
          metaKey: false,
          ctrlKey: false,
          shiftKey: false,
          altKey: false
        }
      } else {
        const keySplit = key.toLowerCase().split('_').map(k => k)
        shortcut = {
          key: keySplit.filter(k => !['meta', 'ctrl', 'shift', 'alt'].includes(k)).join('_'),
          metaKey: keySplit.includes('meta'),
          ctrlKey: keySplit.includes('ctrl'),
          shiftKey: keySplit.includes('shift'),
          altKey: keySplit.includes('alt')
        }
      }
      shortcut.chained = chained

      // Convert Meta to Ctrl for non-MacOS
      if (!macOS.value && shortcut.metaKey && !shortcut.ctrlKey) {
        shortcut.metaKey = false
        shortcut.ctrlKey = true
      }

      // Retrieve handler function
      if (typeof shortcutConfig === 'function') {
        shortcut.handler = shortcutConfig
      } else if (typeof shortcutConfig === 'object') {
        shortcut = { ...shortcut, handler: shortcutConfig.handler }
      }

      if (!shortcut.handler) {
        console.trace('[Shortcut] Invalid value')
        return null
      }

      let enabled = true
      if (!(shortcutConfig as ShortcutConfig).usingInput) {
        enabled = !usingInput.value
      } else if (typeof (shortcutConfig as ShortcutConfig).usingInput === 'string') {
        enabled = usingInput.value === (shortcutConfig as ShortcutConfig).usingInput
      }
      shortcut.enabled = enabled

      return shortcut
    }).filter(Boolean) as Shortcut[]
  })

  useEventListener('keydown', onKeyDown)
}
