"use client";

import { Sparkles, BrainCircuit, TrendingUp, AlertTriangle, CheckCircle2, MessageSquareText, Zap } from "lucide-react";
import { useState } from "react";

export default function AIAssistantPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const insights = [
    {
      title: "Risk Prediction",
      description: "3 tasks in 'Database Migration' project are at risk of missing Friday's deadline based on current velocity.",
      icon: AlertTriangle,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      title: "Workload Balance",
      description: "Sarah Jenkins is currently over-capacity (120%). AI suggests reassigning 2 low-priority tasks to Mike Ross.",
      icon: BrainCircuit,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Priority Recommendation",
      description: "Next best task: 'Fix authentication edge cases' (High impact, dependent on 2 other developers).",
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    }
  ];

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            AI Productivity Assistant <Sparkles className="w-6 h-6 text-violet-500" />
          </h1>
          <p className="text-muted-foreground mt-1">Intelligent insights powered by Taskly AI Brain.</p>
        </div>
        <button 
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="flex items-center justify-center gap-2 bg-violet-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-violet-700 transition-all shadow-lg shadow-violet-500/20 disabled:opacity-70"
        >
          {isAnalyzing ? (
            <Zap className="w-5 h-5 animate-pulse" />
          ) : (
            <Sparkles className="w-5 h-5" />
          )}
          {isAnalyzing ? "Analyzing Workspace..." : "Run Daily Analysis"}
        </button>
      </div>

      {/* Main Analysis Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Sparkles className="w-32 h-32" />
            </div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MessageSquareText className="w-5 h-5 text-violet-500" />
              Smart Daily Summary
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Good morning, John. Your team is currently at <span className="text-foreground font-medium">84% productivity</span>. 
                Yesterday, 12 tasks were completed, exceeding the daily average by 15%.
              </p>
              <p>
                The "Mobile App V2" project is moving significantly faster than projected. However, the "Cloud Infrastructure" 
                track is facing potential bottlenecks in the security audit phase.
              </p>
              <p className="bg-secondary/50 p-4 rounded-lg border-l-4 border-violet-500 italic">
                "Focus on unblocking Sarah today. Her tasks in the review column are critical for the upcoming sprint release."
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {insights.slice(0, 2).map((insight, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-shadow">
                  <div className={`w-10 h-10 ${insight.bg} rounded-lg flex items-center justify-center mb-4`}>
                    <insight.icon className={`w-6 h-6 ${insight.color}`} />
                  </div>
                  <h3 className="font-semibold mb-2">{insight.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {insight.description}
                  </p>
                </div>
             ))}
          </div>
        </div>

        <div className="space-y-6">
          {/* Productivity Score */}
          <div className="bg-card border border-border rounded-2xl p-6 text-center">
            <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Productivity Score</h3>
            <div className="relative inline-flex items-center justify-center">
               <svg className="w-32 h-32 transform -rotate-90">
                 <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-secondary" />
                 <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={364.4} strokeDashoffset={364.4 * 0.15} className="text-violet-500" />
               </svg>
               <span className="absolute text-3xl font-bold">85</span>
            </div>
            <p className="mt-4 text-sm font-medium text-emerald-500">+5% from last week</p>
          </div>

          {/* Smart Task List */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              AI Recommended Tasks
            </h3>
            <div className="space-y-4">
              {[
                "Approve Security Audit",
                "Review Sarah's PR #42",
                "Sync with Design Team"
              ].map((task, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors cursor-pointer border border-transparent hover:border-border">
                  <div className="w-2 h-2 rounded-full bg-violet-500" />
                  <span className="text-sm font-medium">{task}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
