"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  MapPin,
  Globe,
  Mail,
  Calendar,
  Clock,
  Trash2,
  Eye,
  Send,
  LoaderCircle,
  Inbox,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ContactDetailModal } from "./contact-detail-modal";
import {
  Contact,
  ContactStatus,
  useGetContactsQuery,
  useGetContactStatsQuery,
  useUpdateContactStatusMutation,
  useDeleteContactMutation,
} from "@/lib/api";

const STATUS_CONFIG: Record<
  ContactStatus,
  { label: string; badgeClass: string; dotClass: string }
> = {
  PENDING: {
    label: "Pending",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
    dotClass: "bg-amber-500",
  },
  CONTACTED: {
    label: "Contacted",
    badgeClass: "bg-blue-50 text-blue-800 border-blue-200",
    dotClass: "bg-blue-500",
  },
  RESOLVED: {
    label: "Resolved",
    badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
    dotClass: "bg-emerald-500",
  },
  ARCHIVED: {
    label: "Archived",
    badgeClass: "bg-slate-50 text-slate-700 border-slate-200",
    dotClass: "bg-slate-400",
  },
};

export function ContactList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ContactStatus | "ALL">("ALL");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null);
  const [actionAlert, setActionAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const {
    data: contactsData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetContactsQuery({
    search: searchTerm,
    status: statusFilter,
  });

  const { data: stats } = useGetContactStatsQuery();
  const [updateStatus] = useUpdateContactStatusMutation();
  const [deleteContact, { isLoading: isDeleting }] = useDeleteContactMutation();

  const handleQuickStatusChange = async (
    contact: Contact,
    newStatus: ContactStatus
  ) => {
    try {
      await updateStatus({
        id: contact.id,
        status: newStatus,
      }).unwrap();
      setActionAlert({
        type: "success",
        message: `Updated status for ${contact.firstName} ${contact.lastName} to ${STATUS_CONFIG[newStatus].label}.`,
      });
      setTimeout(() => setActionAlert(null), 4000);
    } catch {
      setActionAlert({
        type: "error",
        message: "Failed to update status. Please try again.",
      });
      setTimeout(() => setActionAlert(null), 4000);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteContact(deleteTarget.id).unwrap();
      const name = `${deleteTarget.firstName} ${deleteTarget.lastName}`;
      setDeleteTarget(null);
      setActionAlert({
        type: "success",
        message: `Inquiry from ${name} was permanently deleted.`,
      });
      setTimeout(() => setActionAlert(null), 4000);
    } catch {
      setActionAlert({
        type: "error",
        message: "Failed to delete inquiry. Please try again.",
      });
      setTimeout(() => setActionAlert(null), 4000);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  const contacts = contactsData?.contacts || [];

  return (
    <div className="space-y-6">
      {/* ---------------- 1. TOP STATS BAR ---------------- */}
      {stats && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <button
            type="button"
            onClick={() => setStatusFilter("ALL")}
            className={`rounded-2xl border p-4 text-left transition-all ${
              statusFilter === "ALL"
                ? "border-teal-600 bg-teal-50/50 shadow-xs ring-2 ring-teal-500/20"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Inquiries
            </p>
            <p className="mt-1 text-2xl font-black text-slate-900">{stats.total}</p>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("PENDING")}
            className={`rounded-2xl border p-4 text-left transition-all ${
              statusFilter === "PENDING"
                ? "border-amber-600 bg-amber-50/60 shadow-xs ring-2 ring-amber-500/20"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Pending
              </p>
            </div>
            <p className="mt-1 text-2xl font-black text-amber-900">{stats.pending}</p>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("CONTACTED")}
            className={`rounded-2xl border p-4 text-left transition-all ${
              statusFilter === "CONTACTED"
                ? "border-blue-600 bg-blue-50/60 shadow-xs ring-2 ring-blue-500/20"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              <p className="text-xs font-bold uppercase tracking-wider text-blue-700">
                Contacted
              </p>
            </div>
            <p className="mt-1 text-2xl font-black text-blue-900">
              {stats.contacted}
            </p>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("RESOLVED")}
            className={`rounded-2xl border p-4 text-left transition-all ${
              statusFilter === "RESOLVED"
                ? "border-emerald-600 bg-emerald-50/60 shadow-xs ring-2 ring-emerald-500/20"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Resolved
              </p>
            </div>
            <p className="mt-1 text-2xl font-black text-emerald-900">
              {stats.resolved}
            </p>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("ARCHIVED")}
            className={`rounded-2xl border p-4 text-left transition-all ${
              statusFilter === "ARCHIVED"
                ? "border-slate-600 bg-slate-100 shadow-xs ring-2 ring-slate-500/20"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-slate-400" />
              <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Archived
              </p>
            </div>
            <p className="mt-1 text-2xl font-black text-slate-700">
              {stats.archived}
            </p>
          </button>
        </div>
      )}

      {/* ---------------- 2. SEARCH & FILTER CONTROLS ---------------- */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, message, city or IP..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 shadow-xs focus:border-teal-500 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="gap-2 text-xs"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isFetching ? "animate-spin text-teal-600" : ""}`}
            />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* ---------------- 3. NOTIFICATION ALERT ---------------- */}
      {actionAlert && (
        <div
          className={`flex items-center gap-2.5 rounded-xl border p-3.5 text-sm animate-in fade-in duration-200 ${
            actionAlert.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {actionAlert.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          )}
          <span>{actionAlert.message}</span>
        </div>
      )}

      {/* ---------------- 4. MAIN DATA LIST ---------------- */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 text-slate-400 shadow-xs">
          <LoaderCircle className="h-8 w-8 animate-spin text-teal-600" />
          <p className="mt-3 text-sm font-medium">Loading contact inquiries...</p>
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700 shadow-xs">
          <AlertCircle className="mx-auto h-8 w-8 text-red-500 mb-2" />
          <p className="font-semibold">Unable to load inquiries</p>
          <p className="text-xs text-red-600 mt-1">
            Please check your network or try refreshing the page.
          </p>
        </div>
      ) : contacts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center shadow-xs">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-50 text-teal-700 mb-3">
            <Inbox className="h-6 w-6" />
          </div>
          <h4 className="text-base font-bold text-slate-800">
            {searchTerm || statusFilter !== "ALL"
              ? "No matching inquiries found"
              : "No customer inquiries yet"}
          </h4>
          <p className="mt-1 text-xs text-slate-500 max-w-sm">
            {searchTerm || statusFilter !== "ALL"
              ? "Try resetting your search query or switching the status filter tab above."
              : "When visitors submit the form on your landing page, their messages, IP address, and location will appear right here."}
          </p>
          {(searchTerm || statusFilter !== "ALL") && (
            <Button
              variant="outline"
              size="sm"
              className="mt-4 text-xs"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("ALL");
              }}
            >
              Reset Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="border-b border-slate-200 bg-slate-50/75 text-xs font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th scope="col" className="px-6 py-3.5">
                    Sender
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Location & IP
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Message Preview
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {contacts.map((contact) => {
                  const locationText = [contact.city, contact.country]
                    .filter(Boolean)
                    .join(", ");

                  return (
                    <tr
                      key={contact.id}
                      className="group transition-colors hover:bg-slate-50/60"
                    >
                      {/* Sender */}
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900 group-hover:text-teal-900">
                          {contact.firstName} {contact.lastName}
                        </div>
                        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                          <Mail className="h-3 w-3 text-slate-400" />
                          <a
                            href={`mailto:${contact.email}`}
                            className="hover:text-teal-700 hover:underline"
                          >
                            {contact.email}
                          </a>
                        </div>
                      </td>

                      {/* Location & IP */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-800">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-teal-600" />
                          <span>{locationText || "Not detected"}</span>
                          {contact.countryCode && (
                            <span className="rounded bg-teal-50 px-1.5 py-0.5 text-[10px] font-bold text-teal-700 border border-teal-200/60">
                              {contact.countryCode}
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-[11px] font-mono text-slate-400">
                          <Globe className="h-3 w-3" />
                          <span>{contact.ipAddress || "—"}</span>
                        </div>
                      </td>

                      {/* Message Preview */}
                      <td className="px-6 py-4 max-w-xs">
                        <p
                          className="line-clamp-2 text-xs text-slate-600 cursor-pointer hover:text-slate-900"
                          onClick={() => setSelectedContact(contact)}
                          title="Click to view full message"
                        >
                          {contact.message}
                        </p>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                        <div className="font-medium text-slate-700">
                          {formatDate(contact.createdAt)}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {formatTime(contact.createdAt)}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative inline-block">
                          <select
                            value={contact.status}
                            onChange={(e) =>
                              handleQuickStatusChange(
                                contact,
                                e.target.value as ContactStatus
                              )
                            }
                            className={`cursor-pointer rounded-lg border py-1 pl-2.5 pr-7 text-xs font-bold transition focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 appearance-none ${
                              STATUS_CONFIG[contact.status].badgeClass
                            }`}
                          >
                            <option value="PENDING">Pending</option>
                            <option value="CONTACTED">Contacted</option>
                            <option value="RESOLVED">Resolved</option>
                            <option value="ARCHIVED">Archived</option>
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 opacity-60" />
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setSelectedContact(contact)}
                            className="rounded-lg p-2 text-slate-400 hover:bg-teal-50 hover:text-teal-700 transition"
                            title="View full details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          <a
                            href={`mailto:${contact.email}?subject=Regarding your message to Aksharam Nutra Foods`}
                            className="rounded-lg p-2 text-slate-400 hover:bg-teal-50 hover:text-teal-700 transition"
                            title="Reply via email"
                          >
                            <Send className="h-4 w-4" />
                          </a>

                          <button
                            type="button"
                            onClick={() => setDeleteTarget(contact)}
                            className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                            title="Delete inquiry"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile / Tablet Cards View */}
          <div className="block lg:hidden divide-y divide-slate-100">
            {contacts.map((contact) => {
              const locationText = [contact.city, contact.country]
                .filter(Boolean)
                .join(", ");

              return (
                <div key={contact.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900">
                        {contact.firstName} {contact.lastName}
                      </h4>
                      <a
                        href={`mailto:${contact.email}`}
                        className="text-xs text-teal-700 hover:underline flex items-center gap-1 mt-0.5"
                      >
                        <Mail className="h-3 w-3" />
                        {contact.email}
                      </a>
                    </div>

                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                        STATUS_CONFIG[contact.status].badgeClass
                      }`}
                    >
                      {STATUS_CONFIG[contact.status].label}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <MapPin className="h-3.5 w-3.5 text-teal-600" />
                      {locationText || "Unknown location"}
                    </span>
                    <span>•</span>
                    <span className="font-mono text-[11px] text-slate-400">
                      {contact.ipAddress || "No IP"}
                    </span>
                    <span>•</span>
                    <span>{formatDate(contact.createdAt)}</span>
                  </div>

                  <p
                    className="line-clamp-2 text-xs text-slate-600 bg-slate-50 rounded-lg p-2.5 border border-slate-100 cursor-pointer"
                    onClick={() => setSelectedContact(contact)}
                  >
                    {contact.message}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <div className="relative">
                      <select
                        value={contact.status}
                        onChange={(e) =>
                          handleQuickStatusChange(
                            contact,
                            e.target.value as ContactStatus
                          )
                        }
                        className={`cursor-pointer rounded-lg border py-1 pl-2 pr-6 text-xs font-semibold appearance-none ${
                          STATUS_CONFIG[contact.status].badgeClass
                        }`}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="CONTACTED">Contacted</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="ARCHIVED">Archived</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 opacity-60" />
                    </div>

                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedContact(contact)}
                        className="text-xs h-8 px-2.5 gap-1"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDeleteTarget(contact)}
                        className="text-xs h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ---------------- 5. DETAIL MODAL ---------------- */}
      <ContactDetailModal
        contact={selectedContact}
        onClose={() => setSelectedContact(null)}
        onDeleted={() => {
          setSelectedContact(null);
          refetch();
        }}
      />

      {/* ---------------- 6. DELETE CONFIRMATION DIALOG ---------------- */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Contact Inquiry?"
        description={
          deleteTarget
            ? `Are you sure you want to permanently delete the inquiry from ${deleteTarget.firstName} ${deleteTarget.lastName}? This action cannot be reversed.`
            : ""
        }
        confirmText="Yes, Delete Inquiry"
        tone="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
