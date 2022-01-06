import DynamicControllerResolver from './dynamic-resolver'

import {
  whenEventTriggered,
  whenIdle,
  whenMediaMatches,
  whenVisible
} from './strategies'

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

    const loadController = () => super.loadController(controller)

    switch (loadBehavior) {
      case 'event':
        return whenEventTriggered(loadController, { event: loadOptions })
      case 'idle':
        return whenIdle(loadController)
      case 'media':
        return whenMediaMatches(loadController, { query: loadOptions })
      case 'visible':
        return whenVisible(loadController, { element, expand: loadOptions })
      default:
        return loadController()
    }
  }

  getControllerDataFromElement(element) {
    const controllers = super.getControllerDataFromElement(element)
    const { loadBehavior, loadOptions } =
      this.getLoadBehaviorFromElement(element)

    // Add load behavior and load options to available controller data
    return controllers.map((controller) => {
      return { ...controller, loadBehavior, loadOptions }
    })
  }

  getLoadBehaviorFromElement(element) {
    const loadBehaviorAttr = element.getAttribute(this.loadBehaviorAttr) || ''
    const [loadBehavior, ...loadOptionsRest] = loadBehaviorAttr.split(':')
    const loadOptions = loadOptionsRest.join(':')
    return { loadBehavior, loadOptions }
  }
}
