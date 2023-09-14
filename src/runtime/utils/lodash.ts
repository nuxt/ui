type OmitObject<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export function omit<T extends Record<string, any>, K extends keyof T> (
  object: T,
  keysToOmit: K[] | any[]
): OmitObject<T, K> {
  const result = { ...object }

  for (const key of keysToOmit) {
    delete result[key]
  }

  return result as OmitObject<T, K>
}


type Path = (string | number)[] | string;

export function get (object: Record<string, any>, path: Path, defaultValue?: any): any {
  if (typeof path === 'string') {
    path = path.split('.').map(key => {
      const numKey = Number(key)
      return isNaN(numKey) ? key : numKey
    })
  }

  let result: any = object

  for (const key of path) {
    if (result === undefined || result === null) {
      return defaultValue
    }

    result = result[key]
  }

  return result !== undefined ? result : defaultValue
}
