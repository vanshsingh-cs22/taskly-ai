"use client";

import { useState } from "react";
import { User, Mail, Globe, Save } from "lucide-react";
import { useAuth } from "@/store/useAuth";

export default function ProfilePage() {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground mt-1">View and manage your personal information.</p>
      </div>

      <div className="bg-card border border-border rounded-3xl p-8 shadow-xl">
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row items-center gap-8 border-b border-border pb-8">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-zinc-950 text-white flex items-center justify-center text-2xl font-bold border-4 border-primary/20 transition-all group-hover:border-primary/40">
                {user?.avatar || "U"}
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg border-2 border-card">
                 <User className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-xl font-bold">Profile Picture</h2>
              <p className="text-sm text-muted-foreground mt-1 mb-4">PNG, JPG or GIF. Max 5MB.</p>
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-xs font-bold hover:bg-secondary/80 transition-colors">Upload</button>
                <button className="px-4 py-2 text-red-500 rounded-lg text-xs font-bold hover:bg-red-500/10 transition-colors">Remove</button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" defaultValue={user?.name || ""} className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-background outline-none focus:ring-2 focus:ring-primary/20 font-medium" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="email" defaultValue={user?.email || ""} disabled className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-background outline-none opacity-70 cursor-not-allowed font-medium" />
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Bio</label>
              <textarea placeholder="Tell us about yourself..." className="w-full h-28 p-4 rounded-xl border border-border bg-background outline-none focus:ring-2 focus:ring-primary/20 resize-none font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Role</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" defaultValue={user?.role || "Member"} disabled className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-background outline-none opacity-70 cursor-not-allowed font-medium" />
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border flex justify-end">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20 disabled:opacity-70"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
