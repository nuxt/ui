import { defineLocale } from '../composables/defineLocale'

export default defineLocale({
  name: 'Español',
  code: 'es',
  messages: {
    inputMenu: {
      noMatch: 'No hay datos coincidentes',
      noData: 'Sin datos',
      create: 'Crear "{label}"'
    },
    calendar: {
      prevYear: 'A o anterior',
      nextYear: 'A o siguiente',
      prevMonth: 'Mes anterior',
      nextMonth: 'Mes siguiente'
    },
    inputNumber: {
      increment: 'Incremento',
      decrement: 'Decremento'
    },
    commandPalette: {
      noMatch: 'No hay datos coincidentes',
      noData: 'Sin datos',
      close: 'Cerrar'
    },
    selectMenu: {
      noMatch: 'No hay datos coincidentes',
      noData: 'Sin datos',
      create: 'Crear "{label}"'
    },
    toast: {
      close: 'Cerrar'
    },
    carousel: {
      prev: 'Anterior',
      next: 'Siguiente',
      goto: 'Ir a la diapositiva {slide}'
    },
    modal: {
      close: 'Cerrar'
    },
    slideover: {
      close: 'Cerrar'
    },
    alert: {
      close: 'Cerrar'
    },
    table: {
      noData: 'Sin datos'
    }
  }
})
