function fail(msg) {
  throw Error(msg);
}
function assert(a, b) {
  if (a !== b) {
    fail('Expected: ' + a + ' Actual: ' + b);
  }
}
var assertEqual = assert;
function assertNotEqual(a, b) {
  if (a === b) {
    fail('Expected ' + a + ' to not equal ' + b);
  }
}
function assertDeepEqual(a, b) {
  if (a === b) { return; }

  var typeofA = typeof a,
      key;
  if (typeofA !== typeof b) {
    fail(a + ' is not the same type of ' + b);
  } else if ( typeofA === 'object' ) {
    for (key in a) {
      assertDeepEqual(a[key], b[key]);
    }
    for (key in b) {
      assertDeepEqual(a[key], b[key]);
    }
  } else {
    assert(a, b);
  }
}

// TODO: once + fn
// TODO: on().fn() [same for .off]
require(['./Sauron.js'], function (Sauron) {
  describe('Sauron', function () {
    // Set up counter for asserts
    var onCount = 0;
    function _onFn() {
      onCount += 1;
    }
    describe('#on()', function () {
      it('listens to the default channel', function () {
        try {
          Sauron.on(_onFn);
        } catch(e) {
          fail('Error thrown by Sauron.on');
        }
      });
    });
    describe('#voice()', function () {
      it('announces to the default channel', function () {
        Sauron.voice('wasd');
        assert(1, onCount);
      });
    });
    describe('#off()', function () {
      it('unsubscribes a function from the current channel', function () {
        Sauron.off(_onFn);
        Sauron.voice('wasd');
        assert(1, onCount);
      });
    });

    var onVoiceData1A = {'a': 'b'},
        onVoiceData1B = {'c': 'd'},
        onVoiceData2A,
        onVoiceData2B;
    describe('"on"', function () {
      it('receives data passed by "voice"', function (done) {
        Sauron.of('onVoiceChannel').on(function (dataA, dataB) {
          onVoiceData2A = dataA;
          onVoiceData2B = dataB;
        });
        Sauron.of('onVoiceChannel').voice(onVoiceData1A, onVoiceData1B);

        setTimeout(function () {
          assert(onVoiceData1A, onVoiceData2A);
          assert(onVoiceData1B, onVoiceData2B);
          done();
        }, 100);
      });
    });

    // Another counter for an assert
    var onceCount = 0;
    describe('#once()', function () {
      it('allows for a function to listen to a channel exactly once', function () {
        Sauron.once(function () {
          onceCount += 1;
        });
        Sauron.voice('data');
        Sauron.voice('data');
        assert(1, onceCount);
      });
    });

    describe('an on subscription', function () {
      var unsubImplCount = 0;
      function _unsubImplFn(data) {
        if (data === 'unsub') {
          this.off();
        }
        unsubImplCount += 1;
      }
      it('can unsubscribe itself via this.off implicitly', function () {
        Sauron.on(_unsubImplFn);
        Sauron.voice('x');
        Sauron.voice('unsub');
        Sauron.voice('y');
        assert(2, unsubImplCount);
      });

      var unsubExplCount = 0;
      function _unsubExplFn(data) {
        if (data === 'unsub') {
          this.off(_unsubExplFn);
        }
        unsubExplCount += 1;
      }
      it('can unsubscribe itself via this.off explicitly', function () {
        Sauron.on(_unsubExplFn);
        Sauron.voice('x');
        Sauron.voice('unsub');
        Sauron.voice('y');
        assert(2, unsubExplCount);
      });
    });

    // var _getData = function () {return 'moo';},
        // _getSauron;
    // describe('#set()', function () {
      // it('stores data pertinent to a Sauron instance', function () {
        // _getSauron = Sauron.set('_fn', _getData);
      // });
    // });
    // describe('#get()', function () {
      // it('retrieves data pertinent to a Sauron instance', function () {
        // var getData = _getSauron.get('_fn');
        // assert(_getData, getData);
      // });
    // });

    // var _ofCount1 = 0,
        // _ofCount2 = 0;
    // function _ofFn1() { _ofCount1 += 1; }
    // function _ofFn2() { _ofCount2 += 1; }
    // describe('#channel()', function () {
      // it('sets the channel for methods (exclusive from other channels)', function () {
        // Sauron.channel('channel1').on(_ofFn1).voice('hey');
        // Sauron.channel('channel2').on(_ofFn2).voice('hey');
        // assert(1, _ofCount1);
        // assert(1, _ofCount2);
      // });
    // });

    // var _fnCount = 0;
    // function _fnFn() { _fnCount += 1; }
    // describe('#fn()', function () {
      // it('captures the current function for subscribing and unsubscribing externally', function () {
        // Sauron.subData(_fnFn).voice('123')
          // .on().voice('456')
          // .off().voice('789');
        // assert(1, _fnCount);
      // });
    // });

    // var _fnThisCount = 0,
        // _fnThisSauron = Sauron;
    // function _fnThisFn() {
      // this.off();
      // _fnThisCount += 1;
    // }
    // describe('a fn() binding', function () {
      // _fnThisSauron = _fnThisSauron.subData(_fnThisFn);
      // describe('with listener that calls this.off', function () {
        // _fnThisSauron.on();
        // it('invokes only listens once', function () {
          // _fnThisSauron.voice('hey').voice('hey');
          // assert(1, _fnThisCount);
        // });
      // });
    // });

    // var _fnSubImpl1 = 0,
        // _fnSubImpl2 = 0,
        // _fnSubImpl3 = 0,
        // _fnSubImplSauron = Sauron;
    // function _fnSubImplFn1() { this.off(); _fnSubImpl1 += 1; }
    // function _fnSubImplFn2() { _fnSubImpl2 += 1; }
    // function _fnSubImplFn3() { _fnSubImpl3 += 1; }
    // describe('a multi-subscribed channel (with an implicitly unsubscribing function)', function () {
      // _fnSubImplSauron = _fnSubImplSauron.channel('fnSubImpl').on(_fnSubImplFn1).on(_fnSubImplFn2).on(_fnSubImplFn3);
      // describe('that is published to', function () {
        // _fnSubImplSauron.voice('hey');
        // it('the other subscriptions are unaffected', function () {
          // _fnSubImplSauron.voice('hey');
          // assert(1, _fnSubImpl1);
          // assert(2, _fnSubImpl2);
          // assert(2, _fnSubImpl3);
        // });
      // });
    // });

    var _fnSubExpl1 = 0,
        _fnSubExpl2 = 0,
        _fnSubExpl3 = 0,
        _fnSubExplSauron = Sauron;
    function _fnSubExplFn1() { _fnSubExpl1 += 1; }
    function _fnSubExplFn2() { _fnSubExpl2 += 1; }
    function _fnSubExplFn3() { _fnSubExpl3 += 1; }
    describe('a multi-subscribed channel', function () {
      Sauron.on('fnSubExpl', _fnSubExplFn1);
      Sauron.on('fnSubExpl', _fnSubExplFn2);
      Sauron.on('fnSubExpl', _fnSubExplFn3);
      describe('that is published to', function () {
        Sauron.of('fnSubExpl').voice('hey');
        describe('when one function unsubscribes explicitly', function () {
          Sauron.of('fnSubExpl').off(_fnSubExplFn1);
          it('the other subscriptions are unaffected', function () {
            Sauron.of('fnSubExpl').voice('hey');
            assert(1, _fnSubExpl1);
            assert(2, _fnSubExpl2);
            assert(2, _fnSubExpl3);
          });
        });
      });
    });
  });

  var _createRequire = [],
      _createControllerCount = 0,
      _createModelCount = 0;
  // window.require = function (paths, fn) {
    // _createRequire = paths;
    // fn();
  // };
  describe('Create controller/model sugar', function () {
    var _createControllerArgs = [],
        _createModelArgs = [];

    Sauron.on().createController('HtmlController', function (callback) {
      _createControllerArgs = [].slice.call(arguments);
      _createControllerCount += 1;
      callback('567', 890, '...');
    });
    Sauron.on().createModel('CrudModel', function (callback) {
    console.log(arguments);
      _createModelArgs = [].slice.call(arguments);
      _createModelCount += 1;
      // callback('m', 'n', 'o');
    });
    it('properly separates controller creation channel', function (callback) {
      Sauron.createController('HtmlController', function () {
        var _createControllerCompleteArgs = [].slice.call(arguments);
        assert(1, _createControllerCount);
        assert(0, _createModelCount);
        assert(2, _createRequire.length);
        // assert('mvc!c/HtmlController', _createRequire[0]);
        // assert('mvc!c/bleh', _createRequire[1]);
        assertDeepEqual([{'name': 'bleh'}, 'om nom', 30], _createControllerArgs);
        assertDeepEqual(['567', 890, '...'], _createControllerCompleteArgs);
        callback();
      }, {'name': 'bleh'}, 'om nom', 30);
    });
    it('and the model creation channel', function (callback) {
      Sauron.createModel('CrudModel', function () {
        var _createModelCompleteArgs = [].slice.call(arguments);
        assert(1, _createControllerCount);
        assert(1, _createModelCount);
        assert(2, _createRequire.length);
        // assert('mvc!m/CrudModel', _createRequire[0]);
        // assert('mvc!m/blah', _createRequire[1]);
        assertDeepEqual([{'name': 'blah'}, 'x', 'y'], _createModelArgs);
        assertDeepEqual(['m', 'n', 'o'], _createModelCompleteArgs);
        callback();
      }, {'name': 'blah'}, 'x', 'y');
    });
  });

  // describe('Controller start/stop sugar', function () {
    // var _xyzStartCount = 0,
        // _xyzStartArgs = [],
        // _xyzStartCallbackArgs = ['wasd', 'qwerty', 123456789];
    // Sauron.on().controller('xyz').start(function () {
      // _xyzStartCount += 1;
      // _xyzStartArgs = [].slice.call(arguments);

      // Sauron.controller('xyz').startComplete('wasd', 'qwerty', 123456789);
    // });
    // it('handles on.controller.start, controller.startComplete, on.startComplete.controller, start.controller*', function (callback) {
      // var xyzStartArgs = ['hello', 'world', '123'];

      // Sauron.on().startComplete(function () {
        // var xyzStartCallbackArgs = [].slice.call(arguments);

        // assert(1, _xyzStartCount);
        // assertDeepEqual(xyzStartArgs, _xyzStartArgs);
        // assertDeepEqual(xyzStartCallbackArgs, _xyzStartCallbackArgs);

        // callback();
      // }).controller('xyz');

      // Sauron.start().controller('xyz', 'hello', 'world', '123');
    // });

    // var _yyzStartCount = 0,
        // _yyzStartArgs = [],
        // _yyzStartCallbackArgs = ['ijk', 'mn', 314159];
    // Sauron.on().start(function () {
      // _yyzStartCount += 1;
      // _yyzStartArgs = [].slice.call(arguments);

      // Sauron.startComplete('ijk', 'mn', 314159).controller('yyz');
    // }).controller('yyz');
    // it('handles on.start.controller, startComplete.controller, controller.startComplete.on, controller.start', function (callback) {
      // var yyzStartArgs = ['okie', 'doke', 'wah'];

      // Sauron.controller('yyz').startComplete().on(function () {
        // var yyzStartCallbackArgs = [].slice.call(arguments);

        // assert(1, _yyzStartCount);
        // assertDeepEqual(yyzStartArgs, _yyzStartArgs);
        // assertDeepEqual(yyzStartCallbackArgs, _yyzStartCallbackArgs);

        // callback();
      // });

      // Sauron.controller('yyz').start('okie', 'doke', 'wah');
    // });
  // });

  // describe('Model CRUD sugar', function () {
    // var _createArgs = [1, 6, 'a', 'wo'],
        // _updateEventArgs = ['x', '0', '700'],
        // _retrieveCompleteArgs = ['maskdmnkas', {'id': 3, 'data': 'wasd'}],
        // _deleteArgs = [{'id': 50}];
    // it('handles on.model.create.voice.create', function (callback) {
      // Sauron.on().model('abc').create(function () {
        // var createArgs = [].slice.call(arguments);
        // assertDeepEqual(_createArgs, createArgs);
        // callback();
      // }).voice().create(1, 6, 'a', 'wo');
    // });
    // it('handles on.updateEvent.model, model.updateEvent', function (callback) {
      // Sauron.on().updateEvent().model('def', function () {
        // var updateEventArgs = [].slice.call(arguments);
        // assertDeepEqual(_updateEventArgs, updateEventArgs);
        // callback();
      // });
      // Sauron.model('def').updateEvent('x', '0', '700');
    // });
    // it('handles on.model.and.on.retrieve.retrieveComplete, this.retrieveComplete, model.retrieve', function (callback) {
      // Sauron.on().model('ghi').retrieve(function () {
        // this.retrieveComplete('maskdmnkas', {'id': 3, 'data': 'wasd'});
      // }).and().on().retrieveComplete(function () {
        // var retrieveCompleteArgs = [].slice.call(arguments);
        // assertDeepEqual(_retrieveCompleteArgs, retrieveCompleteArgs);
        // callback();
      // });
      // Sauron.model('ghi').retrieve('data');
    // });
    // it('handles model.on.delete, delete.model', function (callback) {
      // Sauron.model('jkl').on()['delete'](function () {
        // var deleteArgs = [].slice.call(arguments);
        // assertDeepEqual(_deleteArgs, deleteArgs);
        // callback();
      // });
      // Sauron['delete']({'id': 50}).model('jkl');
    // });
  // });
});