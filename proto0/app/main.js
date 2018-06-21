// import React from "react";
// import ReactDOM from "react-dom";
import React from "https://dev.jspm.io/react@16";
import ReactDOM from "https://dev.jspm.io/react-dom@16";

class PropsEditor extends React.Component {
  render() {
    return (
      <textarea
        style={{ width: 300, height: 200 }}
        defaultValue={JSON.stringify(this.props.initialValue, null, 2)}
        onChange={event => {
          try {
            const json = JSON.parse(event.target.value);
            this.props.onChange && this.props.onChange(json);
          } catch (e) {
            return;
          }
        }}
      />
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      props: {
        name: "John"
      },
      filepath: "./components/Greeting.js",
      component: null
    };
  }
  async componentDidMount() {
    // check ts
    const { default: bar } = await import("./misc/bar.ts");
    console.log("bar", bar(3));

    // check elements
    const { default: Foo } = await import("./elements/Foo.ts");
    console.log("foo", Foo);

    // check react
    const { default: component } = await import(this.state.filepath);
    this.setState({ component });
  }
  render() {
    if (this.state.component) {
      // const props = { name: "John" };
      // return React.createElement(this.state.component, props);
      return (
        <div>
          <PropsEditor
            initialValue={this.state.props}
            onChange={props => this.setState({ props })}
          />
          <br />
          <this.state.component {...this.state.props} />
        </div>
      );
    }
    return "hello";
  }
}

ReactDOM.render(<App />, document.querySelector("#root"));
