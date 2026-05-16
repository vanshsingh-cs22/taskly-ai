import { useState, useEffect } from "react";
import { CheckCircle2, Clock, Calendar, AlertCircle, LayoutDashboard } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";
import { useAuth } from "@/store/useAuth";

export function MemberDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    overdueTasks: 0
  });
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const [statsRes, tasksRes] = await Promise.all([
          axios.get(`http://localhost:8081/api/member/stats?userId=${user.id}`),
          axios.get(`http://localhost:8081/api/member/tasks?userId=${user.id}`)
        ]);
        setStats(statsRes.data);
        setTasks(tasksRes.data);
      } catch (err: any) {
        console.error("Failed to fetch member data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const statCards = [
    { label: "Total Tasks", value: stats.totalTasks, icon: LayoutDashboard, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Completed", value: stats.completedTasks, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "In Progress", value: stats.inProgressTasks, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Overdue", value: stats.overdueTasks, icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/10" },
  ];

  if (loading) return <div className="p-10 text-center font-bold text-muted-foreground animate-pulse">Loading dashboard...</div>;

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name.split(" ")[0]}! 🚀</h1>
          <p className="text-muted-foreground mt-1">Here's your personal productivity overview.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label}
            className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group flex flex-col items-start gap-4"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
               <p className="text-xs font-bold text-muted-foreground mb-1">{stat.label}</p>
               <p className="text-3xl font-black">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Left Column: My Recent Tasks */}
         <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-base font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" /> My Recent Tasks
               </h3>
               <a href="/tasks" className="text-xs font-bold text-muted-foreground hover:text-foreground">View All</a>
            </div>
            <div className="flex-1 space-y-4">
               {tasks.length === 0 ? (
                 <div className="h-full flex items-center justify-center min-h-[200px]">
                    <p className="text-sm text-muted-foreground">No recent tasks assigned to you.</p>
                 </div>
               ) : (
                 tasks.slice(0, 5).map((task) => (
                   <div key={task.id} className="flex items-center justify-between p-4 rounded-2xl border border-border bg-secondary/5 hover:bg-secondary/10 transition-all cursor-pointer group">
                      <div className="flex items-center gap-4">
                         <div className={`w-2 h-2 rounded-full ${
                           task.priority === 'high' ? 'bg-amber-500' : 
                           task.priority === 'urgent' ? 'bg-red-500' : 'bg-emerald-500'
                         }`} />
                         <div>
                            <p className="text-sm font-bold group-hover:text-primary transition-colors">{task.content}</p>
                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">Due: {task.due}</p>
                         </div>
                      </div>
                      <div className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg border ${
                        task.status === 'DONE' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                      }`}>
                         {task.status.replace('_', ' ')}
                      </div>
                   </div>
                 ))
               )}
            </div>
         </div>

         {/* Right Column: Task Progress & Recent Activity */}
         <div className="space-y-6">
            {/* Pending Invites Section */}
            <PendingInvites email={user?.email || ""} />

            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
               <h3 className="text-base font-bold flex items-center gap-2 mb-6">
                  <AlertCircle className="w-5 h-5 text-indigo-500" /> Task Progress
               </h3>
               <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-muted-foreground">
                     <span>Overall Completion</span>
                     <span className="text-indigo-500">{stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%</span>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                     <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0}%` }}></div>
                  </div>
               </div>
            </div>

            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
               <h3 className="text-base font-bold flex items-center gap-2 mb-6">
                  <AlertCircle className="w-5 h-5 text-rose-500" /> Recent Activity
               </h3>
               <div className="space-y-6">
                  <div className="flex items-start gap-3">
                     <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                        <AlertCircle className="w-4 h-4" />
                     </div>
                     <div>
                        <p className="text-xs font-medium text-muted-foreground">Updated status of <span className="font-bold text-foreground">Login Logic</span></p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">2h ago</p>
                     </div>
                  </div>
                  <div className="flex items-start gap-3">
                     <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                        <AlertCircle className="w-4 h-4" />
                     </div>
                     <div>
                        <p className="text-xs font-medium text-muted-foreground">Added comment to <span className="font-bold text-foreground">Project Alpha</span></p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">4h ago</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

function PendingInvites({ email }: { email: string }) {
  const [invites, setInvites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvites = async () => {
      try {
        const res = await axios.get(`http://localhost:8081/api/member/invites?email=${email}`);
        setInvites(res.data);
      } catch (err) {
        console.error("Failed to fetch invites", err);
      } finally {
        setLoading(false);
      }
    };
    if (email) fetchInvites();
  }, [email]);

  if (loading) return null;
  if (invites.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-indigo-600 text-white rounded-3xl p-6 shadow-lg shadow-indigo-500/20 space-y-4"
    >
       <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <h3 className="font-bold text-sm uppercase tracking-wider">New Team Invite</h3>
       </div>
       <p className="text-xs opacity-90 leading-relaxed font-medium">
          You have been invited to join the team as a <strong>Member</strong>. Accept to start collaborating on tasks.
       </p>
       <div className="flex gap-2 pt-2">
          <button className="flex-1 py-2 bg-white text-indigo-600 rounded-xl text-xs font-bold hover:bg-zinc-100 transition-colors">Accept</button>
          <button className="flex-1 py-2 bg-indigo-500 text-white rounded-xl text-xs font-bold hover:bg-indigo-400 transition-colors">Decline</button>
       </div>
    </motion.div>
  );
}

