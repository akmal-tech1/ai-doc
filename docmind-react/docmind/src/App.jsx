import { useState, useRef, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import InputBar from "./components/InputBar";
import "./App.css";

const API_BASE = "http://localhost:8000";

export default function App() {
  const [docs, setDocs] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const handleUploadSuccess = (filename, chunks) => {
    setDocs((prev) => [...prev, { filename, chunks }]);
  };

  const handleSend = async (query) => {
    if (!query.trim() || isThinking) return;

    setMessages((prev) => [...prev, { role: "user", content: query }]);
    setIsThinking(true);

    try {
      const res = await fetch(`${API_BASE}/chat?query=${encodeURIComponent(query)}`, {
        method: "POST",
      });
      const data = await res.json();

      if (res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            content: data.answer,
            sources: data.matched_chunks || [],
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "ai", content: "Something went wrong. Please check the server.", sources: [] },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Cannot reach the API at localhost:8000. Make sure the FastAPI server is running.",
          sources: [],
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="app">
      <Header />
      <div className="app-body">
        <Sidebar docs={docs} onUploadSuccess={handleUploadSuccess} apiBase={API_BASE} />
        <div className="main">
          <ChatArea messages={messages} isThinking={isThinking} chatEndRef={chatEndRef} />
          <InputBar onSend={handleSend} isThinking={isThinking} />
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="header">
      <div className="logo-ring">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.14Z" />
          <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.14Z" />
        </svg>
      </div>
      <div className="header-text">
        <h1>DocMind AI</h1>
        <p>RAG-powered document assistant</p>
      </div>
      <div className="status-dot" title="API online" />
    </header>
  );
}
