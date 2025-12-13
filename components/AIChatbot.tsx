"use client";

import { useState, useRef, useEffect } from "react";
import { X, MessageCircle, Send, Loader2 } from "lucide-react";
import Image from "next/image";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  userSelection?: string;
  products?: Array<{
    id: number;
    name: string;
    price: number;
    image_url?: string;
    slug?: string;
  }>;
  quickReplies?: Array<{
    label: string;
    value: string;
  }>;
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Begrüßungsnachricht beim ersten Öffnen mit Standardfragen
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: "1",
          role: "assistant",
          content:
            "Hallo,🐶 ich helfe Ihnen gerne, das perfekte Futter für Ihren Vierbeiner zu finden.",
        },
        {
          id: "2",
          role: "assistant",
          content: "Bitte wählen Sie das Alter Ihres Hundes:",
          quickReplies: [
            { label: "🐶 Welpe/Junior (0-2 Jahre)", value: "JUNIOR" },
            { label: "🐕 Erwachsen (2-7 Jahre)", value: "ADULT" },
            { label: "🐾 Senior (7+ Jahre)", value: "SENIOR" },
          ],
        },
      ]);
    }
  }, [isOpen, messages.length]);

  // Auto-scroll zu neuen Nachrichten
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus auf Input wenn Chat geöffnet wird
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleQuickReply = async (value: string, label: string) => {
    if (isLoading) return;

    // Bei RESTART den Chat-Verlauf löschen
    if (value === "RESTART") {
      setMessages([]);
      setIsLoading(false);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: label,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          context: value, // Sende den Wert für bessere Filterung
        }),
      });

      if (!response.ok) {
        throw new Error("Fehler beim Abrufen der Antwort");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        products: data.products,
        quickReplies: data.quickReplies,
        userSelection: data.userSelection,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chatbot Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "Entschuldigung, es gab einen Fehler. Bitte versuchen Sie es erneut.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Fehler beim Abrufen der Antwort");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        products: data.products,
        quickReplies: data.quickReplies,
        userSelection: data.userSelection,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chatbot Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "Entschuldigung, es gab einen Fehler. Bitte versuchen Sie es erneut.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-[hsl(6,25%,25%)] hover:bg-linear-to-r hover:from-[hsl(27,38%,36%)] hover:to-[hsl(6,25%,25%)] text-white rounded-full p-5 shadow-2xl hover:shadow-[0_20px_60px_rgba(127,85,57,0.5)] transition-all duration-300 hover:scale-110 group cursor-pointer animate-pulse"
          aria-label="Chat öffnen"
        >
          <MessageCircle className="w-7 h-7" />
          <span className="absolute -top-2 -right-2 bg-[hsl(33,100%,37%)] text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
            ?
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-linear-to-r from-[hsl(6,25%,25%)] to-[hsl(27,38%,36%)] text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-full p-2">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">EliteDogTreats Futter-Berater</h3>
                <p className="text-xs text-white/80">
                  Lassen Sie sich beraten 🐾
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 rounded-full p-1 transition-colors cursor-pointer"
              aria-label="Chat schließen"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[hsl(26,18%,90%)]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.role === "user"
                      ? "bg-linear-to-r from-[hsl(33,100%,45%)] to-[hsl(33,100%,37%)] text-white"
                      : "bg-white text-gray-800 shadow-sm border border-gray-200"
                  }`}
                >
                  {/* User Selection Summary */}
                  {message.userSelection && (
                    <p className="text-[10px] mb-2 italic">
                      {message.userSelection
                        .split(/(\[\[.*?\]\])/)
                        .map((part, index) => {
                          if (part.startsWith("[[") && part.endsWith("]]")) {
                            const value = part.slice(2, -2);
                            return (
                              <span
                                key={index}
                                className="text-[hsl(27,38%,36%)] font-semibold"
                              >
                                {value}
                              </span>
                            );
                          }
                          // "Deine Auswahl:" oder "Deine Frage:" in schwarz und bold
                          if (
                            part.includes("Deine Auswahl:") ||
                            part.includes("Deine Frage:")
                          ) {
                            return (
                              <span
                                key={index}
                                className="text-black font-bold"
                              >
                                {part}
                              </span>
                            );
                          }
                          return (
                            <span key={index} className="text-gray-500">
                              {part}
                            </span>
                          );
                        })}
                    </p>
                  )}

                  <p className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </p>

                  {/* Quick Reply Buttons */}
                  {message.quickReplies && message.quickReplies.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.quickReplies.map((reply, index) => (
                        <button
                          key={index}
                          onClick={() =>
                            handleQuickReply(reply.value, reply.label)
                          }
                          className="px-3 py-2 bg-[hsl(33,100%,37%)]/20 border-2 border-[hsl(33,100%,37%)] text-[hsl(27,38%,36%)] rounded-full text-sm font-medium hover:bg-[hsl(33,100%,37%)] hover:text-white transition-all cursor-pointer"
                        >
                          {reply.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Product Recommendations */}
                  {message.products && message.products.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.products.map((product) => (
                        <a
                          key={product.id}
                          href={`/products/${product.slug || product.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block bg-white hover:bg-[hsl(33,100%,37%)]/10 rounded-lg p-3 transition-all border-2 border-[hsl(33,100%,37%)]/30 hover:border-[hsl(33,100%,37%)] cursor-pointer shadow-sm hover:shadow-md"
                        >
                          <div className="flex gap-3">
                            {product.image_url && (
                              <Image
                                src={product.image_url}
                                alt={product.name}
                                width={64}
                                height={64}
                                className="w-16 h-16 object-cover rounded"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm text-black truncate hover:underline">
                                {product.name}
                              </p>
                              <p className="text-sm text-[hsl(33,100%,37%)] font-bold mt-1">
                                €{product.price.toFixed(2)}
                              </p>
                              <p className="text-[10px] text-gray-400 mt-1 truncate">
                                🔗 /products/{product.slug || product.id}
                              </p>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 rounded-2xl px-4 py-3 shadow-sm border border-gray-200">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nachricht schreiben..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[hsl(27,38%,36%)] focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-linear-to-r from-[hsl(6,25%,25%)] to-[hsl(27,38%,36%)] text-white rounded-full p-2 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                aria-label="Nachricht senden"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="flex justify-center mt-3">
              <button
                onClick={() =>
                  handleQuickReply("RESTART", "Neue Suche starten")
                }
                disabled={isLoading}
                className="px-6 py-2 text-accent rounded-lg underline text-sm font-medium transition-all cursor-pointer disabled:opacity-50 hover:text-primary hover:no-underline"
              >
                Neue Suche starten
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
