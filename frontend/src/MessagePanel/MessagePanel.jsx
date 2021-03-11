import React from "react";
import "./MessagePanel.scss";

class MessagePanel extends React.Component {
  constructor(prop) {
    super(prop);
    this.panelId = prop.id;
    this.panelName = prop.name;
    this.groupId = prop.group;

    this.state = {
      messages: [],
      currentUserInputMessage: "",
      infoMessage: "",
      errorMessage: "",
    };
  }

  componentDidMount() {
    this.createSocket(this.panelId, this.panelName, this.groupId);
  }

  createSocket(panelId, panelName, groupId) {
    let socket = new WebSocket(
      `ws://localhost:8765/ws/${panelId}/${panelName}/${groupId}`
    );

    socket.onopen = (evt) => {
      socket.send(
        JSON.stringify({
          isAnnounce: true,
          message: `${this.panelName} registered`,
        })
      );
      this.setState({ infoMessage: `${this.panelName} registered` });
    };

    socket.onmessage = (evt) => {
      let messages = [...this.state.messages];
      messages.push(evt.data);
      this.setState({ messages });
    };

    socket.onclose = (evt) => {
      if (evt.wasClean) {
        this.setState({ infoMessage: `${this.panelName} closed` });
      } else {
        this.setState({ errorMessage: `${evt.code} : ${evt.reason}` });
      }
    };

    socket.onerror = (err) => {
      this.setState({ errorMessage: "Error occurred" });
    };
    this.socket = socket;
  }

  sendMessage(text, isAnnounce) {
    if (text === "") return;
    try {
      let data = JSON.stringify({
        isAnnounce: isAnnounce === true,
        message: text,
      });
      this.socket.send(data);
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }
    this.setState({ currentUserInputMessage: "" });
  }

  textChange(evt) {
    this.setState({
      currentUserInputMessage: evt.target.value,
    });
  }

  keyPress(evt) {
    if (evt.key === "Enter")
      this.sendMessage(this.state.currentUserInputMessage);
  }

  renderMessage(message) {
    let m = JSON.parse(message);
    return (
      <>
        <span>{m["from"]}</span> : <span>{m["message"]}</span>
      </>
    );
  }

  render() {
    let state = this.state;
    return (
      <>
        <div className="panel-ctn">
          <h3>{this.panelName}</h3>
          <div className="panel-body">
            {state.messages.map((m, idx) => (
              <p key={idx}>{this.renderMessage(m)}</p>
            ))}
            <div className="user-console">
              <input
                type="text"
                value={state.currentUserInputMessage}
                onChange={(evt) => this.textChange(evt)}
                onKeyPress={(evt) => this.keyPress(evt)}
              />
              <button
                onClick={(evt) =>
                  this.sendMessage(state.currentUserInputMessage)
                }
              >
                Send
              </button>
              <button
                onClick={(evt) =>
                  this.sendMessage(state.currentUserInputMessage, true)
                }
              >
                Announce
              </button>
            </div>
            <div className="info-message">{state.infoMessage}</div>
            <div className="error-message">{state.errorMessage}</div>
          </div>
        </div>
      </>
    );
  }
}

export default MessagePanel;
