# Stimulus Resolvers

[![NPM version](https://img.shields.io/npm/v/stimulus-resolvers?color=97aab4)](https://www.npmjs.com/package/stimulus-resolvers)
[![GitHub license](https://img.shields.io/github/license/daun/stimulus-resolvers?color=97aab4)](./LICENSE)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/stimulus-resolvers?color=97aab4&label=size)](https://bundlephobia.com/result?p=stimulus-resolvers)
<!-- [![GitHub (pre-)release date](https://img.shields.io/github/release-date-pre/daun/stimulus-resolvers?label=updated)](https://github.com/daun/stimulus-resolvers/releases) -->

Load Stimulus controllers lazily and/or conditionally.

Includes three resolvers:

- [Static](#static-resolver) for direct imports
- [Dynamic](#dynamic-resolver) for lazyloading controllers as dynamic imports
- [Conditional](#conditional-resolver) for lazyloading controllers under customizable conditions:
  - element enters the viewport
  - media query is matched
  - browser is idle
  - event is triggered

## Installation

```bash
npm install stimulus-resolvers
```

## Resolvers

### Static Resolver

Import controllers as static definitions, whether any elements are using the controller or not.
Useful for global controllers used on all pages.

```js
import { Application } from '@hotwired/stimulus'
import { StaticControllerResolver } from 'stimulus-resolvers'

import ButtonController from './controllers/button-controller'
import CartController from './controllers/cart-controller'

const application = Application.start()

StaticControllerResolver.install(application, {
  ButtonController,
  CartController
})
```

### Dynamic Resolver

Load controllers lazily once an element using the controller is found. Requires a custom async
resolver function that takes the controller name and returns the controller's class definition.

```js
import { Application } from '@hotwired/stimulus'
import { DynamicControllerResolver } from 'stimulus-resolvers'

const application = Application.start()

DynamicControllerResolver.install(application, (controllerName) => {
  return import(`./controllers/${controllerName}-controller`).then(controller => controller.default)
})
```

### Conditional Resolver

Load controllers lazily once an element using the controller is found **and** an optional condition
is met:

- `visible`: element enters the viewport
- `media`: media query is matched
- `idle`: browser is idle
- `event`: custom event is triggered

Requires the same custom async resolver function of the dynamic resolver.

```js
import { Application } from '@hotwired/stimulus'
import { ConditionalControllerResolver } from 'stimulus-resolvers'

const application = Application.start()

ConditionalControllerResolver.install(application, (controllerName) => {
  return import(`./controllers/${controllerName}-controller`).then(controller => controller.default)
})
```

Define your controllers as usual, then set the conditions for loading it using the
`data-controller-load-when` attribute.

#### Condition: element visible

Controller is loaded when its element enters the viewport.

```html
<div data-controller="example" data-controller-load-when="visible">
    Will load when the element enters the viewport.
</div>
```

#### Condition: media query

Controller is loaded when the window matches a specified media query.

```html
<div data-controller="example" data-controller-load-when="media:(min-width: 600px)">
    Will load when the window is at least 600px wide.
</div>
```

#### Condition: browser idle

Controller is loaded when the browser is idle. Uses `requestIdleCallback` where supported, falls
back to a one-second timeout otherwise.

```html
<div data-controller="example" data-controller-load-when="idle">
    Will load when the browser is idle.
</div>
```

#### Condition: event triggered

Controller is loaded when an event is fired on (or bubbles up to) the document.

```html
<div data-controller="example" data-controller-load-when="event:my-custom-event">
    Will load when a custom event is fired.
</div>
```

Triggering the event manually will load the controller:

```js
document.dispatchEvent(new CustomEvent('my-custom-event', { bubbles: true }))
```

## Combining resolvers

To include some controllers in the main bundle but load all other controllers lazily,
install both the static resolver as well as either one of the dynamic resolvers.

```js
import { Application } from '@hotwired/stimulus'
import { StaticControllerResolver, DynamicControllerResolver } from 'stimulus-resolvers'

import ButtonController from './controllers/button-controller'
import CartController from './controllers/cart-controller'

// Core controllers included in the main bundle as static imports
// All other controllers are loaded from dynamic imports
const coreControllers = {
  ButtonController,
  CartController
}

const application = Application.start()
StaticControllerResolver.install(application, coreControllers)
DynamicControllerResolver.install(application, (controllerName) => {
  return import(`./controllers/${controllerName}-controller`).then(controller => controller.default)
})
```

## Credits

Based on original work in [stimulus-controller-resolver](https://github.com/danieldiekmeier/stimulus-controller-resolver) by [Daniel Diekmeier](https://github.com/danieldiekmeier).

## License

[MIT](https://opensource.org/licenses/MIT)
