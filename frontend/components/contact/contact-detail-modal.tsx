"use client";

import { useEffect, useState } from "react";
import {
  X,
  Mail,
  User,
  Calendar,
  Clock,
  MapPin,
  Globe,
  ExternalLink,
  Copy,
  Check,
  Trash2,
  Send,
  Save,
  LoaderCircle,
  MessageSquare,
  ShieldCheck,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  Contact,
  ContactStatus,
  useUpdateContactStatusMutation,
  useDeleteContactMutation,
} from "@/lib/api";

interface ContactDetailModalProps {
  contact: Contact | null;
  onClose: () => void;
  onDeleted?: () => void;
}

const STATUS_CONFIG: Record<
  ContactStatus,
  { label: string; badgeClass: string; bgClass: string; textClass: string; desc: string }
> = {
  PENDING: {
    label: "Pending Review",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-300",
    bgClass: "bg-amber-500",
    textClass: "text-amber-700",
    desc: "New inquiry waiting for admin action",
  },
  CONTACTED: {
    label: "Contacted",
    badgeClass: "bg-blue-100 text-blue-800 border-blue-300",
    bgClass: "bg-blue-500",
    textClass: "text-blue-700",
    desc: "Customer has been contacted by sales/support",
  },
  RESOLVED: {
    label: "Resolved",
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
    bgClass: "bg-emerald-500",
    textClass: "text-emerald-700",
    desc: "Inquiry has been answered and resolved",
  },
  ARCHIVED: {
    label: "Archived",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-300",
    bgClass: "bg-slate-400",
    textClass: "text-slate-600",
    desc: "Stored for record-keeping",
  },
};

export function ContactDetailModal({
  contact,
  onClose,
  onDeleted,
}: ContactDetailModalProps) {
  const [updateStatus, { isLoading: isUpdating }] = useUpdateContactStatusMutation();
  const [deleteContact, { isLoading: isDeleting }] = useDeleteContactMutation();

  const [currentStatus, setCurrentStatus] = useState<ContactStatus>("PENDING");
  const [notes, setNotes] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (contact) {
      setCurrentStatus(contact.status);
      setNotes(contact.notes || "");
      setSaveSuccess(false);
    }
  }, [contact]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (contact) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [contact, onClose]);

  if (!contact) return null;

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSaveStatusAndNotes = async (newStatus?: ContactStatus) => {
    const statusToSave = newStatus ?? currentStatus;
    try {
      await updateStatus({
        id: contact.id,
        status: statusToSave,
        notes: notes.trim(),
      }).unwrap();
      setCurrentStatus(statusToSave);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      // Handled by mutation error state
    }
  };

  const handleDelete = async () => {
    try {
      await deleteContact(contact.id).unwrap();
      setShowDeleteConfirm(false);
      onClose();
      onDeleted?.();
    } catch {
      // Error handled by mutation
    }
  };

  const formattedDate = new Date(contact.createdAt).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const formattedTime = new Date(contact.createdAt).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const mapsUrl =
    contact.latitude && contact.longitude
      ? `https://www.google.com/maps?q=${contact.latitude},${contact.longitude}`
      : null;

  const locationDisplay = [contact.city, contact.region, contact.country]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
          onClick={onClose}
        />

        {/* Modal Window */}
        <div className="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/10 overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200/80 bg-slate-50/80 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-teal-50 text-teal-700 border border-teal-200/60">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">
                    {contact.firstName} {contact.lastName}
                  </h3>
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                      STATUS_CONFIG[currentStatus].badgeClass
                    }`}
                  >
                    {STATUS_CONFIG[currentStatus].label}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {formattedDate}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {formattedTime}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/70 hover:text-slate-700 transition"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Sender & Geolocation Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sender Details */}
              <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Contact Information
                </p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-slate-400" />
                      Name
                    </span>
                    <span className="text-sm font-semibold text-slate-800">
                      {contact.firstName} {contact.lastName}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      Email
                    </span>
                    <div className="flex items-center gap-1.5">
                      <a
                        href={`mailto:${contact.email}`}
                        className="text-sm font-semibold text-teal-700 hover:underline"
                      >
                        {contact.email}
                      </a>
                      <button
                        onClick={() => handleCopy(contact.email, "email")}
                        className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition"
                        title="Copy email"
                      >
                        {copiedField === "email" ? (
                          <Check className="h-3 w-3 text-emerald-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <a
                      href={`mailto:${contact.email}?subject=Regarding your message to Aksharam Nutra Foods&body=Dear ${encodeURIComponent(
                        contact.firstName
                      )},%0D%0A%0D%0AThank you for reaching out to Aksharam Nutra Foods.`}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-teal-700 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-teal-800 transition"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Reply via Email</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Automatic Geolocation & IP Address */}
              <div className="rounded-xl border border-teal-100 bg-gradient-to-br from-teal-50/50 to-emerald-50/30 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
                    Location & Network
                  </p>
                  {contact.countryCode && (
                    <span className="rounded bg-teal-100 px-1.5 py-0.5 text-[10px] font-bold text-teal-800">
                      {contact.countryCode}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5 text-slate-400" />
                      IP Address
                    </span>
                    <div className="flex items-center gap-1.5">
                      <code className="rounded bg-white px-2 py-0.5 text-xs font-mono text-slate-700 border border-slate-200">
                        {contact.ipAddress || "Unknown"}
                      </code>
                      {contact.ipAddress && (
                        <button
                          onClick={() => handleCopy(contact.ipAddress!, "ip")}
                          className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition"
                          title="Copy IP address"
                        >
                          {copiedField === "ip" ? (
                            <Check className="h-3 w-3 text-emerald-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start justify-between">
                    <span className="text-xs text-slate-500 flex items-center gap-1.5 pt-0.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      Location
                    </span>
                    <span className="text-sm font-semibold text-slate-800 text-right max-w-[200px]">
                      {locationDisplay || "Not detected"}
                    </span>
                  </div>

                  {contact.latitude && contact.longitude && (
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-slate-500 flex items-center gap-1.5">
                        <Compass className="h-3.5 w-3.5 text-slate-400" />
                        Coordinates
                      </span>
                      <span className="text-xs font-mono text-slate-600">
                        {contact.latitude.toFixed(4)}, {contact.longitude.toFixed(4)}
                      </span>
                    </div>
                  )}

                  {mapsUrl && (
                    <div className="pt-2">
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-teal-300 bg-white px-3 py-1.5 text-xs font-semibold text-teal-800 shadow-xs hover:bg-teal-50 transition"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>View Location on Google Maps</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Message Body */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Message Content
              </p>
              <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                  {contact.message}
                </p>
              </div>
            </div>

            {/* Status Selector & Admin Notes */}
            <div className="rounded-xl border border-slate-200/90 bg-slate-50/70 p-5 space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Update Inquiry Status
                </p>
                <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(Object.keys(STATUS_CONFIG) as ContactStatus[]).map((status) => {
                    const cfg = STATUS_CONFIG[status];
                    const isSelected = currentStatus === status;
                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() => {
                          setCurrentStatus(status);
                          handleSaveStatusAndNotes(status);
                        }}
                        className={`flex flex-col items-start rounded-xl border p-2.5 text-left transition-all ${
                          isSelected
                            ? "border-teal-600 bg-white shadow-xs ring-2 ring-teal-500/20"
                            : "border-slate-200 bg-white/60 hover:bg-white hover:border-slate-300 text-slate-600"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${cfg.bgClass}`}
                          />
                          <span
                            className={`text-xs font-bold ${
                              isSelected ? "text-slate-900" : "text-slate-700"
                            }`}
                          >
                            {cfg.label}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Admin Internal Notes */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="contact-notes"
                    className="text-xs font-bold uppercase tracking-wider text-slate-500"
                  >
                    Internal Admin Notes
                  </label>
                  {saveSuccess && (
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 animate-in fade-in">
                      <Check className="h-3.5 w-3.5" /> Saved successfully
                    </span>
                  )}
                </div>
                <textarea
                  id="contact-notes"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record follow-up actions, call summaries, or customer notes..."
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-teal-500 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20"
                />
                <div className="mt-2 flex justify-end">
                  <Button
                    type="button"
                    onClick={() => handleSaveStatusAndNotes()}
                    disabled={isUpdating}
                    className="gap-2 text-xs"
                  >
                    {isUpdating ? (
                      <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Save className="h-3.5 w-3.5" />
                    )}
                    <span>Save Notes</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between border-t border-slate-200/80 bg-slate-50/80 px-6 py-4">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 hover:underline transition"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete Inquiry</span>
            </button>

            <Button type="button" variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Contact Inquiry?"
        description={`Are you sure you want to permanently delete the inquiry from ${contact.firstName} ${contact.lastName} (${contact.email})? This action cannot be undone.`}
        confirmText="Yes, Delete Inquiry"
        tone="danger"
        isLoading={isDeleting}
      />
    </>
  );
}
