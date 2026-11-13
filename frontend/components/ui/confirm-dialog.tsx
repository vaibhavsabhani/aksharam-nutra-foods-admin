"use client";

import { useEffect, type ReactNode } from "react";
import {
  AlertTriangle,
  Trash2,
  Info,
  LoaderCircle,
  X,
  ShieldAlert,
  FileText,
  AlertCircle,
} from "lucide-react";
import { Button } from "./button";

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: ReactNode;
  itemName?: string;
  itemType?: string;
  confirmText?: string;
  cancelText?: string;
  tone?: "danger" | "warning" | "info";
  isLoading?: boolean;
  error?: string | null;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
  itemType = "Selected Item",
  confirmText = "Delete Permanently",
  cancelText = "Cancel",
  tone = "danger",
  isLoading = false,
  error = null,
}: ConfirmDialogProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const toneConfig = {
    danger: {
      icon: Trash2,
      badgeText: "Permanent Deletion",
      badgeClass: "border-rose-200/90 bg-rose-50 text-rose-700",
      haloClass: "bg-rose-500/10",
      pingClass: "bg-rose-500/20",
      iconTile: "bg-gradient-to-br from-rose-500 via-rose-600 to-red-700 text-white shadow-lg shadow-rose-600/35",
      ambientGlow: "bg-rose-500/15",
      cardBorder: "border-rose-100",
      confirmBtn:
        "bg-gradient-to-r from-rose-600 via-rose-700 to-red-700 hover:from-rose-500 hover:to-red-600 text-white shadow-lg shadow-rose-600/30 hover:shadow-rose-600/45 focus-visible:ring-rose-500",
    },
    warning: {
      icon: AlertTriangle,
      badgeText: "Caution Required",
      badgeClass: "border-amber-200/90 bg-amber-50 text-amber-700",
      haloClass: "bg-amber-500/10",
      pingClass: "bg-amber-500/20",
      iconTile: "bg-gradient-to-br from-amber-500 via-amber-600 to-orange-700 text-white shadow-lg shadow-amber-600/35",
      ambientGlow: "bg-amber-500/15",
      cardBorder: "border-amber-100",
      confirmBtn:
        "bg-gradient-to-r from-amber-600 via-amber-700 to-orange-700 hover:from-amber-500 hover:to-orange-600 text-white shadow-lg shadow-amber-600/30 hover:shadow-amber-600/45 focus-visible:ring-amber-500",
    },
    info: {
      icon: Info,
      badgeText: "Confirmation",
      badgeClass: "border-teal-200/90 bg-teal-50 text-teal-700",
      haloClass: "bg-teal-500/10",
      pingClass: "bg-teal-500/20",
      iconTile: "bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-700 text-white shadow-lg shadow-teal-600/35",
      ambientGlow: "bg-teal-500/15",
      cardBorder: "border-teal-100",
      confirmBtn:
        "bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg shadow-teal-900/25 focus-visible:ring-teal-500",
    },
  }[tone];

  const Icon = toneConfig.icon;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-desc"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden"
    >
      {/* 1. Animated Frosted Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
        onClick={() => {
          if (!isLoading) onClose();
        }}
        aria-hidden="true"
      />

      {/* 2. Magazine-Grade Animated Modal Window */}
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200/90 bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-5 duration-300 ease-out">
        {/* Ambient Top Glow */}
        <div
          className={`absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-3xl pointer-events-none ${toneConfig.ambientGlow}`}
        />

        {/* Dialog Header with Close Button */}
        <div className="relative p-6 sm:p-7 pb-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            aria-label="Close dialog"
            className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-700 hover:rotate-90 active:scale-90 disabled:opacity-40 transition-all duration-200 shadow-2xs"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Animated Danger Emblem & Header Tag */}
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center">
              {/* Outer pulsing ring */}
              <span
                className={`absolute -inset-2 rounded-2xl animate-ping-subtle ${toneConfig.pingClass}`}
              />
              {/* Middle soft blur halo */}
              <span
                className={`absolute -inset-1 rounded-2xl blur-sm ${toneConfig.haloClass}`}
              />
              {/* Inner gradient icon badge */}
              <div
                className={`relative grid h-14 w-14 place-items-center rounded-2xl ${toneConfig.iconTile}`}
              >
                <Icon className="h-7 w-7 stroke-[2.2] animate-in zoom-in duration-300" />
              </div>
            </div>

            <div className="space-y-1">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${toneConfig.badgeClass}`}
              >
                <ShieldAlert className="h-3 w-3 shrink-0" />
                <span>{toneConfig.badgeText}</span>
              </span>
              <h3
                id="confirm-dialog-title"
                className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight"
              >
                {title}
              </h3>
            </div>
          </div>

          {/* Explanation Text */}
          <p
            id="confirm-dialog-desc"
            className="mt-4 text-sm text-slate-600 leading-relaxed"
          >
            {description}
          </p>

          {/* Target Item Card Preview */}
          {itemName && (
            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-br from-slate-50 to-slate-100/60 p-4 transition-all">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-slate-600 shadow-xs border border-slate-200/80">
                  <FileText className="h-5 w-5 text-slate-700" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {itemType}
                  </span>
                  <p className="mt-0.5 text-sm font-bold text-slate-900 truncate">
                    {itemName}
                  </p>
                  <p className="mt-1 text-xs text-rose-600 font-medium flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>Will be immediately erased from website and database</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Banner inside dialog */}
          {error && (
            <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-rose-200 bg-rose-50/90 p-3.5 text-xs text-rose-800 animate-in fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
              <span className="font-semibold leading-relaxed">{error}</span>
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="border-t border-slate-100 bg-slate-50/80 px-6 py-4 sm:px-7 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isLoading}
            onClick={onClose}
            className="w-full sm:w-auto h-11 px-5 border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl active:scale-95 transition-all"
          >
            {cancelText}
          </Button>

          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-6 font-bold rounded-xl active:scale-95 disabled:pointer-events-none disabled:opacity-50 transition-all ${toneConfig.confirmBtn}`}
          >
            {isLoading ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin mr-1.5" />
                <span>Deleting Record...</span>
              </>
            ) : (
              <>
                <Icon className="h-4 w-4 stroke-[2.2]" />
                <span>{confirmText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
