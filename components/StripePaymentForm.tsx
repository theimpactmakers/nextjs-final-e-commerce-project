"use client";

import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

interface StripePaymentFormProps {
  onSuccess: (paymentIntentId: string) => void;
  amount: number;
  disabled?: boolean;
  paymentMethodType?: string;
  checkboxes?: React.ReactNode;
}

export default function StripePaymentForm({
  onSuccess,
  amount,
  disabled = false,
  paymentMethodType,
  checkboxes,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check if Stripe has loaded
  const isReady = stripe && elements;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isReady) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Confirm the payment
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-success`,
        },
        redirect: "if_required",
      });

      if (error) {
        // Show error to customer
        setErrorMessage(error.message || "Ein Fehler ist aufgetreten");
        setIsProcessing(false);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        // Payment succeeded - pass the payment intent ID to parent
        onSuccess(paymentIntent.id);
      } else {
        setErrorMessage("Zahlung konnte nicht abgeschlossen werden");
        setIsProcessing(false);
      }
    } catch (err) {
      console.error("Payment error:", err);
      setErrorMessage("Ein unerwarteter Fehler ist aufgetreten");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Stripe Payment Element */}
      <div className="p-4 border rounded-lg bg-white">
        <p className="text-sm text-muted-foreground mb-4">
          Geben Sie Ihre Zahlungsinformationen ein, um die Bestellung
          abzuschließen
        </p>
        <PaymentElement
          options={{
            layout: "tabs",
            // Restrict to specific payment method type if provided
            ...(paymentMethodType && {
              paymentMethodOrder: [paymentMethodType],
              fields: {
                billingDetails: "auto",
              },
            }),
          }}
        />
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {errorMessage}
        </div>
      )}

      {/* Amount Display */}
      <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
        <span className="font-semibold">Zu zahlender Betrag:</span>
        <span className="text-xl font-bold text-primary">
          {amount.toFixed(2)} €
        </span>
      </div>

      {/* Checkboxes */}
      {checkboxes && <div className="space-y-3">{checkboxes}</div>}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!isReady || isProcessing || disabled}
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-4 rounded-md font-bold text-lg hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isProcessing
          ? "Zahlung wird verarbeitet..."
          : "Kostenpflichtig bestellen →"}
      </button>

      {/* Security Info */}
      <p className="text-xs text-muted-foreground text-center">
        🔒 Ihre Zahlung wird sicher über Stripe verarbeitet
      </p>
    </form>
  );
}
