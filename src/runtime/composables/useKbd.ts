import { computed, shallowRef, getCurrentInstance } from 'vue'
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

export const kbdKeysPlatformMap: Record<KbdKeySpecific, { macos: string, other: string }> = {
  meta: { macos: kbdKeysMap.command, other: 'Ctrl' },
  ctrl: { macos: kbdKeysMap.control, other: 'Ctrl' },
  alt: { macos: kbdKeysMap.option, other: 'Alt' }
}

const _useKbd = () => {
  const macOS = computed(() => import.meta.client && navigator && navigator.userAgent && navigator.userAgent.match(/Macintosh;/))

  if (import.meta.client && macOS.value) {
    document.documentElement.classList.add('ui-macos')
  }

  return {
    macOS
  }
}

const useSharedKbd = /* @__PURE__ */ createSharedComposable(_useKbd)

export function useKbd() {
  const { macOS } = useSharedKbd()
  // Platform-specific keys resolve after mount to match the server-rendered placeholder.
  // Outside of a component there is no mount to wait for.
  const mounted = getCurrentInstance() ? useMounted() : shallowRef(import.meta.client)

  function getKbdKey(value?: KbdKey | string) {
    if (!value) {
      return
    }

    if (['meta', 'alt', 'ctrl'].includes(value)) {
      return mounted.value ? kbdKeysPlatformMap[value as KbdKeySpecific][macOS.value ? 'macos' : 'other'] : ' '
    }

    return kbdKeysMap[value as KbdKey] || value
  }

  return {
    macOS,
    getKbdKey
  }
}
