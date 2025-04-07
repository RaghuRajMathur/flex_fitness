
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatIndianRupees } from "@/utils/format";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return formatIndianRupees(amount);
}
