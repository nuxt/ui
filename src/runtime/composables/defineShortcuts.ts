import { ref, computed } from 'vue'
import type { ComputedRef, WatchSource } from 'vue'
import { logicAnd, logicNot } from '@vueuse/math'
import { useEventListener, useDebounceFn } from '@vueuse/core'
import { useShortcuts } from './useShortcuts'

export interface ShortcutConfig {
  handler: Function
  usingInput?: string | boolean
  whenever?: WatchSource<boolean>[]
}

export interface ShortcutsConfig {
  [key: string]: ShortcutConfig | Function
}

export interface ShortcutsOptions {
  chainDelay?: number
}

interface Shortcut {
  handler: Function
  condition: ComputedRef<boolean>
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

// eslint-disable-next-line regexp/no-super-linear-backtracking
const chainedShortcutRegex = /^[^-]+.*-.*[^-]+$/
// eslint-disable-next-line regexp/no-super-linear-backtracking
const combinedShortcutRegex = /^[^_]+.*_.*[^_]+$/

export const defineShortcuts = (config: ShortcutsConfig, options: ShortcutsOptions = {}) => {
  const { macOS, usingInput } = useShortcuts()

  let shortcuts: Shortcut[] = []

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

    const alphabeticalKey = /^[a-z]$/i.test(e.key)

    let chainedKey
    chainedInputs.value.push(e.key)
    // try matching a chained shortcut
    if (chainedInputs.value.length >= 2) {
      chainedKey = chainedInputs.value.slice(-2).join('-')

      for (const shortcut of shortcuts.filter(s => s.chained)) {
        if (shortcut.key !== chainedKey) {
          continue
        }

        if (shortcut.condition.value) {
          e.preventDefault()
          shortcut.handler()
        }
        clearChainedInput()
        return
      }
    }

    // try matching a standard shortcut
    for (const shortcut of shortcuts.filter(s => !s.chained)) {
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

      if (shortcut.condition.value) {
        e.preventDefault()
        shortcut.handler()
      }
      clearChainedInput()
      return
    }

    debouncedClearChainedInput()
  }

  // Map config to full detailled shortcuts
  shortcuts = Object.entries(config).map(([key, shortcutConfig]) => {
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

    // Create shortcut computed
    const conditions: ComputedRef<boolean>[] = []
    if (!(shortcutConfig as ShortcutConfig).usingInput) {
      conditions.push(logicNot(usingInput))
    } else if (typeof (shortcutConfig as ShortcutConfig).usingInput === 'string') {
      conditions.push(computed(() => usingInput.value === (shortcutConfig as ShortcutConfig).usingInput))
    }
    shortcut.condition = logicAnd(...conditions, ...((shortcutConfig as ShortcutConfig).whenever || []))

    return shortcut as Shortcut
  }).filter(Boolean) as Shortcut[]

  useEventListener('keydown', onKeyDown)
}
