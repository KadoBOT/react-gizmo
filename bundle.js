'use strict';

function __$$styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _typeof = _interopDefault(require('babel-runtime/helpers/typeof'));
var _extends = _interopDefault(require('babel-runtime/helpers/extends'));
var _Object$keys = _interopDefault(require('babel-runtime/core-js/object/keys'));
var _JSON$stringify = _interopDefault(require('babel-runtime/core-js/json/stringify'));
var _Object$getPrototypeOf = _interopDefault(require('babel-runtime/core-js/object/get-prototype-of'));
var _classCallCheck = _interopDefault(require('babel-runtime/helpers/classCallCheck'));
var _createClass = _interopDefault(require('babel-runtime/helpers/createClass'));
var _possibleConstructorReturn = _interopDefault(require('babel-runtime/helpers/possibleConstructorReturn'));
var _inherits = _interopDefault(require('babel-runtime/helpers/inherits'));
var React = _interopDefault(require('react'));
var cytoscape = _interopDefault(require('cytoscape'));
var coseBilkent = _interopDefault(require('cytoscape-cose-bilkent'));
var _Set = _interopDefault(require('babel-runtime/core-js/set'));
var _regeneratorRuntime = _interopDefault(require('babel-runtime/regenerator'));
var _asyncToGenerator = _interopDefault(require('babel-runtime/helpers/asyncToGenerator'));
var _getIterator = _interopDefault(require('babel-runtime/core-js/get-iterator'));
var _Map = _interopDefault(require('babel-runtime/core-js/map'));
var xstate = require('xstate');

cytoscape.use(coseBilkent);

var Graph = function (_React$Component) {
  _inherits(Graph, _React$Component);

  function Graph(props) {
    _classCallCheck(this, Graph);

    var _this = _possibleConstructorReturn(this, (Graph.__proto__ || _Object$getPrototypeOf(Graph)).call(this, props));

    _this.state = {
      nodes: [],
      edges: [],
      raw: _JSON$stringify(props.machine, null, 2),
      machine: props.machine
    };
    return _this;
  }

  _createClass(Graph, [{
    key: "initializeMachine",
    value: function initializeMachine(flow) {
      var machine = this.state.machine;

      var nodes = [];
      var edges = [];

      function addNodesAndEdges(node, key, parent) {
        var id = parent ? parent + "." + key : key;

        if (parent) {
          nodes.push({
            data: {
              id: id,
              label: key,
              parent: parent
            }
          });
        }

        if (node.states) {
          var states = _Object$keys(node.states).map(function (key) {
            return _extends({}, node.states[key], {
              id: key
            });
          }).concat({
            id: "$initial",
            initial: 1,
            on: { "": node.initial }
          });

          states.forEach(function (state) {
            addNodesAndEdges(state, state.id, id);
          });
        }

        if (node.on) {
          var visited = {};
          _Object$keys(node.on).forEach(function (event) {
            var target = node.on[event];
            if ((typeof target === "undefined" ? "undefined" : _typeof(target)) === "object") {
              _Object$keys(target).forEach(function (key) {
                return (visited[key] || (visited[key] = [])).push(event);
              });
            } else {
              (visited[target] || (visited[target] = [])).push(event);
            }
          });

          _Object$keys(visited).forEach(function (target) {
            edges.push({
              data: {
                id: key + ":" + target,
                source: id,
                target: parent ? parent + "." + target : target,
                label: visited[target].join(",\n")
              }
            });
          });
        }
      }
      addNodesAndEdges(machine, machine.id || "machine");

      var cur = flow ? flow.to : this.state.machine.initial;
      var toFlow = flow ? flow.to : "";

      this.cy = cytoscape({
        container: this.cyNode,

        boxSelectionEnabled: true,
        autounselectify: true,

        style: "\n        node[label != '$initial'] {\n          content: data(label);\n          text-valign: center;\n          text-halign: center;\n          shape: roundrectangle;\n          width: label;\n          height: label;\n          padding-left: 5px;\n          padding-right: 5px;\n          padding-top: 5px;\n          padding-bottom: 5px;\n          background-color: white;\n          border-width: 1px;\n          border-color: red;\n          font-size: 10px;\n          font-family: Helvetica Neue;\n        }\n        node[label != '" + cur + "'] {\n          border-color: black;\n        }\n        node:active {\n          overlay-color: white;\n          overlay-padding: 0;\n          overlay-opacity: 0.1;\n        }\n        node[label = '$initial'] {\n          visibility: hidden;\n        }\n        $node > node {\n          padding-top: 1px;\n          padding-left: 10px;\n          padding-bottom: 10px;\n          padding-right: 10px;\n          text-valign: top;\n          text-halign: center;\n          border-width: 1px;\n          border-color: black;\n          background-color: transparent;\n        }\n        edge {\n          color: white;\n          curve-style: bezier;\n          width: 1px;\n          target-arrow-shape: triangle;\n          label: data(label);\n          font-size: 5px;\n          font-weight: bold;\n          text-background-color: white;\n          text-background-padding: 0px;\n          line-color: black;\n          target-arrow-color: black;\n          z-index: 100;\n          text-wrap: wrap;\n          text-background-color: white;\n          text-background-opacity: 0;\n          target-distance-from-node: 2px;\n        }\n        edge[label = ''] {\n          source-arrow-shape: circle;\n          source-arrow-color: white;\n        }\n      ",

        elements: {
          nodes: nodes,
          edges: edges
        },

        layout: {
          name: "cose-bilkent",
          randomize: false,
          idealEdgeLength: 50,
          animate: false
        }
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.initializeMachine();
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      if (this.props.flow !== nextProps.flow) {
        this.initializeMachine(nextProps.flow);
        return true;
      }

      return false;
    }
  }, {
    key: "handleChange",
    value: function handleChange(raw) {
      this.setState({ raw: raw });
    }
  }, {
    key: "generateGraph",
    value: function generateGraph() {
      try {
        // be a little lax.
        var machine = eval("var r=" + this.state.raw + ";r");
        this.setState({ machine: machine, error: false }, this.initializeMachine);
      } catch (e) {
        console.error(e);
        this.setState({ error: true });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return React.createElement(
        "div",
        { className: "gizmo__container" },
        React.createElement("div", { id: "gizmo__cy", ref: function ref(n) {
            return _this2.cyNode = n;
          } })
      );
    }
  }]);

  return Graph;
}(React.Component);

var css = "* {\n  box-sizing: border-box;\n  position: relative; }\n\nhtml,\nbody {\n  height: 100%;\n  width: 100%;\n  margin: 0; }\n\n.gizmo__wrapper {\n  flex: 1;\n  display: flex;\n  justify-content: center; }\n\n.gizmo__graph {\n  display: flex;\n  width: 100vw;\n  justify-content: space-around; }\n\n.gizmo__container {\n  display: flex;\n  flex-direction: row;\n  align-items: stretch;\n  height: 100vh;\n  flex: 0.5;\n  border-right: 3px solid rgba(128, 128, 128, 0.3);\n  background: #424242; }\n\n.gizmo__editor {\n  display: flex;\n  flex-direction: column;\n  flex-basis: 33%; }\n  .gizmo__editor > textarea {\n    flex-grow: 1;\n    font-family: Monaco, monospace;\n    font-size: 16px;\n    background: #161818;\n    color: #fefefe;\n    line-height: 1.2; }\n\n.gizmo__button {\n  -webkit-appearance: none;\n  padding: 1rem;\n  background: blue;\n  color: white;\n  text-transform: uppercase;\n  letter-spacing: 1px;\n  font-size: 12px;\n  border: none;\n  background-color: #ff3cac;\n  background-image: linear-gradient(135deg, #ff3cac 0%, #784ba0 50%, #2b86c5 100%);\n  transition: opacity ease-out 0.3s;\n  cursor: pointer; }\n  .gizmo__button:hover {\n    opacity: 0.8; }\n\n#gizmo__cy {\n  height: 100vh;\n  flex-grow: 1; }\n";
__$$styleInject(css);

var Context = function () {
	function Context(flow) {
		_classCallCheck(this, Context);

		this.machine = null;
		this.data = null;
		this.children = new _Map();
	}

	_createClass(Context, [{
		key: "addFlow",
		value: function addFlow(flow) {
			this.machine = xstate.Machine(flow);
			this.data = React.createContext(this.machine.initialState.value);
		}
	}, {
		key: "setChild",
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
			    off = _ref$off === undefined ? "" : _ref$off,
			    setState = _ref.setState,
			    draftState = _ref.draftState,
			    condition = _ref.condition;

			_this.props.log && console.log({
				on: _this.state.route,
				to: to,
				setState: setState,
				draftState: draftState,
				condition: condition
			});

			_this.setState({
				graph: {
					on: _this.state.route
				}
			});

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

			if ((typeof off === "undefined" ? "undefined" : _typeof(off)) === "object") {
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
					draftState: draftState,
					graph: {
						on: state.route,
						to: nextState.value
					}
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
								return {
									state: _extends({}, state.state, state.draftState),
									draftState: null
								};
							});

						case 3:
						case "end":
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
			publish: _this.publish,
			graph: {
				on: context.data.defaultValue,
				to: ""
			}
		};
		return _this;
	}

	_createClass(Machine, [{
		key: "componentDidMount",
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
		key: "render",
		value: function render() {
			var Provider = context.data.Provider;


			return this.props.graph ? React.createElement(
				"div",
				{ className: "gizmo__graph" },
				React.createElement(Graph, {
					flow: this.state.graph,
					machine: this.props.state.flow
				}),
				React.createElement(
					"div",
					{ className: "gizmo__wrapper" },
					React.createElement(
						Provider,
						{ value: this.state },
						React.cloneElement(this.props.children, {
							route: this.state.route
						})
					)
				)
			) : React.createElement(
				Provider,
				{ value: this.state },
				React.cloneElement(this.props.children, {
					route: this.state.route
				})
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

		return _ret = (_temp = (_this3 = _possibleConstructorReturn(this, (_ref4 = State.__proto__ || _Object$getPrototypeOf(State)).call.apply(_ref4, [this].concat(args))), _this3), _this3.checkType = function (children, _ref5) {
			var _transition = _ref5.transition,
			    publish = _ref5.publish,
			    state = _ref5.state;

			var props = _extends({
				transition: function transition(to, options, cond) {
					return _transition(_extends({ to: to }, options), cond);
				},
				publish: publish
			}, state);
			if (children.type.prototype && children.type.prototype.isReactComponent) {
				return React.cloneElement(children, _extends({
					ref: function ref(node) {
						return context.setChild(node, _this3.props.on);
					}
				}, props));
			} else {
				console.warn("<State /> should not return stateless functions on Children:", children);
				return React.cloneElement(children, _extends({}, props));
			}
		}, _temp), _possibleConstructorReturn(_this3, _ret);
	}

	_createClass(State, [{
		key: "render",
		value: function render() {
			var _this4 = this;

			var Consumer = context.data.Consumer;


			return React.createElement(
				Consumer,
				null,
				function (_ref6) {
					var flow = _ref6.flow,
					    transition = _ref6.transition,
					    publish = _ref6.publish,
					    state = _ref6.state;

					var children = _this4.checkType(_this4.props.children, {
						transition: transition,
						state: state,
						publish: publish
					});

					return flow.has(_this4.props.on) && children;
				}
			);
		}
	}]);

	return State;
}(React.Component);

exports.Machine = Machine;
exports.State = State;
