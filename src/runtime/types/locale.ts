export type Messages = {
  inputMenu: {
    noMatch: string
    noData: string
    create: string
  }
  calendar: {
    prevYear: string
    nextYear: string
    prevMonth: string
    nextMonth: string
  }
  inputNumber: {
    increment: string
    decrement: string
  }
  commandPalette: {
    placeholder: string
    noMatch: string
    noData: string
    close: string
    back: string
  }
  selectMenu: {
    noMatch: string
    noData: string
    create: string
    search: string
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

export type Direction = 'ltr' | 'rtl'

export type Locale<M> = {
  name: string
  code: string
  dir: Direction
  messages: M
}
