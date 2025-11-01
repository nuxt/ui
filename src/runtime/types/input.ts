export interface ModelModifiers<T> {
  string?: boolean
  number?: boolean
  trim?: T extends string ? boolean : never
  lazy?: boolean
  nullable?: T extends null ? boolean : never
  optional?: T extends undefined ? boolean : never
}
