"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const categories = [
  {
    title: "Junior",
    href: "/junior",
    bg: "bg-linear-to-br from-accent via-[#e7a15f] to-[#deb085]",
    icon: "/images/alter/puppy.svg",
    label: "Welpe",
  },
  {
    title: "Adult",
    href: "/adult",
    bg: "bg-linear-to-br from-accent via-[#e7a15f] to-[#deb085]",
    icon: "/images/alter/adult.svg",
    label: "Adult",
  },
  {
    title: "Senior",
    href: "/senior",
    bg: "bg-linear-to-br from-accent via-[#e7a15f] to-[#deb085]",
    icon: "/images/alter/senior.svg",
    label: "Senior",
  },
];

export function AgeCategories() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.2,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef} className="flex justify-center gap-16 flex-wrap">
      {categories.map((c, index) => (
        <a
          key={c.title}
          href={c.href}
          className={`group flex flex-col items-center gap-3 ${
            isVisible ? "animate-spin-in" : "opacity-0"
          }`}
          style={{
            animationDelay: isVisible ? `${index * 0.2}s` : "0s",
          }}
        >
          <div
            className={`w-32 h-32 rounded-full border ${c.bg} shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 flex items-center justify-center overflow-visible relative`}
          >
            {c.icon ? (
              <Image
                src={c.icon}
                alt={c.title}
                width={560}
                height={560}
                className="object-contain absolute"
              />
            ) : (
              <h3 className="text-lg font-bold group-brown brown-glow">
                {c.title}
              </h3>
            )}
          </div>
          <span className="text-lg font-bold text-black relative group-hover:text-accent transition-colors">
            {c.label}
            <span
              className="absolute left-1/2 -translate-x-1/2 bottom-0 h-[3px] w-11/12 origin-center scale-x-0 group-hover:scale-x-100 -translate-y-0.5 transform transition-transform duration-300 rounded opacity-0 group-hover:opacity-100"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, hsl(33 100% 37%) 0%, hsl(38 100% 50%) 50%, hsl(33 100% 37%) 100%)",
              }}
            ></span>
          </span>
        </a>
      ))}
    </div>
  );
}
