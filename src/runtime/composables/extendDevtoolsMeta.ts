export type DevtoolsMeta<T> = {
  defaultProps?: T
  example?: string
  ignore?: boolean
}

export function extendDevtoolsMeta<T>(_meta: DevtoolsMeta<T>) { }
