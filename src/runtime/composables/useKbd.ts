import { createSharedComposable } from '@vueuse/core'
import { ref, computed, onMounted } from 'vue'

type KbdSpecificMap = {
  meta: string
  alt: string
  ctrl: string
}

export const kbdKeysMap = {
  meta: '',
  ctrl: '',
  alt: '',
  win: '⊞',
  command: '⌘',
  shift: '⇧',
  option: '⌥',
  enter: '↵',
  delete: '⌦',
  backspace: '⌫',
  escape: '⎋',
  tab: '⇥',
  capslock: '⇪',
  arrowup: '↑',
  arrowright: '→',
  arrowdown: '↓',
  arrowleft: '←',
  pageup: '⇞',
  pagedown: '⇟',
  home: '↖',
  end: '↘'
}

export const kbdKeysSpecificMap: Record<string, KbdSpecificMap> = {
  macOS: {
    meta: kbdKeysMap.command,
    alt: kbdKeysMap.option,
    ctrl: '⌃'
  },
  other: {
    meta: kbdKeysMap.win,
    alt: 'alt',
    ctrl: 'ctrl'
  }
}

export type KbdKey = keyof typeof kbdKeysMap
export type KbdKeySpecific = keyof KbdSpecificMap

const _useKbd = () => {
  const macOS = computed(() => import.meta.client && navigator && navigator.userAgent && navigator.userAgent.match(/Macintosh;/))

  const metaSymbol = ref(' ')

  onMounted(() => {
    metaSymbol.value = getKbdKey('meta')!
  })

  function getKbdKey(value?: KbdKey | string) {
    if (!value) {
      return
    }

    if (['meta', 'alt', 'ctrl'].includes(value)) {
      return kbdKeysSpecificMap[macOS.value ? 'macOS' : 'other'][value as KbdKeySpecific]
    }

    return kbdKeysMap[value as KbdKey] || value.toUpperCase()
  }

  return {
    macOS,
    metaSymbol,
    getKbdKey
  }
}

export const useKbd = createSharedComposable(_useKbd)
