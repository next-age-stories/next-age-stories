import React from "react";
import ReactDOM from "react-dom";

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
      component: null,
      files: []
    };
  }
  async componentDidMount() {
    const res = await fetch("/manifest.json");
    const manifest = await res.json();
    console.log(manifest);
    this.setState({ files: manifest.files });

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

  async componentDidUpdate(_, prev) {
    // check react
    if (prev.filepath !== this.state.filepath) {
      const { default: component } = await import(this.state.filepath);
      this.setState({ component });
    }
  }

  render() {
    if (this.state.component) {
      return (
        <div>
          {this.state.files.length > 0 && (
            <>
              <ul>
                {this.state.files.map(file => {
                  return (
                    <li key={file}>
                      <button onClick={() => this.setState({ filepath: file })}>
                        {file}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
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
