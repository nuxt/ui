export type TranslatePair = {
  [key: string]: string | string[] | TranslatePair
}

export type Language = {
  name: string
  ui: TranslatePair
}
