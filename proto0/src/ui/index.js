import React from "react";
import ReactDOM from "react-dom";
import PropsEditor from "./components/PropsEditor";
import path from "path";
import styled from "styled-components";

class ReactPreviewer extends React.Component {
  render() {
    const jsonString = encodeURIComponent(
      JSON.stringify(this.props.givenProps)
    );
    const previewPath = path.join("/preview", this.props.filepath);
    return (
      <iframe
        src={previewPath + "?" + jsonString}
        style={{ width: "100%", height: "100%" }}
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
  }

  render() {
    return (
      <Layout>
        <HeaderArea>
          <header>Story UI</header>
        </HeaderArea>
        <MenuArea>
          <span>Files</span>
          {this.state.files.length > 0 && (
            <>
              <ul>
                {this.state.files.map(file => {
                  if (file === this.state.filepath) {
                    return <li key={file}>{file}</li>;
                  }
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
        </MenuArea>
        <EditorArea>
          <PropsEditor
            key={this.state.filepath}
            filepath={this.state.filepath}
            onChange={props => this.setState({ props })}
          />
        </EditorArea>
        <PreviewArea>
          <ReactPreviewer
            key={this.state.filepath}
            filepath={this.state.filepath}
            component={this.state.component}
            givenProps={this.state.props}
          />
        </PreviewArea>
      </Layout>
    );
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
