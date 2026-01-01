export interface ModelModifiers<T = any> {
  string?: string extends T ? boolean : never
  number?: number extends T ? boolean : never
  trim?: string extends T ? boolean : never
  lazy?: boolean
  nullable?: null extends T ? boolean : never
  optional?: boolean
}
