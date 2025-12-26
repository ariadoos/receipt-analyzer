import { DATE_FORMAT, TIME_FORMAT } from "@/constants";
import { COLORS } from "@/constants/colors";
import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import type { Timestamp } from "firebase/firestore";
import { twMerge } from "tailwind-merge";

const COLOR_MAP = new Map(COLORS.map(c => [c.name, c.value]));

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function cleanObject<T extends object>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined && value !== null && value !== "")
  ) as T;
}

export function getRandomColorName() {
  const randomIndex = Math.floor(Math.random() * (COLORS.length - 1));
  return COLORS[randomIndex].name || COLORS[0].name;
}

export function getCategoryColor(categoryName: string) {
  return COLOR_MAP.get(categoryName);
}

export function formatTimestamp(input: Timestamp) {
  const formatted = format(input.toDate(), `${DATE_FORMAT} ${TIME_FORMAT}`);
  return formatted;
}
