"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, X } from "lucide-react";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
}

interface FilterPanelProps {
  currentAge?: "junior" | "adult" | "senior" | "promotions";
}

const MEAT_OPTIONS: FilterOption[] = [
  { label: "Ente", value: "ente" },
  { label: "Rind", value: "rind" },
  { label: "Kaninchen", value: "kaninchen" },
  { label: "Lamm", value: "lamm" },
  { label: "Pferd", value: "pferd" },
  { label: "Wild", value: "wild" },
  { label: "Lachs", value: "lachs" },
  { label: "Huhn", value: "huhn" },
];

const AGE_OPTIONS: FilterOption[] = [
  { label: "Junior", value: "junior" },
  { label: "Adult", value: "adult" },
  { label: "Senior", value: "senior" },
];

export function FilterPanel({ currentAge }: FilterPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>(
    {}
  );
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Bestimme welche Filter angezeigt werden
  const filterGroups: FilterGroup[] =
    currentAge === "promotions"
      ? [
          {
            id: "age",
            label: "Altersgruppe",
            options: AGE_OPTIONS,
          },
          {
            id: "meat",
            label: "Fleischsorte",
            options: MEAT_OPTIONS,
          },
        ]
      : currentAge
      ? [
          {
            id: "meat",
            label: "Fleischsorte",
            options: MEAT_OPTIONS,
          },
        ]
      : [
          {
            id: "age",
            label: "Altersgruppe",
            options: AGE_OPTIONS,
          },
          {
            id: "meat",
            label: "Fleischsorte",
            options: MEAT_OPTIONS,
          },
        ];

  // Initialize filters from URL
  useEffect(() => {
    const filters: Record<string, string[]> = {};
    if (searchParams.get("meat")) {
      filters["meat"] = searchParams.get("meat")!.split(",").filter(Boolean);
    }
    if (searchParams.get("age")) {
      filters["age"] = searchParams.get("age")!.split(",").filter(Boolean);
    }
    setSelectedFilters(filters);
  }, [searchParams]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      Object.keys(openDropdowns).forEach((key) => {
        const ref = dropdownRefs.current[key];
        if (ref && !ref.contains(event.target as Node)) {
          setOpenDropdowns((prev) => ({
            ...prev,
            [key]: false,
          }));
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdowns]);

  const toggleDropdown = (groupId: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const handleFilterChange = (
    groupId: string,
    value: string,
    checked: boolean
  ) => {
    const newFilters = { ...selectedFilters };
    const current = newFilters[groupId] || [];
    let updated: string[];

    if (checked) {
      updated = [...current, value];
    } else {
      updated = current.filter((v) => v !== value);
    }

    newFilters[groupId] = updated;
    
    // Update state
    setSelectedFilters(newFilters);
    
    // Close dropdown after selection
    setOpenDropdowns((prev) => ({
      ...prev,
      [groupId]: false,
    }));

    // Apply filters after state update (outside of setState)
    applyFilters(newFilters);
  };

  const applyFilters = (filters: Record<string, string[]>) => {
    const params = new URLSearchParams();

    if (currentAge === "promotions") {
      // On promotions page, navigate to promotions route with both filters
      if (filters["age"]?.length > 0) {
        params.set("age", filters["age"].join(","));
      }
      if (filters["meat"]?.length > 0) {
        params.set("meat", filters["meat"].join(","));
      }
      const queryString = params.toString();
      router.push(queryString ? `/promotions?${queryString}` : "/promotions", {
        scroll: false,
      });
    } else if (currentAge) {
      // On age-specific pages, navigate within that page
      if (filters["meat"]?.length > 0) {
        params.set("meat", filters["meat"].join(","));
      }
      const queryString = params.toString();
      router.push(
        queryString ? `/${currentAge}?${queryString}` : `/${currentAge}`,
        { scroll: false }
      );
    } else {
      // On shop page, apply both filters
      if (filters["age"]?.length > 0) {
        params.set("age", filters["age"].join(","));
      }
      if (filters["meat"]?.length > 0) {
        params.set("meat", filters["meat"].join(","));
      }
      const queryString = params.toString();
      router.push(queryString ? `/shop?${queryString}` : "/shop", {
        scroll: false,
      });
    }
  };

  const resetFilters = () => {
    setSelectedFilters({});
    if (currentAge === "promotions") {
      router.push("/promotions", { scroll: false });
    } else if (currentAge) {
      router.push(`/${currentAge}`, { scroll: false });
    } else {
      router.push("/shop", { scroll: false });
    }
  };

  const hasActiveFilters = Object.values(selectedFilters).some(
    (v) => v.length > 0
  );

  return (
    <div className="w-full">
      {/* Filter Dropdowns */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="mr-1 text-base font-semibold text-muted-foreground">
          Filter:
        </span>
        {filterGroups.map((group) => (
          <div
            key={group.id}
            ref={(el) => {
              if (el) dropdownRefs.current[group.id] = el;
            }}
            className="relative"
          >
            <button
              onClick={() => toggleDropdown(group.id)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-(--app-radius) text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              {group.label}
              <ChevronDown
                size={18}
                className={`text-accent transition-transform duration-200 ${
                  openDropdowns[group.id] ? "rotate-180" : ""
                }`}
              />
            </button>

            {openDropdowns[group.id] && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-(--app-radius) shadow-xl z-50 min-w-max">
                <div className="p-3 space-y-2">
                  {group.options.map((option) => {
                    const isChecked =
                      selectedFilters[group.id]?.includes(option.value) ||
                      false;
                    return (
                      <label
                        key={`${group.id}-${option.value}`}
                        className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-(--app-radius) transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) =>
                            handleFilterChange(
                              group.id,
                              option.value,
                              e.target.checked
                            )
                          }
                          className="w-4 h-4 rounded border-gray-300 text-accent cursor-pointer accent-accent"
                        />
                        <span className="text-sm text-gray-700">
                          {option.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Reset Button */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-accent text-accent rounded-(--app-radius) text-sm font-medium hover:bg-accent/10 transition-colors cursor-pointer"
          >
            Filter zurücksetzen
            <X size={16} className="text-accent" />
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-4">
          {filterGroups.map((group) =>
            (selectedFilters[group.id] || []).map((value) => {
              const option = group.options.find((o) => o.value === value);
              return (
                <div
                  key={`${group.id}-${value}`}
                  className="inline-flex items-center gap-2 bg-muted text-foreground px-3 py-1.5 rounded-(--app-radius) text-sm border border-muted-foreground/20"
                >
                  <span className="font-medium">{option?.label}</span>
                  <button
                    onClick={() => handleFilterChange(group.id, value, false)}
                    className="ml-1 hover:bg-muted rounded-(--app-radius) p-0.5 transition-colors cursor-pointer"
                    aria-label={`Remove ${option?.label} filter`}
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
