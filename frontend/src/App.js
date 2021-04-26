import React, { useEffect, useState } from "react";
import "./App.css";

const client = new WebSocket("ws://localhost:3000");

function App() {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    client.addEventListener("message", (event) => {
      setChat((old) => [...old, event.data]);
    });
  }, []);

  function sendMessage(_) {
    const fullMsg = name + ":" + msg;
    setMsg("");
    chat.push(fullMsg);
    setChat(chat);
    client.send(fullMsg);
  }

  return (
    <div className="App">
      <h1>Chat</h1>
      <ul>{chat.length > 0 && chat.map((msg, i) => <li key={i}>{msg}</li>)}</ul>
      <div>
        <input onChange={(e) => setName(e.target.value)} value={name} />
        <input
          onChange={(e) => setMsg(e.target.value)}
          onKeyPress={(e) => (e.key === "Enter" ? sendMessage(e) : null)}
          value={msg}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
