import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";

// OpenAI-Client initialisieren
const openai = new OpenAI({
  apiKey: process.env.OPEN_API_KEY,
});

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
  slug?: string;
  category?: string;
  age_category?: string;
}
// Hilfsfunktion: Bestimme nächste Frage basierend auf Konversation
async function getNextQuestion(
  messages: ChatMessage[],
  context?: string
): Promise<{
  message: string;
  quickReplies?: Array<{ label: string; value: string }>;
  allowMultipleSelection?: boolean;
} | null> {
  const conversationLength = messages.filter((m) => m.role === "user").length;

  // Nach Altersgruppe fragen (erste Frage) - nur verfügbare Altersgruppen anzeigen
  if (conversationLength === 0) {
    try {
      const supabase = await createClient();

      // Frage alle verfügbaren Altersgruppen ab
      const { data, error } = await supabase
        .from("products")
        .select("age_group");

      if (!error && data && data.length > 0) {
        // Extrahiere einzigartige Altersgruppen
        const availableAgeGroups = [
          ...new Set(
            data
              .map((item: { age_group?: string }) => item.age_group)
              .filter(Boolean)
          ),
        ];

        if (availableAgeGroups.length === 0) {
          return {
            message:
              "Momentan sind leider keine Produkte verfügbar. Bitte versuchen Sie es später erneut.",
            quickReplies: [],
          };
        }

        // Mapping von Altersgruppen zu Labels
        const ageGroupLabels: { [key: string]: string } = {
          JUNIOR: "🐶 Welpe/Junior (0-2 Jahre)",
          ADULT: "🐕 Erwachsen (2-7 Jahre)",
          SENIOR: "🐾 Senior (7+ Jahre)",
        };

        // Erstelle Quick Replies nur für verfügbare Altersgruppen
        const ageQuickReplies: Array<{ label: string; value: string }> =
          availableAgeGroups
            .map((age) => ({
              label: ageGroupLabels[age as string] || (age as string),
              value: age as string,
            }))
            .filter((item) => item.label && item.value)
            .sort((a, b) => {
              const order = { JUNIOR: 1, ADULT: 2, SENIOR: 3 };
              return (
                (order[a.value as keyof typeof order] || 999) -
                (order[b.value as keyof typeof order] || 999)
              );
            });

        return {
          message: "Bitte wählen Sie zunächst das Alter Ihres Hundes:",
          quickReplies: ageQuickReplies,
        };
      }
    } catch (error) {
      console.error("Error fetching available age groups:", error);
    }

    return {
      message:
        "Es gab einen Fehler beim Laden der Altersgruppen. Bitte versuchen Sie es erneut.",
      quickReplies: [],
    };
  }

  // Nach besonderen Bedürfnissen fragen (zweite Frage) - nur verfügbare Bedürfnisse anzeigen
  if (
    conversationLength === 1 &&
    context &&
    ["JUNIOR", "ADULT", "SENIOR"].includes(context)
  ) {
    try {
      const supabase = await createClient();

      // Frage verfügbare Bedürfnisse für die gewählte Altersgruppe ab
      const { data, error } = await supabase
        .from("products")
        .select("specials")
        .eq("age_group", context);

      if (!error && data && data.length > 0) {
        // Extrahiere einzigartige Bedürfnisse
        const availableSpecials = [
          ...new Set(
            data
              .map((item: { specials?: string }) => item.specials)
              .filter(Boolean)
          ),
        ];

        if (availableSpecials.length === 0) {
          return {
            message:
              "Leider haben wir momentan keine Produkte für diese Altersgruppe. Möchten Sie eine andere Altersgruppe wählen?",
            quickReplies: [],
          };
        }

        // Mapping von Bedürfnissen zu Labels
        const specialsLabels: { [key: string]: string } = {
          HYPOALLERGEN: "🌾 Getreidefrei/Hypoallergen",
          DIAT: "🥗 Diät/Übergewicht",
          DARM: "💚 Darmgesundheit",
          GELENK: "🦴 Gelenkunterstützung",
          NONE: "Keine besonderen Bedürfnisse",
        };

        // Erstelle Quick Replies nur für verfügbare Bedürfnisse
        const specialsQuickReplies: Array<{ label: string; value: string }> =
          availableSpecials
            .map((special) => ({
              label: specialsLabels[special as string] || (special as string),
              value: special as string,
            }))
            .filter((item) => item.label && item.value)
            .sort((a, b) => {
              // "NONE" immer als letztes
              if (a.value === "NONE") return 1;
              if (b.value === "NONE") return -1;
              return a.label.localeCompare(b.label);
            });

        // "NONE" immer als Option hinzufügen, auch wenn nicht in der DB vorhanden
        if (!specialsQuickReplies.find((item) => item.value === "NONE")) {
          specialsQuickReplies.push({
            label: "Keine besonderen Bedürfnisse",
            value: "NONE",
          });
        }

        return {
          message: "Hat Ihr Hund besondere Bedürfnisse oder Allergien?",
          quickReplies: specialsQuickReplies,
        };
      }
    } catch (error) {
      console.error("Error fetching available specials:", error);
    }

    return {
      message:
        "Es gab einen Fehler beim Laden der Bedürfnisse. Bitte versuchen Sie es erneut.",
      quickReplies: [],
    };
  }

  // Nach Fleischsorte fragen (dritte Frage) - nur verfügbare Fleischsorten anzeigen
  if (conversationLength === 2) {
    // Extrahiere Alter und Bedürfnisse aus der Message-History
    const userMessages = messages.filter((m) => m.role === "user");
    const ageCategory = userMessages[0]?.content.includes("Junior")
      ? "JUNIOR"
      : userMessages[0]?.content.includes("Senior")
      ? "SENIOR"
      : "ADULT";
    const specialNeeds = userMessages[1]?.content.includes("Hypoallergen")
      ? "HYPOALLERGEN"
      : userMessages[1]?.content.includes("Diät")
      ? "DIAT"
      : userMessages[1]?.content.includes("Darm")
      ? "DARM"
      : userMessages[1]?.content.includes("Gelenk")
      ? "GELENK"
      : "NONE";

    // Frage verfügbare Fleischsorten ab
    try {
      const supabase = await createClient();

      let queryBuilder = supabase
        .from("products")
        .select("meat_type")
        .eq("age_group", ageCategory);

      if (specialNeeds !== "NONE") {
        queryBuilder = queryBuilder.eq("specials", specialNeeds);
      }

      const { data, error } = await queryBuilder;

      if (!error && data && data.length > 0) {
        // Extrahiere einzigartige Fleischsorten
        const availableMeatTypes: string[] = [
          ...new Set(
            data
              .map((item: { meat_type?: string }) => item.meat_type)
              .filter((type): type is string => Boolean(type))
          ),
        ];

        // Wenn keine Fleischsorten verfügbar sind
        if (availableMeatTypes.length === 0) {
          return {
            message:
              "Leider haben wir momentan keine Produkte für diese Kombination. Möchten Sie eine andere Auswahl treffen?",
            quickReplies: [],
          };
        }

        // Mapping von Fleischsorten zu Labels
        const meatTypeLabels: { [key: string]: string } = {
          ENTE: "🦆 Ente",
          RIND: "🥩 Rind",
          KANINCHEN: "🐰 Kaninchen",
          LAMM: "🐑 Lamm",
          PFERD: "🐴 Pferd",
          WILD: "🦌 Wild",
          LACHS: "🐟 Lachs",
          HUHN: "🐔 Huhn",
        };

        // Wenn nur eine Fleischsorte verfügbar ist, überspringe die Frage und return null
        // Das Signal für den Hauptcode, direkt Produkte zu laden
        if (availableMeatTypes.length === 1) {
          return null; // Signal: Direkt Produkte laden
        }

        // Erstelle Quick Replies nur für verfügbare Fleischsorten
        const meatQuickReplies: { label: string; value: string }[] = [
          ...availableMeatTypes
            .map((meat: string) => ({
              label: meatTypeLabels[meat as string] || (meat as string),
              value: meat as string,
            }))
            .filter((item): item is { label: string; value: string } =>
              Boolean(item.label && item.value)
            )
            .sort((a, b) => a.label.localeCompare(b.label)),
        ];

        // Füge "Egal / Alle Sorten" hinzu, wenn mehrere Sorten verfügbar sind
        if (meatQuickReplies.length > 1) {
          meatQuickReplies.push({
            label: "Egal / Alle Sorten",
            value: "ALL",
          });
        }

        return {
          message:
            "Super! Welche Fleischsorte bevorzugt Ihr Hund? (Sie können mehrere auswählen)",
          quickReplies: meatQuickReplies,
          allowMultipleSelection: true,
        };
      } else if (!error && data && data.length === 0) {
        // Keine Produkte gefunden
        return {
          message:
            "Leider haben wir momentan keine Produkte für diese Kombination. Möchten Sie eine andere Auswahl treffen?",
          quickReplies: [],
        };
      }
    } catch (error) {
      console.error("Error fetching available meat types:", error);
    }

    // Fallback nur bei Fehler: Keine Fleischsorten anzeigen
    return {
      message:
        "Es gab einen Fehler beim Laden der verfügbaren Fleischsorten. Bitte versuchen Sie es erneut.",
      quickReplies: [],
    };
  }

  // Abschlussfrage mit weiteren Optionen (nach 3 Fragen: Alter + Bedürfnisse + Fleischsorte)
  if (conversationLength === 3) {
    return {
      message: "Möchten Sie weitere Beratung oder haben Sie Fragen?",
      quickReplies: [
        { label: "Weitere Produkte zeigen", value: "MORE_PRODUCTS" },
        { label: "Beratung beenden", value: "END" },
      ],
    };
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const { messages, context } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 }
      );
    }

    // Handle spezielle Aktionen
    if (context === "RESTART") {
      return NextResponse.json({
        message:
          "Gerne! Lassen Sie uns von vorne beginnen. Wie alt ist Ihr Hund?",
        quickReplies: [
          { label: "🐶 Welpe/Junior (0-2 Jahre)", value: "JUNIOR" },
          { label: "🐕 Erwachsen (2-7 Jahre)", value: "ADULT" },
          { label: "🐾 Senior (7+ Jahre)", value: "SENIOR" },
        ],
      });
    }

    if (context === "END") {
      return NextResponse.json({
        message:
          "Vielen Dank für Ihr Interesse! Besuchen Sie gerne unseren Shop, um die Produkte zu kaufen. Bei weiteren Fragen bin ich jederzeit für Sie da! 🐾",
      });
    }

    // Handle "BACK" - zurück zur Bedürfnis-Auswahl
    if (context === "BACK") {
      // Extrahiere die Altersgruppe aus der letzten Auswahl
      const userMessages = messages.filter((m) => m.role === "user");
      let ageCategory = "ADULT";
      for (let i = userMessages.length - 1; i >= 0; i--) {
        if (userMessages[i]?.content.includes("Junior")) {
          ageCategory = "JUNIOR";
          break;
        } else if (userMessages[i]?.content.includes("Senior")) {
          ageCategory = "SENIOR";
          break;
        } else if (userMessages[i]?.content.includes("Erwachsen")) {
          ageCategory = "ADULT";
          break;
        }
      }

      // Lade verfügbare Bedürfnisse für die gewählte Altersgruppe
      try {
        const supabase = await createClient();
        const { data, error } = await supabase
          .from("products")
          .select("specials")
          .eq("age_group", ageCategory);

        if (!error && data && data.length > 0) {
          const availableSpecials = [
            ...new Set(
              data
                .map((item: { specials?: string }) => item.specials)
                .filter(Boolean)
            ),
          ];

          const specialsLabels: { [key: string]: string } = {
            HYPOALLERGEN: "🌾 Getreidefrei/Hypoallergen",
            DIAT: "🥗 Diät/Übergewicht",
            DARM: "💚 Darmgesundheit",
            GELENK: "🦴 Gelenkunterstützung",
            NONE: "Keine besonderen Bedürfnisse",
          };

          const specialsQuickReplies: Array<{ label: string; value: string }> =
            availableSpecials
              .map((special) => ({
                label: specialsLabels[special as string] || (special as string),
                value: special as string,
              }))
              .filter((item) => item.label && item.value)
              .sort((a, b) => {
                if (a.value === "NONE") return 1;
                if (b.value === "NONE") return -1;
                return a.label.localeCompare(b.label);
              });

          if (!specialsQuickReplies.find((item) => item.value === "NONE")) {
            specialsQuickReplies.push({
              label: "Keine besonderen Bedürfnisse",
              value: "NONE",
            });
          }

          return NextResponse.json({
            message: "Hat Ihr Hund besondere Bedürfnisse oder Allergien?",
            quickReplies: specialsQuickReplies,
          });
        }
      } catch (error) {
        console.error("Error in BACK handler:", error);
      }
    }

    // Handle Mehrfachauswahl von Fleischsorten
    if (context && context.startsWith("MULTI_MEAT:")) {
      const selectedMeats = context.replace("MULTI_MEAT:", "").split(",");

      // Extrahiere die vorherigen Antworten für Alter und Bedürfnisse
      const userMessages = messages.filter((m) => m.role === "user");
      const ageCategory = userMessages[0]?.content.includes("Junior")
        ? "JUNIOR"
        : userMessages[0]?.content.includes("Senior")
        ? "SENIOR"
        : "ADULT";
      const specialNeeds = userMessages[1]?.content.includes("Hypoallergen")
        ? "HYPOALLERGEN"
        : userMessages[1]?.content.includes("Diät")
        ? "DIAT"
        : userMessages[1]?.content.includes("Darm")
        ? "DARM"
        : userMessages[1]?.content.includes("Gelenk")
        ? "GELENK"
        : "NONE";

      try {
        const supabase = await createClient();

        let queryBuilder = supabase
          .from("products")
          .select(
            `
            id, name, description, slug,
            age_group, meat_type, specials,
            product_images!inner(image_url, is_primary),
            product_variants!inner(price)
          `
          )
          .eq("product_images.is_primary", true)
          .eq("age_group", ageCategory)
          .in("meat_type", selectedMeats)
          .limit(10);

        if (specialNeeds !== "NONE") {
          queryBuilder = queryBuilder.eq("specials", specialNeeds);
        }

        const { data, error } = await queryBuilder;

        if (!error && data && data.length > 0) {
          const multiProducts = data.map(
            (item: {
              id: number;
              name: string;
              description?: string;
              slug?: string;
              age_group?: string;
              meat_type?: string;
              product_images?: Array<{ image_url?: string }>;
              product_variants?: Array<{ price: number }>;
            }) => ({
              id: item.id,
              name: item.name,
              price: item.product_variants?.[0]?.price || 0,
              description: item.description,
              slug: item.slug,
              image_url: item.product_images?.[0]?.image_url,
              age_category: item.age_group,
              category: item.meat_type,
            })
          );

          // Erstelle eine Zusammenfassung der ausgewählten Fleischsorten
          const meatTypeLabels: { [key: string]: string } = {
            ENTE: "🦆 Ente",
            RIND: "🥩 Rind",
            KANINCHEN: "🐰 Kaninchen",
            LAMM: "🐑 Lamm",
            PFERD: "🐴 Pferd",
            WILD: "🦌 Wild",
            LACHS: "🐟 Lachs",
            HUHN: "🐔 Huhn",
          };

          const meatLabels = selectedMeats
            .map((meat: string) => meatTypeLabels[meat] || meat)
            .join(", ");

          return NextResponse.json({
            message: `Perfekt! Hier sind passende Produkte mit ${meatLabels}:`,
            products: multiProducts,
            quickReplies: [
              {
                label: "✅ Ja, weitere Produkte zeigen",
                value: "MORE_PRODUCTS",
              },
              {
                label: "🔙 Andere Fleischsorten wählen",
                value: "BACK_TO_MEAT",
              },
              { label: "❌ Nein, Beratung beenden", value: "END" },
            ],
            userSelection: `Deine Auswahl: [[${userMessages[0]?.content}]] | [[${userMessages[1]?.content}]] | [[${meatLabels}]]`,
          });
        } else {
          return NextResponse.json({
            message:
              "Leider haben wir momentan keine Produkte für diese Fleischsorten-Kombination. Möchten Sie andere Fleischsorten probieren?",
            quickReplies: [
              {
                label: "🔙 Andere Fleischsorten wählen",
                value: "BACK_TO_MEAT",
              },
              { label: "✅ Beratung beenden", value: "END" },
            ],
          });
        }
      } catch (error) {
        console.error("Error fetching multi-meat products:", error);
      }
    }

    // Handle "BACK_TO_MEAT" - zurück zur Fleischsorten-Auswahl
    if (context === "BACK_TO_MEAT") {
      const userMessages = messages.filter((m) => m.role === "user");
      const ageCategory = userMessages[0]?.content.includes("Junior")
        ? "JUNIOR"
        : userMessages[0]?.content.includes("Senior")
        ? "SENIOR"
        : "ADULT";
      const specialNeeds = userMessages[1]?.content.includes("Hypoallergen")
        ? "HYPOALLERGEN"
        : userMessages[1]?.content.includes("Diät")
        ? "DIAT"
        : userMessages[1]?.content.includes("Darm")
        ? "DARM"
        : userMessages[1]?.content.includes("Gelenk")
        ? "GELENK"
        : "NONE";

      try {
        const supabase = await createClient();
        let queryBuilder = supabase
          .from("products")
          .select("meat_type")
          .eq("age_group", ageCategory);

        if (specialNeeds !== "NONE") {
          queryBuilder = queryBuilder.eq("specials", specialNeeds);
        }

        const { data, error } = await queryBuilder;

        if (!error && data && data.length > 0) {
          const availableMeatTypes: string[] = [
            ...new Set(
              data
                .map((item: { meat_type?: string }) => item.meat_type)
                .filter((type): type is string => Boolean(type))
            ),
          ];

          const meatTypeLabels: { [key: string]: string } = {
            ENTE: "🦆 Ente",
            RIND: "🥩 Rind",
            KANINCHEN: "🐰 Kaninchen",
            LAMM: "🐑 Lamm",
            PFERD: "🐴 Pferd",
            WILD: "🦌 Wild",
            LACHS: "🐟 Lachs",
            HUHN: "🐔 Huhn",
          };

          const meatQuickReplies: { label: string; value: string }[] = [
            ...availableMeatTypes
              .map((meat: string) => ({
                label: meatTypeLabels[meat as string] || (meat as string),
                value: meat as string,
              }))
              .filter((item): item is { label: string; value: string } =>
                Boolean(item.label && item.value)
              )
              .sort((a, b) => a.label.localeCompare(b.label)),
          ];

          if (meatQuickReplies.length > 1) {
            meatQuickReplies.push({
              label: "Egal / Alle Sorten",
              value: "ALL",
            });
          }

          return NextResponse.json({
            message:
              "Welche Fleischsorte bevorzugt Ihr Hund? (Sie können mehrere auswählen)",
            quickReplies: meatQuickReplies,
            allowMultipleSelection: true,
          });
        }
      } catch (error) {
        console.error("Error in BACK_TO_MEAT handler:", error);
      }
    }

    // Handle "MORE_PRODUCTS" - zeige weitere passende Produkte
    if (context === "MORE_PRODUCTS") {
      // Extrahiere die LETZTEN Auswahlkriterien aus der Message-History
      // Durchsuche rückwärts, um die neuesten Auswahlen zu finden
      const userMessages = messages.filter((m) => m.role === "user");
      if (userMessages.length >= 3) {
        // Finde die letzte Altersgruppen-Auswahl
        let ageCategory = "ADULT";
        for (let i = userMessages.length - 1; i >= 0; i--) {
          if (userMessages[i]?.content.includes("Junior")) {
            ageCategory = "JUNIOR";
            break;
          } else if (userMessages[i]?.content.includes("Senior")) {
            ageCategory = "SENIOR";
            break;
          } else if (userMessages[i]?.content.includes("Erwachsen")) {
            ageCategory = "ADULT";
            break;
          }
        }

        // Lade ALLE Produkte für die Altersgruppe (unabhängig von Fleischsorte oder Bedürfnissen)
        try {
          const supabase = await createClient();

          const { data, error } = await supabase
            .from("products")
            .select(
              `
              id, name, description, slug,
              age_group, meat_type, specials,
              product_images!inner(image_url, is_primary),
              product_variants!inner(price)
            `
            )
            .eq("product_images.is_primary", true)
            .eq("age_group", ageCategory)
            .limit(20);

          if (!error && data && data.length > 0) {
            const moreProducts = data.map(
              (item: {
                id: number;
                name: string;
                description?: string;
                slug?: string;
                age_group?: string;
                meat_type?: string;
                product_images?: Array<{ image_url?: string }>;
                product_variants?: Array<{ price: number }>;
              }) => ({
                id: item.id,
                name: item.name,
                price: item.product_variants?.[0]?.price || 0,
                description: item.description,
                slug: item.slug,
                image_url: item.product_images?.[0]?.image_url,
                age_category: item.age_group,
                category: item.meat_type,
              })
            );

            return NextResponse.json({
              message:
                "Hier sind weitere Produkte für Ihren Hund aus unserer gesamten Auswahl:",
              products: moreProducts.slice(0, 10),
              quickReplies: [
                { label: "🔙 Zurück zur Auswahl", value: "BACK" },
                { label: "✅ Beratung beenden", value: "END" },
              ],
            });
          }
        } catch (error) {
          console.error("Error fetching more products:", error);
        }
      }

      // Fallback wenn keine Produkte gefunden
      return NextResponse.json({
        message:
          "Es gibt momentan keine weiteren passenden Produkte. Möchten Sie eine neue Suche starten?",
        quickReplies: [{ label: "✅ Beratung beenden", value: "END" }],
      });
    }

    const conversationLength = messages.filter((m) => m.role === "user").length;

    // Prüfe ob strukturierte Befragung fortgesetzt werden soll (aber NICHT bei conversationLength === 3, da dort Produkte geladen werden)
    const nextQuestion = await getNextQuestion(messages, context);

    // Wenn nextQuestion null ist bei conversationLength === 2, bedeutet das: nur eine Fleischsorte verfügbar
    // In diesem Fall direkt Produkte laden ohne Fleischsorten-Frage
    const shouldLoadProductsDirectly =
      conversationLength === 2 && nextQuestion === null;

    if (
      nextQuestion &&
      context &&
      conversationLength !== 3 &&
      !shouldLoadProductsDirectly
    ) {
      return NextResponse.json({
        message: nextQuestion.message,
        quickReplies: nextQuestion.quickReplies,
      });
    }

    // Produkte werden NUR nach der 3. Frage (Fleischsorte) angezeigt
    // ODER nach der 2. Frage wenn nur eine Fleischsorte verfügbar ist
    let products: Product[] = [];
    let systemMessage = `Du bist ein freundlicher und kompetenter Shopping-Assistent für EliteDogTreats, einen Premium-Online-Shop für hochwertiges Hundetrockenfutter mit naturbelassenen Inhaltsstoffen. 

Deine Aufgabe:
- Begrüße Hundebesitzer herzlich und finde heraus, was ihr Hund braucht
- Du antwortest nur auf Fragen zu unseren Produkten 
- Stelle gezielte Fragen zu:
  * Alter des Hundes (Welpe/Junior, Erwachsen/Adult, Senior)
  * Fleischvorlieben (Ente, Rind, Kaninchen, Lamm, Pferd, Wild, Lachs, Huhn)
  * Besondere Bedürfnisse (Allergien, Darmprobleme, Gelenkbeschwerden, Übergewicht)
  * Inhaltsstoff-Präferenzen (getreidefrei, hypoallergen, etc.)
- Gib maßgeschneiderte Empfehlungen basierend auf verfügbaren Produkten
- Sei kurz, präzise und freundlich (max. 3-4 Sätze)
- Verwende keine Markdown-Formatierung
- Wenn Produkte verfügbar sind, erwähne sie kurz im Text

Altersgruppen: Junior (Welpen & junge Hunde), Adult (erwachsene Hunde), Senior (ältere Hunde)
Fleischsorten: Ente, Rind, Kaninchen, Lamm, Pferd, Wild, Lachs, Huhn
Spezialnahrung: Diät, Hypoallergen, Darm (Verdauung), Gelenk (Mobilität)`;

    // Produkte werden nach der 3. Frage (Fleischsorte) geladen
    // ODER wenn eine neue Fleischsorte gewählt wird (context ist eine Fleischsorte)
    const isMeatTypeSelection =
      context &&
      [
        "ENTE",
        "RIND",
        "KANINCHEN",
        "LAMM",
        "PFERD",
        "WILD",
        "LACHS",
        "HUHN",
        "ALL",
      ].includes(context);

    // Sammle alle User-Antworten für die Filterung
    if (
      (conversationLength === 3 ||
        shouldLoadProductsDirectly ||
        (conversationLength > 3 && isMeatTypeSelection)) &&
      context
    ) {
      // Extrahiere die vorherigen Antworten aus den Messages
      const userMessages = messages.filter((m) => m.role === "user");
      const ageCategory = userMessages[0]?.content.includes("Junior")
        ? "JUNIOR"
        : userMessages[0]?.content.includes("Senior")
        ? "SENIOR"
        : "ADULT";
      const specialNeeds = userMessages[1]?.content.includes("Hypoallergen")
        ? "HYPOALLERGEN"
        : userMessages[1]?.content.includes("Diät")
        ? "DIAT"
        : userMessages[1]?.content.includes("Darm")
        ? "DARM"
        : userMessages[1]?.content.includes("Gelenk")
        ? "GELENK"
        : "NONE";

      // Wenn nur eine Fleischsorte verfügbar ist (shouldLoadProductsDirectly), lade diese aus der DB
      let meatType = context; // Die aktuelle Fleischsorte

      if (shouldLoadProductsDirectly) {
        // Lade die einzige verfügbare Fleischsorte
        const supabase = await createClient();
        let queryBuilder = supabase
          .from("products")
          .select("meat_type")
          .eq("age_group", ageCategory);

        if (specialNeeds !== "NONE") {
          queryBuilder = queryBuilder.eq("specials", specialNeeds);
        }

        const { data } = await queryBuilder.limit(1);
        meatType = data?.[0]?.meat_type || "ALL";
      }

      // Suche Produkte basierend auf ALLEN Kriterien (Alter, Bedürfnisse, Fleischsorte)
      try {
        const supabase = await createClient();

        let queryBuilder = supabase
          .from("products")
          .select(
            `
            id, name, description, slug,
            age_group, meat_type, specials,
            product_images!inner(image_url, is_primary),
            product_variants!inner(price)
          `
          )
          .eq("product_images.is_primary", true)
          .eq("age_group", ageCategory) // Filtere nach Altersgruppe
          .limit(10);

        // Filtere nach Fleischsorte (außer bei "ALL")
        if (meatType !== "ALL") {
          queryBuilder = queryBuilder.eq("meat_type", meatType.toUpperCase());
        }

        // Filtere nach besonderen Bedürfnissen (außer bei "NONE")
        if (specialNeeds !== "NONE") {
          queryBuilder = queryBuilder.eq("specials", specialNeeds);
        }

        const { data, error } = await queryBuilder;

        if (error) {
          console.error("Supabase Error:", error);
          products = [];
        } else {
          products = (data || []).map(
            (item: {
              id: number;
              name: string;
              description?: string;
              slug?: string;
              age_group?: string;
              meat_type?: string;
              product_images?: Array<{ image_url?: string }>;
              product_variants?: Array<{ price: number }>;
            }) => ({
              id: item.id,
              name: item.name,
              price: item.product_variants?.[0]?.price || 0,
              description: item.description,
              slug: item.slug,
              image_url: item.product_images?.[0]?.image_url,
              age_category: item.age_group,
              category: item.meat_type,
            })
          );
        }
      } catch (error) {
        console.error("Error fetching filtered products:", error);
        products = [];
      }

      if (products.length > 0) {
        systemMessage = `Basierend auf Ihren Angaben habe ich die folgenden passenden Produkte für Sie gefunden:

VERFÜGBARE PRODUKTE:
${products
  .map(
    (p) =>
      `- ${p.name} (${p.price}€)${
        p.age_category ? ` - ${p.age_category}` : ""
      }${p.category ? ` - ${p.category}` : ""}: ${
        p.description?.substring(0, 80) || "Premium Hundesnack"
      }`
  )
  .join("\n")}

Erstelle eine kurze, freundliche Empfehlung (max. 2-3 Sätze), die erklärt, warum diese Produkte perfekt für den Hund passen. Erwähne am Ende, dass der Kunde weitere Produkte sehen kann, wenn er möchte.`;
      } else {
        systemMessage = `Leider haben wir momentan keine Produkte, die exakt zu diesen Kriterien passen (Alter: ${ageCategory}, Bedürfnisse: ${specialNeeds}, Fleischsorte: ${meatType}). Empfehle dem Kunden, es mit einer anderen Fleischsorte zu versuchen oder unseren Shop zu durchsuchen.`;
      }
    }

    // OpenAI API-Aufruf (nur bei Bedarf)
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemMessage },
        ...messages.map((msg: ChatMessage) => ({
          role: msg.role,
          content: msg.content,
        })),
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const assistantMessage =
      completion.choices[0]?.message?.content ||
      "Entschuldigung, ich konnte keine Antwort generieren.";

    // Prüfe ob weitere Fragen gestellt werden sollen
    const followUpQuestion = await getNextQuestion(messages);

    // Wenn keine followUp-Buttons da sind, gebe Standard-Optionen zurück
    let quickReplies = followUpQuestion?.quickReplies;

    // Wenn wir nach der 3. Frage sind und Produkte gezeigt wurden, frage ob weitere Produkte gewünscht sind
    if (!quickReplies && conversationLength >= 3 && products.length > 0) {
      quickReplies = [
        { label: "✅ Ja, weitere Produkte zeigen", value: "MORE_PRODUCTS" },
        { label: "🔙 Andere Auswahl treffen", value: "BACK" },
        { label: "❌ Nein, Beratung beenden", value: "END" },
      ];
    } else if (
      !quickReplies &&
      conversationLength >= 3 &&
      products.length === 0
    ) {
      // Keine Produkte gefunden
      quickReplies = [
        { label: "🔙 Zurück zur Auswahl", value: "BACK" },
        { label: "✅ Beratung beenden", value: "END" },
      ];
    }

    // Wenn wir noch in der Befragung sind (0-2 Fragen), stelle sicher dass die nächste Frage kommt
    if (!quickReplies && conversationLength < 3) {
      const nextQuestionForUser = await getNextQuestion(messages);
      if (nextQuestionForUser) {
        quickReplies = nextQuestionForUser.quickReplies;
      }
    }

    // Erstelle userSelection für die Anzeige im Frontend mit markierten Werten
    let userSelection = "";
    if (
      (conversationLength === 3 ||
        shouldLoadProductsDirectly ||
        (conversationLength > 3 && isMeatTypeSelection)) &&
      context
    ) {
      const userMessages = messages.filter((m) => m.role === "user");
      const ageLabel = userMessages[0]?.content || "";
      const needsLabel = userMessages[1]?.content || "";

      // Bei shouldLoadProductsDirectly: Zeige die automatisch gewählte Fleischsorte
      let meatLabel = "";
      if (shouldLoadProductsDirectly) {
        // Lade die verfügbare Fleischsorte aus der DB
        const supabase = await createClient();
        const ageCategory = userMessages[0]?.content.includes("Junior")
          ? "JUNIOR"
          : userMessages[0]?.content.includes("Senior")
          ? "SENIOR"
          : "ADULT";
        const specialNeeds = userMessages[1]?.content.includes("Hypoallergen")
          ? "HYPOALLERGEN"
          : userMessages[1]?.content.includes("Diät")
          ? "DIAT"
          : userMessages[1]?.content.includes("Darm")
          ? "DARM"
          : userMessages[1]?.content.includes("Gelenk")
          ? "GELENK"
          : "NONE";

        let queryBuilder = supabase
          .from("products")
          .select("meat_type")
          .eq("age_group", ageCategory);

        if (specialNeeds !== "NONE") {
          queryBuilder = queryBuilder.eq("specials", specialNeeds);
        }

        const { data } = await queryBuilder.limit(1);
        const meatType = data?.[0]?.meat_type || "";

        const meatTypeLabels: { [key: string]: string } = {
          ENTE: "🦆 Ente",
          RIND: "🥩 Rind",
          KANINCHEN: "🐰 Kaninchen",
          LAMM: "🐑 Lamm",
          PFERD: "🐴 Pferd",
          WILD: "🦌 Wild",
          LACHS: "🐟 Lachs",
          HUHN: "🐔 Huhn",
        };

        meatLabel = meatTypeLabels[meatType] || meatType;
      } else {
        // Zeige die aktuelle Fleischsorten-Auswahl (letzte Message)
        meatLabel = userMessages[userMessages.length - 1]?.content || "";
      }

      userSelection = `Deine Auswahl: [[${ageLabel}]] | [[${needsLabel}]] | [[${meatLabel}]]`;
    } else if (conversationLength > 0) {
      const lastUserMessage =
        messages.filter((m) => m.role === "user")[conversationLength - 1]
          ?.content || "";
      if (
        !context ||
        ![
          "JUNIOR",
          "ADULT",
          "SENIOR",
          "HYPOALLERGEN",
          "DIAT",
          "DARM",
          "GELENK",
          "NONE",
          "ENTE",
          "RIND",
          "KANINCHEN",
          "LAMM",
          "PFERD",
          "WILD",
          "LACHS",
          "HUHN",
          "ALL",
        ].includes(context)
      ) {
        userSelection = `Deine Frage: [[${lastUserMessage}]]`;
      }
    }

    return NextResponse.json({
      message: assistantMessage,
      products: products.length > 0 ? products.slice(0, 6) : undefined,
      quickReplies: quickReplies,
      userSelection: userSelection || undefined,
    });
  } catch (error: unknown) {
    console.error("Chatbot API Error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        error: "Fehler beim Verarbeiten der Anfrage",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
