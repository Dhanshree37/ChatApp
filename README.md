# 💬 Cointab Chat App

A simple full-stack chat application using **Next.js** on the frontend, **Express.js** on the backend, and **Ollama (Mistral model)** for generating AI responses.

---

## ✨ Features

- 🌐 Create new chat sessions
- 💬 Send and receive messages from Mistral (via Ollama)
- 🧠 Auto-title each chat with the first few words of your message
- 🧹 Skips empty chats from chat list
- 🎨 Sleek dark-themed UI built with inline CSS
- ⚡ Real-time "Bot is typing..." feedback

---

## 🛠️ Tech Stack

| Frontend         | Backend         | AI Model   |
|------------------|------------------|-------------|
| Next.js (App Router) | Node.js + Express | Mistral via Ollama |

---

## 📁 Folder Structure
```
ChatApp/
├── client/ # Frontend - Next.js App
├── server/ # Backend - Express Server
├── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js & npm
- Ollama installed with the `mistral` model pulled:
  
  ```
  ollama pull mistral
   ```
Backend Setup
```
cd server
npm install
node index.js
```
Starts backend at http://localhost:5000

Frontend Setup
```
cd ../client
npm install
npm run dev
```
Starts frontend at http://localhost:3000

### 📷 Screenshot

![Chat App Screenshot](chatApp.png)

### 📌 Notes
The chat titles are automatically updated after the first message.

Chats with no messages are not shown in the sidebar.

You can start a new chat any time with the "+ New Chat" button.

### 🧑‍💻 Author
Made with ❤️ by Dhanshree Patil

### 📄 License
This project is licensed under the MIT License.
