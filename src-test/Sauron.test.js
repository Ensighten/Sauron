require(['../src/Sauron'], function (Sauron) {
var suite = new Skeleton('Mason.js');

// Super basics
suite.addBatch({
  'Sauron': {
    'is an object': function () {
      assert(typeof Sauron === 'object');
    },
    'can emit events': function () {
      Sauron.voice('hello');
    },
    'can set up functions to subscribe to events': function () {
      var works = false;
      Sauron.on('basicOn', function () {
        works = true;
      });
      Sauron.voice('basicOn');
      assert(works);
    },
    'can unsubscribe functions from events': function () {
      var count = 0;
      function basicOff() {
        count += 1;
      }

      Sauron.on('basicOff', basicOff);
      Sauron.voice('basicOff');
      Sauron.off('basicOff', basicOff);
      Sauron.voice('basicOff');
      assert(count === 1);
    }
  }
});

// Basics
suite.addBatch({
  'Sauron': {
    'can pass a single data item through an event': '',
    'can pass a multiple data items through an event': ''
  // Sauron can handle multiple events in one channel
  }
});

// Intermediate
  // Sauron handling multiple events in one channel can unsubscribe the proper one

// Controller sugar

// Model sugar

// Kitchen sink
suite.addBatch({
  'Sauron': {
    'can fire an event once': function () {
      var count = 0;
      Sauron.once('onceTest', function () {
        count += 1;
      });
      Sauron.voice('onceTest');
      Sauron.voice('onceTest');
      assert(count === 1);
    }
  }
});

suite.exportTo('Mocha');
mocha.run();
});