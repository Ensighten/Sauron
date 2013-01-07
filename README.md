Sauron
======
Mediator pattern for Ensighten's client-side MVC framework

Synopsis
--------
Sauron was designed as a core component of the Ensighten client-side framework; providing a loose channel system for talking between models and controllers.

Getting Started
---------------
Download the [production version][min] ([vanilla][min] or [requirejs][min_require]) or the [development version][max] ([vanilla][max] or [requirejs][max_require]).

[min]: https://raw.github.com/Ensighten/Sauron/master/dist/Sauron.require.min.js
[max]: https://raw.github.com/Ensighten/Sauron/master/dist/Sauron.require.js
[min]: https://raw.github.com/Ensighten/Sauron/master/dist/Sauron.min.js
[max]: https://raw.github.com/Ensighten/Sauron/master/dist/Sauron.js

In your web page:

```html
<script src="jquery.js"></script>
<script src="dist/Sauron.min.js"></script>
<script>
// Start the main controller on the home page
Sauron.start().controller('main', {'page': 'home'});
</script>
```

Documentation
-------------
Sauron can talk in the `controller`, `model`, or no namespace.

Within all namespaces, we can modify events to be subscriptions, `on`, unsubscriptions, `off`, or emissions/triggers, `voice`. By default, if a namespace has a terminating method called (e.g. `start` for `controller`) and there is no modifier, `voice` will be called.

Terminating methods for the `controller` namespace are `start` and `stop`.
```js
Sauron.start().controller('home', {'some': 'data'});
```

Terminating methods for the `model` namespace are `create`, `retrieve`, `update`, `delete`, `createEvent`, `updateEvent`, and `deleteEvent`.
```js
Sauron.model('app').retrieve({'id': 1}, function (err, app) {
  // Inspect app
});
```

Examples
--------
### Listening for an event
```js
Sauron.on().controller('home').start(function () {
  console.log('A home controller has been started');
});
```

### Triggering an event
```js
Sauron.model('user').create({'name': 'John Doe'});
```

### Unsubscribing from an event internally
```js
Sauron.on().model('page').createEvent(function () {
  console.log('New page created');
  this.off();
});
```

### Unsubscribing from an event externally
```js
var subFn = function () {
  console.log('Stop was called');
};
Sauron.on().controller('about').stop(subFn);
Sauron.off().controller('about').stop(subFn);
```

API
---
```js
Sauron.channel([raw]);
/**
 * Retrieval function for the current channel
 * @param {Boolean} [raw] If true, prefixing will be skipped
 * @returns {String}
 */

Sauron.of(subchannel);
/**
 * Adds a new subchannel to the current channel
 * @param {String} subchannel
 * @returns {this.clone}
 */

Sauron.on([subchannel], [fn]);
/**
 * Subscribing function for event listeners
 * @param {String} [subchannel] Subchannel to listen to
 * @param {Function} [fn] Function to subscribe with
 * @returns {this.clone}
 */

Sauron.off([subchannel], [fn]);
/**
 * Unsubscribing function for event listeners
 * @param {String} [subchannel] Subchannel to unsubscribe from to
 * @param {Function} [fn] Function to remove subscription on
 * @returns {this.clone}
 */

Sauron.voice(subchannel, [param1], [param2], ...);
/**
 * Voice/emit command for Sauron
 * @param {String|null} subchannel Subchannel to call on. If it is falsy, it will be skipped
 * @param {Mixed} [param] Parameter to voice to the channel. There can be infinite of these
 * @returns {Sauron}
 */

Sauron.clone();
/**
 * Returns a cloned copy of this
 * @returns {this.clone}
 */

Sauron.once([subchannel], [fn]);
/**
 * Sugar subscribe function that listens to an event exactly once
 * @param {String} [subchannel] Subchannel to listen to
 * @param {Function} [fn] Function to subscribe with
 * @returns {this.clone}
 */

Sauron.noError(fn);
/**
 * Helper function for error first callbacks. If an error occurs, we will log it and not call the function.
 * @param {Function} fn Function to remove error for
 * @returns {Function}
 */

// CONTROLLER METHODS

Sauron.controller(controller);
/**
 * Fluent method for calling out a controller
 * @param {String} controller Name of the controller to invoke
 * @param {Mixed} * If there are any arguments, they will be passed to (on, off, once, voice) for invocation
 * @returns {Mixed} If there are more arguments than controller, the (on, off, once, voice) response will be returned. Otherwise, this.clone
 */

Sauron.createController(controller);
/**
 * Method for creating controllers
 * @param {String} controller Controller to use name for
 * This will ALWAYS call the (on, off, once, voice) function.
 */

Sauron.start([param1], [param2], ...);
Sauron.stop([param1], [param2], ...);
/**
 * Methods for starting/stopping controllers. Will call previous action if there was any (e.g. on, off, once).
 */

// MODEL METHODS

Sauron.model(model);
// Same as Sauron.controller except for models

Sauron.createModel(model);
// Same as Sauron.createController except for models

Sauron.(create|retrieve|update|delete)(Event)?([param1], [param2], ...);
// Same as Sauron.start except for models
// Names expand to create, createEvent, retrieve, ..., deleteEvent
```

Contributing
------------
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint your code using [grunt](http://gruntjs.com/) and test via the [instructions below](#testing).

_Also, please don't edit files in the "dist" or "stage" subdirectories as they are generated via grunt. You'll find source code in the "lib" subdirectory!_

Testing
-------
The test suite is written in [Mocha](http://visionmedia.github.com/mocha/) (with a [crossbones][crossbones] wrapper) for in-browser testing. Start up the server, navigate to the [test page][testPage], and the test will begin.
```js
# If you do not have serve installed, install it
sudo npm install -g serve

# Begin hosting a server
serve

# Navigate to the test page
{{browser}} http://localhost:3000/src-test/Sauron.test.html
```

[crossbones]: https://github.com/Ensighten/crossbones
[testPage]: http://localhost:3000/src-test/Sauron.test.html

License
-------
Copyright (c) 2013 Ensighten
Licensed under the MIT license.