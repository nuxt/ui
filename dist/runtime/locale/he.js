import { defineLocale } from "../composables/defineLocale.js";
export default defineLocale({
  name: "Hebrew",
  code: "he",
  dir: "rtl",
  messages: {
    alert: {
      close: "\u05E1\u05D2\u05D5\u05E8"
    },
    authForm: {
      hidePassword: "\u05D4\u05E1\u05EA\u05E8 \u05E1\u05D9\u05E1\u05DE\u05D4",
      showPassword: "\u05D4\u05E6\u05D2 \u05E1\u05D9\u05E1\u05DE\u05D4",
      submit: "\u05D4\u05DE\u05E9\u05DA"
    },
    banner: {
      close: "\u05E1\u05D2\u05D5\u05E8"
    },
    calendar: {
      nextMonth: "\u05D7\u05D5\u05D3\u05E9 \u05D4\u05D1\u05D0",
      nextYear: "\u05E9\u05E0\u05D4 \u05D4\u05D1\u05D0\u05D4",
      prevMonth: "\u05D7\u05D5\u05D3\u05E9 \u05E7\u05D5\u05D3\u05DD",
      prevYear: "\u05E9\u05E0\u05D4 \u05E7\u05D5\u05D3\u05DE\u05EA"
    },
    carousel: {
      dots: "\u05D1\u05D7\u05E8 \u05E9\u05E7\u05D5\u05E4\u05D9\u05EA \u05DC\u05D4\u05E6\u05D2\u05D4",
      goto: "\u05DE\u05E2\u05D1\u05E8 \u05DC {slide}",
      next: "\u05D4\u05D1\u05D0",
      prev: "\u05D4\u05E7\u05D5\u05D3\u05DD"
    },
    chatPrompt: {
      placeholder: "\u05DB\u05EA\u05D5\u05D1 \u05D0\u05EA \u05D4\u05D4\u05D5\u05D3\u05E2\u05D4 \u05E9\u05DC\u05DA \u05DB\u05D0\u05DF\u2026"
    },
    chatPromptSubmit: {
      label: "\u05E9\u05DC\u05D7"
    },
    chatReasoning: {
      thinking: "\u05D7\u05D5\u05E9\u05D1\u2026",
      thought: "\u05D7\u05E9\u05D1",
      thoughtFor: "\u05D7\u05E9\u05D1 \u05D1\u05DE\u05E9\u05DA {duration}"
    },
    colorMode: {
      dark: "\u05DB\u05D4\u05D4",
      light: "\u05D1\u05D4\u05D9\u05E8",
      switchToDark: "\u05E2\u05D1\u05D5\u05E8 \u05DC\u05DE\u05E6\u05D1 \u05DB\u05D4\u05D4",
      switchToLight: "\u05E2\u05D1\u05D5\u05E8 \u05DC\u05DE\u05E6\u05D1 \u05D1\u05D4\u05D9\u05E8",
      system: "\u05DE\u05E2\u05E8\u05DB\u05EA"
    },
    commandPalette: {
      back: "\u05D7\u05D6\u05D5\u05E8",
      close: "\u05E1\u05D2\u05D5\u05E8",
      noData: "\u05D0\u05D9\u05DF \u05E0\u05EA\u05D5\u05E0\u05D9\u05DD \u05D6\u05DE\u05D9\u05E0\u05D9\u05DD",
      noMatch: "\u05DC\u05D0 \u05E0\u05DE\u05E6\u05D0\u05D4 \u05D4\u05EA\u05D0\u05DE\u05D4",
      placeholder: "\u05D4\u05E7\u05DC\u05D3 \u05E4\u05E7\u05D5\u05D3\u05D4\u2026"
    },
    contentSearch: {
      links: "\u05E7\u05D9\u05E9\u05D5\u05E8\u05D9\u05DD",
      search: "\u05EA\u05D5\u05E6\u05D0\u05D5\u05EA",
      theme: "\u05E2\u05E8\u05DB\u05EA \u05E0\u05D5\u05E9\u05D0"
    },
    contentSearchButton: {
      label: "\u05D7\u05D9\u05E4\u05D5\u05E9\u2026"
    },
    contentToc: {
      title: "\u05D1\u05D3\u05E3 \u05D6\u05D4"
    },
    dropdownMenu: {
      noMatch: "\u05DC\u05D0 \u05E0\u05DE\u05E6\u05D0\u05D4 \u05D4\u05EA\u05D0\u05DE\u05D4",
      search: "\u05D7\u05E4\u05E9\u2026"
    },
    dashboardSearch: {
      theme: "\u05E2\u05E8\u05DB\u05EA \u05E0\u05D5\u05E9\u05D0"
    },
    dashboardSearchButton: {
      label: "\u05D7\u05D9\u05E4\u05D5\u05E9\u2026"
    },
    dashboardSidebarCollapse: {
      collapse: "\u05DB\u05D5\u05D5\u05E5 \u05E1\u05E8\u05D2\u05DC \u05E6\u05D3",
      expand: "\u05D4\u05E8\u05D7\u05D1 \u05E1\u05E8\u05D2\u05DC \u05E6\u05D3"
    },
    dashboardSidebarToggle: {
      close: "\u05E1\u05D2\u05D5\u05E8 \u05E1\u05E8\u05D2\u05DC \u05E6\u05D3",
      open: "\u05E4\u05EA\u05D7 \u05E1\u05E8\u05D2\u05DC \u05E6\u05D3"
    },
    error: {
      clear: "\u05D7\u05D6\u05E8\u05D4 \u05DC\u05D3\u05E3 \u05D4\u05D1\u05D9\u05EA"
    },
    fileUpload: {
      removeFile: "\u05D4\u05E1\u05E8 {filename}"
    },
    header: {
      close: "\u05E1\u05D2\u05D5\u05E8 \u05EA\u05E4\u05E8\u05D9\u05D8",
      open: "\u05E4\u05EA\u05D7 \u05EA\u05E4\u05E8\u05D9\u05D8"
    },
    inputMenu: {
      create: '\u05E6\u05D5\u05E8 "{label}"',
      noData: "\u05D0\u05D9\u05DF \u05E0\u05EA\u05D5\u05E0\u05D9\u05DD",
      noMatch: "\u05D0\u05D9\u05DF \u05D4\u05EA\u05D0\u05DE\u05D4"
    },
    inputNumber: {
      decrement: "\u05D4\u05E4\u05D7\u05EA",
      increment: "\u05D4\u05D5\u05E1\u05E3"
    },
    listbox: {
      noData: "\u05D0\u05D9\u05DF \u05E0\u05EA\u05D5\u05E0\u05D9\u05DD",
      noMatch: "\u05DC\u05D0 \u05E0\u05DE\u05E6\u05D0\u05D4 \u05D4\u05EA\u05D0\u05DE\u05D4",
      search: "\u05D7\u05E4\u05E9\u2026"
    },
    modal: {
      close: "\u05E1\u05D2\u05D5\u05E8"
    },
    pricingTable: {
      caption: "\u05E9\u05D9\u05E4\u05D5\u05E8 \u05DE\u05D7\u05D9\u05E8\u05D5\u05DF"
    },
    prose: {
      codeCollapse: {
        closeText: "\u05DB\u05D5\u05D5\u05E5",
        name: "\u05E7\u05D5\u05D3",
        openText: "\u05D4\u05E8\u05D7\u05D1"
      },
      collapsible: {
        closeText: "\u05D4\u05E1\u05EA\u05E8",
        name: "\u05DE\u05D0\u05E4\u05D9\u05D9\u05E0\u05D9\u05DD",
        openText: "\u05D4\u05E6\u05D2"
      },
      pre: {
        copy: "\u05D4\u05E2\u05EA\u05E7 \u05E7\u05D5\u05D3 \u05DC\u05DC\u05D5\u05D7"
      },
      prompt: {
        copy: "\u05D4\u05E2\u05EA\u05E7 \u05D4\u05E0\u05D7\u05D9\u05D4",
        openIn: "\u05E4\u05EA\u05D7 \u05D1-{name}"
      }
    },
    sidebar: {
      close: "\u05E1\u05D2\u05D5\u05E8",
      toggle: "\u05D4\u05D7\u05DC\u05E3"
    },
    selectMenu: {
      create: '\u05E6\u05D5\u05E8 "{label}"',
      noData: "\u05D0\u05D9\u05DF \u05E0\u05EA\u05D5\u05E0\u05D9\u05DD",
      noMatch: "\u05DC\u05D0 \u05E0\u05DE\u05E6\u05D0\u05D4 \u05D4\u05EA\u05D0\u05DE\u05D4",
      search: "\u05D7\u05E4\u05E9\u2026"
    },
    slideover: {
      close: "\u05E1\u05D2\u05D5\u05E8"
    },
    table: {
      noData: "\u05D0\u05D9\u05DF \u05E0\u05EA\u05D5\u05E0\u05D9\u05DD \u05DC\u05D4\u05E6\u05D2\u05D4"
    },
    toast: {
      close: "\u05E1\u05D2\u05D5\u05E8"
    }
  }
});
