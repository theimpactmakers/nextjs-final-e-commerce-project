import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const formData = await request.formData();
  const answer = formData.get("answer") as string;

  if (!answer) {
    return new Response("Antwort erforderlich", { status: 400 });
  }

  // Update the message as answered
  const { error } = await supabase
    .from("contact_messages")
    .update({ answered: true, answer })
    .eq("id", id);

  if (error) {
    return new Response("Fehler beim Speichern der Antwort", { status: 500 });
  }

  // Optionally: send email to the user here

  redirect(`/admin/contact-messages/${id}`);
}
