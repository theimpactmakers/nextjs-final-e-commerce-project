"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Check, Edit2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";
import type { CheckoutStep } from "@/types";

// Use types from Supabase
type Address = Database["public"]["Tables"]["addresses"]["Row"];
type ShippingMethod = Database["public"]["Tables"]["shipping_methods"]["Row"];
type PaymentMethod = Database["public"]["Tables"]["payment_methods"]["Row"];

export default function CheckoutPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const supabase = createClient();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>("data");
  const [isProcessing, setIsProcessing] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]); // Reserved for address selection UI
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  // Load shipping and payment methods from database
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loadingMethods, setLoadingMethods] = useState(true);

  // Form data
  const [formData, setFormData] = useState({
    // Personal data
    firstName: "",
    lastName: "",
    email: "",
    phone: "",

    // Shipping address
    street: "",
    houseNumber: "",
    addressLine2: "",
    postalCode: "",
    city: "",
    country: "Deutschland",

    // Billing address
    billingDifferent: false,
    billingStreet: "",
    billingHouseNumber: "",
    billingAddressLine2: "",
    billingPostalCode: "",
    billingCity: "",
    billingCountry: "Deutschland",

    // Delivery & Payment (will be set after methods load)
    shippingMethod: "",
    paymentMethod: "",

    // Notes
    customerNotes: "",

    // Terms
    acceptTerms: false,
    acceptPrivacy: false,
  });

  const [completedSteps, setCompletedSteps] = useState<CheckoutStep[]>([]);
  const [countryCode, setCountryCode] = useState("+49"); // Country code for phone

  // Helper functions to convert between ISO codes and full country names
  const countryIsoToName = (iso: string): string => {
    const mapping: { [key: string]: string } = {
      DE: "Deutschland",
      AT: "Österreich",
      CH: "Schweiz",
    };
    return mapping[iso] || iso;
  };

  const countryNameToIso = (name: string): string => {
    const mapping: { [key: string]: string } = {
      Deutschland: "DE",
      Österreich: "AT",
      Schweiz: "CH",
    };
    return mapping[name] || name;
  };

  // Redirect if cart is empty
  useEffect(() => {
    if (!authLoading && items.length === 0) {
      router.push("/cart");
    }
  }, [items, authLoading, router]);

  // Load user data if logged in
  useEffect(() => {
    async function loadUserProfile() {
      if (!user?.id) return;

      // Set email immediately
      setFormData((prev) => ({
        ...prev,
        email: user.email || "",
      }));

      // Load profile data
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("first_name, last_name")
          .eq("id", user.id)
          .single();

        if (profile) {
          setFormData((prev) => ({
            ...prev,
            firstName: prev.firstName || profile.first_name || "",
            lastName: prev.lastName || profile.last_name || "",
          }));
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    }

    loadUserProfile();
  }, [user, supabase]);

  // Set default shipping and payment methods once loaded
  useEffect(() => {
    if (shippingMethods.length > 0 && !formData.shippingMethod) {
      setFormData((prev) => ({
        ...prev,
        shippingMethod: shippingMethods[0].code,
      }));
    }
    if (paymentMethods.length > 0 && !formData.paymentMethod) {
      setFormData((prev) => ({
        ...prev,
        paymentMethod: paymentMethods[0].code,
      }));
    }
  }, [
    shippingMethods,
    paymentMethods,
    formData.shippingMethod,
    formData.paymentMethod,
  ]);

  // Load saved addresses for logged-in users
  useEffect(() => {
    async function loadAddresses() {
      if (!user?.id) return;

      setLoadingAddresses(true);
      try {
        const { data, error } = await supabase
          .from("addresses")
          .select("*")
          .eq("user_id", user.id)
          .order("is_default", { ascending: false });

        if (error) throw error;

        if (data) {
          setSavedAddresses(data);

          // Find default addresses or fallback to first address
          const defaultShipping =
            data.find(
              (addr) => addr.address_type === "shipping" && addr.is_default
            ) ||
            data.find((addr) => addr.address_type === "shipping") ||
            data.find((addr) => addr.is_default) ||
            data[0];

          const defaultBilling =
            data.find(
              (addr) => addr.address_type === "billing" && addr.is_default
            ) || data.find((addr) => addr.address_type === "billing");

          // Autofill shipping/main address
          if (defaultShipping) {
            setFormData((prev) => ({
              ...prev,
              firstName: defaultShipping.first_name,
              lastName: defaultShipping.last_name,
              street: defaultShipping.street,
              houseNumber: defaultShipping.house_number,
              addressLine2: defaultShipping.address_line2 || "",
              postalCode: defaultShipping.postal_code,
              city: defaultShipping.city,
              country: countryIsoToName(defaultShipping.country), // Convert ISO to full name
              phone: defaultShipping.phone || "",
            }));
          }

          // Autofill billing address if it exists and is different
          if (defaultBilling && defaultBilling.id !== defaultShipping?.id) {
            setFormData((prev) => ({
              ...prev,
              billingDifferent: true,
              billingStreet: defaultBilling.street,
              billingHouseNumber: defaultBilling.house_number,
              billingAddressLine2: defaultBilling.address_line2 || "",
              billingPostalCode: defaultBilling.postal_code,
              billingCity: defaultBilling.city,
              billingCountry: countryIsoToName(defaultBilling.country), // Convert ISO to full name
            }));
          }
        }
      } catch (error) {
        console.error("Error loading addresses:", error);
      } finally {
        setLoadingAddresses(false);
      }
    }

    loadAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Load shipping and payment methods from database
  useEffect(() => {
    async function loadMethods() {
      setLoadingMethods(true);
      try {
        // Load shipping methods
        const { data: shipping, error: shippingError } = await supabase
          .from("shipping_methods")
          .select("*")
          .eq("is_active", true)
          .order("display_order");

        if (shippingError) throw shippingError;
        if (shipping) setShippingMethods(shipping);

        // Load payment methods
        const { data: payment, error: paymentError } = await supabase
          .from("payment_methods")
          .select("*")
          .eq("is_active", true)
          .order("display_order");

        if (paymentError) throw paymentError;
        if (payment) setPaymentMethods(payment);
      } catch (error) {
        console.error("Error loading shipping/payment methods:", error);
      } finally {
        setLoadingMethods(false);
      }
    }

    loadMethods();
  }, [supabase]);

  // Auto-update country code when country changes
  useEffect(() => {
    const getCountryCodeFromCountry = (country: string) => {
      switch (country) {
        case "Deutschland":
        case "DE":
          return "+49";
        case "Österreich":
        case "AT":
          return "+43";
        case "Schweiz":
        case "CH":
          return "+41";
        default:
          return "+49";
      }
    };
    setCountryCode(getCountryCodeFromCountry(formData.country));
  }, [formData.country]);

  // Calculate totals
  const selectedShipping = shippingMethods.find(
    (m) => m.code === formData.shippingMethod
  );

  // Calculate shipping cost dynamically from database
  const shippingCost = selectedShipping
    ? selectedShipping.free_shipping_threshold &&
      totalPrice >= selectedShipping.free_shipping_threshold
      ? 0 // Free shipping if threshold met
      : selectedShipping.base_price // Otherwise use base price
    : 0;

  // Calculate promotion savings
  const promotionSavings = items.reduce((total, item) => {
    if (item.original_price && item.original_price > item.price) {
      return total + (item.original_price - item.price) * item.quantity;
    }
    return total;
  }, 0);

  // Calculate shipping savings
  const shippingSavings =
    selectedShipping?.free_shipping_threshold &&
    totalPrice >= selectedShipping.free_shipping_threshold &&
    selectedShipping.base_price > 0
      ? selectedShipping.base_price
      : 0;

  // Total savings
  const totalSavings = promotionSavings + shippingSavings;

  const subtotal = totalPrice;
  const totalAmount = subtotal + shippingCost;

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleStepComplete = (step: CheckoutStep) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
    }
  };

  const isStepCompleted = (step: CheckoutStep) => {
    return completedSteps.includes(step);
  };

  const canProceedFromData = () => {
    const basicDataValid =
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.street &&
      formData.houseNumber &&
      formData.postalCode &&
      formData.city;

    // If billing address is different, validate it too
    if (formData.billingDifferent) {
      return (
        basicDataValid &&
        formData.billingStreet &&
        formData.billingHouseNumber &&
        formData.billingPostalCode &&
        formData.billingCity
      );
    }

    return basicDataValid;
  };

  const handlePlaceOrder = async () => {
    if (!formData.acceptTerms || !formData.acceptPrivacy) {
      alert("Bitte akzeptieren Sie die AGB und Datenschutzbestimmungen");
      return;
    }

    setIsProcessing(true);

    try {
      // Generate unique order number
      const orderNumber = `ORD-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 11)
        .toUpperCase()}`;

      // Prepare shipping address (JSONB format)
      const shippingAddress = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        street: formData.street,
        house_number: formData.houseNumber,
        address_line2: formData.addressLine2 || null,
        postal_code: formData.postalCode,
        city: formData.city,
        country: countryNameToIso(formData.country), // Convert to ISO code for database
        phone: formData.phone ? `${countryCode} ${formData.phone}` : null,
      };

      // Prepare billing address (JSONB format)
      const billingAddress = formData.billingDifferent
        ? {
            first_name: formData.firstName, // Billing first/last name not in form - use shipping
            last_name: formData.lastName,
            street: formData.billingStreet,
            house_number: formData.billingHouseNumber,
            address_line2: formData.billingAddressLine2 || null,
            postal_code: formData.billingPostalCode,
            city: formData.billingCity,
            country: countryNameToIso(formData.billingCountry), // Convert to ISO code for database
            phone: formData.phone ? `${countryCode} ${formData.phone}` : null,
          }
        : shippingAddress;

      // Calculate totals (use same logic as UI - from database)
      const subtotal = totalPrice;
      const selectedMethod = shippingMethods.find(
        (m) => m.code === formData.shippingMethod
      );
      const calculatedShippingCost = selectedMethod
        ? selectedMethod.free_shipping_threshold &&
          totalPrice >= selectedMethod.free_shipping_threshold
          ? 0
          : selectedMethod.base_price
        : 0;
      const taxAmount = (subtotal + calculatedShippingCost) * 0.19; // 19% MwSt
      const totalAmount = subtotal + calculatedShippingCost;

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          order_number: orderNumber,
          user_id: user?.id || null,
          guest_email: user?.id ? null : formData.email,
          guest_first_name: user?.id ? null : formData.firstName,
          guest_last_name: user?.id ? null : formData.lastName,
          status: "pending",
          payment_status: "pending",
          billing_address: billingAddress,
          shipping_address: shippingAddress,
          subtotal: subtotal,
          shipping_cost: calculatedShippingCost,
          tax_amount: taxAmount,
          discount_amount: 0,
          total_amount: totalAmount,
          shipping_method: formData.shippingMethod,
          payment_method: formData.paymentMethod,
          customer_notes: formData.customerNotes || null,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        product_name: item.product_name,
        variant_name: item.variant_name,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart
      await clearCart();

      // Redirect to order confirmation
      router.push(`/order-success?order=${orderNumber}`);
    } catch (error) {
      console.error("Error placing order:", error);
      alert(
        "Es gab einen Fehler beim Erstellen Ihrer Bestellung. Bitte versuchen Sie es erneut."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (authLoading || items.length === 0 || loadingAddresses || loadingMethods) {
    return (
      <div className="container max-w-6xl px-4 py-16 mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-muted-foreground">
            {loadingAddresses
              ? "Lade Adressen..."
              : loadingMethods
              ? "Lade Versand- und Zahlungsmethoden..."
              : "Lädt..."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-primary py-4">
        <div className="container max-w-6xl px-4 mx-auto">
          <Link
            href="/cart"
            className="inline-flex items-center text-primary-foreground hover:underline"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Zurück zum Warenkorb
          </Link>
        </div>
      </div>

      <div className="container max-w-6xl px-4 py-8 mx-auto">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Checkout Steps */}
          <div className="lg:col-span-2 space-y-4">
            {/* Step 1: Personal Data */}
            <div className="bg-card rounded-lg border shadow-sm">
              <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                      isStepCompleted("data")
                        ? "bg-green-500 text-white"
                        : currentStep === "data"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isStepCompleted("data") ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      "1"
                    )}
                  </div>
                  <h2 className="text-xl font-bold">Ihre Daten</h2>
                </div>
                {currentStep !== "data" && isStepCompleted("data") && (
                  <button
                    onClick={() => setCurrentStep("data")}
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    <Edit2 className="w-4 h-4" />
                    Ändern
                  </button>
                )}
              </div>

              {currentStep === "data" ? (
                <div className="p-6 space-y-6">
                  {/* Personal Info */}
                  <div>
                    <h3 className="font-semibold mb-4">Persönliche Daten</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Vorname *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Nachname *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          E-Mail *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary"
                          required
                        />
                      </div>

                      {/* Phone Number with Country Code */}
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Vorwahl
                          </label>
                          <input
                            type="text"
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                            placeholder="+49"
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary text-center font-medium"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm font-medium mb-2">
                            Telefonnummer
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="123 456789"
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <h3 className="font-semibold mb-4">Lieferadresse</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                          <label className="block text-sm font-medium mb-2">
                            Straße *
                          </label>
                          <input
                            type="text"
                            name="street"
                            value={formData.street}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Hausnr. *
                          </label>
                          <input
                            type="text"
                            name="houseNumber"
                            value={formData.houseNumber}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Adresszusatz
                        </label>
                        <input
                          type="text"
                          name="addressLine2"
                          value={formData.addressLine2}
                          onChange={handleInputChange}
                          placeholder="z.B. Hintereingang, 2. Stock"
                          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            PLZ *
                          </label>
                          <input
                            type="text"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary"
                            required
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm font-medium mb-2">
                            Ort *
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Land *
                        </label>
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary"
                          required
                        >
                          <option value="Deutschland">Deutschland</option>
                          <option value="Österreich">Österreich</option>
                          <option value="Schweiz">Schweiz</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Billing Address Toggle */}
                  <div className="border-t pt-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="billingDifferent"
                        checked={formData.billingDifferent}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="font-semibold">
                        Abweichende Rechnungsadresse
                      </span>
                    </label>
                  </div>

                  {/* Billing Address (conditional) */}
                  {formData.billingDifferent && (
                    <div className="bg-muted/50 p-4 rounded-lg space-y-4">
                      <h3 className="font-semibold">Rechnungsadresse</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                          <label className="block text-sm font-medium mb-2">
                            Straße *
                          </label>
                          <input
                            type="text"
                            name="billingStreet"
                            value={formData.billingStreet}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary bg-white"
                            required={formData.billingDifferent}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Hausnr. *
                          </label>
                          <input
                            type="text"
                            name="billingHouseNumber"
                            value={formData.billingHouseNumber}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary bg-white"
                            required={formData.billingDifferent}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Adresszusatz
                        </label>
                        <input
                          type="text"
                          name="billingAddressLine2"
                          value={formData.billingAddressLine2}
                          onChange={handleInputChange}
                          placeholder="z.B. c/o, Firma"
                          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary bg-white"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            PLZ *
                          </label>
                          <input
                            type="text"
                            name="billingPostalCode"
                            value={formData.billingPostalCode}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary bg-white"
                            required={formData.billingDifferent}
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm font-medium mb-2">
                            Ort *
                          </label>
                          <input
                            type="text"
                            name="billingCity"
                            value={formData.billingCity}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary bg-white"
                            required={formData.billingDifferent}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Land *
                        </label>
                        <select
                          name="billingCountry"
                          value={formData.billingCountry}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary bg-white"
                          required={formData.billingDifferent}
                        >
                          <option value="Deutschland">Deutschland</option>
                          <option value="Österreich">Österreich</option>
                          <option value="Schweiz">Schweiz</option>
                        </select>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      if (canProceedFromData()) {
                        handleStepComplete("data");
                        setCurrentStep("delivery");
                      } else {
                        alert("Bitte füllen Sie alle Pflichtfelder aus");
                      }
                    }}
                    disabled={!canProceedFromData()}
                    className="w-full bg-primary text-primary-foreground py-3 rounded-md font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Weiter zur Lieferung
                  </button>
                </div>
              ) : isStepCompleted("data") ? (
                <div className="p-6">
                  <div className="space-y-4">
                    {/* Contact Info */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Kontaktdaten
                      </p>
                      <p className="font-semibold">
                        {formData.firstName} {formData.lastName}
                      </p>
                      <p className="text-sm">{formData.email}</p>
                      {formData.phone && (
                        <p className="text-sm">{formData.phone}</p>
                      )}
                    </div>

                    {/* Shipping Address */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Lieferadresse
                      </p>
                      <p className="text-sm">
                        {formData.street} {formData.houseNumber}
                      </p>
                      {formData.addressLine2 && (
                        <p className="text-sm">{formData.addressLine2}</p>
                      )}
                      <p className="text-sm">
                        {formData.postalCode} {formData.city}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formData.country}
                      </p>
                    </div>

                    {/* Billing Address (if different) */}
                    {formData.billingDifferent && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Rechnungsadresse
                        </p>
                        <p className="text-sm">
                          {formData.billingStreet} {formData.billingHouseNumber}
                        </p>
                        {formData.billingAddressLine2 && (
                          <p className="text-sm">
                            {formData.billingAddressLine2}
                          </p>
                        )}
                        <p className="text-sm">
                          {formData.billingPostalCode} {formData.billingCity}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formData.billingCountry}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>

            {/* Step 2: Delivery Method */}
            <div className="bg-card rounded-lg border shadow-sm">
              <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                      isStepCompleted("delivery")
                        ? "bg-green-500 text-white"
                        : currentStep === "delivery"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isStepCompleted("delivery") ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      "2"
                    )}
                  </div>
                  <h2 className="text-xl font-bold">Lieferung</h2>
                </div>
                {currentStep !== "delivery" && isStepCompleted("delivery") && (
                  <button
                    onClick={() => setCurrentStep("delivery")}
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    <Edit2 className="w-4 h-4" />
                    Ändern
                  </button>
                )}
              </div>

              {currentStep === "delivery" ? (
                <div className="p-6 space-y-4">
                  <h3 className="font-semibold">Liefermethode</h3>
                  <div className="space-y-3">
                    {shippingMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer hover:border-primary transition-colors ${
                          formData.shippingMethod === method.id
                            ? "border-primary bg-primary/5"
                            : "border-border"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <input
                            type="radio"
                            name="shippingMethod"
                            value={method.code}
                            checked={formData.shippingMethod === method.code}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-primary"
                          />
                          <div>
                            <p className="font-semibold">{method.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {method.estimated_days_min &&
                              method.estimated_days_max
                                ? `${method.estimated_days_min}-${method.estimated_days_max} Werktage`
                                : "Lieferzeit auf Anfrage"}
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold">
                          {method.free_shipping_threshold &&
                          totalPrice >= method.free_shipping_threshold
                            ? "Kostenlos"
                            : `${method.base_price.toFixed(2)} €`}
                        </p>
                      </label>
                    ))}
                  </div>

                  {totalPrice >= 50 &&
                    shippingMethods.some(
                      (m) =>
                        m.free_shipping_threshold &&
                        m.free_shipping_threshold <= totalPrice
                    ) && (
                      <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg text-sm">
                        🎉 Kostenloser Standardversand ab 50 € Bestellwert!
                      </div>
                    )}

                  <button
                    onClick={() => {
                      handleStepComplete("delivery");
                      setCurrentStep("payment");
                    }}
                    className="w-full bg-primary text-primary-foreground py-3 rounded-md font-semibold hover:bg-primary/90"
                  >
                    Weiter zur Zahlung
                  </button>
                </div>
              ) : isStepCompleted("delivery") ? (
                <div className="p-6">
                  <p className="font-semibold">
                    {
                      shippingMethods.find(
                        (m) => m.code === formData.shippingMethod
                      )?.name
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {(() => {
                      const method = shippingMethods.find(
                        (m) => m.code === formData.shippingMethod
                      );
                      return method?.estimated_days_min &&
                        method?.estimated_days_max
                        ? `${method.estimated_days_min}-${method.estimated_days_max} Werktage`
                        : "Lieferzeit auf Anfrage";
                    })()}
                  </p>
                </div>
              ) : null}
            </div>

            {/* Step 3: Payment Method */}
            <div className="bg-card rounded-lg border shadow-sm">
              <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                      isStepCompleted("payment")
                        ? "bg-green-500 text-white"
                        : currentStep === "payment"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isStepCompleted("payment") ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      "3"
                    )}
                  </div>
                  <h2 className="text-xl font-bold">Zahlung</h2>
                </div>
                {currentStep !== "payment" && isStepCompleted("payment") && (
                  <button
                    onClick={() => setCurrentStep("payment")}
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    <Edit2 className="w-4 h-4" />
                    Ändern
                  </button>
                )}
              </div>

              {currentStep === "payment" ? (
                <div className="p-6 space-y-4">
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer hover:border-primary transition-colors ${
                          formData.paymentMethod === method.id
                            ? "border-primary bg-primary/5"
                            : "border-border"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={formData.paymentMethod === method.id}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-primary mt-1"
                        />
                        <div className="flex-1">
                          <p className="font-semibold">{method.name}</p>
                          {method.description && (
                            <p className="text-sm text-muted-foreground">
                              {method.description}
                            </p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      handleStepComplete("payment");
                      setCurrentStep("review");
                    }}
                    className="w-full bg-primary text-primary-foreground py-3 rounded-md font-semibold hover:bg-primary/90"
                  >
                    Bestellung prüfen
                  </button>
                </div>
              ) : isStepCompleted("payment") ? (
                <div className="p-6">
                  <p className="font-semibold">
                    {
                      paymentMethods.find(
                        (m) => m.id === formData.paymentMethod
                      )?.name
                    }
                  </p>
                </div>
              ) : null}
            </div>

            {/* Step 4: Review & Place Order */}
            <div className="bg-card rounded-lg border shadow-sm">
              <div className="flex items-center gap-4 p-6 border-b">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                    currentStep === "review"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  4
                </div>
                <h2 className="text-xl font-bold">Bestellung prüfen</h2>
              </div>

              {currentStep === "review" && (
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Anmerkungen zur Bestellung (optional)
                    </label>
                    <textarea
                      name="customerNotes"
                      value={formData.customerNotes}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Besondere Wünsche oder Hinweise..."
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary mt-1"
                        required
                      />
                      <span className="text-sm">
                        Mit Ihrer Bestellung erklären Sie sich mit unseren{" "}
                        <Link
                          href="/agb"
                          className="text-primary hover:underline"
                          target="_blank"
                        >
                          Datenschutzbestimmungen
                        </Link>{" "}
                        und{" "}
                        <Link
                          href="/widerruf"
                          className="text-primary hover:underline"
                          target="_blank"
                        >
                          Widerrufsbestimmungen
                        </Link>{" "}
                        einverstanden. *
                      </span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="acceptPrivacy"
                        checked={formData.acceptPrivacy}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary mt-1"
                        required
                      />
                      <span className="text-sm">
                        Ich habe die{" "}
                        <Link
                          href="/agb"
                          className="text-primary hover:underline"
                          target="_blank"
                        >
                          AGB
                        </Link>{" "}
                        gelesen und akzeptiert. *
                      </span>
                    </label>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={
                      isProcessing ||
                      !formData.acceptTerms ||
                      !formData.acceptPrivacy
                    }
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-4 rounded-md font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isProcessing
                      ? "Wird bearbeitet..."
                      : "Kostenpflichtig bestellen →"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border shadow-sm sticky top-4">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold">Bestellübersicht</h2>
              </div>

              <div className="p-6 space-y-4">
                {/* Products */}
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-16 h-16 shrink-0 bg-muted rounded-md overflow-hidden">
                      {item.image_url && (
                        <Image
                          src={item.image_url}
                          alt={item.product_name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm line-clamp-2">
                        {item.product_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Anzahl: {item.quantity}
                      </p>
                      <p className="text-sm font-semibold">
                        {(item.price * item.quantity).toFixed(2)} €
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ({item.price.toFixed(2)} € / Stück)
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="p-6 border-t space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Zwischensumme</span>
                  <span>{subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>
                    Versand (
                    {
                      shippingMethods.find(
                        (m) => m.id === formData.shippingMethod
                      )?.name
                    }
                    )
                  </span>
                  <span>
                    {shippingCost === 0
                      ? "Kostenlos"
                      : `${shippingCost.toFixed(2)} €`}
                  </span>
                </div>
                <div className="pt-3 border-t">
                  <div className="flex justify-between font-bold text-lg">
                    <span>GESAMTSUMME</span>
                    <span>{totalAmount.toFixed(2)} €</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    (Inkl. MwSt.)
                  </p>
                </div>

                {totalSavings > 0 && (
                  <div className="bg-green-50 border border-green-200 text-green-800 p-3 rounded-lg text-sm flex items-center gap-2">
                    <span>💰</span>
                    <div className="flex flex-col">
                      <span className="font-semibold">
                        Sie sparen insgesamt {totalSavings.toFixed(2)} €
                      </span>
                      {promotionSavings > 0 && shippingSavings > 0 && (
                        <span className="text-xs mt-1">
                          ({promotionSavings.toFixed(2)} € Rabatt +{" "}
                          {shippingSavings.toFixed(2)} € Versand)
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
