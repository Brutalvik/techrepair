"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  Loader2,
  Bot,
  BotMessageSquare,
  Sparkles,
  MapPin,
  Phone,
  Wrench,
} from "lucide-react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Card, CardBody, Divider } from "@heroui/react";
import Link from "next/link";
import clsx from "clsx";
import { GoogleGenAI } from "@google/genai";

import { SYSTEM_PROMPT } from "@/lib/system-prompt";

type Message = {
  role: "user" | "bot";
  text: string;
  isCTA?: boolean;
};

const LOCATIONS = [
  {
    name: "Downtown (Elveden Centre)",
    address: "707 7 Ave SW Main Floor, Calgary",
    phone: "+1 (403) 462-5456",
    tel: "+14034625456",
  },
  {
    name: "Kensington",
    address: "1211 Kensington Rd NW #101, Calgary",
    phone: "+1 (825) 454-4444",
    tel: "+18254544444",
  },
];

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Hi there! 👋 I'm your Infinite Tech assistant. How can I help you with your device today?",
    },
  ]);

  const [userMessageCount, setUserMessageCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, isLoading]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue("");

    // 1. Add User Message
    const newMessages = [
      ...messages,
      { role: "user" as const, text: userMessage },
    ];
    setMessages(newMessages);

    const newCount = userMessageCount + 1;
    setUserMessageCount(newCount);

    // 2. Limit Check
    if (newCount > 10) {
      setIsLoading(true);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            text: "I want to make sure we solve your issue correctly! Since this is getting complex, please book a repair or call one of our locations below directly.",
            isCTA: true,
          },
        ]);
        setIsLoading(false);
      }, 600);
      return;
    }

    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({
        apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "",
      });

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          ...newMessages.map((m) => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.text }],
          })),
        ],
        config: {
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          thinkingConfig: { thinkingBudget: 0 },
        },
      });

      // --- LOGIC TO DETECT THE BUTTON SIGNAL ---
      let botText = response.text || "I'm having trouble connecting right now.";
      let showButton = false;

      // Check for the secret tag
      if (botText.includes("[[SHOW_CTA]]")) {
        showButton = true;
        // Remove the tag so the user doesn't see it
        botText = botText.replace("[[SHOW_CTA]]", "").trim();
      }

      setMessages((prev) => [
        ...prev,
        { role: "bot", text: botText, isCTA: showButton },
      ]);
    } catch (error) {
      console.error("Chatbot Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Oops! Something went wrong. Please try again later.",
        },
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
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        <AnimatePresence>
          {isHovered && !isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
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

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 flex h-[600px] w-[360px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 sm:w-[400px]"
          >
            <div className="flex items-center gap-3 bg-blue-600 px-4 py-3 text-white">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-sm">
                  Infinite Tech Assistant
                </h3>
                <p className="text-xs text-blue-100 flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-full bg-green-400" />
                  Online
                </p>
              </div>
            </div>

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
                      "max-w-[90%]",
                      msg.role === "user" ? "text-right" : "text-left"
                    )}
                  >
                    <div
                      className={clsx(
                        "inline-block rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm whitespace-pre-wrap",
                        msg.role === "user"
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-slate-100 text-slate-800 dark:bg-zinc-800 dark:text-slate-200 rounded-bl-none"
                      )}
                    >
                      {msg.text}
                    </div>

                    {/* RENDER BUTTON ONLY IF isCTA IS TRUE */}
                    {msg.isCTA && (
                      <Card className="mt-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 shadow-none">
                        <CardBody className="p-4 gap-3">
                          <Button
                            as={Link}
                            href="/book-repair"
                            color="primary"
                            variant="solid"
                            className="w-full font-bold shadow-md"
                            startContent={<Wrench size={16} />}
                            onPress={() => setIsOpen(false)}
                          >
                            Book a Repair Now
                          </Button>

                          <Divider className="my-1" />
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">
                            Or Call Us
                          </p>
                          <div className="space-y-2">
                            {LOCATIONS.map((loc) => (
                              <div
                                key={loc.name}
                                className="flex flex-col gap-1 rounded-lg bg-white p-2 border border-slate-200 dark:bg-zinc-900 dark:border-zinc-700"
                              >
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                  <MapPin size={10} /> {loc.name}
                                </span>
                                <a
                                  href={`tel:${loc.tel}`}
                                  className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                                >
                                  <Phone size={14} /> {loc.phone}
                                </a>
                              </div>
                            ))}
                          </div>
                        </CardBody>
                      </Card>
                    )}
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

            <div className="border-t border-slate-100 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
              {userMessageCount > 10 ? (
                <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-zinc-800">
                  <p className="text-xs text-slate-500 font-medium">
                    Chat limit reached.
                  </p>
                  <Button
                    as={Link}
                    href="/book-repair"
                    size="sm"
                    variant="light"
                    color="primary"
                    className="mt-1 h-6"
                    onPress={() => setIsOpen(false)}
                  >
                    Go to Booking Page
                  </Button>
                </div>
              ) : (
                <div className="relative flex items-center gap-2">
                  <Input
                    value={inputValue}
                    onValueChange={setInputValue}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about repairs..."
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
              )}
              <div className="mt-2 text-center">
                <p className="text-[10px] text-slate-400">
                  AI can make mistakes. Contact us for critical issues.
                </p>
                <p className="text-[10px] text-slate-400">
                  By using AI you agree to our{" "}
                  <Link
                    className="text-blue-500 hover:underline"
                    href="/terms-and-conditions"
                  >
                    Terms and Conditions
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
