import React from "react";
import Link from "next/link";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "outline" | "brown";
  className?: string;
  disabled?: boolean;
}

export const BASE_BUTTON_CLASSES =
  "inline-block text-center font-medium rounded-(--app-radius) transition-all duration-300 ease-in-out hover:-translate-y-[0.3125rem] cursor-pointer";

export const PADDING_BUTTON_CLASSES = "px-[1.5625rem] py-[0.5125rem]";

export default function Button({
  children,
  href,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
}: ButtonProps) {
  const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary:
      "bg-accent text-white hover:bg-[hsl(33_100%_40%)] active:bg-accent/80 disabled:opacity-50 disabled:cursor-not-allowed",
    secondary:
      "bg-primary text-white hover:bg-[hsl(27_38%_40%)] active:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed",
    outline:
      "border-2 border-accent text-accent hover:bg-accent/10 active:bg-accent/20 disabled:opacity-50 disabled:cursor-not-allowed",
    brown:
      "bg-brand-brown text-white text-lg font-semibold shadow-lg block mx-auto px-8 py-4 hover:bg-brand-brown/90 active:bg-brand-brown/80 disabled:opacity-50 disabled:cursor-not-allowed",
  };

  const combinedClassName = `${BASE_BUTTON_CLASSES} ${PADDING_BUTTON_CLASSES} ${variants[variant]} ${className}`;

  if (href && !disabled) {
    return (
      <Link href={href} className={combinedClassName}>
        {" "}
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClassName}
    >
      {children}
    </button>
  );
}

// Variant buttons sharing the exact same base classes
type ClickProps = {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

export function AddToCartButton({
  onClick,
  disabled,
  className = "",
  isLoading = false,
}: ClickProps & { isLoading?: boolean }) {
  const variantClasses =
    "bg-accent text-white border-2 border-accent hover:bg-background hover:text-accent disabled:opacity-50 disabled:cursor-not-allowed";

  const combined = `${BASE_BUTTON_CLASSES} ${PADDING_BUTTON_CLASSES} ${variantClasses} w-full inline-flex items-center justify-center gap-2 whitespace-nowrap group ${className}`;

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={combined}
    >
      {isLoading ? (
        <>
          <svg
            className="w-5 h-5 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Wird hinzugefügt...
        </>
      ) : (
        <>
          <svg
            className="w-5 h-5 stroke-white group-hover:stroke-accent transition-all"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          Zum Warenkorb hinzufügen
        </>
      )}
    </button>
  );
}

export function BuyNowButton({
  onClick,
  disabled,
  className = "",
  isLoading = false,
}: ClickProps & { isLoading?: boolean }) {
  const variantClasses =
    "bg-primary text-white border-2 border-primary hover:bg-background hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed";

  const combined = `${BASE_BUTTON_CLASSES} ${PADDING_BUTTON_CLASSES} ${variantClasses} w-full inline-flex items-center justify-center gap-2 whitespace-nowrap group ${className}`;

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={combined}
    >
      {isLoading ? (
        <>
          <svg
            className="w-5 h-5 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Wird verarbeitet...
        </>
      ) : (
        <>
          <svg
            className="w-5 h-5 stroke-white group-hover:stroke-primary transition-all"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Sofort kaufen
        </>
      )}
    </button>
  );
}

export function AddToWishlistButton({
  onClick,
  disabled,
  className = "",
  active = false,
}: ClickProps & { active?: boolean }) {
  // Swap normal/hover: normal black border/text, hover primary
  const variantClasses = "border-2 border-foreground hover:border-primary";

  const combined = `${BASE_BUTTON_CLASSES} ${PADDING_BUTTON_CLASSES} ${variantClasses} w-full inline-flex items-center justify-center gap-2 whitespace-nowrap text-foreground hover:text-primary ${className}`;

  return (
    <button onClick={onClick} disabled={disabled} className={combined}>
      <svg
        className={`w-5 h-5`}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6.02 4.02 4 6.5 4c1.74 0 3.41.81 4.5 2.09C12.09 4.81 13.76 4 15.5 4 17.98 4 20 6.02 20 8.5c0 3.78-3.4 6.86-8.05 11.54L12 21.35z" />
      </svg>
      {active ? "Von Wunschliste entfernen" : "Zur Wunschliste hinzufügen"}
    </button>
  );
}
