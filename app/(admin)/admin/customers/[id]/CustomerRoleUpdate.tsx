"use client";

import { useState, useTransition } from "react";
import { updateCustomerRole } from "../actions";
import { Shield } from "lucide-react";

export function CustomerRoleUpdate({
  customerId,
  currentRole,
}: {
  customerId: string;
  currentRole: string;
}) {
  const [role, setRole] = useState(currentRole);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const handleUpdate = () => {
    if (role === currentRole) {
      setMessage("Keine Änderung");
      return;
    }

    startTransition(async () => {
      const result = await updateCustomerRole(customerId, role);
      if (result.success) {
        setMessage("✓ Rolle aktualisiert");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(`✗ ${result.error}`);
      }
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-muted-foreground">
          Rolle ändern
        </label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          disabled={isPending}
          className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 focus:border-accent focus:outline-none disabled:opacity-50"
        >
          <option value="user">Kunde</option>
          <option value="admin">Administrator</option>
        </select>
      </div>

      <button
        onClick={handleUpdate}
        disabled={isPending || role === currentRole}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 font-medium text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
      >
        <Shield className="h-4 w-4" />
        {isPending ? "Wird aktualisiert..." : "Rolle aktualisieren"}
      </button>

      {message && (
        <p
          className={`text-sm ${
            message.startsWith("✓") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      {role === "admin" && role !== currentRole && (
        <div className="rounded-lg bg-accent/10 border border-accent/20 p-3 text-xs text-foreground">
          <p className="font-medium">⚠️ Warnung</p>
          <p className="mt-1">
            Admin-Zugriff gewährt vollen Zugang zum Dashboard und allen Daten.
          </p>
        </div>
      )}
    </div>
  );
}
