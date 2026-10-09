import type { Messages } from '../types/locale'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: '日本語',
  code: 'ja',
  messages: {
    alert: {
      close: '閉じる'
    },
    authForm: {
      hidePassword: 'パスワードを隠す',
      showPassword: 'パスワードを表示',
      submit: '続ける'
    },
    banner: {
      close: '閉じる'
    },
    breadcrumb: {
      label: 'パンくずリスト'
    },
    calendar: {
      label: 'イベントの日付',
      monthPicker: '月の選択',
      nextMonth: '翌月',
      nextYear: '翌年',
      prevMonth: '前月',
      prevYear: '前年',
      yearPicker: '年の選択'
    },
    carousel: {
      dots: '表示するスライドを選択',
      goto: 'スライド {slide} に移動',
      next: '次へ',
      prev: '前へ',
      roledescription: 'カルーセル',
      slide: 'スライド'
    },
    chatMessages: {
      autoScroll: '一番下までスクロール'
    },
    chatPrompt: {
      placeholder: 'ここにメッセージを入力してください…'
    },
    chatPromptSubmit: {
      label: '送信',
      reload: '再試行',
      stop: '生成を停止'
    },
    chatReasoning: {
      thinking: '考えています…',
      thought: '考えました',
      thoughtFor: '{duration}考えました'
    },
    colorMode: {
      dark: 'ダーク',
      light: 'ライト',
      switchToDark: 'ダークモードに切り替え',
      switchToLight: 'ライトモードに切り替え',
      system: 'システム'
    },
    commandPalette: {
      back: '戻る',
      close: '閉じる',
      noData: 'データがありません',
      noMatch: '一致するデータがありません',
      placeholder: 'コマンドを入力するか検索…'
    },
    contentSearch: {
      links: 'リンク',
      search: '検索結果',
      theme: 'テーマ'
    },
    contentSearchButton: {
      label: '検索…'
    },
    contentToc: {
      title: 'このページ内'
    },
    dropdownMenu: {
      noMatch: '一致するデータがありません',
      search: '検索…'
    },
    dashboardSearch: {
      theme: 'テーマ'
    },
    dashboardSearchButton: {
      label: '検索…'
    },
    dashboardSidebarCollapse: {
      collapse: 'サイドバーを折りたたむ',
      expand: 'サイドバーを展開'
    },
    dashboardSidebarToggle: {
      close: 'サイドバーを閉じる',
      open: 'サイドバーを開く'
    },
    drawer: {
      close: '閉じる'
    },
    error: {
      clear: 'ホームに戻る'
    },
    fileUpload: {
      removeFile: '{filename}を削除'
    },
    header: {
      close: 'メニューを閉じる',
      open: 'メニューを開く'
    },
    inputDate: {
      day: '日',
      dayPeriod: '午前/午後',
      era: '時代',
      hour: '時',
      minute: '分',
      month: '月',
      second: '秒',
      timeZoneName: 'タイムゾーン',
      year: '年'
    },
    inputMenu: {
      create: '"{label}"を作成',
      noData: 'データがありません',
      noMatch: '一致するデータがありません'
    },
    inputNumber: {
      decrement: '減らす',
      increment: '増やす'
    },
    inputRating: {
      rate: '{length}段階中{value}で評価'
    },
    inputTime: {
      dayPeriod: '午前/午後',
      hour: '時',
      minute: '分',
      second: '秒',
      timeZoneName: 'タイムゾーン'
    },
    listbox: {
      noData: 'データがありません',
      noMatch: '一致するデータがありません',
      search: '検索…'
    },
    modal: {
      close: '閉じる'
    },
    pagination: {
      first: '最初のページ',
      last: '最後のページ',
      next: '次のページ',
      page: '{page}ページ',
      prev: '前のページ'
    },
    pinInput: {
      input: 'PINコード、{length}文字中{index}文字目'
    },
    pricingTable: {
      caption: '価格プランの比較'
    },
    prose: {
      codeCollapse: {
        closeText: '折りたたむ',
        name: 'コード',
        openText: '展開'
      },
      collapsible: {
        closeText: '非表示',
        name: 'プロパティ',
        openText: '表示'
      },
      pre: {
        copy: 'コードをクリップボードにコピー'
      },
      prompt: {
        copy: 'プロンプトをコピー',
        openIn: '{name}で開く'
      }
    },
    sidebar: {
      close: '閉じる',
      toggle: '切り替え'
    },
    selectMenu: {
      create: '"{label}"を作成',
      noData: 'データがありません',
      noMatch: '一致するデータがありません',
      search: '検索…'
    },
    skeleton: {
      label: '読み込み中'
    },
    slideover: {
      close: '閉じる'
    },
    slider: {
      max: '最大',
      min: '最小',
      thumb: 'つまみ',
      value: '{total}個中{index}番目の値'
    },
    table: {
      noData: 'データがありません'
    },
    toast: {
      close: '閉じる'
    },
    toaster: {
      label: '通知',
      viewport: '通知 ({hotkey})'
    }
  }
})
