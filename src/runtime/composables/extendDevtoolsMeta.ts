export type DevtoolsMeta<T> = {
  defaultProps?: T
  example?: string
  ignore?: boolean
  ignoreProps?: string[]
}

export function extendDevtoolsMeta<T>(_meta: DevtoolsMeta<T>) { }
