/**
 * Add a tailwind prefix to the theme object that will be used for tainwind-variants
 * @see https://tailwindcss.com/docs/v4-beta#using-a-prefix
 * @see https://github.com/nextui-org/tailwind-variants
 */
export function addTailwindPrefix(theme: Record<string, any>, prefix: string) {
  /**
   * Validate whether the path should be prefixed
   */
  function _validatePath(path: string) {
    /**
     * Prefix processing will begin from the following path
     *
     * path separator: array `.*`  cascade `.`
     *
     * @enample
     * 1. '.base'
     *   - `.base`                             yes
     *   - `.base.[name]`                      yes
     *   - `.base.[name].*`                    yes
     * 2. `compoundVariants.*.class`
     *   - `.compoundVariants`                 no (but will continue to check)
     *   - `.compoundVariants.*`               no (but will continue to check)
     *   - `.compoundVariants.*.class`         yes
     *   - `.compoundVariants.*.class.*`       yes
     *   - `.compoundVariants.*.class.slot`    yes
     *   - `.compoundVariants.*.class.slot.*`  yes
     *   - `.compoundVariants.*.[name] `       no (and will not continue to check)
     * 3. `.defaultVariants`
     *   - `.defaultVariants`                  no (and will not continue to check)
     */
    const pathWhiteList = [
      '.base',
      '.variants',
      '.compoundVariants.*.class',
      '.compoundVariants.*.className',
      '.slots',
      '.compoundSlots.*.class',
      '.compoundSlots.*.className'
    ]
    /**
     * Do not add prefix to these keys while be included in the theme object
     *
     * 1. These are used as values for child component properties, so they do not need to be processed
     */
    const keyBlacklist = [
      '.avatarSize', // 1
      '.leadingAvatarSize', // 1
      '.itemLeadingAvatarSize' // 1
    ] as const

    const isBlockPath = keyBlacklist.some(i => path.endsWith(i))
    const isInvalidPath = !pathWhiteList.some(i => path.startsWith(i)) && !pathWhiteList.some(i => i.startsWith(path))

    return !isBlockPath && !isInvalidPath
  }

  /**
   * Anoher version of `_validatePath` with regex pattern
   *
   * It is most flexible,
   * but the rule writing is more complex and not easy to read,
   * and the running time is longer compared to the previous one
   */
  // function _validatePathWithPattern(path: string) {
  //   /**
  //    * Path patterns to match and add prefix
  //    *
  //    * Path sperater:
  //    *  - '.': cascade(object) path
  //    *  - '.*': array path
  //    */
  //   const pathPatternList = [
  //     /**
  //      * Match base paths:
  //      * - '.base'
  //      * - '.base.*'
  //      */
  //     /^\.base(?:$|\.\*$)/,

  //     /**
  //      * Match slots paths:
  //      * - '.slots'
  //      * - '.slots.slot'
  //      * - '.slots.slot.*'
  //      */
  //     /^\.slots(?:$|\.[^.*]+(?:\.\*)?$)/,

  //     /**
  //      * Match variants paths:
  //      * - '.variants'
  //      * - '.variants.[name]'
  //      * - '.variants.[name].[value]'
  //      * - '.variants.[name].[value].*'
  //      * - '.variants.[name].[value].[slot]'
  //      * - '.variants.[name].[value].[slot].*'
  //      */
  //     /^\.variants(?:$|\.[^.*]+(?:\.[^.*]+(?:\.[^.*]+(?:\.\*)?|\.\*)?)?$)/,

  //     /**
  //      * Match compoundVariants paths:
  //      * - '.compoundVariants'
  //      * - '.compoundVariants.*'
  //      * - '.compoundVariants.*.class'
  //      * - '.compoundVariants.*.className'
  //      * - '.compoundVariants.*.class.[slot]'
  //      * - '.compoundVariants.*.class.*'
  //      * - '.compoundVariants.*.class.[slot].*'
  //      */
  //     /^\.compoundVariants(?:$|\.\*(?:$|\.(?:class|className)(?:\.[^.*]+(?:\.\*)?|\.\*)?$))/,

  //     /**
  //      * Match compoundSlots paths:
  //      * - '.compoundSlots'
  //      * - '.compoundSlots.*'
  //      * - '.compoundSlots.*.class'
  //      * - '.compoundSlots.*.className'
  //      * - '.compoundSlots.*.class.*'
  //      * - '.compoundSlots.*.className.*'
  //      */
  //     /^\.compoundSlots(?:$|\.\*(?:$|\.(?:class|className)(?:\.\*)?$))/
  //   ]

  //   const keyBlacklist = [
  //     '.avatarSize', // 1
  //     '.leadingAvatarSize', // 1
  //     '.itemLeadingAvatarSize' // 1
  //   ] as const

  //   const isBlockPath = keyBlacklist.some(i => path.endsWith(i))
  //   const isInvalidPath = !pathPatternList.some(pattern => pattern.test(path))

  //   return !isBlockPath && !isInvalidPath
  // }

  function _addPrefix(target: any, path: string = '') {
    // Do not check the root path
    if (path !== '' && !_validatePath(path)) {
      return target
    }

    if (Array.isArray(target)) {
      return target.map<string | any>(i => _addPrefix(i, path + '.*'))
    }

    if (typeof target === 'string') {
      return target.split(' ').map(c => c && (prefix + c)).join(' ')
    }

    return Object.entries(target ?? {}).reduce((acc, [key, value]) => {
      acc[key] = _addPrefix(value, path + '.' + key)
      return acc
    }, {} as any)
  }

  return _addPrefix(theme)
}
