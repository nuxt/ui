import { computed } from 'vue'
import { createSharedComposable, useMounted } from '@vueuse/core'

type KbdKeysSpecificMap = {
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
  control: '⌃',
  option: '⌥',
  enter: '↵',
  delete: '⌦',
  backspace: '⌫',
  escape: 'Esc',
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

export type KbdKey = keyof typeof kbdKeysMap
export type KbdKeySpecific = keyof KbdKeysSpecificMap

const _useKbd = () => {
  const macOS = computed(() => import.meta.client && navigator && navigator.userAgent && navigator.userAgent.match(/Macintosh;/))

  const kbdKeysSpecificMap = computed<KbdKeysSpecificMap>(() => ({
    meta: macOS.value ? kbdKeysMap.command : 'Ctrl',
    ctrl: macOS.value ? kbdKeysMap.control : 'Ctrl',
    alt: macOS.value ? kbdKeysMap.option : 'Alt'
  }))

  return {
    macOS,
    kbdKeysSpecificMap
  }
}

const useSharedKbd = /* @__PURE__ */ createSharedComposable(_useKbd)

export function useKbd() {
  const { macOS, kbdKeysSpecificMap } = useSharedKbd()
  // Platform-specific keys resolve after mount to match the server-rendered placeholder.
  const mounted = useMounted()

  function getKbdKey(value?: KbdKey | string) {
    if (!value) {
      return
    }

    if (['meta', 'alt', 'ctrl'].includes(value)) {
      return mounted.value ? kbdKeysSpecificMap.value[value as KbdKeySpecific] : ' '
    }

    return kbdKeysMap[value as KbdKey] || value
  }

  return {
    macOS,
    getKbdKey
  }
}
