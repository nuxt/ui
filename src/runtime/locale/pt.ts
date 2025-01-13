import { defineLocale } from '../composables/defineLocale'

export default defineLocale({
  name: 'Português',
  code: 'pt',
  messages: {
    inputMenu: {
      noMatch: 'Nenhum dado correspondente',
      noData: 'Sem dados',
      create: 'Criar "{label}"'
    },
    calendar: {
      prevYear: 'Ano anterior',
      nextYear: 'Próximo ano',
      prevMonth: 'Mês anterior',
      nextMonth: 'Próximo mês'
    },
    inputNumber: {
      increment: 'Incrementar',
      decrement: 'Decrementar'
    },
    commandPalette: {
      placeholder: 'Digite um comando ou pesquise...',
      noMatch: 'Nenhum dado correspondente',
      noData: 'Sem dados',
      close: 'Fechar'
    },
    selectMenu: {
      noMatch: 'Nenhum dado correspondente',
      noData: 'Sem dados',
      create: 'Criar "{label}"',
      search: 'Buscar...'
    },
    toast: {
      close: 'Fechar'
    },
    carousel: {
      prev: 'Anterior',
      next: 'Próximo',
      goto: 'Ir ao diapositivo {slide}'
    },
    modal: {
      close: 'Fechar'
    },
    slideover: {
      close: 'Fechar'
    },
    alert: {
      close: 'Fechar'
    },
    table: {
      noData: 'Sem dados'
    }
  }
})
