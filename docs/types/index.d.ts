export interface ProBlock {
  id?: string
  to?: string
  name?: string
  description?: string
  slot?: string
  class: string
  style?: string
  inactive?: boolean
  transparent?: boolean
  children?: ProBlock[]
}
