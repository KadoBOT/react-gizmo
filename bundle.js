'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _Set = _interopDefault(require('babel-runtime/core-js/set'));
var _regeneratorRuntime = _interopDefault(require('babel-runtime/regenerator'));
var _asyncToGenerator = _interopDefault(require('babel-runtime/helpers/asyncToGenerator'));
var _extends = _interopDefault(require('babel-runtime/helpers/extends'));
var _typeof = _interopDefault(require('babel-runtime/helpers/typeof'));
var _getIterator = _interopDefault(require('babel-runtime/core-js/get-iterator'));
var _Object$getPrototypeOf = _interopDefault(require('babel-runtime/core-js/object/get-prototype-of'));
var _possibleConstructorReturn = _interopDefault(require('babel-runtime/helpers/possibleConstructorReturn'));
var _inherits = _interopDefault(require('babel-runtime/helpers/inherits'));
var _Map = _interopDefault(require('babel-runtime/core-js/map'));
var _classCallCheck = _interopDefault(require('babel-runtime/helpers/classCallCheck'));
var _createClass = _interopDefault(require('babel-runtime/helpers/createClass'));
var React = _interopDefault(require('react'));
var xstate = require('xstate');

var Context = function () {
  function Context(flow) {
    _classCallCheck(this, Context);

    this.machine = null;
    this.data = null;
    this.children = new _Map();
  }

  _createClass(Context, [{
    key: 'addFlow',
    value: function addFlow(flow) {
      this.machine = xstate.Machine(flow);
      this.data = React.createContext(this.machine.initialState.value);
    }
  }, {
    key: 'setChild',
    value: function setChild(child, name) {
      child && this.children.set(name, child);
    }
  }]);

  return Context;
}();

var context = new Context();

var Machine = function (_React$Component) {
  _inherits(Machine, _React$Component);

  function Machine(props) {
    var _this2 = this;

    _classCallCheck(this, Machine);

    var _this = _possibleConstructorReturn(this, (Machine.__proto__ || _Object$getPrototypeOf(Machine)).call(this, props));

    _this.transition = function (_ref) {
      var to = _ref.to,
          _ref$off = _ref.off,
          off = _ref$off === undefined ? '' : _ref$off,
          setState = _ref.setState,
          draftState = _ref.draftState,
          condition = _ref.condition;

      _this.props.log && console.log({ on: _this.state.route, to: to, setState: setState, draftState: draftState, condition: condition });
      var nextState = context.machine.transition(_this.state.route, to, condition);
      var doAction = function doAction(_ref2) {
        var route = _ref2.route;

        if (context.children.has(route) && _this.state.flow.has(_this.state.route)) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = _getIterator(nextState.actions), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var action = _step.value;

              context.children.get(route)[action] && context.children.get(route)[action]();
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }
      };

      doAction({ route: _this.state.route });

      var filteredFlow = _this.state.flow.add(nextState.value);

      if ((typeof off === 'undefined' ? 'undefined' : _typeof(off)) === 'object') {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = _getIterator(off), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _flow = _step2.value;
            filteredFlow.delete(_flow);
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      } else filteredFlow.delete(off);

      _this.setState(function (state) {
        return {
          route: nextState.value,
          flow: filteredFlow,
          state: _extends({}, state.state, setState),
          draftState: draftState
        };
      }, function () {
        return doAction({ route: nextState.value });
      });
    };

    _this.publish = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _this.transition;

            case 2:
              _this.setState(function (state) {
                return { state: _extends({}, state.state, state.draftState), draftState: null };
              });

            case 3:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this2);
    }));

    context.addFlow(props.state.flow);

    _this.state = {
      route: context.data.defaultValue,
      flow: new _Set([context.machine.initialState.value]),
      transition: _this.transition,
      state: _this.props.state.initialState,
      draftState: null,
      publish: _this.publish
    };
    return _this;
  }

  _createClass(Machine, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (context.children.has(this.state.route)) {
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = _getIterator(context.machine.initialState.actions), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var action = _step3.value;

            context.children.get(this.state.route)[action] && context.children.get(this.state.route)[action]();
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var Provider = context.data.Provider;


      return React.createElement(
        Provider,
        { value: this.state },
        React.cloneElement(this.props.children, { route: this.state.route })
      );
    }
  }]);

  return Machine;
}(React.Component);

var State = function (_React$Component2) {
  _inherits(State, _React$Component2);

  function State() {
    var _ref4;

    var _temp, _this3, _ret;

    _classCallCheck(this, State);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this3 = _possibleConstructorReturn(this, (_ref4 = State.__proto__ || _Object$getPrototypeOf(State)).call.apply(_ref4, [this].concat(args))), _this3), _initialiseProps.call(_this3), _temp), _possibleConstructorReturn(_this3, _ret);
  }

  _createClass(State, [{
    key: 'render',
    value: function render() {
      var _this4 = this;

      var Consumer = context.data.Consumer;


      return React.createElement(
        Consumer,
        null,
        function (_ref5) {
          var flow = _ref5.flow,
              transition = _ref5.transition,
              publish = _ref5.publish,
              state = _ref5.state;

          var render = _this4.checkType(_this4.props.render, { transition: transition, state: state, publish: publish });
          return flow.has(_this4.props.on) && render;
        }
      );
    }
  }]);

  return State;
}(React.Component);

var _initialiseProps = function _initialiseProps() {
  var _this5 = this;

  this.checkType = function (fn, _ref6) {
    var _transition = _ref6.transition,
        publish = _ref6.publish,
        state = _ref6.state;

    var args = _extends({
      transition: function transition(to, options, cond) {
        return _transition(_extends({ to: to }, options), cond);
      },
      publish: publish
    }, state);
    var render = _extends({}, fn(args));
    if (render.type.prototype && render.type.prototype.isReactComponent) {
      render.ref = function (node) {
        return context.setChild(node, _this5.props.on);
      };
    } else {
      console.warn('<State /> should not return stateless functions on render:', fn(args));
    }

    return render;
  };
};

exports.Machine = Machine;
exports.State = State;
