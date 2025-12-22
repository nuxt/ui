export default {
  slots: {
    overlay: 'fixed inset-0 bg-elevated/75',
    content: 'fixed bg-default divide-y divide-default sm:ring ring-default sm:shadow-lg flex flex-col focus:outline-none',
    header: 'flex items-center gap-1.5 p-4 sm:px-6 min-h-16',
    wrapper: '',
    body: 'flex-1 overflow-y-auto p-4 sm:p-6',
    footer: 'flex items-center gap-1.5 p-4 sm:px-6',
    title: 'text-highlighted font-semibold',
    description: 'mt-1 text-muted text-sm',
    close: 'absolute top-4 end-4'
  },
  variants: {
    side: {
      top: {
        content: ''
      },
      right: {
        content: 'max-w-md'
      },
      bottom: {
        content: ''
      },
      left: {
        content: 'max-w-md'
      }
    },
    inset: {
      true: {
        content: 'rounded-lg'
      }
    },
    transition: {
      true: {
        overlay: 'data-[state=open]:animate-[fade-in_200ms_ease-out] data-[state=closed]:animate-[fade-out_200ms_ease-in]'
      }
    }
  },
  compoundVariants: [{
    side: 'top',
    inset: true,
    class: {
      content: 'max-h-[calc(100%-2rem)] inset-x-4 top-4'
    }
  }, {
    side: 'top',
    inset: false,
    class: {
      content: 'max-h-full inset-x-0 top-0'
    }
  }, {
    side: 'right',
    inset: true,
    class: {
      content: 'w-[calc(100%-2rem)] inset-y-4 right-4'
    }
  }, {
    side: 'right',
    inset: false,
    class: {
      content: 'w-full inset-y-0 right-0'
    }
  }, {
    side: 'bottom',
    inset: true,
    class: {
      content: 'max-h-[calc(100%-2rem)] inset-x-4 bottom-4'
    }
  }, {
    side: 'bottom',
    inset: false,
    class: {
      content: 'max-h-full inset-x-0 bottom-0'
    }
  }, {
    side: 'left',
    inset: true,
    class: {
      content: 'w-[calc(100%-2rem)] inset-y-4 left-4'
    }
  }, {
    side: 'left',
    inset: false,
    class: {
      content: 'w-full inset-y-0 left-0'
    }
  }, {
    transition: true,
    side: 'top',
    class: {
      content: 'data-[state=open]:animate-[slide-in-from-top_200ms_ease-in-out] data-[state=closed]:animate-[slide-out-to-top_200ms_ease-in-out]'
    }
  }, {
    transition: true,
    side: 'right',
    class: {
      content: 'data-[state=open]:animate-[slide-in-from-right_200ms_ease-in-out] data-[state=closed]:animate-[slide-out-to-right_200ms_ease-in-out]'
    }
  }, {
    transition: true,
    side: 'bottom',
    class: {
      content: 'data-[state=open]:animate-[slide-in-from-bottom_200ms_ease-in-out] data-[state=closed]:animate-[slide-out-to-bottom_200ms_ease-in-out]'
    }
  }, {
    transition: true,
    side: 'left',
    class: {
      content: 'data-[state=open]:animate-[slide-in-from-left_200ms_ease-in-out] data-[state=closed]:animate-[slide-out-to-left_200ms_ease-in-out]'
    }
  }]
}
