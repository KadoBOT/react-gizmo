# React Gizmo

UI Finite State Machine for React

![Gizmo](https://78.media.tumblr.com/7e86a0e90f263f2c1da0bc2f01b91d9a/tumblr_of8yz2A9Tk1rp0vkjo1_500.gif)

#### React Gizmo is a cute State Machine that doesn't become a monster if you throw water on it

# Quick Start

## Installation

```sh
yarn add react-gizmo
```

## Usage

### PS: `react-gizmo` uses new React Context API. React 16.3 is needed for this library to work.

```js
import { Machine, State } from "react-gizmo";

const state = {
	initialState: { text: "Next" },
	flow: {
		initial: "start",
		states: {
			start: { on: { NEXT: "end" } },
			end: { on: { PREV: "start" } }
		}
	}
};

const MachineApp = () => (
	<Machine log state={state}>
		<App />
	</Machine>
);

ReactDOM.render(<MachineApp />, document.getElementById("root"));
```

App.js

```js
class App extends Component {
	render() {
		return (
			<React.Fragment>
				<State on="start">
					<ButtonStart />
				</State>
				<State on="end">
					<ButtonEnd />
				</State>
			</React.Fragment>
		);
	}
}
```

ButtonStart.js

```js
class ButtonNext extends Component {
	handleOnClick = () => {
		this.props.transition("NEXT", {
			off: "start",
			setState: { text: "Prev" }
		});
	};

	render() {
		return <button onClick={this.handleOnClick}>{this.props.text}</button>;
	}
}
```

ButtonPrev.js

```js
class ButtonPrev extends Component {
	handleOnClick = () => {
		this.props.transition("PREV", {
			off: "end",
			setState: { text: "Next" }
		});
	};

	render() {
		return <button onClick={this.handleOnClick}>{props.text}</button>;
	}
}
```

# API

## &lt;Machine /&gt;

The &lt;Machine /&gt; wraps your App and is responsible for passing down the props to the &lt;State /&gt;. The &lt;Machine /&gt; should have only one children, similar to `react-router`. The `initialState` and `flow` are passed to the machine through the `state` prop.

| Prop  | Type   | Description                                                                                                                                       |
| ----- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| graph | bool   | Display realtime statechart visualization                                                                                                         |
| log   | bool   | If true logs state transitions                                                                                                                    |
| state | object | The object containing the state machine and initial State: { initialState: any, flow: [statechart](http://davidkpiano.github.io/xstate/docs/#/) } |

## &lt;State /&gt;

The &lt;State /&gt; represents the individual state of your flow. `on` prop is what glues the state to a specific flow state, and the `children` prop returns a function with the machine props. It's recommended to use class based component for the `children` of the State so it can be referenced by the Machine.

```js
...
states: {
  start: { on: {  NEXT: 'end' }},
  end: { on: { PREV: 'start' }}
}
...
<State on="start">
  <PageOne />
</State>
<State on="end">
  <PageTwo />
</State>
```

| Prop | Type   | Description                                                                        |
| ---- | ------ | ---------------------------------------------------------------------------------- |
| on   | string | Component that will be turned 'on' when flow transitions to a state with same name |

### props.transition(state[,options])

As the name suggests, this function is responsible for transitioning your app from one state to another. The first argument is the value of the state to be transitioned, and the second argument can receive a bunch of options. Like `off` to hide other non-actives &lt;State /&gt; components, `setState` to update your `state`/`initialState`, `draftState` which temporarily stores your changes until it's `publish`ed and `condition` where you can pass [xState Guards](http://davidkpiano.github.io/xstate/docs/#/guides/guards)

| Option     | Type                               | Description                                                                                                             |
| ---------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| off        | oneOfType(string, arrayOf(string)) | Component(s) that will be turned 'off' when transition is called                                                        |
| setState   | object                             | Mutates `initialState` keys with passed values                                                                          |
| draftState | object                             | Like `setState`, but changes take effect only after being published. Newer `draftState`s will replace unpublished ones. |
| condition  | any                                | Check xState Contitional Transitions ([Guards](http://davidkpiano.github.io/xstate/docs/#/guides/guards))               |

```js
props.transition("NEXT", {
	off: "end",
	setState: {
		text: "Will be updated"
	},
	draftState: {
		text: "Will update again, but only after publish"
	},
	condition: { shouldTransition: this.text.length < 99 }
});
```

### props.publish()

Publishes unpublished state aka. `draftState`. Draft is merged into State and then draft is cleaned. This is usefull when you are not sure if you want to update your state, I.E if a user clicks a cancel button during an API request.

```js
props.transition("NEXT", { draftState: { text: "Hello World" } });
console.log(this.props.text); // ''
props.publish();
console.log(this.props.text); // 'Hello World'
```

### props[state]

Your initialState/state, can be accessed directly via `props.YOUR_STATE_KEY`.

```js
console.log(this.props.text); // Hello
```

# Todo

*   [ ] Connect state to Redux DevTools
*   [ ] Examples
*   [ ] Better integration with other State Managers like Redux and Mobx ie.
*   [ ] Tests

# Thanks

[David](https://twitter.com/DavidKPiano) the creator of [xstate](https://github.com/davidkpiano/xstate) who made this library possible and [Michele](https://twitter.com/MicheleBertoli) for inspiring me with [react-automata](https://github.com/MicheleBertoli/react-automata). Even if you like `react-gizmo` I recommend you to give them a try.
Also, a big thanks to [Ryan Florence](https://twitter.com/ryanflorence) for giving a great talk about State Machine.
