"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "./AuthContext";
import type {
  Profile,
  Address,
  ProfileUpdateData,
  AddressCreateData,
  AddressUpdateData,
  AddressType,
} from "@/types/profile";

type ProfileContextType = {
  profile: Profile | null;
  addresses: Address[];
  isLoading: boolean;
  updateProfile: (data: ProfileUpdateData) => Promise<{ error: Error | null }>;
  createAddress: (
    data: AddressCreateData
  ) => Promise<{ error: Error | null; address?: Address }>;
  updateAddress: (
    id: string,
    data: AddressUpdateData
  ) => Promise<{ error: Error | null }>;
  deleteAddress: (id: string) => Promise<{ error: Error | null }>;
  setDefaultAddress: (
    id: string,
    type: AddressType
  ) => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
  refreshAddresses: () => Promise<void>;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const supabase = createClient();

  // Load profile
  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error loading profile:", error);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, [user, supabase]);

  // Load addresses
  const refreshAddresses = useCallback(async () => {
    if (!user) {
      setAddresses([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAddresses(data || []);
    } catch (error) {
      console.error("Error loading addresses:", error);
      setAddresses([]);
    }
  }, [user, supabase]);

  // Initial load
  useEffect(() => {
    refreshProfile();
    refreshAddresses();
  }, [refreshProfile, refreshAddresses]);

  // Update profile
  const updateProfile = useCallback(
    async (data: ProfileUpdateData) => {
      if (!user) {
        return { error: new Error("Nicht angemeldet") };
      }

      try {
        const { error } = await supabase
          .from("profiles")
          .update({
            ...data,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id);

        if (error) throw error;

        await refreshProfile();
        return { error: null };
      } catch (error) {
        return { error: error as Error };
      }
    },
    [user, supabase, refreshProfile]
  );

  // Create address
  const createAddress = useCallback(
    async (data: AddressCreateData) => {
      if (!user) {
        return { error: new Error("Nicht angemeldet") };
      }

      try {
        // If this is set as default, unset other defaults of the same type
        if (data.is_default) {
          await supabase
            .from("addresses")
            .update({ is_default: false })
            .eq("user_id", user.id)
            .eq("address_type", data.address_type);
        }

        const { data: newAddress, error } = await supabase
          .from("addresses")
          .insert({
            ...data,
            user_id: user.id,
          })
          .select()
          .single();

        if (error) throw error;

        await refreshAddresses();
        return { error: null, address: newAddress };
      } catch (error) {
        return { error: error as Error };
      }
    },
    [user, supabase, refreshAddresses]
  );

  // Update address
  const updateAddress = useCallback(
    async (id: string, data: AddressUpdateData) => {
      if (!user) {
        return { error: new Error("Nicht angemeldet") };
      }

      try {
        // If setting as default, unset other defaults of the same type
        if (data.is_default && data.address_type) {
          await supabase
            .from("addresses")
            .update({ is_default: false })
            .eq("user_id", user.id)
            .eq("address_type", data.address_type);
        }

        const { error } = await supabase
          .from("addresses")
          .update({
            ...data,
            updated_at: new Date().toISOString(),
          })
          .eq("id", id)
          .eq("user_id", user.id);

        if (error) throw error;

        await refreshAddresses();
        return { error: null };
      } catch (error) {
        return { error: error as Error };
      }
    },
    [user, supabase, refreshAddresses]
  );

  // Delete address
  const deleteAddress = useCallback(
    async (id: string) => {
      if (!user) {
        return { error: new Error("Nicht angemeldet") };
      }

      try {
        const { error } = await supabase
          .from("addresses")
          .delete()
          .eq("id", id)
          .eq("user_id", user.id);

        if (error) throw error;

        await refreshAddresses();
        return { error: null };
      } catch (error) {
        return { error: error as Error };
      }
    },
    [user, supabase, refreshAddresses]
  );

  // Set default address
  const setDefaultAddress = useCallback(
    async (id: string, type: AddressType) => {
      if (!user) {
        return { error: new Error("Nicht angemeldet") };
      }

      try {
        // Unset all defaults of this type
        await supabase
          .from("addresses")
          .update({ is_default: false })
          .eq("user_id", user.id)
          .eq("address_type", type);

        // Set new default
        const { error } = await supabase
          .from("addresses")
          .update({ is_default: true })
          .eq("id", id)
          .eq("user_id", user.id);

        if (error) throw error;

        await refreshAddresses();
        return { error: null };
      } catch (error) {
        return { error: error as Error };
      }
    },
    [user, supabase, refreshAddresses]
  );

  return (
    <ProfileContext.Provider
      value={{
        profile,
        addresses,
        isLoading,
        updateProfile,
        createAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        refreshProfile,
        refreshAddresses,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
