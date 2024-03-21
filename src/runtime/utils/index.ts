export function pick<Data extends object, Keys extends keyof Data> (data: Data, keys: Keys[]): Pick<Data, Keys> {
  const result = {} as Pick<Data, Keys>

  for (const key of keys) {
    result[key] = data[key]
  }

  return result
}

export function omit<Data extends object, Keys extends keyof Data> (data: Data, keys: Keys[]): Omit<Data, Keys> {
  const result = { ...data }

  for (const key of keys) {
    delete result[key]
  }

  return result as Omit<Data, Keys>
}

export function looseToNumber (val: any): any {
  const n = parseFloat(val)
  return isNaN(n) ? val : n
}
