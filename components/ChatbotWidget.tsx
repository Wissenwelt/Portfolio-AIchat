"use client";

import { useState, KeyboardEvent, useRef, useEffect } from "react";
// MODIFIED: Added Smile icon
import { MessageSquare, X, Send, Bot, Smile } from "lucide-react";
// MODIFIED: Imported the emoji picker component
import Picker, { EmojiClickData } from "emoji-picker-react";

type Message = {
  from: "user" | "bot";
  text: string;
};

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      from: "bot",
      text: "Hello! I'm Archie, your professional assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  // ADDED: State to manage the visibility of the emoji picker
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // ADDED: Function to handle selecting an emoji
  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setInput((prevInput) => prevInput + emojiData.emoji);
    setShowEmojiPicker(false); // Hide picker after selection
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setInput("");

    try {
      const response = await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          history: messages,
        }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      setMessages((prev) => [...prev, { from: "bot", text: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last?.from === "bot") {
            last.text += chunk;
          }
          return updated;
        });
      }
    } catch (error) {
      console.error("Failed to stream message:", error);
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "I'm having trouble connecting. Please try again shortly.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        from: "bot",
        text: "Hello! I'm Archie, your professional assistant. How can I help you today?",
      },
    ]);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${
          isOpen
            ? "bg-red-500 hover:bg-red-600"
            : "bg-gradient-to-r from-primary-600 to-accent-500"
        }`}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <MessageSquare size={24} className="text-white" />
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-4 w-[350px] h-[500px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          <div className="bg-gradient-to-r from-primary-600 to-accent-500 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bot size={24} />
              <h3 className="font-bold text-lg">Archie Assistant</h3>
            </div>
            <button
              onClick={clearChat}
              className="text-sm bg-white/20 hover:bg-white/30 px-2 py-1 rounded-md transition-colors"
            >
              Clear Chat
            </button>
          </div>

          <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-4 flex ${
                  msg.from === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                    msg.from === "user"
                      ? "bg-gradient-to-r from-primary-600 to-accent-500 text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none border border-gray-200">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-200 p-3 bg-white">
            <div className="relative">
              {/* ADDED: Emoji Picker Panel */}
              {showEmojiPicker && (
                <div className="absolute bottom-full right-0 mb-2">
                  <Picker onEmojiClick={handleEmojiClick} />
                </div>
              )}
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                // MODIFIED: Increased padding-right for emoji button
                className="w-full pl-4 pr-24 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-accent-500"
                disabled={isLoading}
              />
              {/* ADDED: Button to toggle the emoji picker */}
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="absolute right-14 top-1/2 -translate-y-1/2 p-2 rounded-full text-gray-400 hover:text-gray-600"
                aria-label="Open emoji picker"
              >
                <Smile size={20} />
              </button>
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full ${
                  isLoading || !input.trim()
                    ? "bg-gray-300"
                    : "bg-gradient-to-r from-primary-600 to-accent-500"
                }`}
              >
                <Send
                  size={18}
                  className={`${
                    isLoading || !input.trim() ? "text-gray-500" : "text-white"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}