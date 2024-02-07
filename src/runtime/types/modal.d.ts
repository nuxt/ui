import type { Component } from 'vue'

export interface Modal {
  appear?: boolean
  overlay?: boolean
  transition?: boolean
  preventClose?: boolean
  fullscreen?: boolean
  class?: string | Object | string[]
  ui?: any
  onClose?: () => void
  onClosePrevented?: () => void
}

export interface ModalState {
  component: Component | string
  props: Modal
}