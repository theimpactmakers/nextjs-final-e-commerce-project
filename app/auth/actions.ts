'use server'

import { createClient } from '@/lib/supabase/server'

function isValidRedirect(path: string): boolean {
  return path.startsWith('/') && !path.startsWith('//')
}

function validateEmail(email: string): string | null {
  if (!email || email.trim() === '') return 'E-Mail-Adresse ist erforderlich'
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return 'Ungültige E-Mail-Adresse'
  return null
}

function validatePassword(password: string): string | null {
  if (!password || password.trim() === '') return 'Passwort ist erforderlich'
  if (password.length < 6) return 'Passwort muss mindestens 6 Zeichen lang sein'
  return null
}

export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const redirectTo = (formData.get('redirect') as string) || '/'

  const emailError = validateEmail(email)
  const passwordError = validatePassword(password)

  if (emailError || passwordError) {
    return {
      message: 'Bitte überprüfe deine Eingaben',
      errors: {
        email: emailError ? [emailError] : undefined,
        password: passwordError ? [passwordError] : undefined,
      },
      redirectTo: null,
    }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    let message = 'Anmeldung fehlgeschlagen'
    if (error.message.includes('Invalid login credentials')) {
      message = 'Ungültige E-Mail-Adresse oder Passwort'
    } else if (error.message.includes('Email not confirmed')) {
      message = 'Bitte bestätige zuerst deine E-Mail-Adresse'
    } else if (error.message.includes('Too many requests')) {
      message = 'Zu viele Versuche. Bitte versuche es später erneut'
    }

    return {
      message,
      errors: {},
      redirectTo: null,
    }
  }

  // Rückgabe aller erwarteten Felder für TS
  return {
    message: '',
    errors: {},
    redirectTo: isValidRedirect(redirectTo) ? redirectTo : '/',
  }
}
