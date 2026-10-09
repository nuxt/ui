import type { Messages } from '../types/locale'
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
    breadcrumb: {
      label: 'ເສັ້ນທາງນຳທາງ'
    },
    calendar: {
      label: 'ວັນທີຂອງເຫດການ',
      monthPicker: 'ຕົວເລືອກເດືອນ',
      nextMonth: 'ເດືອນໜ້າ',
      nextYear: 'ປີໜ້າ',
      prevMonth: 'ເດືອນກ່ອນ',
      prevYear: 'ປີກ່ອນ',
      yearPicker: 'ຕົວເລືອກປີ'
    },
    carousel: {
      dots: 'ເລືອກສະໄລ້ທີ່ຈະສະແດງ',
      goto: 'ໄປທີ່ສະໄລ້ {slide}',
      next: 'ຕໍ່ໄປ',
      prev: 'ກ່ອນໜ້າ',
      roledescription: 'ຄາຣູເຊວ',
      slide: 'ສະໄລ້'
    },
    chatMessages: {
      autoScroll: 'ເລື່ອນລົງລຸ່ມສຸດ'
    },
    chatPrompt: {
      placeholder: 'ພິມຂໍ້ຄວາມຂອງທ່ານທີ່ນີ້…'
    },
    chatPromptSubmit: {
      label: 'ສົ່ງຄຳສັ່ງ',
      reload: 'ລອງໃໝ່',
      stop: 'ຢຸດການສ້າງ'
    },
    chatReasoning: {
      thinking: 'ກຳລັງຄິດ…',
      thought: 'ຄິດແລ້ວ',
      thoughtFor: 'ຄິດເປັນເວລາ {duration}'
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
      placeholder: 'ພິມຄຳສັ່ງ ຫຼື ຄົ້ນຫາ…'
    },
    contentSearch: {
      links: 'ລິ້ງ',
      search: 'ຜົນໄດ້ຮັບ',
      theme: 'ທີມ'
    },
    contentSearchButton: {
      label: 'ຄົ້ນຫາ…'
    },
    contentToc: {
      title: 'ໃນໜ້ານີ້'
    },
    dropdownMenu: {
      noMatch: 'ບໍ່ພົບຂໍ້ມູນທີ່ກົງກັນ',
      search: 'ຄົ້ນຫາ…'
    },
    dashboardSearch: {
      theme: 'ທີມ'
    },
    dashboardSearchButton: {
      label: 'ຄົ້ນຫາ…'
    },
    dashboardSidebarCollapse: {
      collapse: 'ຫຍໍ້ແຖບດ້ານຂ້າງ',
      expand: 'ຂະຫຍາຍແຖບດ້ານຂ້າງ'
    },
    dashboardSidebarToggle: {
      close: 'ປິດແຖບດ້ານຂ້າງ',
      open: 'ເປີດແຖບດ້ານຂ້າງ'
    },
    drawer: {
      close: 'ປິດ'
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
    inputDate: {
      day: 'ວັນ',
      dayPeriod: 'AM/PM',
      era: 'ສະໄໝ',
      hour: 'ຊົ່ວໂມງ',
      minute: 'ນາທີ',
      month: 'ເດືອນ',
      second: 'ວິນາທີ',
      timeZoneName: 'ເຂດເວລາ',
      year: 'ປີ'
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
    inputRating: {
      rate: 'ໃຫ້ຄະແນນ {value} ຈາກ {length}'
    },
    inputTime: {
      dayPeriod: 'AM/PM',
      hour: 'ຊົ່ວໂມງ',
      minute: 'ນາທີ',
      second: 'ວິນາທີ',
      timeZoneName: 'ເຂດເວລາ'
    },
    listbox: {
      noData: 'ບໍ່ມີຂໍ້ມູນ',
      noMatch: 'ບໍ່ພົບຂໍ້ມູນທີ່ກົງກັນ',
      search: 'ຄົ້ນຫາ…'
    },
    modal: {
      close: 'ປິດ'
    },
    pagination: {
      first: 'ໜ້າທຳອິດ',
      last: 'ໜ້າສຸດທ້າຍ',
      next: 'ໜ້າຕໍ່ໄປ',
      page: 'ໜ້າ {page}',
      prev: 'ໜ້າກ່ອນໜ້າ'
    },
    pinInput: {
      input: 'ລະຫັດ PIN ຕົວອັກສອນທີ {index} ຈາກ {length}'
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
      },
      prompt: {
        copy: 'ຄັດລອກຄຳສັ່ງ',
        openIn: 'ເປີດໃນ {name}'
      }
    },
    sidebar: {
      close: 'ປິດ',
      toggle: 'ສະລັບ'
    },
    selectMenu: {
      create: 'ສ້າງ "{label}"',
      noData: 'ບໍ່ມີຂໍ້ມູນ',
      noMatch: 'ບໍ່ພົບຂໍ້ມູນທີ່ກົງກັນ',
      search: 'ຄົ້ນຫາ…'
    },
    skeleton: {
      label: 'ກຳລັງໂຫຼດ'
    },
    slideover: {
      close: 'ປິດ'
    },
    slider: {
      max: 'ສູງສຸດ',
      min: 'ຕ່ຳສຸດ',
      thumb: 'ຕົວເລື່ອນ',
      value: 'ຄ່າທີ {index} ຈາກ {total}'
    },
    table: {
      noData: 'ບໍ່ມີຂໍ້ມູນ'
    },
    toast: {
      close: 'ປິດ'
    },
    toaster: {
      label: 'ການແຈ້ງເຕືອນ',
      viewport: 'ການແຈ້ງເຕືອນ ({hotkey})'
    }
  }
})
