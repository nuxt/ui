export interface TableRow {
  [key: string]: any
}

export interface TableColumn {
  key: string
  sortable?: boolean
  sort?: (a: any, b: any, direction: 'asc' | 'desc') => number
  direction?: 'asc' | 'desc'
  class?: string
  rowClass?: string
  [key: string]: any
}

export interface Expanded<T> {
  openedRows: T[]
  row: T | null
}
