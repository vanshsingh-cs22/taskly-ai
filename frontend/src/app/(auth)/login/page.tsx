"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Loader2, Shield, User, ArrowRight, Lock, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/store/useAuth";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [error, setError] = useState("");
  const [loginType, setLoginType] = useState<"Admin" | "Member">("Admin");
  const [adminStep, setAdminStep] = useState<1 | 2>(1);
  const login = useAuth((state) => state.login);

  const handleAdminStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // For mock purposes, we verify the password against the backend
      const res = await axios.post("http://localhost:8081/api/auth/login", { email, password });
      
      // If backend says okay, we move to step 2 for Admin
      if (res.data.user.role !== "Admin") {
        setError("This account does not have Admin privileges.");
        setLoading(false);
        return;
      }
      
      setAdminStep(2);
    } catch (err: any) {
      setError("Incorrect password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (adminCode !== "admin123") {
      setError("Invalid admin verification code.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:8081/api/auth/login", { email, password });
      login(res.data.user, res.data.token);
      router.push("/dashboard");
    } catch (err: any) {
      setError("Login failed. Please restart your session.");
    } finally {
      setLoading(false);
    }
  };

  const handleMemberLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:8081/api/auth/login", { email, password });
      
      let user = res.data.user;
      
      // Temporary overrides for specific users to ensure they get the correct role without needing a backend restart
      const emailLower = email.toLowerCase().trim();
      if (emailLower === "vansh.singh.int@ethara.ai" || emailLower === "mohitsharma@taskly.ai") {
        user = {
          id: emailLower === "vansh.singh.int@ethara.ai" ? '5' : '6',
          name: emailLower === "vansh.singh.int@ethara.ai" ? "Vansh Singh" : "Mohit Sharma",
          email: emailLower,
          role: "Member",
          status: "Active",
          tasks: 3,
          lastActive: "Now",
          avatar: emailLower === "vansh.singh.int@ethara.ai" ? "VS" : "MS",
          productivity: 98,
          joinedDate: "2026-01-01"
        };
      }

      if (user.role !== "Member") {
        setError("Please use the Admin login portal for this account.");
        setLoading(false);
        return;
      }

      login(user, res.data.token);
      router.push("/dashboard");
    } catch (err: any) {
      setError("Incorrect member password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4"
        >
          <Lock className="w-6 h-6" />
        </motion.div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Secure Portal</h1>
        <p className="text-muted-foreground mt-2">Select your access level to continue</p>
      </div>

      <div className="flex p-1 bg-secondary rounded-xl gap-1">
        <button
          onClick={() => {
            setLoginType("Admin");
            setAdminStep(1);
            setError("");
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${
            loginType === "Admin"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Shield className="w-4 h-4" /> Admin
        </button>
        <button
          onClick={() => {
            setLoginType("Member");
            setError("");
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${
            loginType === "Member"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <User className="w-4 h-4" /> Member
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 shadow-xl">
        <AnimatePresence mode="wait">
          {loginType === "Admin" ? (
            <motion.div
              key="admin-flow"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
            >
              {adminStep === 1 ? (
                <form onSubmit={handleAdminStep1} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-foreground ml-1">Admin Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@taskly.ai"
                      className="w-full h-11 bg-secondary/50 border-none rounded-xl px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-foreground ml-1">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-11 bg-secondary/50 border-none rounded-xl px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all pr-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs font-bold text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20"
                    >
                      {error}
                    </motion.p>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 bg-primary text-primary-foreground rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Continue <ArrowRight className="w-4 h-4" /></>}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleAdminStep2} className="space-y-4">
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold">Password Verified</h3>
                    <p className="text-xs text-muted-foreground">Please enter your secondary admin code</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-foreground ml-1">Admin Code</label>
                    <input
                      type="password"
                      value={adminCode}
                      onChange={(e) => setAdminCode(e.target.value)}
                      placeholder="••••••••"
                      autoFocus
                      className="w-full h-11 bg-secondary/50 border-none rounded-xl px-4 text-sm tracking-widest focus:ring-2 focus:ring-primary/20 transition-all"
                      required
                    />
                  </div>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs font-bold text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20"
                    >
                      {error}
                    </motion.p>
                  )}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setAdminStep(1)}
                      className="flex-1 h-11 bg-secondary text-foreground rounded-xl font-bold text-sm hover:bg-secondary/80 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-[2] h-11 bg-primary text-primary-foreground rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify & Login"}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="member-flow"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <form onSubmit={handleMemberLogin} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground ml-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="member@taskly.ai"
                    className="w-full h-11 bg-secondary/50 border-none rounded-xl px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground ml-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-11 bg-secondary/50 border-none rounded-xl px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm font-bold text-red-500"
                  >
                    {error}
                  </motion.p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-primary text-primary-foreground rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-bold text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}

