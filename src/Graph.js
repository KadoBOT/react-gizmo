import React from "react";
import cytoscape from "cytoscape";
import coseBilkent from "cytoscape-cose-bilkent";

cytoscape.use(coseBilkent);

export default class Graph extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nodes: [],
      edges: [],
      raw: JSON.stringify(props.machine, null, 2),
      machine: props.machine
    };
  }

  initializeMachine(flow) {
    const { machine } = this.state;
    const nodes = [];
    const edges = [];

    function addNodesAndEdges(node, key, parent) {
      const id = parent ? parent + "." + key : key;

      if (parent) {
        nodes.push({
          data: {
            id,
            label: key,
            parent
          }
        });
      }

      if (node.states) {
        const states = Object.keys(node.states)
          .map(key => ({
            ...node.states[key],
            id: key
          }))
          .concat({
            id: "$initial",
            initial: 1,
            on: { "": node.initial }
          });

        states.forEach(state => {
          addNodesAndEdges(state, state.id, id);
        });
      }

      if (node.on) {
        const visited = {};
        Object.keys(node.on).forEach(event => {
          const target = node.on[event];
          if (typeof target === "object") {
            Object.keys(target).forEach(key =>
              (visited[key] || (visited[key] = [])).push(event)
            );
          } else {
            (visited[target] || (visited[target] = [])).push(event);
          }
        });

        Object.keys(visited).forEach(target => {
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

    let cur = flow ? flow.to : this.state.machine.initial;
    let toFlow = flow ? flow.to : "";

    this.cy = cytoscape({
      container: this.cyNode,

      boxSelectionEnabled: true,
      autounselectify: true,

      style: `
        node[label != '$initial'] {
          content: data(label);
          text-valign: center;
          text-halign: center;
          shape: roundrectangle;
          width: label;
          height: label;
          padding-left: 5px;
          padding-right: 5px;
          padding-top: 5px;
          padding-bottom: 5px;
          background-color: white;
          border-width: 1px;
          border-color: red;
          font-size: 10px;
          font-family: Helvetica Neue;
        }
        node[label != '${cur}'] {
          border-color: black;
        }
        node:active {
          overlay-color: white;
          overlay-padding: 0;
          overlay-opacity: 0.1;
        }
        node[label = '$initial'] {
          visibility: hidden;
        }
        $node > node {
          padding-top: 1px;
          padding-left: 10px;
          padding-bottom: 10px;
          padding-right: 10px;
          text-valign: top;
          text-halign: center;
          border-width: 1px;
          border-color: black;
          background-color: transparent;
        }
        edge {
          color: white;
          curve-style: bezier;
          width: 1px;
          target-arrow-shape: triangle;
          label: data(label);
          font-size: 5px;
          font-weight: bold;
          text-background-color: white;
          text-background-padding: 0px;
          line-color: black;
          target-arrow-color: black;
          z-index: 100;
          text-wrap: wrap;
          text-background-color: white;
          text-background-opacity: 0;
          target-distance-from-node: 2px;
        }
        edge[label = ''] {
          source-arrow-shape: circle;
          source-arrow-color: white;
        }
      `,

      elements: {
        nodes,
        edges
      },

      layout: {
        name: "cose-bilkent",
        randomize: false,
        idealEdgeLength: 50,
        animate: false
      }
    });
  }

  componentDidMount() {
    this.initializeMachine();
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.flow !== nextProps.flow) {
      this.initializeMachine(nextProps.flow);
      return true;
    }

    return false;
  }

  handleChange(raw) {
    this.setState({ raw });
  }

  generateGraph() {
    try {
      // be a little lax.
      const machine = eval(`var r=${this.state.raw};r`);
      this.setState({ machine, error: false }, this.initializeMachine);
    } catch (e) {
      console.error(e);
      this.setState({ error: true });
    }
  }

  render() {
    return (
      <div className="gizmo__container">
        <div id="gizmo__cy" ref={n => (this.cyNode = n)} />
      </div>
    );
  }
}
