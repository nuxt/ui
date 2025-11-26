export default {
  slots: {
    modal: '',
    input: '[&>input]:text-base/5'
  },
  variants: {
    fullscreen: {
      false: {
        modal: 'sm:max-w-3xl h-full sm:h-[28rem]'
      }
    }
  }
}
