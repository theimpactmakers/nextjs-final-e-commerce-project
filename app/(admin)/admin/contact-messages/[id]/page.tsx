import { createClient } from "@/lib/supabase/server";
import React from "react";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Kontaktanfrage beantworten | Admin",
  description: "Antworten Sie auf eine Kontaktanfrage.",
};

export default async function ContactMessageDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const { data: msg, error } = await supabase
    .from("contact_messages")
    .select("id, name, email, message, created_at, answered, answer")
    .eq("id", params.id)
    .single();

  if (error || !msg) return notFound();

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Kontaktanfrage von {msg.name}</h1>
      <div className="mb-4">
        <div>
          <span className="font-semibold">E-Mail:</span> {msg.email}
        </div>
        <div>
          <span className="font-semibold">Datum:</span>{" "}
          {new Date(msg.created_at).toLocaleString()}
        </div>
      </div>
      <div className="mb-6">
        <span className="font-semibold">Nachricht:</span>
        <div className="bg-gray-50 border rounded p-3 mt-1 whitespace-pre-line">
          {msg.message}
        </div>
      </div>
      {msg.answered ? (
        <div className="bg-green-50 border border-green-200 rounded p-4">
          <div className="font-semibold mb-2">Antwort:</div>
          <div>{msg.answer}</div>
        </div>
      ) : (
        <form
          action={`/admin/contact-messages/${msg.id}/reply`}
          method="POST"
          className="space-y-4"
        >
          <div>
            <label htmlFor="answer" className="block font-semibold mb-1">
              Antwort
            </label>
            <textarea
              id="answer"
              name="answer"
              required
              rows={5}
              className="w-full border rounded p-2"
            />
          </div>
          <button
            type="submit"
            className="bg-accent text-white px-4 py-2 rounded hover:bg-accent/80"
          >
            Antwort senden
          </button>
        </form>
      )}
    </div>
  );
}
