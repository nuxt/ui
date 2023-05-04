import type { ComputedRef, WatchSource } from 'vue'
import { logicAnd, logicNot } from '@vueuse/math'
import { useEventListener } from '@vueuse/core'
import { computed } from 'vue'
import { useShortcuts } from './useShortcuts'

export interface ShortcutConfig {
  handler: Function
  usingInput?: string | boolean
  whenever?: WatchSource<Boolean>[]
}

export interface ShortcutsConfig {
  [key: string]: ShortcutConfig | Function
}

interface Shortcut {
  handler: Function
  condition: ComputedRef<Boolean>
  // KeyboardEvent attributes
  key: string
  ctrlKey: boolean
  metaKey: boolean
  shiftKey: boolean
  altKey: boolean
  // code?: string
  // keyCode?: number
}

export const defineShortcuts = (config: ShortcutsConfig) => {
  const { macOS, usingInput } = useShortcuts()

  let shortcuts: Shortcut[] = []

  const onKeyDown = (e: KeyboardEvent) => {
    const alphabeticalKey = /^[a-z]{1}$/i.test(e.key)

    for (const shortcut of shortcuts) {
      if (e.key.toLowerCase() !== shortcut.key) { continue }
      if (e.metaKey !== shortcut.metaKey) { continue }
      if (e.ctrlKey !== shortcut.ctrlKey) { continue }
      // shift modifier is only checked in combination with alphabetical keys
      // (shift with non-alphabetical keys would change the key)
      if (alphabeticalKey && e.shiftKey !== shortcut.shiftKey) { continue }
      // alt modifier changes the combined key anyways
      // if (e.altKey !== shortcut.altKey) { continue }

      if (shortcut.condition.value) {
        e.preventDefault()
        shortcut.handler()
      }
      return
    }
  }

  // Map config to full detailled shortcuts
  shortcuts = Object.entries(config).map(([key, shortcutConfig]) => {
    if (!shortcutConfig) {
      return null
    }

    // Parse key and modifiers
    const keySplit = key.toLowerCase().split('_').map(k => k)
    let shortcut: Partial<Shortcut> = {
      key: keySplit.filter(k => !['meta', 'ctrl', 'shift', 'alt'].includes(k)).join('_'),
      metaKey: keySplit.includes('meta'),
      ctrlKey: keySplit.includes('ctrl'),
      shiftKey: keySplit.includes('shift'),
      altKey: keySplit.includes('alt')
    }

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
    const conditions: ComputedRef<Boolean>[] = []
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
