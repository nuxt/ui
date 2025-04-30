import { reactive, computed, onMounted } from 'vue'
import { createSharedComposable } from '@vueuse/core'

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

export type KbdKey = keyof typeof kbdKeysMap
export type KbdKeySpecific = keyof KbdKeysSpecificMap

const _useKbd = () => {
  const macOS = computed(() => import.meta.client && navigator && navigator.userAgent && navigator.userAgent.match(/Macintosh;/))

  const kbdKeysSpecificMap = reactive({
    meta: ' ',
    alt: ' ',
    ctrl: ' '
  })

  onMounted(() => {
    kbdKeysSpecificMap.meta = macOS.value ? kbdKeysMap.command : 'Ctrl'
    kbdKeysSpecificMap.ctrl = macOS.value ? kbdKeysMap.control : 'Ctrl'
    kbdKeysSpecificMap.alt = macOS.value ? kbdKeysMap.option : 'Alt'
  })

  function getKbdKey(value?: KbdKey | string) {
    if (!value) {
      return
    }

    if (['meta', 'alt', 'ctrl'].includes(value)) {
      return kbdKeysSpecificMap[value as KbdKeySpecific]
    }

    return kbdKeysMap[value as KbdKey] || value.toUpperCase()
  }

  return {
    macOS,
    getKbdKey
  }
}

export const useKbd = /* @__PURE__ */ createSharedComposable(_useKbd)
