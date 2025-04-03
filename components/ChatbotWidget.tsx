"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Loader2,
  X,
  Send,
  Paperclip,
  AlertCircle,
  Globe,
  Trash2,
  FileText,
  File,
} from "lucide-react";

// Interface for chat messages
interface ChatMessage {
  from: "user" | "bot";
  text: string;
}

// Interface for the attached file data (including content)
interface AttachedFileData {
  name: string;
  type: string; // e.g., 'application/pdf', 'text/plain'
  size: number;
  contentBase64: string; // File content encoded as Base64
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      from: "bot",
      text: "Hello! I'm Archie, your AI assistant. How can I help you today? 😊",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchMode, setSearchMode] = useState(false);
  // State to hold attached file data, including Base64 content
  const [attachedFileData, setAttachedFileData] = useState<AttachedFileData | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, attachedFileData, scrollToBottom]);

  useEffect(() => {
    if (isOpen && !isLoading) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isLoading]);

  // Function to read file content as Base64
  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = (reader.result as string).split(",")[1];
        if (base64String) {
          resolve(base64String);
        } else {
          reject(new Error("Failed to read file as Base64."));
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const sendMessage = useCallback(async () => {
    const messageTextTrimmed = input.trim();
    if (!messageTextTrimmed && !attachedFileData) return;

    setError(null);

    const userMessageToSendText = messageTextTrimmed;

    const displayMessageText = attachedFileData
      ? `${messageTextTrimmed} ${messageTextTrimmed ? "• " : ""}[File attached: ${attachedFileData.name}]`
      : userMessageToSendText;
    const newUserMessage: ChatMessage = { from: "user", text: displayMessageText };
    setMessages((prev) => [...prev, newUserMessage]);

    const historyForAPI = messages.map((msg) => ({
      role: msg.from === "bot" ? "assistant" : "user",
      text: msg.text,
    }));

    const requestBody = {
      message: userMessageToSendText || `Please analyze the attached file: ${attachedFileData?.name}`,
      history: historyForAPI,
      searchMode: searchMode,
      attachedFileData: attachedFileData,
    };

    setInput("");
    setAttachedFileData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        let errorMsg = `API error: ${res.status} ${res.statusText}`;
        try {
          const errorData = await res.json();
          errorMsg = errorData.error || errorData.reply || errorMsg;
        } catch (e) {
          console.warn("Could not parse error response body.");
        }
        throw new Error(errorMsg);
      }

      const data = await res.json();
      if (typeof data.reply === "string") {
        const formattedReply = data.reply.replace(/\n{3,}/g, "\n\n").trim();
        setMessages((prev) => [...prev, { from: "bot", text: formattedReply }]);
      } else {
        throw new Error("Invalid response format from API (missing 'reply').");
      }
    } catch (err: unknown) {
      console.error("Chatbot fetch/processing error:", err);
      let errorText = "Sorry, something went wrong. Please try again.";
      if (err instanceof Error) errorText = err.message;
      setError(errorText);
    } finally {
      setIsLoading(false);
      if (isOpen) {
        inputRef.current?.focus();
      }
    }
  }, [input, messages, searchMode, attachedFileData, isOpen]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isLoading) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleAttachmentClick = () => {
    if (!isLoading && !attachedFileData) {
      fileInputRef.current?.click();
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setError(null);
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        setError(`File is too large (max ${maxSize / 1024 / 1024}MB).`);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      if (file.type !== "application/pdf" && file.type !== "text/plain") {
        setError("Unsupported file type. Please attach a PDF or TXT file.");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      setIsLoading(true);
      setError("Reading file...");
      try {
        const base64Content = await readFileAsBase64(file);
        setAttachedFileData({
          name: file.name,
          type: file.type,
          size: file.size,
          contentBase64: base64Content,
        });
        setError(null);
      } catch (readError: unknown) {
        console.error("File reading error:", readError);
        let errMsg = "Unknown error";
        if (readError instanceof Error) errMsg = readError.message;
        setError(`Failed to read file: ${errMsg}`);
        setAttachedFileData(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } finally {
        setIsLoading(false);
      }
    }
  };

  const removeAttachment = () => {
    setAttachedFileData(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    inputRef.current?.focus();
  };

  const triggerSearch = () => {
    if (!isLoading) {
      setSearchMode((prev) => !prev);
      const searchStatusMessage = !searchMode
        ? "Search mode activated. I'll look for relevant news when you send your next message."
        : "Search mode deactivated.";
      setMessages((prev) => [...prev, { from: "bot", text: searchStatusMessage }]);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setError(null);
      setSearchMode(false);
      setAttachedFileData(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType === "application/pdf") {
      return <FileText className="w-4 h-4 flex-shrink-0" />;
    }
    return <File className="w-4 h-4 flex-shrink-0" />;
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-0 right-0 m-4 bg-gradient-to-br from-primary-600 to-accent-500 text-white p-4 rounded-full shadow-xl z-[999]"
        onClick={toggleChat}
        aria-label={isOpen ? "Close Chat" : "Open Chat"}
      >
        {isOpen ? <X className="w-7 h-7" /> : <MessageSquare className="w-7 h-7" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[998] bg-white flex flex-col"
            aria-modal="true"
            role="dialog"
          >
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-primary-600 to-accent-500 text-white">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-6 h-6" />
                <h2 className="text-xl font-semibold">Chat with Archie</h2>
                {searchMode && (
                  <span className="px-2 py-0.5 bg-white/20 text-white text-xs rounded-full">Search Mode</span>
                )}
              </div>
              <div>
                <button
                  onClick={toggleChat}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                  aria-label="Close Chat"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 * Math.min(idx, 5) }}
                  className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-2xl shadow-sm ${
                      msg.from === "user"
                        ? "bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-br-lg"
                        : "bg-white text-gray-700 border border-gray-200 rounded-bl-lg"
                    } break-words whitespace-pre-wrap`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {isLoading && searchMode && (
                <motion.div className="flex items-center gap-2 p-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                  <motion.span
                    className="text-gray-600 bg-white border border-gray-200 rounded-2xl px-4 py-2"
                    initial={{ scale: 1 }}
                    animate={{ scale: 1.05 }}
                    transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
                  >
                    Archie is researching the latest news...
                  </motion.span>
                </motion.div>
              )}

              {isLoading && !searchMode && (
                <motion.div className="flex items-center gap-2 p-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                  <span className="text-gray-600 bg-white border border-gray-200 rounded-2xl px-4 py-2">
                    {attachedFileData ? "Processing your file..." : "Archie is thinking..."}
                  </span>
                </motion.div>
              )}

              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center p-2">
                  <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
                    <AlertCircle className="w-5 h-5" />
                    <span>{error}</span>
                    <button
                      onClick={() => setError(null)}
                      className="ml-2 text-red-500 hover:text-red-700"
                      aria-label="Dismiss error"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-200 bg-white">
              <AnimatePresence>
                {attachedFileData && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mb-2 text-sm text-gray-600 bg-gray-100 border border-gray-200 rounded-md px-3 py-1.5 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      {getFileIcon(attachedFileData.type)}
                      <span className="truncate" title={attachedFileData.name}>
                        {attachedFileData.name}
                      </span>
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        ({(attachedFileData.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <button
                      onClick={removeAttachment}
                      disabled={isLoading}
                      className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-200 flex-shrink-0 disabled:opacity-50"
                      aria-label="Remove attached file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1 border border-gray-200">
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileSelect}
                  accept="application/pdf,text/plain"
                />
                <button
                  onClick={handleAttachmentClick}
                  disabled={isLoading || !!attachedFileData}
                  className={`p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-200 rounded-lg transition-colors ${
                    isLoading || !!attachedFileData ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  aria-label="Attach file (PDF or TXT)"
                >
                  <Paperclip className="w-5 h-5" />
                </button>

                <motion.button
                  onClick={triggerSearch}
                  disabled={isLoading}
                  className={`p-2 rounded-lg relative flex items-center justify-center transition-colors ${
                    searchMode ? "bg-primary-500 text-white" : "text-gray-500 hover:text-primary-600 hover:bg-gray-200"
                  } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  aria-label="Toggle Search Mode"
                  whileHover={{ scale: isLoading ? 1 : 1.05 }}
                  whileTap={{ scale: isLoading ? 1 : 0.95 }}
                >
                  <Globe className="w-5 h-5" />
                  <span className="hidden sm:inline ml-1">Search</span>
                  {searchMode && (
                    <motion.div
                      className="absolute inset-0 rounded-lg border-2 border-white/50"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
                    />
                  )}
                </motion.button>

                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    isLoading
                      ? "Processing..."
                      : attachedFileData
                      ? "Ask about the file or send without a message..."
                      : searchMode
                      ? "Ask anything (search mode active)..."
                      : "Ask me anything, attach PDF/TXT..."
                  }
                  className="flex-1 bg-transparent p-2 text-gray-700 placeholder-gray-400 focus:outline-none"
                  disabled={isLoading}
                  aria-label="Chat input"
                />

                <motion.button
                  whileHover={{
                    scale: isLoading || (!input.trim() && !attachedFileData) ? 1 : 1.05,
                  }}
                  whileTap={{
                    scale: isLoading || (!input.trim() && !attachedFileData) ? 1 : 0.95,
                  }}
                  onClick={sendMessage}
                  disabled={isLoading || (!input.trim() && !attachedFileData)}
                  className={`p-2 rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 text-white transition-all duration-200 ${
                    isLoading || (!input.trim() && !attachedFileData)
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:from-primary-600 hover:to-accent-600"
                  }`}
                  aria-label="Send message"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
