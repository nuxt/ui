export type Messages = {
  alert: {
    close: string
  }
  authForm: {
    submit: string
    hidePassword: string
    showPassword: string
  }
  banner: {
    close: string
  }
  calendar: {
    prevYear: string
    nextYear: string
    prevMonth: string
    nextMonth: string
  }
  carousel: {
    prev: string
    next: string
    dots: string
    goto: string
  }
  chatPrompt: {
    placeholder: string
  }
  chatPromptSubmit: {
    label: string
  }
  colorMode: {
    system: string
    light: string
    dark: string
    switchToLight: string
    switchToDark: string
  }
  commandPalette: {
    placeholder: string
    noMatch: string
    noData: string
    close: string
    back: string
  }
  contentSearch: {
    title?: string
    description?: string
    links: string
    theme: string
  }
  contentSearchButton: {
    label: string
  }
  contentToc: {
    title: string
  }
  dashboardSearch: {
    title?: string
    description?: string
    theme: string
  }
  dashboardSearchButton: {
    label: string
  }
  dashboardSidebar?: {
    title?: string
    description?: string
  }
  dashboardSidebarCollapse: {
    expand: string
    collapse: string
  }
  dashboardSidebarToggle: {
    close: string
    open: string
  }
  error: {
    clear: string
  }
  fileUpload: {
    removeFile: string
  }
  header: {
    title?: string
    description?: string
    close: string
    open: string
  }
  inputMenu: {
    noMatch: string
    noData: string
    create: string
  }
  inputNumber: {
    increment: string
    decrement: string
  }
  modal: {
    close: string
  }
  pricingTable: {
    caption: string
  }
  prose: {
    codeCollapse: {
      name: string
      openText: string
      closeText: string
    }
    collapsible: {
      name: string
      openText: string
      closeText: string
    }
    pre: {
      copy: string
    }
  }
  selectMenu: {
    noMatch: string
    noData: string
    create: string
    search: string
  }
  slideover: {
    close: string
  }
  table: {
    noData: string
  }
  toast: {
    close: string
  }
}

export type Direction = 'ltr' | 'rtl'

export type Locale<M> = {
  name: string
  code: string
  dir: Direction
  messages: M
}
