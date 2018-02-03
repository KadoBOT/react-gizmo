'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var reactBroadcast = require('react-broadcast');
var xstate = require('xstate');

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};



var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};



















var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var Context = function () {
  function Context(flow) {
    classCallCheck(this, Context);

    this.machine = null;
    this.data = null;
    this.children = new Map();
  }

  createClass(Context, [{
    key: 'addFlow',
    value: function addFlow(flow) {
      this.machine = xstate.Machine(flow);
      this.data = reactBroadcast.createContext(this.machine.initialState.value);
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
  inherits(Machine, _React$Component);

  function Machine(props) {
    classCallCheck(this, Machine);

    var _this = possibleConstructorReturn(this, (Machine.__proto__ || Object.getPrototypeOf(Machine)).call(this, props));

    _this.transition = function (_ref) {
      var on = _ref.on,
          to = _ref.to,
          _ref$off = _ref.off,
          off = _ref$off === undefined ? '' : _ref$off,
          data = _ref.data;

      console.log({ on: on, to: to, flow: [].concat(toConsumableArray(_this.state.flow)) });
      var nextState = context.machine.transition(on, to);
      var doAction = function doAction(_ref2) {
        var route = _ref2.route;

        if (context.children.has(route) && _this.state.flow.has(on)) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = nextState.actions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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

      doAction({ route: on });

      var filteredFlow = _this.state.flow.add(nextState.value);

      if ((typeof off === 'undefined' ? 'undefined' : _typeof(off)) === 'object') {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = off[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var flow = _step2.value;
            filteredFlow.delete(flow);
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

      _this.setState({
        route: nextState.value,
        flow: filteredFlow,
        draftState: data
      }, function () {
        return doAction({ route: nextState.value });
      });
    };

    _this.updateState = function () {
      return _this.setState(function (state) {
        return { state: _extends({}, state.state, state.draftState) };
      });
    };

    context.addFlow(props.state.flow);

    _this.state = {
      route: context.data.Provider.defaultValue,
      flow: new Set([context.machine.initialState.value]),
      transition: _this.transition,
      state: _this.props.state.initialState,
      draftState: null,
      updateState: _this.updateState
    };
    return _this;
  }

  createClass(Machine, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (context.children.has(this.state.route)) {
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = context.machine.initialState.actions[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
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
  inherits(State, _React$Component2);

  function State() {
    var _ref3;

    var _temp, _this2, _ret;

    classCallCheck(this, State);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this2 = possibleConstructorReturn(this, (_ref3 = State.__proto__ || Object.getPrototypeOf(State)).call.apply(_ref3, [this].concat(args))), _this2), _initialiseProps.call(_this2), _temp), possibleConstructorReturn(_this2, _ret);
  }

  createClass(State, [{
    key: 'render',
    value: function render() {
      var _this3 = this;

      var Consumer = context.data.Consumer;


      return React.createElement(
        Consumer,
        null,
        function (_ref4) {
          var flow = _ref4.flow,
              transition = _ref4.transition,
              updateState = _ref4.updateState,
              state = _ref4.state;

          var render = _this3.checkType(_this3.props.render, { transition: transition, state: state, updateState: updateState });
          return flow.has(_this3.props.on) && render;
        }
      );
    }
  }]);
  return State;
}(React.Component);

var _initialiseProps = function _initialiseProps() {
  var _this4 = this;

  this.checkType = function (fn, _ref5) {
    var _transition = _ref5.transition,
        updateState = _ref5.updateState,
        state = _ref5.state;

    var args = _extends({
      transition: function transition(to, options) {
        return _transition(_extends({ on: _this4.props.on, to: to }, options));
      },
      updateState: updateState
    }, state);
    var render = fn(state);
    if (render.type && render.type.prototype.isReactComponent) {
      args.ref = function (node) {
        return context.setChild(node, _this4.props.on);
      };
    } else {
      console.warn('<State /> should not return stateless functions on render:', fn(args));
    }

    return fn(args);
  };
};

exports.Machine = Machine;
exports.State = State;
