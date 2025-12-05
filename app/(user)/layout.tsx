"use client";

import { ProfileProvider } from "@/contexts/ProfileContext";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProfileProvider>{children}</ProfileProvider>;
}
