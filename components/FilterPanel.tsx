'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { ChevronDown, X } from 'lucide-react';

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
  currentAge?: 'junior' | 'adult' | 'senior';
}

const MEAT_OPTIONS: FilterOption[] = [
  { label: 'Ente', value: 'ente' },
  { label: 'Rind', value: 'rind' },
  { label: 'Kaninchen', value: 'kaninchen' },
  { label: 'Lamm', value: 'lamm' },
  { label: 'Pferd', value: 'pferd' },
  { label: 'Wild', value: 'wild' },
  { label: 'Lachs', value: 'lachs' },
  { label: 'Huhn', value: 'huhn' },
];

const AGE_OPTIONS: FilterOption[] = [
  { label: 'Junior', value: 'junior' },
  { label: 'Adult', value: 'adult' },
  { label: 'Senior', value: 'senior' },
];

export function FilterPanel({ currentAge }: FilterPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Bestimme welche Filter angezeigt werden
  const filterGroups: FilterGroup[] = currentAge
    ? [
        {
          id: 'meat',
          label: 'Fleischsorte',
          options: MEAT_OPTIONS,
        },
      ]
    : [
        {
          id: 'age',
          label: 'Altersgruppe',
          options: AGE_OPTIONS,
        },
        {
          id: 'meat',
          label: 'Fleischsorte',
          options: MEAT_OPTIONS,
        },
      ];

  // Initialize filters from URL
  useEffect(() => {
    const filters: Record<string, string[]> = {};
    if (searchParams.get('meat')) {
      filters['meat'] = searchParams.get('meat')!.split(',').filter(Boolean);
    }
    if (!currentAge && searchParams.get('age')) {
      filters['age'] = searchParams.get('age')!.split(',').filter(Boolean);
    }
    setSelectedFilters(filters);
  }, [searchParams, currentAge]);

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

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdowns]);

  const toggleDropdown = (groupId: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const handleFilterChange = (groupId: string, value: string, checked: boolean) => {
    setSelectedFilters((prev) => {
      const current = prev[groupId] || [];
      let updated: string[];

      if (checked) {
        updated = [...current, value];
      } else {
        updated = current.filter((v) => v !== value);
      }

      return {
        ...prev,
        [groupId]: updated,
      };
    });

    applyFilters({
      ...selectedFilters,
      [groupId]: checked
        ? [...(selectedFilters[groupId] || []), value]
        : (selectedFilters[groupId] || []).filter((v) => v !== value),
    });

    // Close dropdown after selection
    setOpenDropdowns((prev) => ({
      ...prev,
      [groupId]: false,
    }));
  };

  const applyFilters = (filters: Record<string, string[]>) => {
    const params = new URLSearchParams();

    if (currentAge) {
      // On age-specific pages, navigate within that page
      if (filters['meat']?.length > 0) {
        params.set('meat', filters['meat'].join(','));
      }
      const queryString = params.toString();
      router.push(queryString ? `/${currentAge}?${queryString}` : `/${currentAge}`, { scroll: false });
    } else {
      // On shop page, apply both filters
      if (filters['age']?.length > 0) {
        params.set('age', filters['age'].join(','));
      }
      if (filters['meat']?.length > 0) {
        params.set('meat', filters['meat'].join(','));
      }
      const queryString = params.toString();
      router.push(queryString ? `/shop?${queryString}` : '/shop', { scroll: false });
    }
  };

  const resetFilters = () => {
    setSelectedFilters({});
    if (currentAge) {
      router.push(`/${currentAge}`, { scroll: false });
    } else {
      router.push('/shop', { scroll: false });
    }
  };

  const hasActiveFilters = Object.values(selectedFilters).some((v) => v.length > 0);

  return (
    <div className="w-full mb-8">
      {/* Filter Dropdowns */}
      <div className="flex flex-wrap gap-3 mb-6">
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
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {group.label}
              <ChevronDown
                size={18}
                className={`transition-transform duration-200 ${
                  openDropdowns[group.id] ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openDropdowns[group.id] && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-xl z-50 min-w-max">
                <div className="p-3 space-y-2">
                  {group.options.map((option) => {
                    const isChecked =
                      selectedFilters[group.id]?.includes(option.value) || false;
                    return (
                      <label
                        key={`${group.id}-${option.value}`}
                        className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) =>
                            handleFilterChange(group.id, option.value, e.target.checked)
                          }
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer accent-blue-600"
                        />
                        <span className="text-sm text-gray-700">{option.label}</span>
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
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Filter zurücksetzen
            <X size={16} />
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filterGroups.map((group) =>
            (selectedFilters[group.id] || []).map((value) => {
              const option = group.options.find((o) => o.value === value);
              return (
                <div
                  key={`${group.id}-${value}`}
                  className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm border border-blue-200"
                >
                  <span className="font-medium">{option?.label}</span>
                  <button
                    onClick={() => handleFilterChange(group.id, value, false)}
                    className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
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
