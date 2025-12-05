/**
 * Profile and Address Types
 * Central type definitions for user profile management
 */

export type Profile = {
  id: string;
  first_name: string;
  last_name: string;
  gender: "M" | "F" | "D" | null;
  date_of_birth: string | null;
  role: string | null;
  created_at: string;
  updated_at: string;
};

export type AddressType = "billing" | "shipping";

export type Address = {
  id: string;
  user_id: string;
  address_type: AddressType;
  is_default: boolean;
  company: string | null;
  first_name: string;
  last_name: string;
  street: string;
  house_number: string;
  address_line2: string | null;
  postal_code: string;
  city: string;
  state: string | null;
  country: string;
  phone: string | null;
  created_at: string;
  updated_at: string;
};

export type ProfileUpdateData = Partial<
  Omit<Profile, "id" | "created_at" | "updated_at">
>;

export type AddressCreateData = Omit<
  Address,
  "id" | "user_id" | "created_at" | "updated_at"
>;

export type AddressUpdateData = Partial<
  Omit<Address, "id" | "user_id" | "created_at" | "updated_at">
>;

export type AddressFormData = {
  address_type: AddressType;
  is_default: boolean;
  company: string;
  first_name: string;
  last_name: string;
  street: string;
  house_number: string;
  address_line2: string;
  postal_code: string;
  city: string;
  state: string;
  country: string;
  phone: string;
};
