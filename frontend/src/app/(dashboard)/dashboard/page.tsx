"use client";

import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus,
  Palette,
  Check,
  X,
  Mail,
  FolderKanban,
  History,
  Search,
  Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import axios from "axios";
import { useAuth } from "@/store/useAuth";
import { MemberDashboard } from "@/components/dashboard/MemberDashboard";

const data7Days = [
  { date: 'May 10', completed: 4, active: 10 },
  { date: 'May 11', completed: 7, active: 12 },
  { date: 'May 12', completed: 5, active: 15 },
  { date: 'May 13', completed: 12, active: 10 },
  { date: 'May 14', completed: 15, active: 8 },
  { date: 'May 15', completed: 10, active: 5 },
  { date: 'May 16', completed: 18, active: 4 },
];

const data30Days = [
  { date: 'Apr 17', completed: 2, active: 5 },
  { date: 'Apr 24', completed: 15, active: 20 },
  { date: 'May 01', completed: 8, active: 15 },
  { date: 'May 08', completed: 25, active: 18 },
  { date: 'May 15', completed: 40, active: 25 },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [selectedColor, setSelectedColor] = useState("blue");
  const [isColorMenuOpen, setIsColorMenuOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [timeRange, setTimeRange] = useState("7");
  
  // New Project Form State
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    priority: "Medium",
    deadline: ""
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const colors = [
    { id: "blue", hex: "#3b82f6", label: "Ocean Blue" },
    { id: "violet", hex: "#8b5cf6", label: "Deep Violet" },
    { id: "emerald", hex: "#10b981", label: "Forest Emerald" },
    { id: "rose", hex: "#f43f5e", label: "Sunset Rose" },
  ];

  const stats = [
    { label: "Active Projects", value: "12", change: "+2", trend: "up", icon: TrendingUp },
    { label: "Team Workload", value: "84%", change: "-5%", trend: "down", icon: Users },
    { label: "Tasks Completed", value: "124", change: "+12", trend: "up", icon: CheckCircle2 },
    { label: "In Progress", value: "8", change: "+1", trend: "up", icon: Clock },
  ];

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8081/api/projects", {
        ...newProject,
        status: "Planning"
      });
      setIsProjectModalOpen(false);
      setNewProject({ name: "", description: "", priority: "Medium", deadline: "" });
      alert("Project created successfully!");
    } catch (err) {
      console.error("Failed to create project", err);
    }
  };

  const recentActivity = [
    { user: "Sarah J.", action: "assigned 4 tasks to", target: "Frontend", time: "2m ago" },
    { user: "Mike R.", action: "completed", target: "Database Schema", time: "12m ago" },
    { user: "AI Assistant", action: "generated", target: "Weekly Report", time: "1h ago" },
    { user: "System", action: "back-up", target: "Production DB", time: "3h ago" },
    { user: "John D.", action: "created", target: "Marketing Site", time: "5h ago" },
    { user: "Alex W.", action: "updated", target: "User Profile", time: "6h ago" },
    { user: "Sarah J.", action: "commented on", target: "Login Logic", time: "8h ago" },
    { user: "Mike R.", action: "moved", target: "Navbar Design", time: "10h ago" },
  ];

  const filteredActivity = recentActivity.filter(activity => 
    activity.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
    activity.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.action.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (user?.role === "Member") {
    return <MemberDashboard />;
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
           <p className="text-muted-foreground mt-1">Overview of your team's performance and activity.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative">
              <button 
                onClick={() => setIsColorMenuOpen(!isColorMenuOpen)}
                className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-xl font-bold text-sm hover:bg-secondary transition-all shadow-sm group"
              >
                <Palette className={`w-4 h-4 transition-colors ${selectedColor === 'blue' ? 'text-blue-500' : selectedColor === 'violet' ? 'text-violet-500' : selectedColor === 'emerald' ? 'text-emerald-500' : 'text-rose-500'}`} />
                Theme Color
              </button>
              <AnimatePresence>
                {isColorMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsColorMenuOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-2xl shadow-2xl z-20 overflow-hidden p-2"
                    >
                      {colors.map((color) => (
                        <button
                          key={color.id}
                          onClick={() => {
                            setSelectedColor(color.id);
                            setIsColorMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all ${selectedColor === color.id ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-secondary/50'}`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color.hex }} />
                            {color.label}
                          </div>
                          {selectedColor === color.id && <Check className="w-3 h-3" />}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
           </div>
           <button 
             onClick={() => setIsProjectModalOpen(true)}
             className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20"
           >
             <Plus className="w-4 h-4" /> New Project
           </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label}
            className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                <stat.icon className="w-5 h-5" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                {stat.change}
                {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              </div>
            </div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest text-[10px] mb-1">{stat.label}</p>
            <p className="text-3xl font-black">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold">Team Productivity</h3>
              <p className="text-sm text-muted-foreground">Historical view of task completion.</p>
            </div>
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-secondary/50 border-none rounded-xl px-4 py-2 text-xs font-bold outline-none cursor-pointer hover:bg-secondary transition-colors"
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days (Beta)</option>
            </select>
          </div>
          
          <div className="h-[300px] w-full relative">
            {isMounted && (
              <ResponsiveContainer width="99%" height="100%" minWidth={0}>
                <AreaChart data={timeRange === "7" ? data7Days : data30Days}>
                  <defs>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={selectedColor === 'blue' ? "#3b82f6" : selectedColor === 'violet' ? "#8b5cf6" : selectedColor === 'emerald' ? "#10b981" : "#f43f5e"} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={selectedColor === 'blue' ? "#3b82f6" : selectedColor === 'violet' ? "#8b5cf6" : selectedColor === 'emerald' ? "#10b981" : "#f43f5e"} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#888' }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#888' }} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#18181b', 
                      border: '1px solid #27272a', 
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="completed" 
                    stroke={selectedColor === 'blue' ? "#3b82f6" : selectedColor === 'violet' ? "#8b5cf6" : selectedColor === 'emerald' ? "#10b981" : "#f43f5e"} 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorCompleted)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-4">
             <h3 className="text-lg font-bold">Recent Activity</h3>
          </div>
          <div className="relative mb-6">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
             <input 
               type="text" 
               placeholder="Search activity..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full h-10 pl-10 pr-10 rounded-xl border border-border bg-background outline-none focus:ring-2 focus:ring-primary/20 text-xs font-bold transition-all"
             />
             {searchQuery && (
               <button 
                 onClick={() => setSearchQuery("")}
                 className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-secondary rounded-full"
               >
                 <X className="w-3 h-3" />
               </button>
             )}
          </div>
          <div className="space-y-6">
            {(searchQuery ? filteredActivity : recentActivity).slice(0, 5).map((item, i) => (
              <div key={i} className="flex gap-4 items-start group">
                <div className="w-8 h-8 rounded-full bg-secondary flex-shrink-0 flex items-center justify-center text-[10px] font-bold border border-border group-hover:border-primary/30 transition-colors">
                  {item.user.substring(0, 2)}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-xs leading-snug">
                    <span className="font-bold">{item.user}</span> {item.action} <span className="font-bold text-primary">{item.target}</span>
                  </p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{item.time}</p>
                </div>
              </div>
            ))}
            {(searchQuery && filteredActivity.length === 0) && (
              <div className="py-10 text-center">
                 <p className="text-xs text-muted-foreground font-bold">No activity found for "{searchQuery}"</p>
              </div>
            )}
          </div>
          <button 
            onClick={() => setIsActivityModalOpen(true)}
            className="w-full mt-8 py-3 bg-secondary/50 rounded-xl text-xs font-bold hover:bg-secondary transition-colors border border-border"
          >
            View All Activity
          </button>
        </div>
      </div>

      {/* New Project Modal */}
      <AnimatePresence>
        {isProjectModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProjectModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-card border border-border rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/10">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                       <FolderKanban className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold">New Project</h2>
                 </div>
                 <button onClick={() => setIsProjectModalOpen(false)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                    <X className="w-5 h-5" />
                 </button>
              </div>
              <form onSubmit={handleCreateProject} className="p-8 space-y-5">
                 <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Project Name</label>
                    <input 
                      required
                      value={newProject.name}
                      onChange={e => setNewProject({...newProject, name: e.target.value})}
                      type="text" 
                      placeholder="e.g. Q3 Marketing Sprint" 
                      className="w-full h-12 px-4 rounded-xl border border-border bg-background outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-medium"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Description</label>
                    <textarea 
                      value={newProject.description}
                      onChange={e => setNewProject({...newProject, description: e.target.value})}
                      placeholder="Define the scope and objectives..."
                      className="w-full h-28 p-4 rounded-xl border border-border bg-background outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-medium resize-none"
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                       <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Priority</label>
                       <select 
                         value={newProject.priority}
                         onChange={e => setNewProject({...newProject, priority: e.target.value})}
                         className="w-full h-12 px-4 rounded-xl border border-border bg-background outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-bold text-sm cursor-pointer"
                       >
                          <option>Low</option>
                          <option>Medium</option>
                          <option>High</option>
                          <option>Critical</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Deadline</label>
                       <input 
                          value={newProject.deadline}
                          onChange={e => setNewProject({...newProject, deadline: e.target.value})}
                          type="date" 
                          className="w-full h-12 px-4 rounded-xl border border-border bg-background outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-bold text-sm"
                       />
                    </div>
                 </div>
                 <div className="pt-6 flex gap-3">
                    <button 
                      type="button"
                      onClick={() => setIsProjectModalOpen(false)}
                      className="flex-1 h-12 rounded-xl bg-secondary text-secondary-foreground font-bold hover:bg-secondary/80 transition-all border border-border"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                    >
                      Create Project
                    </button>
                 </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View All Activity Modal */}
      <AnimatePresence>
         {isActivityModalOpen && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsActivityModalOpen(false)}
               className="absolute inset-0 bg-black/80 backdrop-blur-md"
             />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0, x: 20 }}
               animate={{ scale: 1, opacity: 1, x: 0 }}
               exit={{ scale: 0.9, opacity: 0, x: 20 }}
               className="relative bg-card border border-border rounded-3xl w-full max-w-md shadow-2xl overflow-hidden h-[80vh] flex flex-col"
             >
               <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/10">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <History className="w-5 h-5 text-primary" />
                     </div>
                     <h2 className="text-xl font-bold">Activity Feed</h2>
                  </div>
                  <button onClick={() => setIsActivityModalOpen(false)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                     <X className="w-5 h-5" />
                  </button>
               </div>
               
               <div className="p-4 border-b border-border bg-secondary/5">
                  <div className="relative">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                     <input 
                       type="text" 
                       placeholder="Search activity..." 
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       className="w-full h-10 pl-10 pr-4 rounded-xl border border-border bg-background outline-none focus:ring-2 focus:ring-primary/20 text-xs font-bold"
                     />
                  </div>
               </div>

               <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {filteredActivity.concat(filteredActivity).map((item, i) => (
                    <div key={i} className="flex gap-4 items-start group">
                      <div className="w-9 h-9 rounded-full bg-secondary flex-shrink-0 flex items-center justify-center text-[10px] font-bold border border-border group-hover:border-primary/30 transition-colors">
                        {item.user.substring(0, 2)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-[13px] leading-snug">
                          <span className="font-bold">{item.user}</span> {item.action} <span className="font-bold text-primary">{item.target}</span>
                        </p>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{item.time}</p>
                      </div>
                    </div>
                  ))}
                  {filteredActivity.length === 0 && (
                    <div className="py-20 text-center">
                       <p className="text-sm text-muted-foreground font-bold">No activity matches your search.</p>
                    </div>
                  )}
               </div>

               <div className="p-6 border-t border-border bg-secondary/10">
                  <button 
                    onClick={() => setIsActivityModalOpen(false)}
                    className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-all"
                  >
                    Close Activity Feed
                  </button>
               </div>
             </motion.div>
           </div>
         )}
      </AnimatePresence>
    </div>
  );
}
