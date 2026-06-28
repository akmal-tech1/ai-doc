export default function ChatArea({ messages, isThinking, chatEndRef }) {
  if (messages.length === 0 && !isThinking) {
    return (
      <div className="chat-area">
        <div className="empty-state">
          <BrainIcon />
          <h2>Ask anything</h2>
          <p>Upload a PDF and start asking questions. Answers are pulled directly from your documents.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-area" role="log" aria-label="Chat messages" aria-live="polite">
      {messages.map((msg, i) => (
        <Message key={i} msg={msg} />
      ))}
      {isThinking && <ThinkingBubble />}
      <div ref={chatEndRef} />
    </div>
  );
}

function Message({ msg }) {
  const isAI = msg.role === "ai";
  return (
    <div className={`msg ${isAI ? "ai-msg" : "user-msg"}`}>
      {isAI && (
        <div className="avatar ai-avatar" aria-hidden="true">
          <BrainIcon size={15} />
        </div>
      )}
      <div className={`bubble ${isAI ? "ai-bubble" : "user-bubble"}`}>
        <p>{msg.content}</p>
        {isAI && msg.sources && msg.sources.length > 0 && (
          <div className="sources" aria-label="Source chunks">
            {msg.sources.map((src, i) => (
              <span key={i} className="source-tag">
                <FileIcon />
                {src.filename ? src.filename.replace(".pdf", "") : "doc"} #{src.chunk_number ?? i + 1}
              </span>
            ))}
          </div>
        )}
      </div>
      {!isAI && (
        <div className="avatar user-avatar" aria-hidden="true">U</div>
      )}
    </div>
  );
}

function ThinkingBubble() {
  return (
    <div className="msg ai-msg">
      <div className="avatar ai-avatar" aria-hidden="true">
        <BrainIcon size={15} />
      </div>
      <div className="bubble ai-bubble thinking-bubble" aria-label="AI is thinking">
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
      </div>
    </div>
  );
}

function BrainIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.14Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.14Z" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
    </svg>
  );
}
