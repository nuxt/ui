export type Messages = {
  alert: {
    close: string
  }
  authForm: {
    hidePassword: string
    showPassword: string
    submit: string
  }
  banner: {
    close: string
  }
  calendar: {
    nextMonth: string
    nextYear: string
    prevMonth: string
    prevYear: string
  }
  carousel: {
    dots: string
    goto: string
    next: string
    prev: string
  }
  chatPrompt: {
    placeholder: string
  }
  chatPromptSubmit: {
    label: string
  }
  colorMode: {
    dark: string
    light: string
    switchToDark: string
    switchToLight: string
    system: string
  }
  commandPalette: {
    back: string
    close: string
    noData: string
    noMatch: string
    placeholder: string
  }
  contentSearch: {
    description?: string
    links: string
    theme: string
    title?: string
  }
  contentSearchButton: {
    label: string
  }
  contentToc: {
    title: string
  }
  dashboardSearch: {
    description?: string
    theme: string
    title?: string
  }
  dashboardSearchButton: {
    label: string
  }
  dashboardSidebar?: {
    description?: string
    title?: string
  }
  dashboardSidebarCollapse: {
    collapse: string
    expand: string
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
    close: string
    description?: string
    open: string
    title?: string
  }
  inputMenu: {
    create: string
    noData: string
    noMatch: string
  }
  inputNumber: {
    decrement: string
    increment: string
  }
  modal: {
    close: string
  }
  pricingTable: {
    caption: string
  }
  prose: {
    codeCollapse: {
      closeText: string
      name: string
      openText: string
    }
    collapsible: {
      closeText: string
      name: string
      openText: string
    }
    pre: {
      copy: string
    }
  }
  selectMenu: {
    create: string
    noData: string
    noMatch: string
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
