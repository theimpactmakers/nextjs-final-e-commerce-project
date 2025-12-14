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
  allowMultipleSelection?: boolean;
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMeatTypes, setSelectedMeatTypes] = useState<string[]>([]);
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

  const handleQuickReply = async (
    value: string,
    label: string,
    allowMultiple?: boolean
  ) => {
    if (isLoading) return;

    // Bei RESTART den Chat-Verlauf löschen
    if (value === "RESTART") {
      setMessages([]);
      setIsLoading(false);
      setSelectedMeatTypes([]);
      return;
    }

    // Bei Mehrfachauswahl: Fleischsorte zur Auswahl hinzufügen/entfernen
    if (allowMultiple && !["ALL", "NONE"].includes(value)) {
      if (selectedMeatTypes.includes(value)) {
        setSelectedMeatTypes((prev) => prev.filter((meat) => meat !== value));
      } else {
        setSelectedMeatTypes((prev) => [...prev, value]);
      }
      return; // Nicht direkt senden, warte auf Bestätigung
    }

    // Bei "Alle Sorten" wähle alle aus und sende direkt
    if (value === "ALL" && allowMultiple) {
      const currentMessage = messages[messages.length - 1];
      if (currentMessage?.quickReplies) {
        const allMeats = currentMessage.quickReplies
          .filter((reply) => !["ALL", "NONE"].includes(reply.value))
          .map((reply) => reply.value);
        setSelectedMeatTypes(allMeats);
      }
      // Sende direkt mit "ALL"
      value = "ALL";
      allowMultiple = false;
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
        allowMultipleSelection: data.allowMultipleSelection,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Reset Mehrfachauswahl wenn keine Mehrfachauswahl mehr erlaubt ist
      if (!data.allowMultipleSelection) {
        setSelectedMeatTypes([]);
      }
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

  const handleConfirmMultipleSelection = async () => {
    if (isLoading || selectedMeatTypes.length === 0) return;

    const meatTypeLabels: { [key: string]: string } = {
      ENTE: "🦆 Ente",
      RIND: "🥩 Rind",
      KANINCHEN: "🐰 Kaninchen",
      LAMM: "🐑 Lamm",
      PFERD: "🐴 Pferd",
      WILD: "🦌 Wild",
      LACHS: "🐟 Lachs",
      HUHN: "🐔 Huhn",
    };

    const selectedLabels = selectedMeatTypes
      .map((meat) => meatTypeLabels[meat] || meat)
      .join(", ");

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: selectedLabels,
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
          context: `MULTI_MEAT:${selectedMeatTypes.join(",")}`,
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
        allowMultipleSelection: data.allowMultipleSelection,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setSelectedMeatTypes([]);
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
        allowMultipleSelection: data.allowMultipleSelection,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Reset Mehrfachauswahl wenn keine Mehrfachauswahl mehr erlaubt ist
      if (!data.allowMultipleSelection) {
        setSelectedMeatTypes([]);
      }
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
          className="fixed bottom-6 right-6 z-50 bg-linear-to-r from-[hsl(27,38%,36%)] to-[hsl(6,25%,25%)] rounded-full p-5 shadow-2xl hover:shadow-[0_20px_60px_rgba(127,85,57,0.5)] transition-all duration-300 hover:scale-110 group cursor-pointer text-white hover:bg-black "
          aria-label="Chat öffnen"
        >
          <MessageCircle className="w-7 h-7" />
          <span className="absolute -top-2 -right-2 bg-accent/80 text-black text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
            ?
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-6 right-6 z-50 w-96 h-[600px] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-white/20 backdrop-blur-xl bg-white/80"
          style={{
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          }}
        >
          {/* Header */}
          <div className="bg-white/60 backdrop-blur-md text-gray-800 p-4 flex justify-between items-center border-b border-white/20">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo.webp"
                alt="EliteDogTreats Logo"
                width={100}
                height={100}
                className="rounded-full"
              />
              <div>
                <h3 className="font-semibold text-primary">
                  Futter-Berater 🐾
                </h3>
                <p className="text-xs text-gray-500">
                  Finden Sie die richtigen Produkte
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-gray-100/50 rounded-full p-1 transition-colors cursor-pointer"
              aria-label="Chat schließen"
            >
              <X className="w-5 h-5 text-black" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[hsl(26,18%,90%)]/50 backdrop-blur-sm">
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
                        Auswahl
                      </p>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        message.role === "user"
                          ? "bg-white text-accent border border-accent"
                          : "bg-white text-gray-800 shadow-sm border border-gray-200"
                      }`}
                    >
                      {/* User Selection Summary */}
                      {message.userSelection && (
                        <p className="text-[10px] mb-2 italic">
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
                          <div className="mt-3">
                            <div className="flex flex-wrap gap-2">
                              {message.quickReplies.map((reply, index) => {
                                const isSpecialButton =
                                  reply.value === "ALL" ||
                                  reply.value === "NONE" ||
                                  reply.value === "END" ||
                                  reply.value === "BACK" ||
                                  reply.value === "BACK_TO_MEAT" ||
                                  reply.label.includes("Egal") ||
                                  reply.label.includes("Keine besonderen") ||
                                  reply.label.includes("beenden") ||
                                  reply.label.includes("Zurück") ||
                                  reply.label.includes("Ja,") ||
                                  reply.label.includes("Nein,");

                                const isSelected =
                                  message.allowMultipleSelection &&
                                  selectedMeatTypes.includes(reply.value);

                                return (
                                  <button
                                    key={index}
                                    onClick={() =>
                                      handleQuickReply(
                                        reply.value,
                                        reply.label,
                                        message.allowMultipleSelection
                                      )
                                    }
                                    className={`px-3 py-2 rounded-(--app-radius) text-sm font-medium transition-all cursor-pointer ${
                                      isSelected
                                        ? "bg-green-600 text-white border-2 border-green-700"
                                        : isSpecialButton
                                        ? "bg-accent/20 text-accent hover:bg-accent hover:text-white"
                                        : "bg-accent text-white hover:bg-accent/20 hover:text-accent"
                                    }`}
                                  >
                                    {isSelected && "✓ "}
                                    {reply.label}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Bestätigungsbutton für Mehrfachauswahl */}
                            {message.allowMultipleSelection &&
                              selectedMeatTypes.length > 0 && (
                                <button
                                  onClick={handleConfirmMultipleSelection}
                                  disabled={isLoading}
                                  className="mt-3 w-full px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all cursor-pointer disabled:opacity-50"
                                >
                                  ✓ Auswahl bestätigen (
                                  {selectedMeatTypes.length} ausgewählt)
                                </button>
                              )}
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
          <div className="p-4 bg-linear-to-r from-[hsl(27,38%,36%)] to-[hsl(6,25%,25%)]">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nachricht schreiben..."
                className="flex-1 px-4 py-2 border-2 border-white/30 bg-white/95 rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:border-white placeholder:text-gray-500"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-accent text-white rounded-full px-2 py-1 hover:bg-white/90 hover:text-accent hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                aria-label="Nachricht senden"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex justify-center mt-3">
              <button
                onClick={() =>
                  handleQuickReply("RESTART", "Neue Suche starten")
                }
                disabled={isLoading}
                className="px-6 py-2 text-white rounded-lg underline text-sm font-medium transition-all cursor-pointer disabled:opacity-50 hover:text-white/80 hover:no-underline"
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
