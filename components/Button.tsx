import React from "react";
import Link from "next/link";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "outline";
  className?: string;
  disabled?: boolean;
}

export default function Button({
  children,
  href,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
}: ButtonProps) {
  const baseStyles =
    "inline-block text-center font-medium rounded-[0.3125rem] transition-all duration-[360ms] ease-in-out";
  const paddingStyles = "px-[1.5625rem] py-[0.8125rem]";

  const variantStyles = {
    primary:
      "bg-accent text-white hover:bg-accent/90 active:bg-accent/80 disabled:opacity-50 disabled:cursor-not-allowed",
    secondary:
      "bg-primary text-white hover:bg-primary/90 active:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed",
    outline:
      "border-2 border-accent text-accent hover:bg-accent/10 active:bg-accent/20 disabled:opacity-50 disabled:cursor-not-allowed",
  };

  const combinedClassName = `${baseStyles} ${paddingStyles} ${variantStyles[variant]} ${className}`;

  if (href && !disabled) {
    return (
      <Link href={href} className={combinedClassName}>
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
