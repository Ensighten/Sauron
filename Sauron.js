// Better sentences
// Sauron.create.an.app => Sauron.create().an('app')
// Sauron.when.an.app.is.created/isCreated => Sauron.when().an('app').is().created()
// Sauron.an.app.has.been.created => Sauron.an('app').has().been().created()
// Sauron.start.main
// Sauron.stop.login
// Sauron.ignore.when.an.app.is.created => Sauron.ignore(fn).when().an.app.is.created() -- note, a false positive is possible if when('') is used x_x
// Sauron.the.next.time.an.app.is.created => Sauron.the().next().time().an().app().is().created()
// These sentences are getting a bit lengthy o_o

// FUCK CHAINING

define(function () {
  var MiddleEarth = {},
      Sauron = {};

  function Palantir() {
    this.stack = [];
  }
  function popStack() {
    return this.stack.pop();
  }
  var PalantirProto = Palantir.prototype = {
    'channel': function () {
      var stack = this.stack,
          controller = this.controller,
          model = this.model,
          channel = stack[stack.length - 1] || '';

      // If there is a controller, prefix the channel
      if (controller !== undefined) {
        channel = 'controller/' + controller + '/' + channel;
      } else if (model !== undefined) {
      // Otherwise, if there is a model, prefix the channel
        channel = 'model/' + model + '/' + channel;
      }

      return channel;
    },
    'pushStack': function (channel) {
      this.stack.push(channel);
    },
    'popStack': popStack,
    'end': popStack,
    'of': function (subchannel) {
      var lastChannel = this.channel(),
          channel = lastChannel + '/' + subchannel;
      this.pushStack(channel);
      return this.clone();
    },
    'on': function (subchannel, fn) {
      // Move the track to do an 'on' action
      this.method = 'on';

      // If there are are arguments
      if (arguments.length > 0) {
        // If there is only one argument and subchannel is a function, promote the subchannel to fn
        if (arguments.length === 1 && typeof subchannel === 'function') {
          fn = subchannel;
          subchannel = null;
        }

        // If there is a subchannel, add it to the current channel
        if (subchannel) {
          this.of(subchannel);
        }

        // If there is a function
        if (fn) {
          // Get the proper channel
          var channelName = this.channel(),
              channel = MiddleEarth[channelName];

          // If the channel does not exist, create it
          if (channel === undefined) {
            channel = [];
            MiddleEarth[channelName] = channel;
          }

          // Save the function to this and context to the function
          this.fn = fn;
          fn.SAURON_CONTEXT = this;

          // Add the function to the channel
          channel.push(fn);

          // This is a terminal event so return Sauron
          return Sauron;
        }
      }

      // Return a clone
      return this.clone();
    },
    'off': function (subchannel, fn) {
      // Move the track to do an 'off' action
      this.method = 'off';

      // If there are are arguments or there is a function
      fn = fn || this.fn;
      if (arguments.length > 0 || fn) {
        // If there is only one argument and subchannel is a function, promote the subchannel to fn
        if (arguments.length === 1 && typeof subchannel === 'function') {
          fn = subchannel;
          subchannel = null;
        }

        // If there is a subchannel, add it to the current channel
        if (subchannel) {
          this.of(subchannel);
        }

        // If there is a function
        if (fn) {
          // Get the proper channel
          var channelName = this.channel(),
              channel = MiddleEarth[channelName] || [],
              i = channel.length;

          // Loop through the subscribers
          while (i--) {
            // If an functions match, remove them
            if (channel[i] === fn) {
              channel.splice(i, 1);
            }
          }

          // This is a terminal event so return Sauron
          return Sauron;
        }
      }

      // Return a clone
      return this.clone();
    },
    'voice': function () {
      // Collect the data and channel
      var args = [].slice.call(arguments),
          channelName = this.channel(),
          channel = MiddleEarth[channelName] || [],
          subscriber,
          i = 0,
          len = channel.length;

      // Loop through the subscribers
      for (; i < len; i++) {
        subscriber = channel[i];

        // Call the function within its original context
        subscriber.apply(subscriber.SAURON_CONTEXT, args);
      }

      // This is a terminal event so return Sauron
      return Sauron;
    },
    'clone': function () {
      var that = this,
          retObj = new Palantir(),
          key;

      for (key in that) {
        if (that.hasOwnProperty(key)) {
          retObj[key] = that[key];
        }
      }

      // Special treatment for the stack
      retObj.stack = [].slice.call(that.stack);

      // Return the modified item
      return retObj;
    },
    'once': function (subchannel, fn) {
      // Move the track to do an 'on' action
      this.method = 'once';

      // If there are arguments
      if (arguments.length > 0) {
        // If there is only one argument and subchannel is a function, promote the subchannel to fn
        if (arguments.length === 1 && typeof subchannel === 'function') {
          fn = subchannel;
          subchannel = null;
        }

        // If there is no function, throw an error
        if (typeof fn !== 'function') {
          throw new Error('Sauron.once expected a function, received: ' + fn.toString);
        }

        // Upcast the function for subscription
        var subFn = function () {
          // Unsubcribe from this
          this.off();

          // Call the function in this context
          var args = [].slice.call(arguments);
          return fn.apply(this, args);
        };

        // Call .on and return
        return this.on(subchannel, subFn);
      }

      // Return a clone
      return this.clone();
    },

    // Controller methods
    'controller': function (controller) {
      this.controller = controller;
      return this.clone();
    },
    'createController': execFn('createController'),
    'start': execFn('start'),
    'stop': execFn('stop'),

    // Model methods
    'model': function (model) {
      this.model = model;
      return this.clone();
    },
    'createModel': execFn('createModel'),
    'create': execFn('create'),
    'retrieve': execFn('retrieve'),
    'update': execFn('update'),
    'delete': execFn('delete'),
    'createEvent': execFn('createEvent'),
    'retrieveEvent': execFn('retrieveEvent'),
    'updateEvent': execFn('updateEvent'),
    'deleteEvent': execFn('deleteEvent')
  };

  function execFn(subchannel) {
    return function () {
      // Add subchannel to the channel
      this.of(subchannel);

      // If there are arguments, perform the normal action
      if (arguments.length > 0) {
        var args = [].slice.call(arguments),
            method = this.method || 'voice';
        return this[method].apply(this, args);
      } else {
      // Otherwise, return a clone
        return this.clone();
      }
    };
  }

  // Copy over all of the items in the Palantir prototype to Sauron such that each one is run on a fresh Palantir
  for (key in PalantirProto) {
    if (PalantirProto.hasOwnProperty(key)) {
      (function (fn) {
        Sauron[key] = function () {
          var args = [].slice.call(arguments);
          return fn.apply(new Palantir(), args);
        };
      }(PalantirProto[key]));
    }
  }

  return Sauron;
});