import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [chatId, setChatId] = useState(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatList, setChatList] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const createAndFetch = async () => {
      try {
        const res = await axios.post("http://localhost:5000/api/chat");
        setChatId(res.data.chatId);
        setMessages([]);

        const chatRes = await axios.get("http://localhost:5000/api/chats");
        setChatList(chatRes.data);
      } catch (err) {
        console.error("Error on startup", err);
      }
    };

    createAndFetch();
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    try {
      setMessages([...messages, { role: "user", content: input }]);
      setInput("");
      setIsTyping(true);

      const res = await axios.post(`http://localhost:5000/api/chat/${chatId}/message`, {
        message: input,
      });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.data.response },
      ]);
      setIsTyping(false);

      const updatedChats = await axios.get("http://localhost:5000/api/chats");
      setChatList(updatedChats.data);
    } catch (err) {
      console.error("Error sending message", err);
      setIsTyping(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "sans-serif",
        background: "#121212",
        color: "#fff",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "250px",
          background: "#1e1e1e",
          padding: "1rem",
          borderRight: "1px solid #333",
          overflowY: "auto",
        }}
      >
        <button
          onClick={async () => {
            try {
              const res = await axios.post("http://localhost:5000/api/chat");
              setChatId(res.data.chatId);
              setMessages([]);
              setInput("");

              const chatRes = await axios.get("http://localhost:5000/api/chats");
              setChatList(chatRes.data);
            } catch (err) {
              console.error("Failed to start new chat", err);
            }
          }}
          style={{
            width: "100%",
            padding: "0.75rem",
            marginBottom: "1rem",
            background: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          + New Chat
        </button>

        {chatList.map((chat) => (
          <div
            key={chat.id}
            onClick={async () => {
              try {
                const res = await axios.get(
                  `http://localhost:5000/api/chat/${chat.id}`
                );
                setMessages(res.data);
                setChatId(chat.id);
              } catch (err) {
                console.error("Failed to load chat", err);
              }
            }}
            style={{
              padding: "0.5rem",
              marginBottom: "0.5rem",
              cursor: "pointer",
              background: chat.id === chatId ? "#333" : "#2c2c2c",
              borderRadius: "6px",
              transition: "background 0.3s",
            }}
          >
            {chat.title}
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div
        style={{
          flex: 1,
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h1 style={{ color: "#0070f3", marginBottom: "1rem" }}>
          💬 Chat App
        </h1>

        <div
          style={{
            flex: 1,
            border: "1px solid #333",
            padding: "1rem",
            overflowY: "auto",
            background: "#1a1a1a",
            marginBottom: "1rem",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                backgroundColor: msg.role === "user" ? "#0070f3" : "#333",
                color: msg.role === "user" ? "#fff" : "#e0e0e0",
                padding: "0.75rem 1rem",
                borderRadius: "10px",
                maxWidth: "70%",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              }}
            >
              <div style={{ fontWeight: "bold", marginBottom: "0.3rem" }}>
                {msg.role === "user" ? "You" : "Bot"}
              </div>
              <div>{msg.content}</div>
            </div>
          ))}

          {isTyping && (
            <div style={{ fontStyle: "italic", color: "#bbb" }}>
              Bot is typing...
            </div>
          )}
        </div>

        <div>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
            style={{
              padding: "0.75rem",
              width: "75%",
              borderRadius: "8px",
              border: "1px solid #444",
              outline: "none",
              fontSize: "1rem",
              background: "#2a2a2a",
              color: "#fff",
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              padding: "0.75rem 1.2rem",
              marginLeft: "0.5rem",
              borderRadius: "8px",
              border: "none",
              background: "#0070f3",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
