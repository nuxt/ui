import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Български',
  code: 'bg',
  messages: {
    alert: {
      close: 'Затворете'
    },
    authForm: {
      hidePassword: 'Скрий паролата',
      showPassword: 'Покажи паролата',
      submit: 'Продължи'
    },
    banner: {
      close: 'Затвори'
    },
    calendar: {
      nextMonth: 'Следващ месец',
      nextYear: 'Следваща година',
      prevMonth: 'Предишен месец',
      prevYear: 'Предишна година'
    },
    carousel: {
      dots: 'Изберете слайд за показване',
      goto: 'Отидете на слайд {slide}',
      next: 'Напред',
      prev: 'Назад'
    },
    chatPrompt: {
      placeholder: 'Въведете съобщение…'
    },
    chatPromptSubmit: {
      label: 'Изпрати'
    },
    colorMode: {
      dark: 'Тъмно',
      light: 'Светло',
      switchToDark: 'Превключи към тъмен режим',
      switchToLight: 'Превключи към светъл режим',
      system: 'Система'
    },
    commandPalette: {
      back: 'Назад',
      close: 'Затворете',
      noData: 'Няма данни',
      noMatch: 'Няма съвпадение на данни',
      placeholder: 'Въведете команда или потърсете…'
    },
    contentSearch: {
      links: 'Връзки',
      theme: 'Тема'
    },
    contentSearchButton: {
      label: 'Търсене'
    },
    contentToc: {
      title: 'Съдържание'
    },
    dashboardSearch: {
      theme: 'Тема'
    },
    dashboardSearchButton: {
      label: 'Търсене'
    },
    dashboardSidebarCollapse: {
      collapse: 'Свий',
      expand: 'Разшири'
    },
    dashboardSidebarToggle: {
      close: 'Затвори',
      open: 'Отвори'
    },
    error: {
      clear: 'Изчисти'
    },
    fileUpload: {
      removeFile: 'Премахни {filename}'
    },
    header: {
      close: 'Затвори',
      open: 'Отвори'
    },
    inputMenu: {
      create: 'Създайте "{label}"',
      noData: 'Няма данни',
      noMatch: 'Няма съвпадение на данни'
    },
    inputNumber: {
      decrement: 'Намаляване',
      increment: 'Увеличаване'
    },
    modal: {
      close: 'Затворете'
    },
    pricingTable: {
      caption: 'Ценова таблица'
    },
    prose: {
      codeCollapse: {
        closeText: 'Сгъни',
        name: 'код',
        openText: 'Разгъни'
      },
      collapsible: {
        closeText: 'Скрий',
        name: 'свойства',
        openText: 'Покажи'
      },
      pre: {
        copy: 'Копирай кода в клипборда'
      }
    },
    selectMenu: {
      create: 'Създайте "{label}"',
      noData: 'Няма данни',
      noMatch: 'Няма съвпадение на данни',
      search: 'Потърсете…'
    },
    slideover: {
      close: 'Затворете'
    },
    table: {
      noData: 'Няма данни'
    },
    toast: {
      close: 'Затворете'
    }
  }
})
