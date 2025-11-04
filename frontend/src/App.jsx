import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

export default function App() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "👋 Hi there! Let’s get started on your university application essay.\n\n1️⃣ What program are you applying to, and at what school?\n2️⃣ What is the essay prompt given to you by your desired school?\n3️⃣ What is the word count of your essay?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMsg = { role: "user", content: input };
    setMessages((m) => [...m, newMsg]);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();
    setLoading(false);
    setMessages((m) => [
      ...m,
      { role: "assistant", content: data.reply || "Sorry, I didn’t catch that." },
    ]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 text-gray-900">
      <header className="p-5 text-center shadow-md bg-white/70 backdrop-blur-md">
        <h1 className="text-3xl font-bold text-blue-700">UniEssay Mentor 🎓</h1>
        <p className="text-sm text-gray-500">Your AI-powered essay guide</p>
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${msg.role === "assistant" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                msg.role === "assistant"
                  ? "bg-blue-100 text-gray-800"
                  : "bg-blue-600 text-white"
              }`}
            >
              {msg.content}
            </div>
          </motion.div>
        ))}

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-blue-100 text-gray-800 px-4 py-3 rounded-2xl shadow-sm">
              <span className="animate-pulse">Thinking...</span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef}></div>
      </main>

      <footer className="p-4 bg-white/70 backdrop-blur-md shadow-inner">
        <div className="flex items-center gap-2">
          <textarea
            className="flex-1 resize-none rounded-xl border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows="1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your answer or ask for essay help..."
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl shadow transition"
          >
            <Send size={18} />
          </button>
        </div>
      </footer>
    </div>
  );
}
