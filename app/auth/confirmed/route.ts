import { createClient } from "@/lib/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // PKCE Flow: code parameter
  const code = searchParams.get("code");
  
  // OTP Flow: token_hash parameter
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  
  const next = searchParams.get("next") ?? "/";

  const supabase = await createClient();

  // PKCE Flow (mit code) - das ist was Supabase bei dir verwendet
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error("Code exchange error:", error.message);
      redirect(`/auth/error?error=${encodeURIComponent(error.message)}`);
    }
    
    redirect(next);
  }
  
  // OTP Flow (mit token_hash)
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    
    if (error) {
      console.error("OTP verification error:", error.message);
      redirect(`/auth/error?error=${encodeURIComponent(error.message)}`);
    }
    
    redirect(next);
  }
  
  // Keine gültigen Parameter
  redirect("/auth/error?error=Fehlende Parameter");
}