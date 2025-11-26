"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (
    email: string,
    password: string,
    metadata?: Record<string, string>
  ) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  // Load user on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error("Error loading user:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
      // Refresh router when auth state changes
      router.refresh();
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth, router]);

  // Sign in
  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          return { error };
        }

        // Manually update user state immediately
        if (data.user) {
          setUser(data.user);
        }

        // Refresh the router to update server components
        router.refresh();

        return { error: null };
      } catch (error) {
        return { error: error as Error };
      }
    },
    [supabase.auth, router]
  );

  // Sign up
  const signUp = useCallback(
    async (
      email: string,
      password: string,
      metadata?: Record<string, string>
    ) => {
      try {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: metadata,
            emailRedirectTo:
              typeof window !== "undefined"
                ? `${window.location.origin}/auth/confirmed`
                : undefined,
          },
        });

        if (error) {
          return { error };
        }

        // Refresh the router to update server components
        router.refresh();

        return { error: null };
      } catch (error) {
        return { error: error as Error };
      }
    },
    [supabase.auth, router]
  );

  // Sign out
  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      // Manually update user state immediately
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }, [supabase.auth, router]);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    } catch (error) {
      console.error("Error refreshing user:", error);
    }
  }, [supabase.auth]);

  // Forgot password
  const forgotPassword = useCallback(
    async (email: string) => {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo:
            typeof window !== "undefined"
              ? `${window.location.origin}/auth/confirmed?next=/auth/update-password`
              : undefined,
        });

        if (error) {
          return { error };
        }

        return { error: null };
      } catch (error) {
        return { error: error as Error };
      }
    },
    [supabase.auth]
  );

  // Update password
  const updatePassword = useCallback(
    async (newPassword: string) => {
      try {
        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (error) {
          return { error };
        }

        // Refresh the router to update server components
        router.refresh();

        return { error: null };
      } catch (error) {
        return { error: error as Error };
      }
    },
    [supabase.auth, router]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        refreshUser,
        forgotPassword,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
