/**
 * Resolver that loads controllers as static imports
 */

export default class StaticControllerResolver {
  /**
   * Install controllers as static imports
   *
   * @param {*} application Stimulus application
   * @param {object} controllers Controller definitions, keyed by classname
   */
  static install(application, controllers) {
    Object.entries(controllers).forEach(([className, controllerDefinition]) => {
      const controllerName = kebabCase(className).replace(/-controller$/, '')
      application.register(controllerName, controllerDefinition)
    })
  }
}

function kebabCase(str) {
  return str
    .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2')
    .replace(/^-/g, '')
    .toLowerCase()
}
