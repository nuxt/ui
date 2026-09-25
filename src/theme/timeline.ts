export default {
  slots: {
    root: 'flex gap-1.5',
    item: 'group relative flex flex-1 gap-3',
    container: 'relative flex items-center gap-1.5',
    indicator: 'group-data-[state=completed]:text-accent-foreground group-data-[state=active]:text-accent-foreground text-muted group-data-[state=completed]:bg-accent group-data-[state=active]:bg-accent',
    separator: 'flex-1 rounded-full bg-elevated',
    wrapper: 'w-full',
    date: 'text-dimmed text-xs/5',
    title: 'font-medium text-highlighted text-sm',
    description: 'text-muted text-wrap text-sm'
  },

  variants: {
    orientation: {
      horizontal: {
        root: 'flex-row w-full',
        item: 'flex-col',
        separator: 'h-0.5'
      },
      vertical: {
        root: 'flex-col',
        container: 'flex-col',
        separator: 'w-0.5'
      }
    },

    // The indicator is an Avatar with its own color, so the timeline's color only
    // takes over in the states where it paints the indicator.
    color: {
      primary: {
        indicator: 'group-data-[state=completed]:[--ui-accent:var(--ui-primary)] group-data-[state=active]:[--ui-accent:var(--ui-primary)]',
        separator: '[--ui-accent:var(--ui-primary)]'
      },
      secondary: {
        indicator: 'group-data-[state=completed]:[--ui-accent:var(--ui-secondary)] group-data-[state=active]:[--ui-accent:var(--ui-secondary)]',
        separator: '[--ui-accent:var(--ui-secondary)]'
      },
      success: {
        indicator: 'group-data-[state=completed]:[--ui-accent:var(--ui-success)] group-data-[state=active]:[--ui-accent:var(--ui-success)]',
        separator: '[--ui-accent:var(--ui-success)]'
      },
      info: {
        indicator: 'group-data-[state=completed]:[--ui-accent:var(--ui-info)] group-data-[state=active]:[--ui-accent:var(--ui-info)]',
        separator: '[--ui-accent:var(--ui-info)]'
      },
      warning: {
        indicator: 'group-data-[state=completed]:[--ui-accent:var(--ui-warning)] group-data-[state=active]:[--ui-accent:var(--ui-warning)]',
        separator: '[--ui-accent:var(--ui-warning)]'
      },
      error: {
        indicator: 'group-data-[state=completed]:[--ui-accent:var(--ui-error)] group-data-[state=active]:[--ui-accent:var(--ui-error)]',
        separator: '[--ui-accent:var(--ui-error)]'
      },
      neutral: {
        indicator: 'group-data-[state=completed]:[--ui-accent:var(--ui-neutral)] group-data-[state=active]:[--ui-accent:var(--ui-neutral)]',
        separator: '[--ui-accent:var(--ui-neutral)]'
      }
    },

    size: {
      '3xs': '',
      '2xs': '',
      'xs': '',
      'sm': '',
      'md': '',
      'lg': '',
      'xl': '',
      '2xl': '',
      '3xl': ''
    },

    reverse: {
      true: {
        separator: 'group-data-[state=active]:bg-accent group-data-[state=completed]:bg-accent'
      },
      false: {
        separator: 'group-data-[state=completed]:bg-accent'
      }
    }
  },

  compoundVariants: [{
    orientation: 'horizontal',
    size: '3xs',
    class: {
      wrapper: 'pe-4.5'
    }
  }, {
    orientation: 'horizontal',
    size: '2xs',
    class: {
      wrapper: 'pe-5'
    }
  }, {
    orientation: 'horizontal',
    size: 'xs',
    class: {
      wrapper: 'pe-5.5'
    }
  }, {
    orientation: 'horizontal',
    size: 'sm',
    class: {
      wrapper: 'pe-6'
    }
  }, {
    orientation: 'horizontal',
    size: 'md',
    class: {
      wrapper: 'pe-6.5'
    }
  }, {
    orientation: 'horizontal',
    size: 'lg',
    class: {
      wrapper: 'pe-7'
    }
  }, {
    orientation: 'horizontal',
    size: 'xl',
    class: {
      wrapper: 'pe-7.5'
    }
  }, {
    orientation: 'horizontal',
    size: '2xl',
    class: {
      wrapper: 'pe-8'
    }
  }, {
    orientation: 'horizontal',
    size: '3xl',
    class: {
      wrapper: 'pe-8.5'
    }
  }, {
    orientation: 'vertical',
    size: '3xs',
    class: {
      wrapper: '-mt-0.5 pb-4.5'
    }
  }, {
    orientation: 'vertical',
    size: '2xs',
    class: {
      wrapper: 'pb-5'
    }
  }, {
    orientation: 'vertical',
    size: 'xs',
    class: {
      wrapper: 'mt-0.5 pb-5.5'
    }
  }, {
    orientation: 'vertical',
    size: 'sm',
    class: {
      wrapper: 'mt-1 pb-6'
    }
  }, {
    orientation: 'vertical',
    size: 'md',
    class: {
      wrapper: 'mt-1.5 pb-6.5'
    }
  }, {
    orientation: 'vertical',
    size: 'lg',
    class: {
      wrapper: 'mt-2 pb-7'
    }
  }, {
    orientation: 'vertical',
    size: 'xl',
    class: {
      wrapper: 'mt-2.5 pb-7.5'
    }
  }, {
    orientation: 'vertical',
    size: '2xl',
    class: {
      wrapper: 'mt-3 pb-8'
    }
  }, {
    orientation: 'vertical',
    size: '3xl',
    class: {
      wrapper: 'mt-3.5 pb-8.5'
    }
  }],

  defaultVariants: {
    size: 'md',
    color: 'primary'
  }
}
