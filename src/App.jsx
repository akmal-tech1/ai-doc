// App.js
import React from "react";
import FileUpload from "./FileUpload/FileUpload";
import Chat from "./Chat/Chat";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>AI Chatbot Interface</h1>
      <FileUpload />
      <Chat />
    </div>
  );
}

export default App;
