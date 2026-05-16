"use client";

import { useState, useEffect } from "react";
import { 
  Users, UserPlus, Mail, Shield, MoreVertical, MoreHorizontal, Search, 
  CheckCircle2, X, Send, Filter, ArrowUpRight, 
  Trash2, UserCog, Calendar, Activity, Zap, Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function TeamPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [isMoreFilterOpen, setIsMoreFilterOpen] = useState(false);
  const [productivityFilter, setProductivityFilter] = useState("all");
  
  // Modals
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [inviteEmail, setInviteEmail] = useState("");

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const res = await axios.get("http://localhost:8081/api/team");
      setMembers(res.data);
    } catch (err) {
      console.error("Failed to fetch team", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8081/api/team/invite", { email: inviteEmail });
      setMembers([...members, res.data]);
      setIsInviteModalOpen(false);
      setInviteEmail("");
    } catch (err) {
      console.error("Failed to invite member", err);
    }
  };

  const handleUpdateRole = async (id: string, newRole: string) => {
    try {
      const res = await axios.patch(`http://localhost:8081/api/team/${id}`, { role: newRole });
      setMembers(members.map(m => m.id === id ? res.data : m));
      if (selectedMember?.id === id) setSelectedMember(res.data);
    } catch (err) {
      console.error("Failed to update role", err);
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    try {
      await axios.delete(`http://localhost:8081/api/team/${id}`);
      setMembers(members.filter(m => m.id !== id));
      setSelectedMember(null);
    } catch (err) {
      console.error("Failed to delete member", err);
    }
  };

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "All Roles" || m.role === roleFilter;
    
    let matchesProductivity = true;
    if (productivityFilter === "high") matchesProductivity = m.productivity >= 80;
    if (productivityFilter === "medium") matchesProductivity = m.productivity >= 50 && m.productivity < 80;
    if (productivityFilter === "low") matchesProductivity = m.productivity < 50;
    
    return matchesSearch && matchesRole && matchesProductivity;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Directory</h1>
          <p className="text-muted-foreground mt-1">Manage permissions, monitor productivity, and grow your team.</p>
        </div>
        <button 
          onClick={() => setIsInviteModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20"
        >
          <UserPlus className="w-4 h-4" /> Invite Member
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Members", value: members.length, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "High Productivity", value: members.filter(m => m.productivity > 80).length, icon: Zap, color: "text-violet-500", bg: "bg-violet-500/10" },
          { label: "Active Now", value: members.filter(m => m.status === 'Active').length, icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10" }
        ].map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="bg-card border border-border rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-8 h-8 ${stat.bg} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
            </div>
            <p className="text-3xl font-bold">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-card/30 p-2 rounded-2xl border border-border/50">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-background outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-11 px-4 rounded-xl border border-border bg-background text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
          >
            <option>All Roles</option>
            <option>Admin</option>
            <option>Member</option>
          </select>
          
          <div className="relative">
             <button 
               onClick={() => setIsMoreFilterOpen(!isMoreFilterOpen)}
               className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-bold transition-all whitespace-nowrap ${isMoreFilterOpen ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border hover:bg-secondary'}`}
             >
               <Filter className="w-4 h-4" /> 
               {productivityFilter === 'all' ? 'More Filters' : `Productivity: ${productivityFilter}`}
             </button>
             
             <AnimatePresence>
                {isMoreFilterOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsMoreFilterOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-2xl shadow-2xl z-20 overflow-hidden p-2"
                    >
                       <p className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Productivity</p>
                       {[
                         { id: "all", label: "All Levels" },
                         { id: "high", label: "High (80%+)" },
                         { id: "medium", label: "Medium (50-80%)" },
                         { id: "low", label: "Low (<50%)" }
                       ].map((f) => (
                         <button
                           key={f.id}
                           onClick={() => {
                             setProductivityFilter(f.id);
                             setIsMoreFilterOpen(false);
                           }}
                           className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${productivityFilter === f.id ? 'bg-primary/10 text-primary' : 'hover:bg-secondary text-muted-foreground hover:text-foreground'}`}
                         >
                           <span>{f.label}</span>
                           {productivityFilter === f.id && <Check className="w-3.5 h-3.5" />}
                         </button>
                       ))}
                    </motion.div>
                  </>
                )}
             </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Member Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] bg-secondary/10">
                <th className="px-6 py-5">Member</th>
                <th className="px-6 py-5">Role & Permissions</th>
                <th className="px-6 py-5">Productivity</th>
                <th className="px-6 py-5">Tasks</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                [1, 2, 3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-10"><div className="h-4 bg-secondary rounded w-full opacity-50" /></td>
                  </tr>
                ))
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-muted-foreground font-medium">
                    No members found matching your search.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr 
                    key={member.id} 
                    onClick={() => setSelectedMember(member)}
                    className="hover:bg-secondary/10 transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-full bg-zinc-950 text-white flex items-center justify-center text-xs font-bold border border-white/10 ring-2 ring-primary/0 group-hover:ring-primary/40 transition-all">
                          {member.avatar || member.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold group-hover:text-primary transition-colors">{member.name}</p>
                          <p className="text-xs text-muted-foreground font-medium">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary text-secondary-foreground text-xs font-bold border border-border">
                        <Shield className={`w-3 h-3 ${member.role === 'Admin' ? 'text-violet-500' : 'text-zinc-500'}`} />
                        {member.role}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                           <div className={`h-full ${member.productivity > 80 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${member.productivity}%` }} />
                        </div>
                        <span className="text-xs font-bold">{member.productivity}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-bold">{member.tasks} tasks</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          member.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 
                          member.status === 'Idle' ? 'bg-amber-500' : 'bg-zinc-500'
                        }`} />
                        <span className="text-[11px] font-bold uppercase tracking-wider">{member.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Member Profile Drawer */}
      <AnimatePresence>
        {selectedMember && (
          <div className="fixed inset-0 z-[110] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMember(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-card border-l border-border h-full shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                 <h2 className="text-lg font-bold">Member Profile</h2>
                 <button onClick={() => setSelectedMember(null)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                    <X className="w-5 h-5" />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {/* Header Info */}
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 rounded-full bg-zinc-950 text-white flex items-center justify-center text-2xl font-bold mx-auto border-4 border-primary/20">
                    {selectedMember.avatar || selectedMember.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{selectedMember.name}</h3>
                    <p className="text-muted-foreground font-medium">{selectedMember.email}</p>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-secondary text-xs font-bold border border-border">
                       Joined {selectedMember.joinedDate}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${selectedMember.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-secondary text-muted-foreground border-border'}`}>
                       {selectedMember.status}
                    </span>
                  </div>
                </div>

                {/* Productivity Card */}
                <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-5">
                      <Zap className="w-16 h-16" />
                   </div>
                   <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-bold uppercase tracking-widest text-primary">AI Productivity Score</h4>
                      <span className="text-2xl font-black text-primary">{selectedMember.productivity}%</span>
                   </div>
                   <div className="w-full h-2 bg-primary/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${selectedMember.productivity}%` }} />
                   </div>
                   <p className="text-xs text-muted-foreground mt-4 font-medium italic">
                      "John's performance is 12% above team average this month. Recommended for lead on next sprint."
                   </p>
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">Manage Member</h4>
                  <div className="grid grid-cols-1 gap-3">
                    <button 
                      onClick={() => handleUpdateRole(selectedMember.id, selectedMember.role === 'Admin' ? 'Member' : 'Admin')}
                      className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-secondary transition-colors text-sm font-bold"
                    >
                      <UserCog className="w-4 h-4 text-violet-500" />
                      Make {selectedMember.role === 'Admin' ? 'Member' : 'Admin'}
                    </button>
                    <button 
                      onClick={() => handleDeleteMember(selectedMember.id)}
                      className="flex items-center gap-3 p-4 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-colors text-sm font-bold text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove from Team
                    </button>
                  </div>
                </div>

                {/* Recent Activity Mock */}
                <div className="space-y-4">
                   <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">Recent Activity</h4>
                   {[
                     { text: "Completed 'API Integration'", time: "2h ago" },
                     { text: "Joined 'Mobile App V2' project", time: "5h ago" },
                     { text: "Commented on Task #124", time: "Yesterday" }
                   ].map((item, i) => (
                     <div key={i} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                        <span className="text-sm font-medium">{item.text}</span>
                        <span className="text-[10px] font-bold text-muted-foreground ml-auto">{item.time}</span>
                     </div>
                   ))}
                </div>
              </div>

              <div className="p-6 border-t border-border bg-secondary/10">
                 <button 
                    onClick={() => setSelectedMember(null)}
                    className="w-full h-12 rounded-xl bg-card border border-border font-bold text-sm hover:bg-secondary transition-colors"
                 >
                    Close Profile
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Invite Modal */}
      <AnimatePresence>
        {isInviteModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsInviteModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-card border border-border rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                 <h2 className="text-xl font-bold">Invite Team Member</h2>
                 <button onClick={() => setIsInviteModalOpen(false)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                    <X className="w-5 h-5" />
                 </button>
              </div>
              <form onSubmit={handleInvite} className="p-8 space-y-6">
                 <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                       <Mail className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Grow your team and collaborate faster. Invitations will be sent via email.
                    </p>
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
                    <input 
                      required
                      value={inviteEmail}
                      onChange={e => setInviteEmail(e.target.value)}
                      type="email" 
                      placeholder="teammate@company.com" 
                      className="w-full h-12 px-4 rounded-xl border border-border bg-background outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                    />
                 </div>
                 <div className="flex gap-3 pt-2">
                    <button 
                      type="button"
                      onClick={() => setIsInviteModalOpen(false)}
                      className="flex-1 h-12 rounded-xl bg-secondary text-secondary-foreground font-bold hover:bg-secondary/80 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                    >
                      <Send className="w-4 h-4" /> Send Invite
                    </button>
                 </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
