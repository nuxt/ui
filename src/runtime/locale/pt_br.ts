import { defineLocale } from '../composables/defineLocale'

export default defineLocale({
  name: 'Português (Brasil)',
  code: 'pt-BR',
  messages: {
    inputMenu: {
      noMatch: 'Nenhum dado correspondente',
      noData: 'Nenhum dado',
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
      noMatch: 'Nenhum dado correspondente',
      noData: 'Nenhum dado',
      close: 'Fechar'
    },
    selectMenu: {
      noMatch: 'Nenhum dado correspondente',
      noData: 'Nenhum dado',
      create: 'Criar "{label}"'
    },
    toast: {
      close: 'Fechar'
    },
    carousel: {
      prev: 'Anterior',
      next: 'Próximo',
      goto: 'Ir para a slide {slide}'
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
      noData: 'Nenhum dado'
    }
  }
})
