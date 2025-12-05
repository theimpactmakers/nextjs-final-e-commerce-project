import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (typeof email !== "string" || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Bitte eine gültige E-Mail-Adresse angeben." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Użyj server-side Supabase client zamiast service role
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("newsletter_subscriptions")
      .upsert(
        { email: normalizedEmail, source: "footer" },
        { onConflict: "email" }
      )
      .select("id, email, subscribed_at")
      .single();

    if (error) {
      console.error("Newsletter subscription failed", error);
      return NextResponse.json(
        { error: "Leider hat das Speichern nicht funktioniert." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, subscription: data });
  } catch (error) {
    console.error("Newsletter subscription request failed", error);
    return NextResponse.json(
      { error: "Es ist ein unerwarteter Fehler aufgetreten." },
      { status: 500 }
    );
  }
}
