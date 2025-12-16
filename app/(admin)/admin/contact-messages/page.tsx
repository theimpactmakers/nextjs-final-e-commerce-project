import { createClient } from "@/lib/supabase/server";
import React from "react";

export const metadata = {
  title: "Kontaktanfragen | Admin",
  description: "Verwalten Sie Kontaktanfragen von Kunden.",
};

type ContactMessage = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  message: string;
  created_at: string;
  answered?: boolean;
  answer?: string | null;
};

export default async function ContactMessagesPage() {
  const supabase = await createClient();
  const { data: messages, error } = await supabase
    .from("contact_messages")
    .select("id, first_name, last_name, email, phone, message, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="p-8 text-[#a90329]">
        Fehler beim Laden: {error.message}
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Kontaktanfragen</h1>
      <table className="min-w-full border bg-white text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-3 py-2">Datum</th>
            <th className="border px-3 py-2">Vorname</th>
            <th className="border px-3 py-2">Nachname</th>
            <th className="border px-3 py-2">E-Mail</th>
            <th className="border px-3 py-2">Telefon</th>
            <th className="border px-3 py-2">Nachricht</th>
            <th className="border px-3 py-2">Aktion</th>
          </tr>
        </thead>
        <tbody>
          {messages && messages.length > 0 ? (
            (messages as ContactMessage[]).map((msg) => (
              <tr key={msg.id}>
                <td className="border px-3 py-2 whitespace-nowrap">
                  {new Date(msg.created_at).toLocaleString()}
                </td>
                <td className="border px-3 py-2">{msg.first_name}</td>
                <td className="border px-3 py-2">{msg.last_name}</td>
                <td className="border px-3 py-2">{msg.email}</td>
                <td className="border px-3 py-2">{msg.phone || "-"}</td>
                <td className="border px-3 py-2 max-w-xs text-primary wrap-break-word">
                  {msg.message}
                </td>
                <td className="border px-3 py-2">
                  <a
                    href={`/admin/contact-messages/${msg.id}`}
                    className="text-accent hover:text-black underline"
                  >
                    Ansehen
                  </a>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={7}
                className="text-center py-8 text-muted-foreground"
              >
                Keine Kontaktanfragen gefunden.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
