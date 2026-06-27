from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import tempfile
from dotenv import load_dotenv
from groq import Groq
from tavily import TavilyClient
import chromadb
from datetime import datetime
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
tavily_client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

chroma_client = chromadb.PersistentClient(path="./memory_db")
collection = chroma_client.get_or_create_collection(name="chat_memory")

embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

class ChatRequest(BaseModel):
    message: str
    web_search: bool = False
    use_memory: bool = True
    use_document: bool = False
    history: List[dict] = []

def save_memory(user_msg: str, ai_msg: str):
    try:
        timestamp = datetime.now().isoformat()
        collection.add(
            documents=[f"User: {user_msg}\nAI: {ai_msg}"],
            ids=[timestamp]
        )
    except:
        pass

def get_memory(query: str) -> str:
    try:
        count = collection.count()
        if count == 0:
            return ""
        results = collection.query(query_texts=[query], n_results=min(3, count))
        if results['documents'][0]:
            return "Previous context:\n" + "\n".join(results['documents'][0])
    except:
        pass
    return ""

def search_web(query: str) -> str:
    try:
        results = tavily_client.search(query=query, search_depth="advanced", max_results=5)
        print("TAVILY RESULTS:", results)
        return "\n\n".join([f"{r['title']}\n{r['content']}" for r in results['results']])
    except Exception as e:
        print("TAVILY ERROR:", str(e))
        return f"Search failed: {str(e)}"

def search_doc(query: str) -> str:
    try:
        vectorstore = Chroma(persist_directory="./doc_db", embedding_function=embeddings)
        results = vectorstore.similarity_search(query, k=3)
        return "From document:\n" + "\n".join([r.page_content for r in results])
    except:
        return ""

@app.post("/api/chat")
async def chat(req: ChatRequest):
    system = "You are NeuroAssist, an advanced AI agent. Be helpful, clear and concise."
    context = ""

    if req.use_memory:
        mem = get_memory(req.message)
        if mem:
            context += f"\n\n{mem}"

    if req.web_search:
        results = search_web(req.message)
        context += f"\n\nWeb Results:\n{results}"

    if req.use_document:
        doc = search_doc(req.message)
        if doc:
            context += f"\n\n{doc}"

    if context:
        system += f"\n\nContext:{context}"

    messages = [{"role": "system", "content": system}] + req.history + [{"role": "user", "content": req.message}]

    response = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        max_tokens=8096
    )

    answer = response.choices[0].message.content

    if req.use_memory:
        save_memory(req.message, answer)

    return {"response": answer}

@app.post("/api/upload")
async def upload(file: UploadFile = File(...)):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as f:
            f.write(await file.read())
            loader = PyPDFLoader(f.name)
            pages = loader.load()
            splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
            chunks = splitter.split_documents(pages)
            vectorstore = Chroma.from_documents(
                documents=chunks,
                embedding=embeddings,
                persist_directory="./doc_db"
            )
        return {"message": f"Document processed! {len(chunks)} chunks ready."}
    except Exception as e:
        return {"error": str(e)}