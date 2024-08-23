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

export interface SlideoverInstance<T> {
  id: number,
  isOpen: boolean
  component: Component
  props: Slideover & T
  patch (props: Partial<Slideover & T>): void
  close: () => void,
}