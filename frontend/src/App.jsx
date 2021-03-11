import React from "react";
import MessagePanel from "./MessagePanel/MessagePanel";
import "./App.scss";
class App extends React.Component {
  constructor(prop) {
    super(prop);
  }

  render() {
    return (
      <div className="App">
        <div className="group-container">
            <div className="group">
                <h2>Group 1</h2>
                <MessagePanel name="User 1" id="user_1" group="group_1"></MessagePanel>
                <MessagePanel name="User 2" id="user_2" group="group_1"></MessagePanel>
            </div>
            <div className="group">
                <h2>Group 2</h2>
                <MessagePanel name="User 3" id="user_3" group="group_2"></MessagePanel>
                <MessagePanel name="User 4" id="user_4" group="group_2"></MessagePanel>
                <MessagePanel name="User 5" id="user_5" group="group_2"></MessagePanel>
            </div>
        </div>
      </div>
    );
  }
}

export default App;
