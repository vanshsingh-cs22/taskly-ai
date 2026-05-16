"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  Bell, 
  Shield, 
  Moon, 
  Sun, 
  Monitor, 
  LogOut, 
  Mail, 
  Lock,
  Globe,
  Palette,
  CreditCard,
  Save,
  Trash2,
  Check
} from "lucide-react";
import { useAuth } from "@/store/useAuth";

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setCurrentTheme(savedTheme);
  }, []);

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "billing", label: "Billing", icon: CreditCard },
  ];

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  const updateTheme = (newTheme: string) => {
    setCurrentTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences and workspace configuration.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-64 shrink-0">
          <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <div className="bg-card border border-border rounded-3xl p-8 shadow-xl relative transition-colors duration-300">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {activeTab === "profile" && (
                <div className="space-y-8">
                  <div className="flex flex-col md:flex-row items-center gap-8 border-b border-border pb-8">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-full bg-zinc-950 text-white flex items-center justify-center text-2xl font-bold border-4 border-primary/20 transition-all group-hover:border-primary/40 overflow-hidden">
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
                      <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Location</label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input type="text" placeholder="San Francisco, CA" className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-background outline-none focus:ring-2 focus:ring-primary/20 font-medium" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold mb-6">Email Notifications</h2>
                  {[
                    { title: "Task Assignments", desc: "Notify when I am assigned to a new task." },
                    { title: "Project Updates", desc: "Notify when there are changes in projects I follow." },
                    { title: "Mentions", desc: "Notify when someone mentions me in comments." },
                    { title: "AI Productivity Reports", desc: "Receive weekly AI-generated team insights." }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border border-border/50 rounded-2xl hover:bg-secondary/20 transition-colors">
                       <div className="space-y-1">
                          <p className="text-sm font-bold">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                       </div>
                       <button className="w-12 h-6 bg-primary rounded-full relative transition-colors shadow-inner">
                          <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                       </button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "security" && (
                <div className="space-y-8">
                   <div className="space-y-4">
                      <h2 className="text-xl font-bold">Change Password</h2>
                      <div className="space-y-4 max-w-md">
                         <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Current Password</label>
                            <input type="password" placeholder="••••••••" className="w-full h-11 px-4 rounded-xl border border-border bg-background outline-none focus:ring-2 focus:ring-primary/20" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">New Password</label>
                            <input type="password" placeholder="••••••••" className="w-full h-11 px-4 rounded-xl border border-border bg-background outline-none focus:ring-2 focus:ring-primary/20" />
                         </div>
                      </div>
                      <button className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:opacity-90 transition-all">Update Password</button>
                   </div>

                   <div className="pt-8 border-t border-border space-y-4">
                      <h2 className="text-xl font-bold text-red-500">Danger Zone</h2>
                      <p className="text-sm text-muted-foreground">Once you delete your account, there is no going back. Please be certain.</p>
                      <button className="flex items-center gap-2 px-6 py-2.5 border border-red-500/20 text-red-500 rounded-xl text-sm font-bold hover:bg-red-500/5 transition-all">
                        <Trash2 className="w-4 h-4" /> Delete Account
                      </button>
                   </div>
                </div>
              )}

              {activeTab === "appearance" && (
                <div className="space-y-8">
                  <h2 className="text-xl font-bold">Theme Preferences</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { id: "light", label: "Light", icon: Sun, desc: "Clean and airy" },
                      { id: "dark", label: "Dark", icon: Moon, desc: "Sleek and professional" },
                      { id: "system", label: "System", icon: Monitor, desc: "Match your OS" }
                    ].map((theme) => (
                      <button 
                        key={theme.id}
                        onClick={() => updateTheme(theme.id)}
                        className={`relative p-6 rounded-2xl border flex flex-col items-center gap-3 transition-all ${currentTheme === theme.id ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-border hover:border-primary/50 bg-card'}`}
                      >
                         {currentTheme === theme.id && (
                           <div className="absolute top-2 right-2 bg-primary text-primary-foreground p-1 rounded-full">
                              <Check className="w-3 h-3" />
                           </div>
                         )}
                         <theme.icon className={`w-8 h-8 ${currentTheme === theme.id ? 'text-primary' : 'text-muted-foreground'}`} />
                         <div className="text-center">
                            <p className="text-sm font-bold">{theme.label}</p>
                            <p className="text-[10px] text-muted-foreground font-medium">{theme.desc}</p>
                         </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer Actions */}
              <div className="pt-8 border-t border-border flex items-center justify-between">
                <button 
                  onClick={() => router.push("/login")}
                  className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-red-500 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
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
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
