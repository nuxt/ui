import type { Messages } from '../types/locale'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: '繁體中文',
  code: 'zh-TW',
  messages: {
    alert: {
      close: '關閉'
    },
    authForm: {
      hidePassword: '隱藏密碼',
      showPassword: '顯示密碼',
      submit: '繼續'
    },
    banner: {
      close: '關閉'
    },
    breadcrumb: {
      label: '導覽路徑'
    },
    calendar: {
      label: '事件日期',
      monthPicker: '月份選擇器',
      nextMonth: '下個月',
      nextYear: '明年',
      prevMonth: '上個月',
      prevYear: '去年',
      yearPicker: '年份選擇器'
    },
    carousel: {
      dots: '選擇要顯示的投影片',
      goto: '跳轉到第 {slide} 頁',
      next: '下一頁',
      prev: '上一頁',
      roledescription: '輪播',
      slide: '投影片'
    },
    chatMessages: {
      autoScroll: '捲動到底部'
    },
    chatPrompt: {
      placeholder: '在這裡輸入你的消息…'
    },
    chatPromptSubmit: {
      label: '發送',
      reload: '重試',
      stop: '停止生成'
    },
    chatReasoning: {
      thinking: '思考中…',
      thought: '已思考',
      thoughtFor: '思考了 {duration}'
    },
    colorMode: {
      dark: '深色',
      light: '淺色',
      switchToDark: '切換到深色模式',
      switchToLight: '切換到淺色模式',
      system: '系統'
    },
    commandPalette: {
      back: '返回',
      close: '關閉',
      noData: '沒有資料',
      noMatch: '沒有相符的資料',
      placeholder: '輸入命令或搜尋…'
    },
    contentSearch: {
      links: '連結',
      search: '搜尋結果',
      theme: '主題'
    },
    contentSearchButton: {
      label: '搜尋…'
    },
    contentToc: {
      title: '本頁內容'
    },
    dropdownMenu: {
      noMatch: '沒有相符的資料',
      search: '搜尋…'
    },
    dashboardSearch: {
      theme: '主題'
    },
    dashboardSearchButton: {
      label: '搜尋…'
    },
    dashboardSidebarCollapse: {
      collapse: '收起側邊欄',
      expand: '展開側邊欄'
    },
    dashboardSidebarToggle: {
      close: '關閉側邊欄',
      open: '開啟側邊欄'
    },
    drawer: {
      close: '關閉'
    },
    error: {
      clear: '返回首頁'
    },
    fileUpload: {
      removeFile: '移除 {filename}'
    },
    header: {
      close: '關閉選單',
      open: '開啟選單'
    },
    inputDate: {
      day: '日',
      dayPeriod: '上午/下午',
      era: '紀元',
      hour: '小時',
      minute: '分鐘',
      month: '月',
      second: '秒',
      timeZoneName: '時區',
      year: '年'
    },
    inputMenu: {
      create: '建立「{label}」',
      noData: '沒有資料',
      noMatch: '沒有相符的資料'
    },
    inputNumber: {
      decrement: '減少',
      increment: '增加'
    },
    inputRating: {
      rate: '評分 {value} 分，滿分 {length} 分'
    },
    inputTime: {
      dayPeriod: '上午/下午',
      hour: '小時',
      minute: '分鐘',
      second: '秒',
      timeZoneName: '時區'
    },
    listbox: {
      noData: '沒有資料',
      noMatch: '沒有相符的資料',
      search: '搜尋…'
    },
    modal: {
      close: '關閉'
    },
    pagination: {
      first: '第一頁',
      last: '最後一頁',
      next: '下一頁',
      page: '第 {page} 頁',
      prev: '上一頁'
    },
    pinInput: {
      input: 'PIN 碼，第 {index} 位，共 {length} 位'
    },
    pricingTable: {
      caption: '價格計畫比較'
    },
    prose: {
      codeCollapse: {
        closeText: '收起',
        name: '程式碼',
        openText: '展開'
      },
      collapsible: {
        closeText: '隱藏',
        name: '屬性',
        openText: '顯示'
      },
      pre: {
        copy: '複製程式碼到剪貼簿'
      },
      prompt: {
        copy: '複製提示詞',
        openIn: '在 {name} 中開啟'
      }
    },
    sidebar: {
      close: '關閉',
      toggle: '切換'
    },
    selectMenu: {
      create: '建立「{label}」',
      noData: '沒有資料',
      noMatch: '沒有相符的資料',
      search: '搜尋…'
    },
    skeleton: {
      label: '載入中'
    },
    slideover: {
      close: '關閉'
    },
    slider: {
      max: '最大值',
      min: '最小值',
      thumb: '滑桿',
      value: '第 {index} 個值，共 {total} 個'
    },
    table: {
      noData: '沒有資料'
    },
    toast: {
      close: '關閉'
    },
    toaster: {
      label: '通知',
      viewport: '通知（{hotkey}）'
    }
  }
})
