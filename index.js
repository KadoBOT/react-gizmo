import React from 'react'
import { createContext } from 'react-broadcast';
import { Machine as Xstate } from 'xstate'

class Context {
  constructor(flow) {
    this.machine = null
    this.data = null
    this.children = new Map()
  }

  addFlow(flow) {
    this.machine = Xstate(flow)
    this.data =  createContext(this.machine.initialState.value);
  }

  setChild(child, name) {
    child && this.children.set(name, child)
  }
}

let context = new Context()

export class Machine extends React.Component {
  constructor(props) {
    super(props)
    context.addFlow(props.state.flow)

    this.state = {
      route: context.data.Provider.defaultValue,
      flow: new Set([context.machine.initialState.value]),
      transition: this.transition,
      state: this.props.state.initialState,
      draftState: null,
      updateState: this.updateState
    };
  }

  componentDidMount() {
    if(context.children.has(this.state.route)) {
      for (const action of context.machine.initialState.actions) {
        context.children.get(this.state.route)[action] && context.children.get(this.state.route)[action]()
      }
    }
  }

  transition = ({ on, to, off = '', data}) => {
    console.log({on, to, flow: [...this.state.flow]})
    let nextState = context.machine.transition(on, to)
    const doAction = ({ route }) => {
      if(context.children.has(route) && this.state.flow.has(on)) {
        for (const action of nextState.actions) {
          context.children.get(route)[action] && context.children.get(route)[action]()
        }
      }
    }

    doAction({ route: on })

    let filteredFlow = this.state.flow.add(nextState.value)

    if(typeof off === 'object') for (const flow of off) filteredFlow.delete(flow)
    else filteredFlow.delete(off)

    this.setState({
      route: nextState.value,
      flow: filteredFlow,
      draftState: data
    }, () => doAction({ route: nextState.value }))
  }

  updateState = () => this.setState(state => ({ state: {...state.state, ...state.draftState}}))

  render() {
    const { Provider } = context.data

    return (
      <Provider value={this.state}>
        {React.cloneElement(this.props.children, { route: this.state.route })}
      </Provider>
    );
  }
}

export class State extends React.Component {
  checkType = (fn, { transition, updateState, state }) => {
    let args = {
      transition: (to, options) => transition({ on: this.props.on, to, ...options }),
      updateState,
      ...state,
    }
    const render = fn(state)
    if(render.type && render.type.prototype.isReactComponent) {
      args.ref = node => context.setChild(node, this.props.on)
    } else {
      console.warn('<State /> should not return stateless functions on render:', fn(args))
    }
    
    return fn(args)
  }

  render() {
    const { Consumer } = context.data
    
    return (
      <Consumer>
        {({flow, transition, updateState, state}) => {
          const render = this.checkType(this.props.render, { transition, state, updateState })
          return flow.has(this.props.on) && render
        }}
      </Consumer>
    )
  }
}
