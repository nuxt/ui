export interface ModelModifiers<T = any> {
  nullable?: null extends T ? boolean : false
  number?: number extends T ? boolean : false
  string?: string extends T ? boolean : false
  trim?: string extends T ? boolean : false

  optional?: boolean
  lazy?: boolean
}
