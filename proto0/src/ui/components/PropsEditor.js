import React from "react";

const initialStory = [{ name: "1", props: {} }];
function loadStories(key) {
  try {
    const data = localStorage.getItem(key);
    if (data == null) {
      return initialStory;
    }
    return JSON.parse(data);
  } catch (e) {
    return initialStory;
  }
}

export default class PropsEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      valid: true,
      loading: true,
      currentStory: null,
      currentProps: null,
      editingValue: "",
      stories: []
    };
  }

  componentDidMount() {
    const stories = loadStories(this.props.filepath);
    const currentProps = stories[0].props;
    const currentStory = stories[0].name;
    console.log(currentStory, currentProps);
    this.setState({
      stories,
      currentStory,
      currentProps,
      editingValue: JSON.stringify(currentProps),
      loading: false
    });
  }

  componentDidUpdate(_, prevState) {
    if (prevState.currentStory !== this.state.currentStory) {
      this.setState({ loading: true });
      const stories = loadStories(this.props.filepath);
      const story = stories.find(s => s.name === this.state.currentStory);
      if (story) {
        this.setState({
          currentStory: story.name,
          currentProps: story.props,
          editingValue: JSON.stringify(story.props),
          loading: false
        });
        this.props.onChange(story.props);
      }
    }
  }

  render() {
    return (
      <div>
        <div>Story Props</div>
        <div>
          {this.state.stories.map(story => {
            if (this.state.currentStory === story.name) {
              return <span key={story.name}>{story.name}</span>;
            }
            return (
              <button
                key={story.name}
                onClick={() => this.setState({ currentStory: story.name })}
              >
                {story.name}
              </button>
            );
          })}
          <button
            onClick={() => {
              const { stories } = this.state;
              const newStories = [
                ...stories,
                { name: (stories.length + 1).toString(), props: {} }
              ];
              localStorage.setItem(
                this.props.filepath,
                JSON.stringify(newStories)
              );
              this.setState({
                stories: newStories
              });
            }}
          >
            + add story
          </button>
        </div>
        {!this.state.loading && (
          <textarea
            style={{
              width: 300,
              height: 200,
              backgroundColor: this.state.valid ? "white" : "#faa"
            }}
            value={this.state.editingValue}
            onChange={event => {
              this.setState({ editingValue: event.target.value });
              try {
                const props = JSON.parse(event.target.value);
                this.setState({ valid: true });
                this.props.onChange && this.props.onChange(props);
                // save to localStorage
                const newStories = this.state.stories.map(story => {
                  if (story.name === this.state.currentStory) {
                    return {
                      name: story.name,
                      props
                    };
                  }
                  return story;
                });
                localStorage.setItem(
                  this.props.filepath,
                  JSON.stringify(newStories)
                );
                console.log("save", this.props.filepath, newStories);
              } catch (e) {
                this.setState({ valid: false });
                return;
              }
            }}
          />
        )}
      </div>
    );
  }
}
