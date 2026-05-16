"use client";

import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Users, Calendar, ArrowUpRight, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';

const productivityData = [
  { name: 'Week 1', completed: 45, predicted: 40 },
  { name: 'Week 2', completed: 52, predicted: 48 },
  { name: 'Week 3', completed: 48, predicted: 55 },
  { name: 'Week 4', completed: 61, predicted: 58 },
];

const teamData = [
  { name: 'Sarah', tasks: 42, color: '#8b5cf6' },
  { name: 'John', tasks: 38, color: '#3b82f6' },
  { name: 'Mike', tasks: 32, color: '#10b981' },
  { name: 'Alex', tasks: 15, color: '#f59e0b' },
];

const statusData = [
  { name: 'Completed', value: 82, color: '#10b981' },
  { name: 'In Progress', value: 35, color: '#3b82f6' },
  { name: 'Review', value: 12, color: '#f59e0b' },
  { name: 'Overdue', value: 7, color: '#ef4444' },
];

export default function AnalyticsPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance Analytics</h1>
          <p className="text-muted-foreground mt-1">Deep dive into team productivity and task trends.</p>
        </div>
      </div>

      {/* High Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
           { label: "Completion Rate", value: "94.2%", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
           { label: "Avg. Task Time", value: "2.4 Days", icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10" },
           { label: "Team Velocity", value: "58.0", icon: TrendingUp, color: "text-violet-500", bg: "bg-violet-500/10" },
           { label: "Overdue Risk", value: "Low", icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/10" },
        ].map((stat, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
             <div className="flex items-center gap-3 mb-4">
                <div className={`w-8 h-8 ${stat.bg} rounded-lg flex items-center justify-center`}>
                   <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest text-[10px]">{stat.label}</span>
             </div>
             <p className="text-2xl font-black">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Productivity Trends */}
        <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Productivity Trends</h3>
          <div className="h-[300px] w-full relative">
            {isMounted && (
              <ResponsiveContainer width="99%" height="100%" minWidth={0}>
                <LineChart data={productivityData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))', fontSize: '10px', fontWeight: 'bold' }}
                  />
                  <Line type="monotone" dataKey="completed" stroke="#8b5cf6" strokeWidth={4} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                  <Line type="monotone" dataKey="predicted" stroke="hsl(var(--muted-foreground))" strokeWidth={2} strokeDasharray="5 5" dot={false} opacity={0.5} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Task Distribution */}
        <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Task Distribution</h3>
          <div className="h-[300px] w-full flex items-center justify-center relative">
            {isMounted && (
              <>
                <ResponsiveContainer width="99%" height="100%" minWidth={0}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3 shrink-0 ml-4">
                   {statusData.map((item, i) => (
                     <div key={i} className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-[11px] font-bold">{item.name}</span>
                        <span className="text-[11px] text-muted-foreground font-black ml-auto">{item.value}%</span>
                     </div>
                   ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Team Contribution */}
        <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-8 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Individual Contribution</h3>
          <div className="h-[300px] w-full relative">
            {isMounted && (
              <ResponsiveContainer width="99%" height="100%" minWidth={0}>
                <BarChart data={teamData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip 
                    cursor={{ fill: 'hsl(var(--secondary))', opacity: 0.4 }}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))', fontSize: '10px', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="tasks" radius={[6, 6, 0, 0]} barSize={40}>
                    {teamData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
