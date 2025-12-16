import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, countryCode, phone, message } = body;

    // Validation
    if (!lastName || !email || !phone || !message) {
      return NextResponse.json(
        { error: "Bitte füllen Sie alle Pflichtfelder aus." },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Bitte geben Sie eine gültige E-Mail-Adresse ein." },
        { status: 400 }
      );
    }

    const fullName = firstName ? `${firstName} ${lastName}` : lastName;
    const fullPhone = `${countryCode || "+49"} ${phone}`;

    // Save to Supabase
    const supabase = await createClient();

    const { error: dbError } = await supabase.from("contact_messages").insert([
      {
        first_name: firstName || null,
        last_name: lastName,
        email: email,
        phone: fullPhone,
        message: message,
        created_at: new Date().toISOString(),
      },
    ]);

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        {
          error:
            "Fehler beim Speichern der Nachricht. Bitte versuchen Sie es später erneut.",
        },
        { status: 500 }
      );
    }

    // Log to console for admin notification
    console.log("=== Neue Kontaktanfrage ===");
    console.log(`Name: ${fullName}`);
    console.log(`E-Mail: ${email}`);
    console.log(`Telefon: ${fullPhone}`);
    console.log(`Nachricht: ${message}`);
    console.log("===========================");

    return NextResponse.json(
      { message: "Ihre Nachricht wurde erfolgreich gesendet!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      {
        error:
          "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.",
      },
      { status: 500 }
    );
  }
}
