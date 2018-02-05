import React from 'react'
import { Machine as Xstate } from 'xstate'

class Context {
  constructor(flow) {
    this.machine = null
    this.data = null
    this.children = new Map()
  }

  addFlow(flow) {
    this.machine = Xstate(flow)
    this.data =  React.createContext(this.machine.initialState.value);
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
      route: context.data.defaultValue,
      flow: new Set([context.machine.initialState.value]),
      transition: this.transition,
      state: this.props.state.initialState,
      draftState: null,
      publish: this.publish
    };
  }

  componentDidMount() {
    if(context.children.has(this.state.route)) {
      for (const action of context.machine.initialState.actions) {
        context.children.get(this.state.route)[action] && context.children.get(this.state.route)[action]()
      }
    }
  }

  transition = ({ to, off = '', setState, draftState, condition }) => {
    this.props.log && console.log({ on: this.state.route, to, setState, draftState, condition })
    let nextState = context.machine.transition(this.state.route, to, condition)
    const doAction = ({ route }) => {
      if(context.children.has(route) && this.state.flow.has(this.state.route)) {
        for (const action of nextState.actions) {
          context.children.get(route)[action] && context.children.get(route)[action]()
        }
      }
    }

    doAction({ route: this.state.route })

    let filteredFlow = this.state.flow.add(nextState.value)

    if(typeof off === 'object') for (const flow of off) filteredFlow.delete(flow)
    else filteredFlow.delete(off)

    this.setState(state => ({
      route: nextState.value,
      flow: filteredFlow,
      state: { ...state.state, ...setState },
      draftState
    }), () => doAction({ route: nextState.value }))
  }

  publish = async () => {
    await this.transition
    this.setState(state => ({ state: {...state.state, ...state.draftState}, draftState: null }))
  }

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
  checkType = (fn, { transition, publish, state }) => {
    let args = {
      transition: (to, options, cond) => transition({to, ...options }, cond),
      publish,
      ...state,
    }
    const render = {...fn(args)}
    if(render.type.prototype && render.type.prototype.isReactComponent) {
      render.ref = node => context.setChild(node, this.props.on)
    } else {
      console.warn('<State /> should not return stateless functions on render:', fn(args))
    }
    
    return render
  }

  render() {
    const { Consumer } = context.data
    
    return (
      <Consumer>
        {({flow, transition, publish, state}) => {
          const render = this.checkType(this.props.render, { transition, state, publish })
          return flow.has(this.props.on) && render
        }}
      </Consumer>
    )
  }
}
