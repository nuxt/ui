export interface ProComponent {
  to?: string
  name?: string
  slot?: string
  class?: string
  inactive?: boolean
  transparent?: boolean
  children?: ProComponent[]
}
