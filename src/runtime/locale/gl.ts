import type { Messages } from '../types/locale'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Galego',
  code: 'gl',
  messages: {
    alert: {
      close: 'Pechar'
    },
    authForm: {
      hidePassword: 'Ocultar contrasinal',
      showPassword: 'Amosar contrasinal',
      submit: 'Continuar'
    },
    banner: {
      close: 'Pechar'
    },
    breadcrumb: {
      label: 'ruta de navegación'
    },
    calendar: {
      label: 'Data do evento',
      monthPicker: 'Selector de mes',
      nextMonth: 'Mes seguinte',
      nextYear: 'Ano seguinte',
      prevMonth: 'Mes anterior',
      prevYear: 'Ano anterior',
      yearPicker: 'Selector de ano'
    },
    carousel: {
      dots: 'Escoller diapositiva a amostrar',
      goto: 'Ir á diapositiva {slide}',
      next: 'Seguinte',
      prev: 'Anterior',
      roledescription: 'carrusel',
      slide: 'diapositiva'
    },
    chatMessages: {
      autoScroll: 'Desprazar cara abaixo'
    },
    chatPrompt: {
      placeholder: 'Escribe a túa mensaxe aquí…'
    },
    chatPromptSubmit: {
      label: 'Enviar',
      reload: 'Tentar de novo',
      stop: 'Deter a xeración'
    },
    chatReasoning: {
      thinking: 'Pensando…',
      thought: 'Pensou',
      thoughtFor: 'Pensou durante {duration}'
    },
    colorMode: {
      dark: 'Oscuro',
      light: 'Claro',
      switchToDark: 'Cambiar a modo oscuro',
      switchToLight: 'Cambiar a modo claro',
      system: 'Sistema'
    },
    commandPalette: {
      back: 'Atrás',
      close: 'Pechar',
      noData: 'Sen datos',
      noMatch: 'Non hai datos coincidentes',
      placeholder: 'Escribe un comando ou busca…'
    },
    contentSearch: {
      links: 'Ligazóns',
      search: 'Resultados',
      theme: 'Tema'
    },
    contentSearchButton: {
      label: 'Buscar…'
    },
    contentToc: {
      title: 'Nesta páxina'
    },
    dropdownMenu: {
      noMatch: 'Non hai datos coincidentes',
      search: 'Buscar…'
    },
    dashboardSearch: {
      theme: 'Tema'
    },
    dashboardSearchButton: {
      label: 'Buscar…'
    },
    dashboardSidebarCollapse: {
      collapse: 'Contraer barra lateral',
      expand: 'Despregar barra lateral'
    },
    dashboardSidebarToggle: {
      close: 'Pechar barra lateral',
      open: 'Abrir barra lateral'
    },
    drawer: {
      close: 'Pechar'
    },
    error: {
      clear: 'Volver ao inicio'
    },
    fileUpload: {
      removeFile: 'Eliminar {filename}'
    },
    header: {
      close: 'Pechar menú',
      open: 'Abrir menú'
    },
    inputDate: {
      day: 'día',
      dayPeriod: 'AM/PM',
      era: 'era',
      hour: 'hora',
      minute: 'minuto',
      month: 'mes',
      second: 'segundo',
      timeZoneName: 'fuso horario',
      year: 'ano'
    },
    inputMenu: {
      create: 'Crear "{label}"',
      noData: 'Sen datos',
      noMatch: 'Non hai datos coincidentes'
    },
    inputNumber: {
      decrement: 'Diminuír',
      increment: 'Aumentar'
    },
    inputRating: {
      rate: 'Valorar {value} de {length}'
    },
    inputTime: {
      dayPeriod: 'AM/PM',
      hour: 'hora',
      minute: 'minuto',
      second: 'segundo',
      timeZoneName: 'fuso horario'
    },
    listbox: {
      noData: 'Sen datos',
      noMatch: 'Non hai datos coincidentes',
      search: 'Buscar…'
    },
    modal: {
      close: 'Pechar'
    },
    pagination: {
      first: 'Primeira páxina',
      last: 'Última páxina',
      next: 'Páxina seguinte',
      page: 'Páxina {page}',
      prev: 'Páxina anterior'
    },
    pinInput: {
      input: 'código PIN, carácter {index} de {length}'
    },
    pricingTable: {
      caption: 'Comparación de plans de prezos'
    },
    prose: {
      codeCollapse: {
        closeText: 'Contraer',
        name: 'código',
        openText: 'Despregar'
      },
      collapsible: {
        closeText: 'Ocultar',
        name: 'propiedades',
        openText: 'Amosar'
      },
      pre: {
        copy: 'Copiar código ao portapapeis'
      },
      prompt: {
        copy: 'Copiar instrución',
        openIn: 'Abrir en {name}'
      }
    },
    sidebar: {
      close: 'Pechar',
      toggle: 'Alternar'
    },
    selectMenu: {
      create: 'Crear "{label}"',
      noData: 'Sen datos',
      noMatch: 'Non hai datos coincidentes',
      search: 'Buscar…'
    },
    skeleton: {
      label: 'cargando'
    },
    slideover: {
      close: 'Pechar'
    },
    slider: {
      max: 'Máximo',
      min: 'Mínimo',
      thumb: 'Control desprazable',
      value: 'Valor {index} de {total}'
    },
    table: {
      noData: 'Sen datos'
    },
    toast: {
      close: 'Pechar'
    },
    toaster: {
      label: 'Notificación',
      viewport: 'Notificacións ({hotkey})'
    }
  }
})
