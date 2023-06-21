interface AppComponentConfig {
  [component: string]: string|AppComponentConfig
}
interface AppConfig {
  ui: {
    [component: string]: AppComponentConfig
  }
}

export default class Prefixer {
  private excludeConfigKeys: string[];

  public constructor(private prefix: string|undefined) {
    this.excludeConfigKeys = [
      'size',
      'chipPosition',
      'variant'
    ]
  }

  public applyToConfig(config: AppConfig) {
    if (!this.prefix) {
      return config
    }
    for(const [componentName, componentConfig] of Object.entries(config.ui)) {
      config.ui[componentName] = this.createPrefixedComponentConfig(componentConfig)
    }
    return config
  }

  private createPrefixedComponentConfig(config: AppComponentConfig, prefixKeys: boolean = false) {
    const newConfig = {}
    for (const [configKey, data] of Object.entries(config)) {
      const newConfigKey = prefixKeys ? `${this.prefix}${configKey}` : configKey

      if (typeof data === 'string') {
        // if it is size and a string then it is a literal ref to an object key - skip
        if (this.excludeConfigKeys.includes(configKey)) {
          newConfig[newConfigKey] = data
          continue
        }

        newConfig[newConfigKey] = this.applyTailwindPrefix(data)
        continue
      }
      newConfig[newConfigKey] = data === null ? null : this.createPrefixedComponentConfig(data, configKey === 'color')
    }
    return newConfig
  }

  private applyTailwindPrefix(classStr: string) {
    const classes = classStr.split(' ')
    const prefixedClasses = []
    for (const cls of classes) {
      if (cls.trim() === '') {
        continue
      }
      if (cls.startsWith('i-')) {
        prefixedClasses.push(cls)
        continue
      }
      const modifierSeperator = ':'
      const sliceIndex = cls.lastIndexOf(modifierSeperator) + 1
      if (sliceIndex === 0) {
        prefixedClasses.push(`${this.prefix}${cls}`)
      } else {
        const prefixesCls = cls.slice(0, sliceIndex) + this.prefix + cls.slice(sliceIndex)
        prefixedClasses.push(prefixesCls)
      }

    }
    return prefixedClasses.join(' ')
  }
}
