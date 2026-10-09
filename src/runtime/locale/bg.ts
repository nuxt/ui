import type { Messages } from '../types/locale'
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
    breadcrumb: {
      label: 'навигационна пътека'
    },
    calendar: {
      label: 'Дата на събитието',
      monthPicker: 'Избор на месец',
      nextMonth: 'Следващ месец',
      nextYear: 'Следваща година',
      prevMonth: 'Предишен месец',
      prevYear: 'Предишна година',
      yearPicker: 'Избор на година'
    },
    carousel: {
      dots: 'Изберете слайд за показване',
      goto: 'Отидете на слайд {slide}',
      next: 'Напред',
      prev: 'Назад',
      roledescription: 'карусел',
      slide: 'слайд'
    },
    chatMessages: {
      autoScroll: 'Превърти надолу'
    },
    chatPrompt: {
      placeholder: 'Въведете съобщение…'
    },
    chatPromptSubmit: {
      label: 'Изпрати',
      reload: 'Опитай отново',
      stop: 'Спри генерирането'
    },
    chatReasoning: {
      thinking: 'Мисли…',
      thought: 'Помисли',
      thoughtFor: 'Мислил {duration}'
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
      search: 'Резултати',
      theme: 'Тема'
    },
    contentSearchButton: {
      label: 'Търсене'
    },
    contentToc: {
      title: 'Съдържание'
    },
    dropdownMenu: {
      noMatch: 'Няма съвпадение на данни',
      search: 'Потърсете…'
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
    drawer: {
      close: 'Затворете'
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
    inputDate: {
      day: 'ден',
      dayPeriod: 'AM/PM',
      era: 'ера',
      hour: 'час',
      minute: 'минута',
      month: 'месец',
      second: 'секунда',
      timeZoneName: 'часова зона',
      year: 'година'
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
    inputRating: {
      rate: 'Оценка {value} от {length}'
    },
    inputTime: {
      dayPeriod: 'AM/PM',
      hour: 'час',
      minute: 'минута',
      second: 'секунда',
      timeZoneName: 'часова зона'
    },
    listbox: {
      noData: 'Няма данни',
      noMatch: 'Няма съвпадение на данни',
      search: 'Потърсете…'
    },
    modal: {
      close: 'Затворете'
    },
    pagination: {
      first: 'Първа страница',
      last: 'Последна страница',
      next: 'Следваща страница',
      page: 'Страница {page}',
      prev: 'Предишна страница'
    },
    pinInput: {
      input: 'ПИН код, символ {index} от {length}'
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
      },
      prompt: {
        copy: 'Копирай подсказката',
        openIn: 'Отвори в {name}'
      }
    },
    sidebar: {
      close: 'Затворете',
      toggle: 'Превключване'
    },
    selectMenu: {
      create: 'Създайте "{label}"',
      noData: 'Няма данни',
      noMatch: 'Няма съвпадение на данни',
      search: 'Потърсете…'
    },
    skeleton: {
      label: 'зареждане'
    },
    slideover: {
      close: 'Затворете'
    },
    slider: {
      max: 'Максимум',
      min: 'Минимум',
      thumb: 'Плъзгач',
      value: 'Стойност {index} от {total}'
    },
    table: {
      noData: 'Няма данни'
    },
    toast: {
      close: 'Затворете'
    },
    toaster: {
      label: 'Известие',
      viewport: 'Известия ({hotkey})'
    }
  }
})
