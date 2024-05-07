import type { Component } from 'vue'

export interface Slideover {
  ui?: any
  side?: 'right' | 'left'
  transition?: boolean
  appear?: boolean
  overlay?: boolean
  preventClose?: boolean
  modelValue?: boolean
}

export interface SlideoverState {
  id?: number
  isOpen: boolean
  component: Component | string
  props: Slideover
}