"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function PasswordInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const [visible, setVisible] = useState(false);
  return <div className="relative"><Input {...props} type={visible ? "text" : "password"} className="pr-12" /><Button type="button" variant="ghost" size="sm" aria-label={visible ? "Hide password" : "Show password"} onClick={() => setVisible((value) => !value)} className="absolute right-1 top-1 h-10 w-10 px-0">{visible ? <EyeOff size={18} /> : <Eye size={18} />}</Button></div>;
}