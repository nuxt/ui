export type DevtoolsMeta<T> = {
  defaultProps?: T
  example?: string
  ignore?: boolean
}

export function extendComponentMeta<T>(_meta: DevtoolsMeta<T>) { }
