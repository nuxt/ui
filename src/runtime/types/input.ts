export interface ModelModifiers<T = any> {
  string?: boolean
  number?: boolean
  trim?: T extends string ? boolean : never
  lazy?: boolean
  nullable?: T extends null ? boolean : never
  optional?: T extends undefined ? boolean : never
}
