import type { ElementType, ReactNode } from "react";
import { typeClass, type TypeClassRole } from "@/lib/typography";

interface TypeProps {
  role: TypeClassRole;
  as?: ElementType;
  className?: string;
  children: ReactNode;
}

/**
 * Einziger Typo-Zugang für Screens: wählt eine semantische Rolle aus
 * lib/typography.ts. NIE fontFamily/fontSize/fontWeight direkt setzen — nur
 * `role` (+ Farbe/Layout via className). Schrift ändern = nur lib/typography.ts.
 */
export function Type({ role, as, className = "", children }: TypeProps) {
  const Tag: ElementType = as ?? "p";
  return <Tag className={`${typeClass[role]} ${className}`}>{children}</Tag>;
}
