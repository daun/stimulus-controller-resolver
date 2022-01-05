import { AttributeObserver } from '@hotwired/stimulus'

/**
 * Resolver that loads controllers as async chunks
 */

export default class DynamicControllerResolver {
  constructor(application, resolverFn) {
    this.application = application
    this.resolverFn = resolverFn
    this.controllerAttr = application.schema.controllerAttribute
    this.loadingControllers = {}
    this.loadControllersForElement = this.loadControllersForElement.bind(this)

    this.observer = new AttributeObserver(
      application.element,
      this.controllerAttr,
      {
        elementMatchedAttribute: this.loadControllersForElement,
        elementAttributeValueChanged: this.loadControllersForElement
      }
    )
  }

  /**
   * Install resolver for dynamically loaded controllers
   *
   * @param {*} application Stimulus application
   * @param {function} resolverFn Function that takes a controller name and returns a Promise resolving to the corresponding controller class definition
   */
  static install(application, resolverFn) {
    const instance = new this(application, resolverFn)
    instance.start()
    return instance
  }

  start() {
    this.observer.start()
  }

  stop() {
    this.observer.stop()
  }

  loadControllersForElement(element) {
    const controllers = this.getControllerDataFromElement(element)
    controllers.forEach((controller) => this.loadController(controller))
  }

  loadController({ controllerName }) {
    if (!this.isControllerLoaded(controllerName)) {
      this.loadControllerDefinition(controllerName)
    }
  }

  async loadControllerDefinition(controllerName) {
    if (
      this.loadingControllers[controllerName] ||
      this.isControllerLoaded(controllerName)
    ) {
      return
    }

    this.loadingControllers[controllerName] = true

    const controllerDefinition = await this.resolverFn(controllerName)
    if (controllerDefinition) {
      this.application.register(controllerName, controllerDefinition)
    }

    delete this.loadingControllers[controllerName]
  }

  isControllerLoaded(controllerName) {
    return this.application.router.modulesByIdentifier.has(controllerName)
  }

  getControllerDataFromElement(element) {
    const controllerAttr = element.getAttribute(this.controllerAttr)
    const controllerNames = controllerAttr.split(/\s+/)

    return controllerNames.map((controllerName) => {
      return { element, controllerName }
    })
  }
}
