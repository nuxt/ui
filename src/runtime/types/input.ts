export interface ModelModifiers<T = any> {
  string?: T extends string ? boolean : never
  number?: T extends number ? boolean : never
  trim?: T extends string ? boolean : never
  lazy?: boolean
  nullable?: T extends null ? boolean : never
  optional?: boolean
}
