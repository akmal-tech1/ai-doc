// Chat.js
import React, { useState } from "react";
import axios from "axios";

function Chat() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

    const handleChat = async () => {
        try {
            const res = await axios.post("http://localhost:8000/chat", null, {
                params: { query },
            });
            setResults(res.data.results);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h2>Chat with AI</h2>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask something..."
            />
            <button onClick={handleChat}>Send</button>

            <div>
                {results.map((r, idx) => (
                    <div key={idx} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
                        <p><strong>File:</strong> {r.filename}</p>
                        <p><strong>Chunk:</strong> {r.chunk_number}</p>
                        <p><strong>Text:</strong> {r.text}</p>
                        <p><strong>Score:</strong> {r.score}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Chat;
