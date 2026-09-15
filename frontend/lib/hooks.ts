"use client";

import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import type { AppDispatch, RootState } from "./store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function getApiError(error: unknown, fallback = "Something went wrong. Please try again.") {
  if (typeof error === "object" && error !== null && "data" in error) {
    const data = (error as { data?: { message?: string | string[] } }).data;
    if (Array.isArray(data?.message)) return data.message[0] ?? fallback;
    if (data?.message) return data.message;
  }
  return fallback;
}