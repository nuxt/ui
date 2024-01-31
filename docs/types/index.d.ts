export interface HomeProBlock {
  id?: string
  to?: string
  name?: string
  description?: string
  slot?: string
  class: string
  style?: any
  inactive?: boolean
  transparent?: boolean
  children?: ProBlock[]
}
