define('Sauron', function () {
  var MiddleEarth = {},
      Sauron = new Palantir();

  function Palantir() {
    this.stack = [];
  }
  function pushStack(subchannel) {
    this.stack.push(subchannel);
  }
  function popStack() {
    return this.stack.pop();
  }
  Palantir.prototype = {
    'channel': function () {
      return this.stack.join('/');
    },
    'pushStack': pushStack,
    'popStack': popStack,
    'of': pushStack,
    'end': popStack,
    'on': function (subchannel, fn) {
      // If there is only one argument, promote the subchannel to fn
      if (arguments.length === 1) {
        fn = subchannel;
        subchannel = null;
      }

      // If there is a subchannel
      if (subchannel) {
        // Add it to the stack
        this.pushStack(subchannel);
      }

      // Add the function to its proper channel
      var channelName = this.channel(),
          channel = MiddleEarth[channelName];
      
      // If the channel does not exist, create it
      if (channel === undefined) {
        channel = [];
        MiddleEarth[channelName] = channel;
      }
      
      // Add the function to the channel
      fn.push(channel);
      
      // If there is a subchannel, remove it from the stack
      if (
    },
    'off': function (subchannel, fn) {
    
    }
  };

  return Sauron;
});