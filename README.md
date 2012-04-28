Sauron
======
Mediator pattern for Ensighten's client-side MVC framework

Synopsis
--------
Sauron was designed as a core component of the Ensighten client-side framework.

(This is a TODO) It is specialized to restart models and controllers in case a fault occurs (Attribution to Addy Osmani for this idea). This is acheived through an loose channel system for talking between models and controllers.

Sample Code
-----------
Note: Always be sure to require your controller/model before called .start, .stop, or whatever your method is

```
Sauron.start().controller('main', {'main': 'home'}, function () {
  // Do something
});

Sauron.on().controller('home').start(function () {
  // Do something
});

Sauron.model('user').retrieve({'name': 'Ensighten'}, function (Ensighten) {
  // Do something
});
```

API (Quick and Dirty copy from src/Sauron.js)
---------------------------------------------
**Sauron.channel** - Retrieval function for the current channel

 * @param {Boolean} raw If true, prefixing will be skipped
 * @returns {String}


**Sauron.of** - Adds a new subchannel to the current channel

 * @param {String}
 * @returns {this.clone}


**Sauron.on** - Subscribing function for event listeners

 * @param {String} [subchannel] Subchannel to listen to
 * @param {Function} [fn] Function to subscribe with
 * @returns {Sauron|this.clone}


**Sauron.off** - Unsubscribing function for event listeners

 * @param {String} [subchannel] Subchannel to unsubscribe from to
 * @param {Function} [fn] Function to remove subscription on
 * @returns {Sauron|this.clone}


**Sauron.clone** - Returns a cloned copy of this

 * @returns {this.clone}


**Sauron.voice** - Voice/emit command for Sauron

 * @param {String|null} subchannel Subchannel to call on. If it is falsy, it will be skipped
 * @param {Mixed} [param] Parameter to voice to the channel. There can be infinite of these
 * @returns {Sauron}


**Sauron.once** - Suguar subscribe function that listens to an event exactly once

 * @param {String} [subchannel] Subchannel to listen to
 * @param {Function} [fn] Function to subscribe with
 * @returns {this.clone}


**Sauron.noError** - Helper function for error first callbacks. If an error occurs, we will log it and not call the function.

 * @param {Function} fn Function to remove error for
 * @returns {Function} Function that ignores the first parameter for all calls on fn


**<u>ALL METHODS AFTER THIS POINT HAVE THE SAME RESPONSE STRUCTURE</u>**

 * @param {Mixed} \* If there are any arguments (outside of those above), they will be passed to (on, off, once, voice) for invocation
 * @returns {Mixed} If there are more arguments other than those above, the (on, off, once, voice) response will be returned. Otherwise, this.clone


**Sauron.controller** - Method for specifying a controller to use

 * @param {String} controller Controller to use name for
 * See ALL METHODS snippet.


**Sauron.createController** - Method for create controllers

 * @param {String} controller Controller to use name for
 * See ALL METHODS snippet. This will ALWAYS call the (on, off, once, voice) function.


**Sauron.(start|stop)** - Methods for starting/stopping controllers

 * See ALL METHODS snippet.


**Sauron.model** - See Sauron.controller, replace controller with model

**Sauron.createModel** - See Sauron.createMode, replace controller with model

**Sauron.(create|retrieve|update|delete)(Event)?** - Methods for running CRUD with models

 * That is Sauron.create, Sauron.retrieve, Sauron.update, Sauron.delete, Sauron.creatEvent, Sauron.retrieveEvent, Sauron.updateEvent, Sauron.deleteEvent
 * See ALL METHODS snippet.

Pipe Dream Grammar - not yet implemented (and probably will never be due to maintenance and length)
------------------

 * Sauron.create.an.app => Sauron.create().an('app')
 * Sauron.when.an.app.is.created/isCreated => Sauron.when().an('app').is().created()
 * Sauron.an.app.has.been.created => Sauron.an('app').has().been().created()
 * Sauron.start.main
 * Sauron.stop.login
 * Sauron.ignore.when.an.app.is.created => Sauron.ignore(fn).when().an.app.is.created() -- note, a false positive is possible if when('') is used x_x
 * Sauron.the.next.time.an.app.is.created => Sauron.the().next().time().an().app().is().created()