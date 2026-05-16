"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Users,
  BarChart3,
  Settings,
  Bell,
  Search,
  Sparkles,
  X,
  Clock,
  Moon,
  Sun,
  ArrowRight,
  User,
  LogOut
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/store/useAuth";

const searchableItems = [
  { title: "Mobile App V2", category: "Project", href: "/projects", icon: FolderKanban },
  { title: "Marketing Site", category: "Project", href: "/projects", icon: FolderKanban },
  { title: "Design landing page mockup", category: "Task", href: "/tasks", icon: CheckSquare },
  { title: "Set up PostgreSQL database schema", category: "Task", href: "/tasks", icon: CheckSquare },
  { title: "Implement JWT Authentication", category: "Task", href: "/tasks", icon: CheckSquare },
  { title: "Create Next.js frontend structure", category: "Task", href: "/tasks", icon: CheckSquare },
  { title: "Finalize tech stack", category: "Task", href: "/tasks", icon: CheckSquare },
  { title: "John Doe", category: "Team", href: "/team", icon: Users },
  { title: "Sarah Jenkins", category: "Team", href: "/team", icon: Users },
  { title: "Mike Ross", category: "Team", href: "/team", icon: Users },
  { title: "Dashboard", category: "Page", href: "/dashboard", icon: LayoutDashboard },
  { title: "Analytics", category: "Page", href: "/analytics", icon: BarChart3 },
  { title: "Settings", category: "Page", href: "/settings", icon: Settings },
  { title: "AI Assistant", category: "Page", href: "/ai-assistant", icon: Sparkles },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [globalSearch, setGlobalSearch] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New task assigned", description: "You have been assigned to 'API Integration' task.", time: "2m ago", type: "task" },
    { id: 2, title: "Deadline approaching", description: "The 'Mobile App V2' project is due in 3 days.", time: "1h ago", type: "alert" },
    { id: 3, title: "Comment on your task", description: "Sarah Jenkins commented on 'Dashboard UI'.", time: "5h ago", type: "message" },
  ]);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);


  const searchResults = globalSearch.trim()
    ? searchableItems.filter(item =>
      item.title.toLowerCase().includes(globalSearch.toLowerCase()) ||
      item.category.toLowerCase().includes(globalSearch.toLowerCase())
    )
    : [];

  // Close search dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut: press "/" to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setIsSearchFocused(false);
        searchInputRef.current?.blur();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    // Initial theme check
    const savedTheme = localStorage.getItem("theme") as "light" | "dark";
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else {
      // Default to dark as per my CSS design
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const adminNavigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Projects", href: "/projects", icon: FolderKanban },
    { name: "All Tasks", href: "/tasks", icon: CheckSquare },
    { name: "Team", href: "/team", icon: Users },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "AI Assistant", href: "/ai-assistant", icon: Sparkles },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const memberNavigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Tasks", href: "/tasks", icon: CheckSquare },
    { name: "Projects", href: "/projects", icon: FolderKanban },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const navigation = user?.role === "Admin" ? adminNavigation : memberNavigation;

  if (!isMounted) return null;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-background flex text-foreground transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col sticky top-0 h-screen overflow-hidden transition-colors duration-300">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold tracking-tight text-xl">Taskly AI</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
              >
                <item.icon className="w-4.5 h-4.5" />
                {item.name}
                {item.name === "AI Assistant" && (
                  <span className="ml-auto bg-violet-500/10 text-violet-500 text-[9px] px-2 py-0.5 rounded-full font-black border border-violet-500/20">NEW</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Snippet */}
        <div className="p-4 border-t border-border space-y-2">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-secondary cursor-pointer transition-all border border-transparent hover:border-border">
            <div className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-bold border border-white/10">
              {user?.avatar || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{user?.name}</p>
              <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">{user?.role}</p>
            </div>
          </div>
          <button 
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-background transition-colors duration-300">
        {/* Top Header */}
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-50 transition-colors duration-300">
          <div className="flex items-center flex-1 max-w-md" ref={searchRef}>
            <div className="relative w-full group">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search anything... (Press '/')"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full h-10 bg-secondary/30 border border-transparent rounded-xl pl-10 pr-10 text-sm font-medium focus:bg-background focus:border-primary/30 focus:ring-4 focus:ring-primary/5 outline-none transition-all"
              />
              {globalSearch && (
                <button
                  onClick={() => { setGlobalSearch(""); setIsSearchFocused(false); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-secondary rounded-full"
                >
                  <X className="w-3 h-3" />
                </button>
              )}

              {/* Search Results Dropdown */}
              <AnimatePresence>
                {isSearchFocused && globalSearch.trim() && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    className="absolute top-full left-0 mt-2 w-full bg-card border border-border rounded-2xl shadow-2xl z-[60] overflow-hidden"
                  >
                    {searchResults.length > 0 ? (
                      <div className="max-h-[320px] overflow-y-auto p-2">
                        <p className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          {searchResults.length} result{searchResults.length > 1 ? 's' : ''}
                        </p>
                        {searchResults.map((item, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              router.push(item.href);
                              setGlobalSearch("");
                              setIsSearchFocused(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-secondary transition-all group/item"
                          >
                            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 group-hover/item:bg-primary group-hover/item:text-primary-foreground transition-all">
                              <item.icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold truncate group-hover/item:text-primary transition-colors">{item.title}</p>
                              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{item.category}</p>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover/item:opacity-100 transition-opacity" />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center">
                        <Search className="w-6 h-6 text-muted-foreground/30 mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground font-bold">No results for "{globalSearch}"</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent hover:border-border transition-all flex items-center justify-center"
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            >
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`relative p-2.5 rounded-xl transition-all ${isNotificationsOpen ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent hover:border-border'}`}
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && !isNotificationsOpen && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-background animate-pulse"></span>
                )}
              </button>

              {/* Notification Dropdown */}
              <AnimatePresence>
                {isNotificationsOpen && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsNotificationsOpen(false)}
                      className="fixed inset-0 z-[-1]"
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-80 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-[60]"
                    >
                      <div className="p-4 border-b border-border flex items-center justify-between bg-secondary/10">
                        <h3 className="font-bold text-sm">Notifications</h3>
                        <button
                          onClick={() => setNotifications([])}
                          className="text-[10px] font-bold text-primary hover:underline"
                        >
                          Clear All
                        </button>
                      </div>
                      <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-10 text-center space-y-2">
                            <Bell className="w-8 h-8 text-muted-foreground/30 mx-auto" />
                            <p className="text-xs text-muted-foreground font-medium">All caught up!</p>
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div key={n.id} className="p-4 border-b border-border last:border-0 hover:bg-secondary/20 transition-colors cursor-pointer group">
                              <div className="flex justify-between items-start gap-2">
                                <p className="text-xs font-bold group-hover:text-primary transition-colors">{n.title}</p>
                                <span className="text-[9px] font-bold text-muted-foreground whitespace-nowrap">{n.time}</span>
                              </div>
                              <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{n.description}</p>
                              <div className="flex items-center gap-1 mt-2">
                                <Clock className="w-3 h-3 text-muted-foreground/50" />
                                <span className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-wider">{n.type}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      <div className="p-3 bg-secondary/5 text-center border-t border-border">
                        <button className="text-[11px] font-bold text-muted-foreground hover:text-foreground transition-colors">View all activity</button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto bg-background/50 transition-colors duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}
