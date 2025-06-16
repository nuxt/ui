import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Հայերեն',
  code: 'hy',
  messages: {
    inputMenu: {
      noMatch: 'Համընկնումներ չեն գտնվել',
      noData: 'Տվյալներ չկան',
      create: 'Ստեղծել "{label}"'
    },
    calendar: {
      prevYear: 'Նախորդ տարի',
      nextYear: 'Հաջորդ տարի',
      prevMonth: 'Նախորդ ամիս',
      nextMonth: 'Հաջորդ ամիս'
    },
    inputNumber: {
      increment: 'Ավելացնել',
      decrement: 'Պակասեցնել'
    },
    fileUpload: {
      empty: 'Հայտնաբերել կամ քաշել ֆայլերը այստեղ',
      removeAll: 'Հեռացնել բոլորը',
      addFiles: 'Ավելացնել ֆայլ(եր)',
      actions: 'Ֆայլեր'
    },
    commandPalette: {
      placeholder: 'Մուտքագրեք հրաման կամ որոնեք...',
      noMatch: 'Համընկնումներ չեն գտնվել',
      noData: 'Տվյալներ չկան',
      close: 'Փակել',
      back: 'Հետ'
    },
    selectMenu: {
      noMatch: 'Համընկնումներ չեն գտնվել',
      noData: 'Տվյալներ չկան',
      create: 'Ստեղծել "{label}"',
      search: 'Որոնում...'
    },
    toast: {
      close: 'Փակել'
    },
    carousel: {
      prev: 'Հետ',
      next: 'Առաջ',
      goto: 'Անցնել {slide}-ին'
    },
    modal: {
      close: 'Փակել'
    },
    slideover: {
      close: 'Փակել'
    },
    alert: {
      close: 'Փակել'
    },
    table: {
      noData: 'Տվյալներ չկան'
    }
  }
})
