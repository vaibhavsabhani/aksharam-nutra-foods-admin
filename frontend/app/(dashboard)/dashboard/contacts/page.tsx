"use client";

import { Mail } from "lucide-react";
import { ContactList } from "@/components/contact/contact-list";

export default function ContactsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
          <Mail className="h-3.5 w-3.5" />
          <span>Customer Leads & Inquiries</span>
        </div>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Website Contact Inquiries
        </h2>
        <p className="mt-1.5 text-sm text-slate-600">
          Monitor inbound inquiries submitted through your landing page, complete with
          automatic IP address detection, geographic location, and status tracking.
        </p>
      </div>

      <section>
        <ContactList />
      </section>
    </div>
  );
}
