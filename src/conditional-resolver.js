import DynamicControllerResolver from './dynamic-resolver'

import { whenIdle, whenVisible, whenMediaMatches } from './strategies'

/**
 * Resolver that loads controllers as async chunks when conditions match
 */
export default class ConditionalControllerResolver extends DynamicControllerResolver {
  /**
   * Install resolver for conditionally loaded controllers
   *
   * @param {*} application Stimulus application
   * @param {function} resolverFn Function that takes a controller name and returns a Promise resolving to the corresponding controller class definition
   */
  static install(application, resolverFn) {
    return super.install(application, resolverFn)
  }

  get loadBehaviorAttr() {
    return `${this.controllerAttr}-load-when` // data-controller-load-when
  }

  loadController(controller) {
    const { element, controllerName, loadBehavior, loadOptions } = controller

    if (this.isControllerLoaded(controllerName)) {
      return true
    }

    console.log(
      `Loading controller conditionally: ${controllerName} / ${loadBehavior} / ${loadOptions}`
    )

    const loadController = () => super.loadController(controller)

    switch (loadBehavior) {
      case 'idle':
        return whenIdle(loadController)
      case 'visible':
        return whenVisible(loadController, { element, expand: loadOptions })
      case 'media':
        return whenMediaMatches(loadController, { query: loadOptions })
      default:
        return loadController()
    }
  }

  getControllerDataFromElement(element) {
    const controllers = super.getControllerDataFromElement(element)

    const loadBehaviorAttr = element.getAttribute(this.loadBehaviorAttr) || ''
    const [loadBehavior, ...loadOptionsRest] = loadBehaviorAttr.split(':')
    const loadOptions = loadOptionsRest.join(':')

    return controllers.map(({ controllerName }) => {
      return { element, controllerName, loadBehavior, loadOptions }
    })
  }
}
