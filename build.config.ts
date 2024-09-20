import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  replace: {
    'process.env.DEV': 'false'
  }
})
