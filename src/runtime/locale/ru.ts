import type { Messages } from '../types/locale'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Русский',
  code: 'ru',
  messages: {
    alert: {
      close: 'Закрыть'
    },
    authForm: {
      hidePassword: 'Скрыть пароль',
      showPassword: 'Показать пароль',
      submit: 'Продолжить'
    },
    banner: {
      close: 'Закрыть'
    },
    breadcrumb: {
      label: 'навигационная цепочка'
    },
    calendar: {
      label: 'Дата события',
      monthPicker: 'Выбор месяца',
      nextMonth: 'Следующий месяц',
      nextYear: 'Следующий год',
      prevMonth: 'Предыдущий месяц',
      prevYear: 'Предыдущий год',
      yearPicker: 'Выбор года'
    },
    carousel: {
      dots: 'Выберите слайд для отображения',
      goto: 'Перейти к {slide}',
      next: 'Далее',
      prev: 'Назад',
      roledescription: 'карусель',
      slide: 'слайд'
    },
    chatMessages: {
      autoScroll: 'Прокрутить вниз'
    },
    chatPrompt: {
      placeholder: 'Введите ваше сообщение здесь…'
    },
    chatPromptSubmit: {
      label: 'Отправить',
      reload: 'Повторить',
      stop: 'Остановить генерацию'
    },
    chatReasoning: {
      thinking: 'Размышляет…',
      thought: 'Размышление завершено',
      thoughtFor: 'Размышление заняло {duration}'
    },
    colorMode: {
      dark: 'Тёмная',
      light: 'Светлая',
      switchToDark: 'Переключиться на тёмный режим',
      switchToLight: 'Переключиться на светлый режим',
      system: 'Системная'
    },
    commandPalette: {
      back: 'Назад',
      close: 'Закрыть',
      noData: 'Нет данных',
      noMatch: 'Совпадений не найдено',
      placeholder: 'Введите команду или выполните поиск…'
    },
    contentSearch: {
      links: 'Ссылки',
      search: 'Результаты',
      theme: 'Тема'
    },
    contentSearchButton: {
      label: 'Поиск…'
    },
    contentToc: {
      title: 'На этой странице'
    },
    dropdownMenu: {
      noMatch: 'Совпадений не найдено',
      search: 'Поиск…'
    },
    dashboardSearch: {
      theme: 'Тема'
    },
    dashboardSearchButton: {
      label: 'Поиск…'
    },
    dashboardSidebarCollapse: {
      collapse: 'Свернуть боковую панель',
      expand: 'Развернуть боковую панель'
    },
    dashboardSidebarToggle: {
      close: 'Закрыть боковую панель',
      open: 'Открыть боковую панель'
    },
    drawer: {
      close: 'Закрыть'
    },
    error: {
      clear: 'Вернуться на главную'
    },
    fileUpload: {
      removeFile: 'Удалить {filename}'
    },
    header: {
      close: 'Закрыть меню',
      open: 'Открыть меню'
    },
    inputDate: {
      day: 'день',
      dayPeriod: 'AM/PM',
      era: 'эра',
      hour: 'час',
      minute: 'минута',
      month: 'месяц',
      second: 'секунда',
      timeZoneName: 'часовой пояс',
      year: 'год'
    },
    inputMenu: {
      create: 'Создать "{label}"',
      noData: 'Нет данных',
      noMatch: 'Совпадений не найдено'
    },
    inputNumber: {
      decrement: 'Уменьшить',
      increment: 'Увеличить'
    },
    inputRating: {
      rate: 'Оценить на {value} из {length}'
    },
    inputTime: {
      dayPeriod: 'AM/PM',
      hour: 'час',
      minute: 'минута',
      second: 'секунда',
      timeZoneName: 'часовой пояс'
    },
    listbox: {
      noData: 'Нет данных',
      noMatch: 'Совпадений не найдено',
      search: 'Поиск…'
    },
    modal: {
      close: 'Закрыть'
    },
    pagination: {
      first: 'Первая страница',
      last: 'Последняя страница',
      next: 'Следующая страница',
      page: 'Страница {page}',
      prev: 'Предыдущая страница'
    },
    pinInput: {
      input: 'PIN-код, символ {index} из {length}'
    },
    pricingTable: {
      caption: 'Сравнение ценных планов'
    },
    prose: {
      codeCollapse: {
        closeText: 'Свернуть',
        name: 'код',
        openText: 'Развернуть'
      },
      collapsible: {
        closeText: 'Скрыть',
        name: 'свойства',
        openText: 'Показать'
      },
      pre: {
        copy: 'Скопировать код в буфер обмена'
      },
      prompt: {
        copy: 'Скопировать промпт',
        openIn: 'Открыть в {name}'
      }
    },
    sidebar: {
      close: 'Закрыть',
      toggle: 'Переключить'
    },
    selectMenu: {
      create: 'Создать "{label}"',
      noData: 'Нет данных',
      noMatch: 'Совпадений не найдено',
      search: 'Поиск…'
    },
    skeleton: {
      label: 'загрузка'
    },
    slideover: {
      close: 'Закрыть'
    },
    slider: {
      max: 'Максимум',
      min: 'Минимум',
      thumb: 'Ползунок',
      value: 'Значение {index} из {total}'
    },
    table: {
      noData: 'Нет данных'
    },
    toast: {
      close: 'Закрыть'
    },
    toaster: {
      label: 'Уведомление',
      viewport: 'Уведомления ({hotkey})'
    }
  }
})
