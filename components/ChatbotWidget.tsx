"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Loader2, X, Send } from "lucide-react";

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hey, I'm Archie, Vijendra's AI agent! Before we start our conversation, could you please share your name and a bit about yourself? This will help me tailor my genius-level insights professionally (and with my signature sarcasm). 🤖✨"
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { from: "user", text: userMessage }]);
    setInput("");
    setIsLoading(true);

    try {
      // Convert the messages array to the format expected by the API
      const history = messages.map(msg => ({
        role: msg.from === "bot" ? "assistant" : "user",
        text: msg.text
      }));

      const res = await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: history
        }),
      });

      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setMessages((prev) => [...prev, { from: "bot", text: data.reply }]);
    } catch (err) {
      console.error("Chatbot error:", err);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "🔥 Oops, my circuits are fried. Try again later!" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div suppressHydrationWarning>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-5 right-5 bg-gradient-to-r from-primary-500 to-accent-500 text-white p-4 rounded-full shadow-4xl z-50 flex items-center gap-2 font-medium"
        onClick={() => setOpen(!open)}
      >
        {open ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <MessageSquare className="w-6 h-6" />
            <span>Archie</span>
          </>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            suppressHydrationWarning
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-20 right-5 w-[95vw] sm:w-[500px] h-[70vh] max-h-[600px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl flex flex-col z-50 border border-primary-100 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-primary-600 to-accent-500 text-white px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-full">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold">Archie</h2>
              </div>
              <button 
                onClick={() => setOpen(false)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl ${
                      msg.from === "user" 
                        ? "bg-gradient-to-r from-primary-500 to-accent-500 text-white"
                        : "bg-gray-50 border border-primary-100"
                    }`}
                    style={{ fontFamily: "Segoe UI Emoji, Noto Color Emoji, sans-serif" }}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-50 p-3 rounded-2xl flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
                    <span>Thinking...</span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-primary-100 p-4">
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type your question..."
                  className="flex-1 bg-transparent p-2 focus:outline-none"
                  disabled={isLoading}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={sendMessage}
                  disabled={isLoading}
                  className="p-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white disabled:opacity-50"
                >
                  <Send className="w-6 h-6" />
                </motion.button>
              </div>
              <p className="text-sm text-gray-500 mt-2 text-center">
                Press ⏎ Enter to send
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
