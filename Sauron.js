/**
 * Global mediator
 * Attribution to O'Reilly JavaScript Patterns by Stoyan Stefanov
 */
!function (name, definition) {
  if (typeof define === 'function') {
    define(definition);
  } else if (typeof module !== 'undefined') {
    module.exports = definition();
  } else {
    this[name] = definition();
  }
}('Sauron', function () {
  // TODO: Make into function that when run calls .exec [auto pub's to 'all'] Sauron('hey'), Sauron.of('moo')('hey')
  var Sauron = {},
      _SauronProto;

  /**
   * Sauron constructor function
   * @returns {Object<_Sauron>} Instance of Sauron
   */
  function _Sauron() {}

  var ACTION_KEY = '_action',
      CHANNEL_KEY = '_channel',
      SUB_DATA_KEY = '_sub_data',
      PUB_DATA_KEY = '_pub_data',
      DEBUG_KEY = '_debug';

  // Bind prototype of create object
  _Sauron.prototype = _SauronProto = {
    // Default settings
    'channels': {},
    // Note: These should remain in check with the 'constants' above
    '_channel': '',
    '_action': 'voice',
    /**
     * Execution function for Sauron instance. Takes a specific channel and interacts with subscribers depending on action
     * @returns {Object<_Sauron>} this
     */
    'exec': function () {
      // Collect data for quick check
      var channel = this.get(CHANNEL_KEY),
          action = this.get(ACTION_KEY),
          args = this.get(PUB_DATA_KEY),
          fn = this.get(SUB_DATA_KEY),
          debug = this.get(DEBUG_KEY);

      if (debug === true) {
        console.log('Action: ' + action + '\nChannel: ' + channel + '\nSubData: ' + fn + '\nPubData: ' + JSON.stringify(args));
      }

      // If the action is voice
      if (action === 'voice') {
        // and no arguments have been passed in
        if (!args || args.length === 0) {
          // Do nothing
          return this;
        }
      } else {
      // Otherwise, the action is on or off
        // and if the function is undefined
        if (fn === undefined) {
          // Do nothing
          return this;
        }
      }

      var channels = this.channels,
          subscribers,
          i,
          eachFn;

      if (action === 'on') {
        // Localize the channelName
        // If the channel does not exist, create it
        if (!channels[channel]) {
          channels[channel] = [];
        }

        // To prevent further alteration of context, create and return a new Sauron
        var context = this.clone();

        // Add the event to the channel and capture the context
        channels[channel].push({'fn': fn, 'context': context});
      } else {
        // Collect the proper variables
        subscribers = channels[channel] || [];
        i = subscribers.length;

        // Create the appropriate each fn
        if (action === 'voice') {
          _eachFn = function (subscriber) {
            // Localize function and context
            var fn = subscriber.fn,
                context = subscriber.context,
                _oldAction = context.get(ACTION_KEY),
                _oldFn = context.get(SUB_DATA_KEY);

            // Set up function for the context and default action to voice as normal
            context.set(ACTION_KEY, 'voice');
            context.fn(fn);

            // Execute the function within the proper context
            fn.apply(context, args);

            // Return the function and action to as it was before
            context.set(ACTION_KEY, _oldAction);
            context.fn(_oldFn);
          };
        } else {
        // Otherwise, assume 'off'
          _eachFn = function (subscriber) {
            // If the function matches, remove it
            if (subscriber.fn === fn) {
              subscribers.splice(i, 1);
            }
          };
        }

        // Reverse loop for unsubscribing
        while ( i-- ) {
          // Call the each function on each item
          _eachFn(subscribers[i]);
        }
      }

      // Keep a fluent interface
      return this;
    },
    /**
     * Sets action to 'voice' and executes if any parameters are passed
     * @param {Mixed} param1 Data to announce to current channel to with. There can be as many parameters as we want
     * @returns {Object<_Sauron>} this
     */
    'voice': function () {
      var args;
      this.set(ACTION_KEY, 'voice');
      args = [].slice.call(arguments);
      this.pubData(args);
      this.exec();
      return this;
    },
    /**
     * Semantic resetter. Clears out action, pubData, and subData.
     * @returns {Object<_Sauron>} this
     // TODO: Test more
     */
    'and': function () {
      delete this[ACTION_KEY];
      delete this[PUB_DATA_KEY];
      delete this[SUB_DATA_KEY];
      return this;
    },
    /**
     * Sets action to 'on' and if a function is set, listens to the current channel with that function
     * @param {Function} [fn] Function to listen with
     * @returns {Object<_Sauron>} this
     */
    'on': function (fn) {
      this.set(ACTION_KEY, 'on');
      this.subData(fn);
      this.exec();
      return this;
    },
    /**
     * Sets action to 'off' and if a function is set, unbinds that function from the current channel
     * @param {Function} [fn] Function to unbind
     * @returns {Object<_Sauron>} this
     */
    'off': function (fn) {
      this.set(ACTION_KEY, 'off');
      this.subData(fn);
      this.exec();
      return this;
    },
    /**
     * Listens to current channel and executes function exactly once
     * @param {Function} fn Function to execute once
     * @returns {Object<_Sauron>} this
     */
    'once': function (fn) {
      // Subscribe to be called
      this.on(function () {
        // Collect arguments and call intended function
        var args = [].slice.call(arguments);
        fn.apply(this, args);

        // Unsubscribe after one call
        this.off();
      });
      return this;
    },
    /**
     * Retrieve data from the current instance
     * @param {String} key Key to retrieve value of
     * @returns {Mixed} Value stored under key
     */
    'get': function (key) {
      return this[key];
    },
    /**
     * Sets data on the current instance under a certain key
     * @param {String} key Key to store under
     * @param {Mixed} [val] Value to store
     * @returns {Object<_Sauron>} this
     */
    'set': function (key, val) {
      this[key] = val;
      return this;
    },
    /**
     * Sugar for setting channel
     * @param {String} channel Channel to listen to
     * @returns {Object<_Sauron>} this
     */
    'channel': function (channel) {
      this.set(CHANNEL_KEY, channel);
      return this;
    },
    /**
     * Sugar for appending to channels
     // TODO: Swap out prod code with actual uses of this
     // TODO: Test
     * @param {String} channel Channel to append on current channel
     * @returns {Object<_Sauron>} this
     */
    'of': function (channel) {
      this.set(CHANNEL_KEY, this.get(CHANNEL_KEY) + channel);
      return this;
    },
    /**
     * Sugar for setting the on/off function
     * @param {Function} fn Function to set to current instance
     * @returns {Object<_Sauron>} this
     */
    'subData': function (fn) {
      if (fn) {
        this.set(SUB_DATA_KEY, fn);
      }
      return this;
    },
    /**
     * Legacy name for subData
     * @see subData
     // TODO: Remove me
     */
    'fn': function (fn) {
      return this.subData(fn);
    },
    /**
     * Sugar for setting the pub data
     // TODO: Test me
     * @param {Array<Mixed>} data Data to store for publications
     * @returns {Object<_Sauron>} this
     */
    'pubData': function (data) {
      if (data && data.length > 0) {
        this.set(PUB_DATA_KEY, data);
      }
      return this;
    },
    /**
     * Sugar for storing either pub/sub data depending on the current action
     * @param {Array<Mixed>} data Data to pass onto the proper method
     * @returns {Object<_Sauron>} this
     // TODO: Test me
     */
    'saveData': function (data) {
      if (this.get(ACTION_KEY) === 'voice') {
        this.pubData(data);
      } else {
        this.subData.apply(this, data);
      }
      return this;
    },
    // TODO: Test
    'debug': function (debug) {
      this.set(DEBUG_KEY, debug);
      return this;
    },
    // TODO: Test
    'clone': function () {
      var clone = new _Sauron(),
          key;

      for (key in this) {
        if (this.hasOwnProperty(key)) {
          clone[key] = this[key];
        }
      }

      return clone;
    }
  };

  // Calls should look like (invoked at the end)
  // Sauron.of(channel).on(function)
  // Sauron.on('channel', function)
  // Sauron.start().controller(name, params)
  // Sauron.controller(name).on().startComplete(fn)
  // Sauron.on().controller(name).start(fn)
  // TODO: Sauron.create('HtmlController').controller(name, params).start(container).stop()
  // Sauron.off().createModel('Crud', fn) [cannot use new since it is reserved]
  // Sauron.fn(fn).on().createController('Base')
  // Sauron.createModelComplete('Crud', params)
  // Sauron.on().createControllerComplete('Html', fn)
  // TODO: Sauron.controller(name).model(name).create('HtmlController') [ambiguity case]

  // Avoid controller/model collisions by using the type key to namespace
  var CREATE_TYPE_KEY = 'createType',
      CONTROLLER_NAME_KEY = 'controllerName',
      CONTROLLER_METHOD_KEY = 'controllerMethod',
      MODEL_NAME_KEY = 'modelName',
      MODEL_METHOD_KEY = 'modelMethod';

  /** BEGIN: Sauron.create logic **/
  // This has no sub-methods yet as with controller and model
  /**
   * Execution check for createController and createModel. Automatically requires controllers/models
   * @param {String} parentName Name of parent controller to build on
   * @param {Object} params Parameter object to pass onto parentName constructor
   * @returns {Object<_Sauron>} this
   */
  _SauronProto._createExec = function (parentName, params) {
    var action = this.get(ACTION_KEY),
        createType = this.get(CREATE_TYPE_KEY),
        createReqPrefix,
    // We use a string for throwing errors if the
        reqArr = [],
        dataArgs = [].slice.call(arguments, 1),
    // TODO: Rename to controller/createComplete/HtmlController
        channel = 'create/' + createType + '/' + parentName,
        that = this;

    // Set up the proper channel
    that.channel(channel);

    // If we are making new object, require it first
    if( action === 'voice' && params ) {
      createReqPrefix = 'mvc!' + (createType === 'controller' ? 'c' : 'm') + '/';

      // TODO: Clean up
      reqArr.push( createReqPrefix + parentName );
      reqArr.push( createReqPrefix + params.name );
    }

    // Require the controller/model if requested
    require(reqArr, function () {
      // Must modify channel since require is async
      var oldChannel = that.get(CHANNEL_KEY);
      that.channel(channel);

      // Call the intended action
      that[action].apply(that, dataArgs);

      // Return to the current channel
      that.channel(oldChannel);
    });

    // Continue the fluent interface
    return this;
  };

  /**
   * Method for listenining/broadcasting/unbinding to creation of controllers
   * @see _createExec
   */
  _SauronProto.createController = function () {
    var args = [].slice.call(arguments);
    this.set(CREATE_TYPE_KEY, 'controller');
    return this._createExec.apply(this, args);
  };

  /**
   * Method for listenining/broadcasting/unbinding to creation of models
   * @see _createExec
   */
  _SauronProto.createModel = function () {
    var args = [].slice.call(arguments);
    this.set(CREATE_TYPE_KEY, 'model');
    return this._createExec.apply(this, args);
  };

  // TODO: DRY with _createExec
  /**
   * Automatic channel for all creation completion calls
   * @param {String} parentName Name of parent object that actions will be in relation to
   * @returns {Object<_Sauron>} this
   */
  _SauronProto._createCompleteExec = function (parentName) {
    var action = this.get(ACTION_KEY),
        createType = this.get(CREATE_TYPE_KEY),
        dataArgs = [].slice.call(arguments, 1);

    // Set up the proper channel
    // TODO: Rename to controller/createComplete/HtmlController
    this.channel('createComplete/' + createType + '/' + parentName);

    // Call the intended action
    this[action].apply(this, dataArgs);

    return this;
  };

  /**
   * Callback channel for when a controller is done being constructed
   * @see _createCompleteExec
   */
  _SauronProto.createControllerComplete = function () {
    var args = [].slice.call(arguments);
    this.set(CREATE_TYPE_KEY, 'controller');
    return this._createCompleteExec.apply(this, args);
  };

  /**
   * Callback channel for when a model is done being constructed
   * @see _createCompleteExec
   */
  _SauronProto.createModelComplete = function () {
    var args = [].slice.call(arguments);
    this.set(CREATE_TYPE_KEY, 'model');
    return this._createCompleteExec.apply(this, args);
  };
  /** END: Sauron.create logic **/

  /** BEGIN: Controller + model methods **/
  /**
   * Channels all calls to controller-related actions
   * @param {Mixed} param1 Any parameter to pass onto final call
   * @returns {Object<_Sauron>} this
   */
  _SauronProto._controllerExec = function () {
    var action,
        contrName = this.get(CONTROLLER_NAME_KEY),
        contrMethod = this.get(CONTROLLER_METHOD_KEY),
        args = [].slice.call(arguments);

    // Set it to controller/controllerName/method
    this.channel('controller/' + contrName + '/' + contrMethod);
    this.saveData(args);

    if (contrName !== undefined && contrMethod !== undefined) {
      // Collect action
      action = this.get(ACTION_KEY);

      // Invoke action
      this[action]();
    }
    return this;
  };

  /**
   * Channel all controller methods to this controller
   * @param {String} controllerName Name of controller to relate to
   * @returns {Object<_Sauron>} this
   */
  _SauronProto.controller = function (controllerName) {
    var dataArgs = [].slice.call(arguments, 1);

    // Save the controller key
    this.set(CONTROLLER_NAME_KEY, controllerName);

    // Call controllerExec with reduced arguments
    this._controllerExec.apply(this, dataArgs);

    // Return for a fluent interface
    return this;
  };

  // TODO: DRY with the above
  /**
   * Channels all calls to model-related actions
   * @param {Mixed} param1 Any parameter to pass onto final call
   * @returns {Object<_Sauron>} this
   */
  _SauronProto._modelExec = function () {
    var action,
        modelName = this.get(MODEL_NAME_KEY),
        modelMethod = this.get(MODEL_METHOD_KEY),
        args = [].slice.call(arguments);

    // Set it to controller/controllerName/method
    this.channel('model/' + modelName + '/' + modelMethod);
    this.saveData(args);

    if (modelName !== undefined && modelMethod !== undefined) {
      action = this.get(ACTION_KEY);

      // Invoke action
      this[action]();
    }
    return this;
  };

  /**
   * Channel all model methods to this model
   * @param {String} modelName Name of model to relate to
   * @returns {Object<_Sauron>} this
   */
  _SauronProto.model = function (modelName) {
    var dataArgs = [].slice.call(arguments, 1);

    // Save the controller key
    this.set(MODEL_NAME_KEY, modelName);

    this._modelExec.apply(this, dataArgs);

    // Return for a fluent interface
    return this;
  };

  /**
   * @function Sauron.(start|stop)
   * Start/stop method for controllers
   */
  /**
   * @function Sauron.(start|stop)Complete
   * Start/stop complete method for controllers
   */

  /**
   * @function Sauron.(create|retrieve|update|delete)
   * CRUD method for models
   */
  /**
   * @function Sauron.(create|retrieve|update|delete)Event
   * CRUD event method for models
   */
  /**
   * @function Sauron.(create|retrieve|update|delete)Complete
   * CRUD complete method for models
   */

  /**
   * We do .start and .startComplete instead of .start().complete()
   * so that we can do alternative chains like .startComplete().stop()
   * without accidentally perminently setting contexts
   */
   // TODO: Make these construct into contrRoutes, modelRoutes, allRoutes
   // TODO: Then do the bindings for all routes [much reduced nesting]
  var routes = [
        { 'method_key': CONTROLLER_METHOD_KEY,
          'exec_key': '_controllerExec',
          'baseMethods': ['start', 'stop'],
          'methods': ['', 'Complete'] },
        { 'method_key': MODEL_METHOD_KEY,
          'exec_key': '_modelExec',
          'baseMethods': ['create', 'retrieve', 'update', 'delete'],
          'methods': ['', 'Complete', 'Event'] }],
      route,
      i,
      method_key,
      name_key,
      exec_key,
      baseMethods,
      baseMethod,
      j,
      methods,
      method,
      k,
      fullMethod;

  for( i = routes.length; i--; ) {
    // Localize object data
    route = routes[i];
    method_key = route.method_key;
    exec_key = route.exec_key;
    baseMethods = route.baseMethods;
    methods = route.methods;

    // Iterate the baseMethods and methods, then populate the methods
    for( j = baseMethods.length; j--; ) {
      baseMethod = baseMethods[j];
      for( k = methods.length; k--; ) {
        method = methods[k];

        // Compound into normal method
        fullMethod = baseMethod + method;

        // Closure the full method, method_key, exec_key
        (function(fullMethod, method_key, exec_key){
          _SauronProto[fullMethod] = function () {
            var args = [].slice.call(arguments);

            // Set up the controller/model method
            this.set(method_key, fullMethod);

            // Invoke execution method
            this[exec_key].apply(this, args);

            return this;
          };
        }(fullMethod, method_key, exec_key));
      }
    }
  }
  /** END: Controller + model methods **/

  // Wrapper object will create a new Sauron object instead of doing Sauron() each time
  var key;
  for( key in _SauronProto ) {
    if( _SauronProto.hasOwnProperty(key) ) {
      Sauron[key] = (function(key){
        return function () {
          var s = new _Sauron(),
              args = [].slice.call(arguments);
          return s[key].apply(s, args);
        };
      }(key));
    }
  }

  return Sauron;
});