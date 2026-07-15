# NeuroAssist — AI Agent Pro

> A production-level AI Agent with real-time web search, long-term memory, RAG-based document chat, and a modern React frontend.

![NeuroAssist](https://img.shields.io/badge/AI-Agent-7c3aed?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Groq](https://img.shields.io/badge/Groq-LLaMA3-orange?style=for-the-badge)

[Live Demo](https://industrious-enthusiasm-production.up.railway.app/) - https://industrious-enthusiasm-production.up.railway.app/

---

## Features

- 🌐 **Real-time Web Search** — Live internet access via Tavily API
- 🧠 **Long-term Memory** — Remembers past conversations using ChromaDB
- 📄 **Document Chat (RAG)** — Upload PDFs and ask questions about them
- ⚡ **Blazing Fast** — Powered by Groq + LLaMA 3.3 70B
- 🎨 **Modern UI** — Clean dark-mode React interface

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + Tailwind CSS |
| Backend | FastAPI + Python |
| LLM | Groq (LLaMA 3.3 70B) |
| Web Search | Tavily API |
| Memory | ChromaDB |
| Document RAG | LangChain + HuggingFace Embeddings |

---

## Screenshots

### Dashboard
![Dashboard](screenshots/Screenshot%202026-07-05%20102857.png)

### Chat Interface
![Chat Interface](screenshots/Screenshot%202026-07-05%20103924.png)

---

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- Groq API Key → [console.groq.com](https://console.groq.com)
- Tavily API Key → [tavily.com](https://tavily.com)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/NeuroAssist-Pro.git
cd NeuroAssist-Pro
```

**2. Backend Setup**
```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

**3. Environment Variables**
```bash
# Create .env file
GROQ_API_KEY=your_groq_api_key
TAVILY_API_KEY=your_tavily_api_key
```

**4. Frontend Setup**
```bash
cd frontend
npm install
```

### Running the App

**Terminal 1 - Backend:**
```bash
uvicorn main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) 

---

## Project Structure

NeuroAssist-Pro/

├── main.py              # FastAPI backend

├── .env                 # API keys

├── requirements.txt     # Python dependencies

└── frontend/

├── src/

│   ├── App.jsx      # Main React component

│   └── index.css    # Global styles

└── vite.config.js   # Vite configuration

---

## How It Works

1. **User sends a message** via the React frontend
2. **FastAPI backend** receives the request
3. Based on toggles:
   - 🌐 Web Search → Tavily fetches real-time results
   - 🧠 Memory → ChromaDB retrieves relevant past conversations
   - 📄 Doc Chat → LangChain searches uploaded PDF content
4. **Groq LLM** generates a response using all context
5. Response is saved to memory and returned to frontend

---

## Author

**Kishore Kumar**
- GitHub: [@seenukishore](https://github.com/seenukishore)
- LinkedIn: [linkedin.com/in/kishore-kumar-seenu](https://www.linkedin.com/in/kishore-kumar-seenu/)

---

⭐ Star this repo if you found it helpful!