export type LocalePair = {
  inputMenu: {
    noMatch: string
    noData: string
  }
  commandPalette: {
    noMatch: string
    noData: string
    close: string
  }
  selectMenu: {
    noMatch: string
    noData: string
  }
  toast: {
    close: string
  }
  carousel: {
    prev: string
    next: string
    goto: string
  }
  modal: {
    close: string
  }
  slideover: {
    close: string
  }
  alert: {
    close: string
  }
  table: {
    noData: string
  }
}

export type Locale = {
  name: string
  ui: LocalePair
}
