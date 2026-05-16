import Link from "next/link";
import { ArrowRight, CheckCircle, LayoutDashboard, Zap, Shield, Users, ArrowUpRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 w-full border-b border-border/40 bg-background/80 backdrop-blur-md z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg tracking-tight">Taskly AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
            <Link href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</Link>
            <Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
              Log in
            </Link>
            <Link href="/register" className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 transition-opacity">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-6 text-center pt-20 pb-32">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 text-secondary-foreground text-sm font-medium mb-8 border border-border/50">
            <Zap className="w-4 h-4 text-accent" />
            <span>Introducing AI Productivity Assistant v2.0</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 max-w-4xl mx-auto leading-[1.1]">
            Manage tasks with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-500">intelligent precision.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Taskly AI combines powerful project management with an intelligent assistant that predicts risks, balances workloads, and keeps your team in flow.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg text-lg font-medium hover:opacity-90 transition-opacity">
              Start for free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="#demo" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-8 py-4 rounded-lg text-lg font-medium hover:bg-secondary/80 transition-colors">
              View demo
            </Link>
          </div>
        </section>

        {/* Dashboard Preview Mockup */}
        <section className="container mx-auto px-6 mb-32 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent blur-3xl -z-10" />
          <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-2 shadow-2xl overflow-hidden ring-1 ring-white/10">
            <div className="rounded-xl border border-border overflow-hidden bg-background aspect-[16/9] relative flex items-center justify-center">
              {/* Mockup Placeholder - In a real app, use an image/video */}
              <div className="text-center text-muted-foreground">
                <LayoutDashboard className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="font-medium">Dashboard Preview</p>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted By */}
        <section className="container mx-auto px-6 mb-32 text-center">
          <p className="text-sm font-medium text-muted-foreground mb-8">TRUSTED BY INNOVATIVE TEAMS WORLDWIDE</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale">
            {/* Logos would go here */}
            <div className="text-xl font-bold font-serif">Acme Corp</div>
            <div className="text-xl font-bold">GlobalTech</div>
            <div className="text-xl font-bold tracking-widest">NEXUS</div>
            <div className="text-xl font-bold italic">Stark Ind.</div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto px-6 mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Everything you need to ship faster</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Built for modern software teams that want to focus on building, not managing.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl border border-border bg-card/50 hover:bg-card transition-colors">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-6">
                <LayoutDashboard className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Intuitive Kanban</h3>
              <p className="text-muted-foreground leading-relaxed">
                Drag and drop tasks effortlessly. Customize columns, set WIP limits, and visualize your entire workflow at a glance.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="p-8 rounded-2xl border border-border bg-card/50 hover:bg-card transition-colors">
              <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-violet-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Productivity Assistant</h3>
              <p className="text-muted-foreground leading-relaxed">
                Automatically analyze tasks, predict overdue risks, and generate smart daily summaries to keep the team aligned.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="p-8 rounded-2xl border border-border bg-card/50 hover:bg-card transition-colors">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Seamless Collaboration</h3>
              <p className="text-muted-foreground leading-relaxed">
                Real-time updates, integrated team chat, and role-based access control. Built for remote and hybrid teams.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/20 py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-semibold tracking-tight">Taskly AI</span>
          </div>
          <div className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Taskly AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
