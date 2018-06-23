import React from "react";

export default class PropsEditor extends React.Component {
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
