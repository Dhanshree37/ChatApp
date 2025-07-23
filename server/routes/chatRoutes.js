const express = require("express");
const router = express.Router();
const axios = require("axios");

let chats = [];
let messages = {};

// Create new chat
router.post("/chat", (req, res) => {
  const newId = chats.length + 1;
  chats.push({ id: newId, title: `Chat ${newId}`, created_at: new Date() });
  messages[newId] = [];
  res.status(201).json({ chatId: newId });
});

// Send message and get response from Ollama (mistral)
router.post("/chat/:id/message", async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;

  // Save user's message
  messages[id].push({ role: "user", content: message });

  // Auto-title the chat if it's the first message
  const currentChat = chats.find(c => c.id === parseInt(id));
  if (currentChat && currentChat.title.startsWith("Chat")) {
    const words = message.trim().split(/\s+/).slice(0, 5); // First 5 words
    currentChat.title = words.join(" ") + (words.length === 5 ? "..." : "");
  }

  try {
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "mistral",
      prompt: message,
      stream: false,
    });

    const reply = response.data.response.trim();

    // Save bot's response
    messages[id].push({ role: "assistant", content: reply });

    res.json({ 
      response: reply,
      title: currentChat.title // send updated title back to frontend
    });
  } catch (error) {
    console.error("Ollama error:", error.message);
    res.status(500).json({ error: "Failed to get response from Ollama" });
  }
});

// Get all chats (excluding empty ones)
router.get("/chats", (req, res) => {
  const nonEmptyChats = chats.filter(chat => {
    const chatMsgs = messages[chat.id] || [];
    return chatMsgs.length > 0;
  });
  res.json(nonEmptyChats);
});

// Get messages of a chat
router.get("/chat/:id", (req, res) => {
  const { id } = req.params;
  res.json(messages[id] || []);
});

module.exports = router;
