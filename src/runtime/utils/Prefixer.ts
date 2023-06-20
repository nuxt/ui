import TailwindClasses from "./tailwind-classes";

interface AppComponentConfig {
  [component: string]: string|AppComponentConfig
}
interface AppConfig {
  ui: {
    [component: string]: AppComponentConfig
  }
}

export default class Prefixer {
  public constructor(private prefix: string|undefined) {
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

  private createPrefixedComponentConfig(config: AppComponentConfig) {
    for (const [configKey, data] of Object.entries(config)) {
      if (typeof data === 'string') {
        config[configKey] = this.applyTailwindPrefix(data)
        continue
      }
      config[configKey] = data === null ? null : this.createPrefixedComponentConfig(data)
    }
    return config
  }

  public applyTailwindPrefix(code: string) {
    const escapeRegExp = (s) => s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');

    for (const twCls of TailwindClasses) {
      const exp = new RegExp(
        `(["':\\s])(?!${this.prefix})(-?${escapeRegExp(twCls)})(?![-])`,
        'g',
      )
      code = ` ${code}`.replace(exp, `$1${this.prefix}$2`).trimStart()
    }

    return code
  }
}
