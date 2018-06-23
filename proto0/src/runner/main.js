import React from "react";
import ReactDOM from "react-dom";
import PropsEditor from "./components/PropsEditor";
import path from "path";
import _styled from "styled-components";

// interop for styled
const styled = _styled.default;

class ReactPreviewer extends React.Component {
  render() {
    const jsonString = encodeURIComponent(
      JSON.stringify(this.props.givenProps)
    );
    const previewPath = path.join("/preview", this.props.filepath);
    return <iframe src={previewPath + "?" + jsonString} />;
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      props: {
        name: "John"
      },
      filepath: "./src/components/Greeting.js",
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
    const { default: bar } = await import("./src/misc/bar.ts");
    console.log("bar", bar(3));

    // check elements
    const { default: Foo } = await import("./src/elements/Foo.ts");
    console.log("foo", Foo);

    // check react
    const { default: component } = await import(this.state.filepath);
    this.setState({ component });
  }

  async componentDidUpdate(_, prev) {
    // check react
    if (prev.filepath !== this.state.filepath) {
      const { default: component } = await import(this.state.filepath);
      if (component) {
        this.setState({ component });
      }
    }
  }

  render() {
    if (this.state.component) {
      return (
        <Layout>
          <MenuArea>
            {this.state.files.length > 0 && (
              <>
                <ul>
                  {this.state.files.map(file => {
                    return (
                      <li key={file}>
                        <button
                          onClick={() => this.setState({ filepath: file })}
                        >
                          {file}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </MenuArea>
          <EditorArea>
            <PropsEditor
              initialValue={this.state.props}
              onChange={props => this.setState({ props })}
            />
          </EditorArea>
          <PreviewArea>
            <ReactPreviewer
              filepath={this.state.filepath}
              component={this.state.component}
              givenProps={this.state.props}
            />
          </PreviewArea>
        </Layout>
      );
    }
    return "hello";
  }
}

const Layout = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 250px 1fr 1fr;
  grid-template-rows: 40px 1fr 1fr;
  grid-template-areas: "header header header" "menu editor preview" "menu editor preview";
`;

const HeaderArea = styled.div`
  grid-area: header;
`;
const MenuArea = styled.div`
  grid-area: menu;
`;
const EditorArea = styled.div`
  grid-area: editor;
`;
const PreviewArea = styled.div`
  grid-area: preview;
`;

ReactDOM.render(<App />, document.querySelector("#root"));
