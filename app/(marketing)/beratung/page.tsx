"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
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

export default function BeratungPage() {
  const [messages, setMessages] = useState<Message[]>([
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
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll zu neuen Nachrichten (nur innerhalb des Chat-Containers)
  useEffect(() => {
    if (messagesEndRef.current && messages.length > 2) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [messages]);

  const handleQuickReply = async (value: string, label: string) => {
    if (isLoading) return;

    // Bei RESTART den Chat-Verlauf löschen
    if (value === "RESTART") {
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
          context: value,
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
    <div className="min-h-screen bg-white">
      {/* Banner Section */}
      <section className="w-full mt-4 mb-8">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="relative">
            <Image
              src="/images/banners/beratung-banner.webp"
              alt="Futterberatung Banner"
              width={1600}
              height={300}
              className="w-full h-60 object-cover rounded-2xl shadow-sm"
              priority
            />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-12">
        {/* Chat Window */}
        <div className="max-w-3xl mx-auto">
          <div
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-primary/40 overflow-hidden"
            style={{
              boxShadow:
                "0 8px 32px 0 rgba(127, 85, 57, 0.25), 0 4px 16px 0 rgba(127, 85, 57, 0.15)",
            }}
          >
            {/* Chat Header */}
            <div className="bg-[hsl(26,18%,90%)] text-gray-800 p-2">
              <div className="flex items-center gap-4">
                <Image
                  src="/images/logo.webp"
                  alt="EliteDogTreats Logo"
                  width={150}
                  height={150}
                />
                <div>
                  <h2 className="text-2xl font-bold text-primary">
                    Futter-Berater 🐾
                  </h2>
                  <p className="text-gray-600">
                    Finden Sie die richtigen Produkte für Ihren Vierbeiner
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-6 space-y-4 bg-[hsl(26,18%,90%)]/30">
              {messages.map((message) => (
                <div key={message.id}>
                  <div
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div className="max-w-[80%]">
                      {message.role === "user" && (
                        <p className="text-xs text-gray-500 font-medium mb-1">
                          Ihre Auswahl
                        </p>
                      )}
                      <div
                        className={`rounded-2xl px-4 py-3 ${
                          message.role === "user"
                            ? "bg-white text-accent border-2 border-accent"
                            : "bg-white text-gray-800 shadow-sm border border-gray-200"
                        }`}
                      >
                        {/* User Selection Summary */}
                        {message.userSelection && (
                          <p className="text-xs mb-2 italic">
                            {message.userSelection
                              .split(/(\[\[.*?\]\])/)
                              .map((part, index) => {
                                if (
                                  part.startsWith("[[") &&
                                  part.endsWith("]]")
                                ) {
                                  const value = part.slice(2, -2);
                                  return (
                                    <span
                                      key={index}
                                      className="text-primary font-semibold"
                                    >
                                      {value}
                                    </span>
                                  );
                                }
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

                        <p
                          className={`text-sm whitespace-pre-wrap ${
                            message.quickReplies &&
                            message.quickReplies.length > 0
                              ? "font-bold"
                              : ""
                          }`}
                        >
                          {message.content}
                        </p>

                        {/* Quick Reply Buttons */}
                        {message.quickReplies &&
                          message.quickReplies.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {message.quickReplies.map((reply, index) => {
                                const isSpecialButton =
                                  reply.value === "ALL" ||
                                  reply.value === "NONE" ||
                                  reply.value === "END" ||
                                  reply.value === "BACK" ||
                                  reply.label.includes("Egal") ||
                                  reply.label.includes("Keine besonderen") ||
                                  reply.label.includes("beenden") ||
                                  reply.label.includes("Zurück");

                                return (
                                  <button
                                    key={index}
                                    onClick={() =>
                                      handleQuickReply(reply.value, reply.label)
                                    }
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                                      isSpecialButton
                                        ? "bg-accent/20 text-accent hover:bg-accent hover:text-white"
                                        : "bg-accent text-white hover:bg-accent/20 hover:text-accent"
                                    }`}
                                  >
                                    {reply.label}
                                  </button>
                                );
                              })}
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
                                className="block bg-linear-to-r from-accent/10 to-accent/5 hover:from-accent/20 hover:to-accent/10 rounded-lg p-3 transition-all border-2 border-accent/30 hover:border-accent cursor-pointer shadow-sm hover:shadow-md"
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
                                    <p className="text-sm text-accent font-bold mt-1">
                                      €{product.price.toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 rounded-2xl px-4 py-3 shadow-sm border border-gray-200">
                    <Loader2 className="w-5 h-5 animate-spin text-accent" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="py-4 px-16 bg-linear-to-r from-primary to-[hsl(6,25%,25%)] border-t border-white/20">
              <div className="flex gap-6">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Frage stellen oder Auswahl treffen..."
                  className="flex-1 px-4 py-2 border-2 border-white/30 bg-white/95 rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:border-white placeholder:text-gray-500"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-accent text-white rounded-full px-8 py-3 hover:bg-white hover:text-accent hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-medium"
                  aria-label="Nachricht senden"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <div className="flex justify-center mt-4">
                <button
                  onClick={() =>
                    handleQuickReply("RESTART", "Neue Suche starten")
                  }
                  disabled={isLoading}
                  className="px-6 text-white rounded-lg underline text-m font-medium transition-all cursor-pointer disabled:opacity-50 hover:text-white/80 hover:no-underline"
                >
                  Neue Suche starten
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
