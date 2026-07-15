import { useState, useRef, useEffect } from "react"
import axios from "axios"
import { Send, Search, Brain, FileText, Trash2, Zap, Plus, X, Menu } from "lucide-react"

export default function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [webSearch, setWebSearch] = useState(false)
  const [memory, setMemory] = useState(true)
  const [docChat, setDocChat] = useState(false)
  const [file, setFile] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async (text) => {
    const msg = text || input
    if (!msg.trim()) return
    const userMsg = { role: "user", content: msg }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    setLoading(true)
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/chat`, {
        message: msg,
        web_search: webSearch,
        use_memory: memory,
        use_document: docChat,
        history: messages
      })
      setMessages(prev => [...prev, { role: "assistant", content: res.data.response }])
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Error occurred. Please try again." }])
    }
    setLoading(false)
  }

  const uploadFile = async (e) => {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    const formData = new FormData()
    formData.append("file", f)
    await axios.post(`${import.meta.env.VITE_API_URL}/api/upload`, formData)
  }

  const Toggle = ({ value, onChange }) => (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: 44, height: 24, borderRadius: 12,
        background: value ? '#7c3aed' : '#374151',
        position: 'relative', border: 'none', cursor: 'pointer',
        transition: 'background 0.3s'
      }}
    >
      <div style={{
        position: 'absolute', top: 4,
        left: value ? 24 : 4,
        width: 16, height: 16,
        borderRadius: '50%', background: 'white',
        transition: 'left 0.3s'
      }} />
    </button>
  )

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100vh', width: '100vw',
      background: '#0d0d14', color: 'white',
      fontFamily: 'Inter, sans-serif', overflow: 'hidden'
    }}>

      {/* Top Nav */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Zap size={18} color="#7c3aed" />
          <span style={{ color: '#a78bfa', fontWeight: 600, fontSize: 18 }}>NeuroAssist</span>
        </div>
        <button onClick={() => setSidebarOpen(true)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
          <Menu size={22} />
        </button>
      </div>

      {/* Sidebar */}
      {sidebarOpen && (
        <>
          <div onClick={() => setSidebarOpen(false)} style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40
          }} />
          <div style={{
            position: 'fixed', left: 0, top: 0, height: '100%', width: 260,
            background: '#13131f', borderRight: '1px solid rgba(255,255,255,0.1)',
            zIndex: 50, padding: 20, display: 'flex', flexDirection: 'column', gap: 20
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: 600, color: 'white' }}>Command Center</p>
                <p style={{ fontSize: 12, color: '#a78bfa' }}>AI Agent Pro</p>
              </div>
              <button onClick={() => setSidebarOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 2 }}>Features</p>

            {[
              { icon: <Search size={15} />, label: 'Web Search', value: webSearch, onChange: setWebSearch },
              { icon: <Brain size={15} />, label: 'Memory', value: memory, onChange: setMemory },
              { icon: <FileText size={15} />, label: 'Doc Chat', value: docChat, onChange: setDocChat },
            ].map(({ icon, label, value, onChange }) => (
              <div key={label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: value ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.05)',
                borderRadius: 12, padding: '12px 16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#a78bfa' }}>
                  {icon}
                  <span style={{ fontSize: 14, color: '#d1d5db' }}>{label}</span>
                </div>
                <Toggle value={value} onChange={onChange} />
              </div>
            ))}

            {docChat && (
              <label style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                padding: 16, border: '2px dashed rgba(124,58,237,0.5)',
                borderRadius: 12, cursor: 'pointer'
              }}>
                <FileText size={20} color="#a78bfa" />
                <span style={{ fontSize: 12, color: '#9ca3af' }}>{file ? file.name : 'Upload PDF'}</span>
                <input type="file" accept=".pdf" style={{ display: 'none' }} onChange={uploadFile} />
              </label>
            )}

            <button onClick={() => { setMessages([]); setSidebarOpen(false) }}
              style={{
                marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 8,
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#6b7280', padding: 8, borderRadius: 8
              }}>
              <Trash2 size={15} />
              <span style={{ fontSize: 14 }}>Clear Chat</span>
            </button>
          </div>
        </>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 0' }}>
        {messages.length === 0 ? (
          <div style={{
            height: '100%', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 20, textAlign: 'center', padding: 24
          }}>
            <div style={{
              width: 80, height: 80, borderRadius: 24,
              background: 'rgba(124,58,237,0.3)',
              border: '1px solid rgba(124,58,237,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Zap size={36} color="#a78bfa" />
            </div>
            <div>
              <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>How can I help you?</h2>
              <p style={{ color: '#6b7280', fontSize: 14, maxWidth: 340 }}>
                I'm <span style={{ color: '#a78bfa' }}>NeuroAssist</span> - your AI agent with web search, memory, and document understanding.
              </p>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.05)', borderRadius: 20, padding: '8px 16px'
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%', background: '#2dd4bf',
                animation: 'pulse 2s infinite'
              }} />
              <span style={{ color: '#2dd4bf', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase' }}>Ready to Process</span>
            </div>
          </div>
        ) : (
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 24,
            maxWidth: 680, margin: '0 auto', padding: '0 24px', width: '100%'
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.role === 'user' ? 'center' : 'flex-start'
              }}>
                {msg.role === 'user' ? (
                  <div style={{
                    background: 'rgba(255,255,255,0.08)',
                    borderRadius: 16, padding: '12px 20px',
                    fontSize: 14, color: '#e5e7eb',
                    maxWidth: '80%', textAlign: 'center',
                    border: '1px solid rgba(255,255,255,0.08)'
                  }}>
                    {msg.content}
                    <div style={{ fontSize: 10, color: '#4b5563', marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 }}>
                      Just now
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 8,
                        background: 'rgba(124,58,237,0.4)',
                        border: '1px solid rgba(124,58,237,0.4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <Zap size={13} color="#a78bfa" />
                      </div>
                      <span style={{ fontSize: 13, color: '#a78bfa', fontWeight: 500 }}>NeuroAssist</span>
                    </div>
                    <div style={{
                      fontSize: 14, color: '#d1d5db',
                      lineHeight: 1.7, whiteSpace: 'pre-wrap',
                      paddingLeft: 36
                    }}>
                      {msg.content}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: 'rgba(124,58,237,0.4)',
                    border: '1px solid rgba(124,58,237,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Zap size={13} color="#a78bfa" />
                  </div>
                  <span style={{ fontSize: 13, color: '#a78bfa', fontWeight: 500 }}>NeuroAssist</span>
                </div>
                <div style={{ paddingLeft: 36, display: 'flex', gap: 4, alignItems: 'center', fontStyle: 'italic', color: '#6b7280', fontSize: 13 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2dd4bf' }} />
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2dd4bf', opacity: 0.6 }} />
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2dd4bf', opacity: 0.3 }} />
                  <span style={{ marginLeft: 4 }}>Searching for latest research...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ padding: '12px 24px 24px' }}>
        <div style={{
          maxWidth: 680, margin: '0 auto', width: '100%',
          display: 'flex', flexDirection: 'column', gap: 12
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 16, padding: '12px 16px'
          }}>
            <label style={{ cursor: 'pointer', color: '#6b7280' }}>
              <Plus size={20} />
              <input type="file" accept=".pdf" style={{ display: 'none' }} onChange={uploadFile} />
            </label>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Ask me anything..."
              style={{
                flex: 1, background: 'transparent', border: 'none',
                outline: 'none', color: 'white', fontSize: 14,
                '::placeholder': { color: '#4b5563' }
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              style={{
                width: 36, height: 36, borderRadius: 10,
                background: loading || !input.trim() ? 'rgba(124,58,237,0.3)' : '#7c3aed',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
              <Send size={15} color="white" />
            </button>
          </div>

          {messages.length === 0 && (
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              {["Summarize this page", "Check my calendar", "Analyze PDF"].map(action => (
                <button key={action} onClick={() => sendMessage(action)}
                  style={{
                    fontSize: 12, color: '#6b7280',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 20, padding: '6px 14px',
                    background: 'none', cursor: 'pointer'
                  }}>
                  {action}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
