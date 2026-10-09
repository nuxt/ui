import type { Messages } from '../types/locale'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Español',
  code: 'es',
  messages: {
    alert: {
      close: 'Cerrar'
    },
    authForm: {
      hidePassword: 'Ocultar contraseña',
      showPassword: 'Mostrar contraseña',
      submit: 'Continuar'
    },
    banner: {
      close: 'Cerrar'
    },
    breadcrumb: {
      label: 'ruta de navegación'
    },
    calendar: {
      label: 'Fecha del evento',
      monthPicker: 'Selector de mes',
      nextMonth: 'Mes siguiente',
      nextYear: 'Año siguiente',
      prevMonth: 'Mes anterior',
      prevYear: 'Año anterior',
      yearPicker: 'Selector de año'
    },
    carousel: {
      dots: 'Elegir diapositiva a mostrar',
      goto: 'Ir a la diapositiva {slide}',
      next: 'Siguiente',
      prev: 'Anterior',
      roledescription: 'carrusel',
      slide: 'diapositiva'
    },
    chatMessages: {
      autoScroll: 'Desplazarse hacia abajo'
    },
    chatPrompt: {
      placeholder: 'Escribe tu mensaje aquí…'
    },
    chatPromptSubmit: {
      label: 'Enviar',
      reload: 'Reintentar',
      stop: 'Detener generación'
    },
    chatReasoning: {
      thinking: 'Pensando…',
      thought: 'Pensó',
      thoughtFor: 'Pensó durante {duration}'
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
      close: 'Cerrar',
      noData: 'Sin datos',
      noMatch: 'No hay datos coincidentes',
      placeholder: 'Escribe un comando o busca…'
    },
    contentSearch: {
      links: 'Enlaces',
      search: 'Resultados',
      theme: 'Tema'
    },
    contentSearchButton: {
      label: 'Buscar…'
    },
    contentToc: {
      title: 'En esta página'
    },
    dropdownMenu: {
      noMatch: 'No hay datos coincidentes',
      search: 'Buscar…'
    },
    dashboardSearch: {
      theme: 'Tema'
    },
    dashboardSearchButton: {
      label: 'Buscar…'
    },
    dashboardSidebarCollapse: {
      collapse: 'Colapsar barra lateral',
      expand: 'Expandir barra lateral'
    },
    dashboardSidebarToggle: {
      close: 'Cerrar barra lateral',
      open: 'Abrir barra lateral'
    },
    drawer: {
      close: 'Cerrar'
    },
    error: {
      clear: 'Volver al inicio'
    },
    fileUpload: {
      removeFile: 'Eliminar {filename}'
    },
    header: {
      close: 'Cerrar menú',
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
      timeZoneName: 'zona horaria',
      year: 'año'
    },
    inputMenu: {
      create: 'Crear "{label}"',
      noData: 'Sin datos',
      noMatch: 'No hay datos coincidentes'
    },
    inputNumber: {
      decrement: 'Decrementar',
      increment: 'Incrementar'
    },
    inputRating: {
      rate: 'Valorar {value} de {length}'
    },
    inputTime: {
      dayPeriod: 'AM/PM',
      hour: 'hora',
      minute: 'minuto',
      second: 'segundo',
      timeZoneName: 'zona horaria'
    },
    listbox: {
      noData: 'Sin datos',
      noMatch: 'No hay datos coincidentes',
      search: 'Buscar…'
    },
    modal: {
      close: 'Cerrar'
    },
    pagination: {
      first: 'Primera página',
      last: 'Última página',
      next: 'Página siguiente',
      page: 'Página {page}',
      prev: 'Página anterior'
    },
    pinInput: {
      input: 'código PIN, carácter {index} de {length}'
    },
    pricingTable: {
      caption: 'Comparación de planes de precios'
    },
    prose: {
      codeCollapse: {
        closeText: 'Colapsar',
        name: 'código',
        openText: 'Expandir'
      },
      collapsible: {
        closeText: 'Ocultar',
        name: 'propiedades',
        openText: 'Mostrar'
      },
      pre: {
        copy: 'Copiar código al portapapeles'
      },
      prompt: {
        copy: 'Copiar prompt',
        openIn: 'Abrir en {name}'
      }
    },
    sidebar: {
      close: 'Cerrar',
      toggle: 'Alternar'
    },
    selectMenu: {
      create: 'Crear "{label}"',
      noData: 'Sin datos',
      noMatch: 'No hay datos coincidentes',
      search: 'Buscar…'
    },
    skeleton: {
      label: 'cargando'
    },
    slideover: {
      close: 'Cerrar'
    },
    slider: {
      max: 'Máximo',
      min: 'Mínimo',
      thumb: 'Control deslizante',
      value: 'Valor {index} de {total}'
    },
    table: {
      noData: 'Sin datos'
    },
    toast: {
      close: 'Cerrar'
    },
    toaster: {
      label: 'Notificación',
      viewport: 'Notificaciones ({hotkey})'
    }
  }
})
