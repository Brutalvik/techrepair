"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Bot,
  BotMessageSquare,
  Sparkles,
} from "lucide-react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { ScrollShadow } from "@heroui/scroll-shadow";
import clsx from "clsx";

import { SYSTEM_PROMPT } from "@/lib/system-prompt";

// Type for chat messages
type Message = {
  role: "user" | "bot";
  text: string;
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Hi there! 👋 I'm your Infinite Tech assistant. How can I help you with your device today?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue("");
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      // API Key provided by the environment
      const apiKey = "";

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userMessage }] }],
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }

      const data = await response.json();
      const botResponse =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I'm sorry, I'm having trouble connecting right now. Please try again later.";

      setMessages((prev) => [...prev, { role: "bot", text: botResponse }]);
    } catch (error) {
      console.error("Chatbot Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Oops! Something went wrong. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Toggle Button Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        <AnimatePresence>
          {isHovered && !isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="mb-2 flex items-center gap-2 rounded-xl bg-white px-4 py-2 shadow-lg dark:bg-zinc-900 border border-blue-100 dark:border-blue-900/30 cursor-pointer"
            >
              <Sparkles size={16} className="text-blue-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Get tech answers instantly!
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 focus:outline-none"
        >
          {isOpen ? <X size={24} /> : <BotMessageSquare size={28} />}
        </motion.button>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 flex h-[500px] w-[350px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 sm:w-[380px]"
          >
            {/* Header */}
            <div className="flex items-center gap-3 bg-blue-600 px-4 py-3 text-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-sm">
                  Infinite Tech Assistant
                </h3>
                <p className="text-xs text-blue-100">
                  Online • Replies instantly
                </p>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollShadow ref={scrollRef} className="flex-1 space-y-4 p-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={clsx(
                    "flex w-full",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={clsx(
                      "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-slate-100 text-slate-800 dark:bg-zinc-800 dark:text-slate-200 rounded-bl-none"
                    )}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl rounded-bl-none bg-slate-100 px-4 py-3 dark:bg-zinc-800">
                    <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                    <span className="text-xs text-slate-500">Thinking...</span>
                  </div>
                </div>
              )}
            </ScrollShadow>

            {/* Input Area */}
            <div className="border-t border-slate-100 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="relative flex items-center gap-2">
                <Input
                  value={inputValue}
                  onValueChange={setInputValue}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="flex-1"
                  classNames={{
                    inputWrapper:
                      "bg-slate-100 dark:bg-zinc-800 pr-10 hover:bg-slate-200 dark:hover:bg-zinc-700",
                  }}
                  disabled={isLoading}
                />
                <Button
                  isIconOnly
                  size="sm"
                  color="primary"
                  className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full"
                  onClick={handleSendMessage}
                  isLoading={isLoading}
                >
                  {!isLoading && <Send size={16} />}
                </Button>
              </div>
              <div className="mt-2 text-center">
                <p className="text-[10px] text-slate-400">
                  AI can make mistakes. Contact an advisor for critical issues.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
