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
    'can pass a single data item through an event': function () {
      var data = {'a': 'b'},
          actualData;
      Sauron.on('singleData', function (data) {
        actualData = data;
      });
      Sauron.voice('singleData', data);
      assert(actualData === data);
    },
    'can pass a multiple data items through an event':  function () {
      var data1 = {'a': 'b'},
          data2 = {'c': 'd'},
          actualData1,
          actualData2;
      Sauron.on('multiData', function (data1, data2) {
        actualData1 = data1;
        actualData2 = data2;
      });
      Sauron.voice('multiData', data1, data2);
      assert(actualData1 === data1);
      assert(actualData2 === data2);
    },
    'can handle multiple events in one channel': function () {
      var called1 = false,
          called2 = false;
      Sauron.on('multiEvent', function () { called1 = true; });
      Sauron.on('multiEvent', function () { called2 = true; });

      Sauron.voice('multiEvent');

      assert(called1);
      assert(called2);
    }
  }
});

// Intermediate
suite.addBatch({
  'Sauron': {
    'handling multiple events in one channel': {
      'can unsubscribe the proper one': function () {
        var count1 = 0,
            count2 = 0,
            count3 = 0;

        function fn2() { count2 += 1; }
        Sauron.on('multiEvent2', function () { count1 += 1; });
        Sauron.on('multiEvent2', fn2);
        Sauron.on('multiEvent2', function () { count3 += 1; });

        Sauron.voice('multiEvent2');
        Sauron.off('multiEvent2', fn2);
        Sauron.voice('multiEvent2');
        assert(count1 === 2);
        assert(count2 === 1);
        assert(count3 === 2);
      }
    }
  },
  'A subscribed function in Sauron': {
    'can unsubscribe within via this.off()': function () {
      var count = 0;
      Sauron.on('implicitOff', function () {
        count += 1;
        this.off();
      });
      Sauron.voice('implicitOff');
      Sauron.voice('implicitOff');
      assert(count === 1);
    }
  }
});

function worksProperly(mvcType, methodName) {
  return {
    'works properly': function () {
      var data = {'a': 'b'},
          actualData;
      Sauron.controller('test').on()[methodName](function (data) {
        actualData = data;
      });
      Sauron.controller('test')[methodName](data);
      assert(data === actualData);
    }
  };
}
worksProperly.controller = function (methodName) {
  return worksProperly('controller', methodName);
};

// TODO: Test createController, createModel as well as new-paradigm of .make

// Controller sugar
suite.addBatch({
  'Sauron': {
    'has a start method for models that': worksProperly.controller('start'),
    'has a stop method for models that': worksProperly.controller('stop')
  }
});

worksProperly.model = function (methodName) {
  return worksProperly('model', methodName);
};

// Model sugar
suite.addBatch({
  'Sauron': {
    'has a create method for models that': worksProperly.model('create'),
    'has a retrieve method for models that': worksProperly.model('retrieve'),
    'has a update method for models that': worksProperly.model('update'),
    'has a delete method for models that': worksProperly.model('delete')
  }
});

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