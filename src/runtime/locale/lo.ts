import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'ລາວ',
  code: 'lo',
  messages: {
    alert: {
      close: 'ປິດ'
    },
    authForm: {
      hidePassword: 'ເຊື່ອງລະຫັດຜ່ານ',
      showPassword: 'ສະແດງລະຫັດຜ່ານ',
      submit: 'ດຳເນີນການຕໍ່'
    },
    banner: {
      close: 'ປິດ'
    },
    calendar: {
      nextMonth: 'ເດືອນໜ້າ',
      nextYear: 'ປີໜ້າ',
      prevMonth: 'ເດືອນກ່ອນ',
      prevYear: 'ປີກ່ອນ'
    },
    carousel: {
      dots: 'ເລືອກສະໄລ້ທີ່ຈະສະແດງ',
      goto: 'ໄປທີ່ສະໄລ້ {slide}',
      next: 'ຕໍ່ໄປ',
      prev: 'ກ່ອນໜ້າ'
    },
    chatPrompt: {
      placeholder: 'ພິມຂໍ້ຄວາມຂອງທ່ານທີ່ນີ້...'
    },
    chatPromptSubmit: {
      label: 'ສົ່ງຄຳສັ່ງ'
    },
    colorMode: {
      dark: 'ມືດ',
      light: 'ແຈ້ງ',
      switchToDark: 'ປ່ຽນເປັນໂຫມດມືດ',
      switchToLight: 'ປ່ຽນເປັນໂຫມດແຈ້ງ',
      system: 'ລະບົບ'
    },
    commandPalette: {
      back: 'ກັບຄືນ',
      close: 'ປິດ',
      noData: 'ບໍ່ມີຂໍ້ມູນ',
      noMatch: 'ບໍ່ພົບຂໍ້ມູນທີ່ກົງກັນ',
      placeholder: 'ພິມຄຳສັ່ງ ຫຼື ຄົ້ນຫາ...'
    },
    contentSearch: {
      links: 'ລິ້ງ',
      theme: 'ທີມ'
    },
    contentSearchButton: {
      label: 'ຄົ້ນຫາ...'
    },
    contentToc: {
      title: 'ໃນໜ້ານີ້'
    },
    dashboardSearch: {
      theme: 'ທີມ'
    },
    dashboardSearchButton: {
      label: 'ຄົ້ນຫາ...'
    },
    dashboardSidebarCollapse: {
      collapse: 'ຫຍໍ້ແຖບດ້ານຂ້າງ',
      expand: 'ຂະຫຍາຍແຖບດ້ານຂ້າງ'
    },
    dashboardSidebarToggle: {
      close: 'ປິດແຖບດ້ານຂ້າງ',
      open: 'ເປີດແຖບດ້ານຂ້າງ'
    },
    error: {
      clear: 'ກັບໄປໜ້າຫຼັກ'
    },
    fileUpload: {
      removeFile: 'ລົບ {filename}'
    },
    header: {
      close: 'ປິດເມນູ',
      open: 'ເປີດເມນູ'
    },
    inputMenu: {
      create: 'ສ້າງ "{label}"',
      noData: 'ບໍ່ມີຂໍ້ມູນ',
      noMatch: 'ບໍ່ພົບຂໍ້ມູນທີ່ກົງກັນ'
    },
    inputNumber: {
      decrement: 'ຫຼຸດລົງ',
      increment: 'ເພີ່ມຂຶ້ນ'
    },
    modal: {
      close: 'ປິດ'
    },
    pricingTable: {
      caption: 'ປຽບທຽບແພັກເກັດລາຄາ'
    },
    prose: {
      codeCollapse: {
        closeText: 'ຫຍໍ້',
        name: 'ໂຄ້ດ',
        openText: 'ຂະຫຍາຍ'
      },
      collapsible: {
        closeText: 'ເຊື່ອງ',
        name: 'ຄຸນສົມບັດ',
        openText: 'ສະແດງ'
      },
      pre: {
        copy: 'ຄັດລອກໂຄ້ດ'
      }
    },
    selectMenu: {
      create: 'ສ້າງ "{label}"',
      noData: 'ບໍ່ມີຂໍ້ມູນ',
      noMatch: 'ບໍ່ພົບຂໍ້ມູນທີ່ກົງກັນ',
      search: 'ຄົ້ນຫາ...'
    },
    slideover: {
      close: 'ປິດ'
    },
    table: {
      noData: 'ບໍ່ມີຂໍ້ມູນ'
    },
    toast: {
      close: 'ປິດ'
    }
  }
})
