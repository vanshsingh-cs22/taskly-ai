"use client";

import { useState, useEffect } from "react";
import { 
  FolderKanban, 
  Plus, 
  MoreVertical, 
  MoreHorizontal, 
  Users, 
  Clock, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  X,
  Edit2,
  Archive,
  Trash2,
  ExternalLink,
  Check,
  Calendar,
  AlertCircle,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useAuth } from "@/store/useAuth";

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [projectToEdit, setProjectToEdit] = useState<any>(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  // Form State
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    priority: "Medium",
    deadline: ""
  });

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      const url = user?.role === "Member" 
        ? `http://localhost:8081/api/member/projects?userId=${user?.id}`
        : "http://localhost:8081/api/projects";
      const res = await axios.get(url);
      setProjects(res.data);
    } catch (err) {
      console.error("Failed to fetch projects", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8081/api/projects", {
        ...newProject,
        status: "Planning"
      });
      setProjects([...projects, res.data]);
      setIsCreateModalOpen(false);
      setNewProject({ name: "", description: "", priority: "Medium", deadline: "" });
    } catch (err) {
      console.error("Failed to create project", err);
    }
  };

  const handleEditProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectToEdit) return;
    try {
      const res = await axios.patch(`http://localhost:8081/api/projects/${projectToEdit.id}`, projectToEdit);
      setProjects(projects.map(p => p.id === projectToEdit.id ? res.data : p));
      setIsEditModalOpen(false);
      setProjectToEdit(null);
    } catch (err) {
      console.error("Failed to update project", err);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await axios.delete(`http://localhost:8081/api/projects/${id}`);
      setProjects(projects.filter(p => p.id !== id));
      setActiveMenu(null);
    } catch (err) {
      console.error("Failed to delete project", err);
    }
  };

  const handleArchiveProject = (id: string) => {
    setProjects(projects.map(p => p.id === id ? { ...p, status: "Archived" } : p));
    setActiveMenu(null);
    alert("Project archived successfully!");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress": return "bg-blue-500/10 text-blue-500";
      case "Planning": return "bg-zinc-500/10 text-zinc-500";
      case "Review": return "bg-amber-500/10 text-amber-500";
      case "Completed": return "bg-emerald-500/10 text-emerald-500";
      case "Archived": return "bg-red-500/10 text-red-500";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  const filteredProjects = projects.filter(p => {
    if (statusFilter === "All Status") return true;
    return p.status === statusFilter;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-1">Manage and track all active initiatives.</p>
        </div>
        {user?.role === "Admin" && (
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20"
          >
            <Plus className="w-4 h-4" /> Create Project
          </button>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-card/30 p-2 rounded-2xl border border-border/50">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Filter projects by name..."
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-background outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-lg border border-border">
             <button 
               onClick={() => setView("grid")}
               className={`p-1.5 rounded-md transition-all ${view === 'grid' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
             >
               <LayoutGrid className="w-4 h-4" />
             </button>
             <button 
               onClick={() => setView("list")}
               className={`p-1.5 rounded-md transition-all ${view === 'list' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
             >
               <List className="w-4 h-4" />
             </button>
          </div>
          <div className="relative">
             <button 
               onClick={() => setIsFilterOpen(!isFilterOpen)}
               className={`flex items-center gap-2 px-4 py-2 border rounded-xl bg-background text-sm font-bold transition-all whitespace-nowrap ${isFilterOpen ? 'border-primary ring-2 ring-primary/10' : 'border-border hover:bg-secondary'}`}
             >
               <Filter className="w-4 h-4" /> 
               {statusFilter === 'All Status' ? 'Filter' : statusFilter}
             </button>
             
             <AnimatePresence>
                {isFilterOpen && (
                   <>
                     <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)} />
                     <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-2xl shadow-2xl z-20 overflow-hidden p-2"
                     >
                        <p className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Filter by Status</p>
                        {["All Status", "Planning", "In Progress", "Review", "Completed", "Archived"].map((s) => (
                          <button
                            key={s}
                            onClick={() => {
                              setStatusFilter(s);
                              setIsFilterOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${statusFilter === s ? 'bg-primary/10 text-primary' : 'hover:bg-secondary text-muted-foreground hover:text-foreground'}`}
                          >
                            <span>{s}</span>
                            {statusFilter === s && <Check className="w-3.5 h-3.5" />}
                          </button>
                        ))}
                     </motion.div>
                   </>
                )}
             </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-50">
           {[1, 2, 3, 4].map(i => <div key={i} className="h-64 bg-secondary rounded-2xl animate-pulse" />)}
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <div 
              key={project.id} 
              onClick={() => {
                setSelectedProject(project);
                setIsDetailsOpen(true);
              }}
              className="group bg-card border border-border rounded-2xl p-6 hover:shadow-xl hover:border-primary/30 transition-all duration-300 relative cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(project.status)}`}>
                  {project.status}
                </div>
                <div className="relative">
                  {user?.role === "Admin" && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenu(activeMenu === project.id ? null : project.id);
                      }}
                      className="text-muted-foreground hover:text-foreground p-1 hover:bg-secondary rounded-lg transition-colors"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  )}
                  
                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {activeMenu === project.id && user?.role === "Admin" && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setActiveMenu(null); }} />
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 10 }}
                          className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-2xl z-20 overflow-hidden p-1"
                        >
                           {[
                             { label: "Edit Project", icon: Edit2, action: (e: any) => { e.stopPropagation(); setProjectToEdit(project); setIsEditModalOpen(true); setActiveMenu(null); } },
                             { label: "View Details", icon: ExternalLink, action: (e: any) => { e.stopPropagation(); setSelectedProject(project); setIsDetailsOpen(true); setActiveMenu(null); } },
                             { label: "Archive", icon: Archive, action: (e: any) => { e.stopPropagation(); handleArchiveProject(project.id); } },
                             { label: "Delete", icon: Trash2, color: "text-red-500", action: (e: any) => { e.stopPropagation(); handleDeleteProject(project.id); } },
                           ].map((item, idx) => (
                             <button 
                               key={idx}
                               onClick={item.action}
                               className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all hover:bg-secondary ${item.color || ''}`}
                             >
                               <item.icon className="w-3.5 h-3.5" />
                               {item.label}
                             </button>
                           ))}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{project.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-6 min-h-[40px]">
                {project.description}
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-muted-foreground uppercase tracking-widest text-[9px]">Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-1000 ease-out" 
                    style={{ width: `${project.progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex -space-x-2">
                    {(project.members || ["JD"]).map((member: string, i: number) => (
                      <div 
                        key={i} 
                        className="w-7 h-7 rounded-full border-2 border-card bg-zinc-950 text-white flex items-center justify-center text-[10px] font-bold"
                      >
                        {member}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-[11px] text-muted-foreground font-medium">
                     <div className="flex items-center gap-1">
                        <FolderKanban className="w-3.5 h-3.5" /> {project.tasks}
                     </div>
                     <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {project.deadline ? new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}
                     </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
           <table className="w-full text-left text-sm">
             <thead className="bg-secondary/30 text-muted-foreground font-bold border-b border-border text-[10px] uppercase tracking-widest">
               <tr>
                 <th className="px-6 py-4">Project</th>
                 <th className="px-6 py-4">Status</th>
                 <th className="px-6 py-4">Progress</th>
                 <th className="px-6 py-4">Deadline</th>
                 <th className="px-6 py-4 text-right">Actions</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-border">
               {filteredProjects.map(project => (
                 <tr 
                   key={project.id} 
                   onClick={() => {
                     setSelectedProject(project);
                     setIsDetailsOpen(true);
                   }}
                   className="hover:bg-secondary/10 transition-colors cursor-pointer"
                 >
                    <td className="px-6 py-4 font-bold">{project.name}</td>
                    <td className="px-6 py-4">
                       <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${getStatusColor(project.status)}`}>
                         {project.status}
                       </span>
                    </td>
                    <td className="px-6 py-4 w-48">
                       <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                             <div className="h-full bg-primary" style={{ width: `${project.progress}%` }} />
                          </div>
                          <span className="text-xs font-bold">{project.progress}%</span>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground font-medium">{project.deadline}</td>
                    <td className="px-6 py-4 text-right relative">
                       {user?.role === "Admin" && (
                         <button 
                           onClick={(e) => {
                             e.stopPropagation();
                             setActiveMenu(activeMenu === project.id ? null : project.id);
                           }}
                           className="text-muted-foreground hover:text-foreground p-2 hover:bg-secondary rounded-lg transition-all"
                         >
                            <MoreHorizontal className="w-4 h-4" />
                         </button>
                       )}
                       
                       <AnimatePresence>
                        {activeMenu === project.id && user?.role === "Admin" && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setActiveMenu(null); }} />
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.95, y: 10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: 10 }}
                              className="absolute right-6 mt-2 w-48 bg-card border border-border rounded-xl shadow-2xl z-20 overflow-hidden p-1 text-left"
                            >
                               {[
                                 { label: "Edit Project", icon: Edit2, action: (e: any) => { e.stopPropagation(); setProjectToEdit(project); setIsEditModalOpen(true); setActiveMenu(null); } },
                                 { label: "View Details", icon: ExternalLink, action: (e: any) => { e.stopPropagation(); setSelectedProject(project); setIsDetailsOpen(true); setActiveMenu(null); } },
                                 { label: "Archive", icon: Archive, action: (e: any) => { e.stopPropagation(); handleArchiveProject(project.id); } },
                                 { label: "Delete", icon: Trash2, color: "text-red-500", action: (e: any) => { e.stopPropagation(); handleDeleteProject(project.id); } },
                               ].map((item, idx) => (
                                 <button 
                                   key={idx}
                                   onClick={item.action}
                                   className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all hover:bg-secondary ${item.color || ''}`}
                                 >
                                   <item.icon className="w-3.5 h-3.5" />
                                   {item.label}
                                 </button>
                               ))}
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </td>
                 </tr>
               ))}
             </tbody>
           </table>
        </div>
      )}

      {/* Create Project Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-card border border-border rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/10">
                 <h2 className="text-xl font-bold">Create New Project</h2>
                 <button onClick={() => setIsCreateModalOpen(false)} className="p-2 hover:bg-secondary rounded-full transition-colors">
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
                      placeholder="e.g. Website Overhaul" 
                      className="w-full h-12 px-4 rounded-xl border border-border bg-background outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-medium"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Description</label>
                    <textarea 
                      value={newProject.description}
                      onChange={e => setNewProject({...newProject, description: e.target.value})}
                      placeholder="Describe the goals and scope..."
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
                      onClick={() => setIsCreateModalOpen(false)}
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

      {/* Edit Project Modal */}
      <AnimatePresence>
        {isEditModalOpen && projectToEdit && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-card border border-border rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/10">
                 <h2 className="text-xl font-bold">Edit Project</h2>
                 <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                    <X className="w-5 h-5" />
                 </button>
              </div>
              <form onSubmit={handleEditProject} className="p-8 space-y-5">
                 <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Project Name</label>
                    <input 
                      required
                      value={projectToEdit.name}
                      onChange={e => setProjectToEdit({...projectToEdit, name: e.target.value})}
                      type="text" 
                      className="w-full h-12 px-4 rounded-xl border border-border bg-background outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-medium"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Description</label>
                    <textarea 
                      value={projectToEdit.description}
                      onChange={e => setProjectToEdit({...projectToEdit, description: e.target.value})}
                      className="w-full h-28 p-4 rounded-xl border border-border bg-background outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-medium resize-none"
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                       <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Priority</label>
                       <select 
                         value={projectToEdit.priority}
                         onChange={e => setProjectToEdit({...projectToEdit, priority: e.target.value})}
                         className="w-full h-12 px-4 rounded-xl border border-border bg-background outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-bold text-sm cursor-pointer"
                       >
                          <option>Low</option>
                          <option>Medium</option>
                          <option>High</option>
                          <option>Critical</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Status</label>
                       <select 
                         value={projectToEdit.status}
                         onChange={e => setProjectToEdit({...projectToEdit, status: e.target.value})}
                         className="w-full h-12 px-4 rounded-xl border border-border bg-background outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-bold text-sm cursor-pointer"
                       >
                          <option>Planning</option>
                          <option>In Progress</option>
                          <option>Review</option>
                          <option>Completed</option>
                          <option>Archived</option>
                       </select>
                    </div>
                 </div>
                 <div className="pt-6 flex gap-3">
                    <button 
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="flex-1 h-12 rounded-xl bg-secondary text-secondary-foreground font-bold hover:bg-secondary/80 transition-all border border-border"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                    >
                      Save Changes
                    </button>
                 </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Project Details Drawer */}
      <AnimatePresence>
        {isDetailsOpen && selectedProject && (
          <div className="fixed inset-0 z-[110] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDetailsOpen(false)}
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
                 <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getStatusColor(selectedProject.status)}`}>
                       <FolderKanban className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-bold">Project Details</h2>
                 </div>
                 <button onClick={() => setIsDetailsOpen(false)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                    <X className="w-5 h-5" />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <div>
                   <h3 className="text-2xl font-black mb-2">{selectedProject.name}</h3>
                   <div className="flex flex-wrap gap-2">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${getStatusColor(selectedProject.status)}`}>
                         {selectedProject.status}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-secondary text-secondary-foreground text-[10px] font-bold uppercase tracking-wider border border-border">
                         Priority: {selectedProject.priority}
                      </span>
                   </div>
                </div>

                <div className="space-y-3">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Description</h4>
                   <p className="text-sm leading-relaxed text-muted-foreground bg-secondary/20 p-4 rounded-xl border border-border/50">
                      {selectedProject.description || "No description provided for this project."}
                   </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-secondary/20 p-4 rounded-2xl border border-border/50">
                      <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                         <Calendar className="w-4 h-4" />
                         <span className="text-[10px] font-bold uppercase tracking-widest">Deadline</span>
                      </div>
                      <p className="text-sm font-bold">{selectedProject.deadline || 'Not set'}</p>
                   </div>
                   <div className="bg-secondary/20 p-4 rounded-2xl border border-border/50">
                      <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                         <Zap className="w-4 h-4" />
                         <span className="text-[10px] font-bold uppercase tracking-widest">Progress</span>
                      </div>
                      <p className="text-sm font-bold">{selectedProject.progress}%</p>
                   </div>
                </div>

                <div className="space-y-4">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Team Members</h4>
                   <div className="flex flex-wrap gap-3">
                      {(selectedProject.members || ["JD", "SJ", "RW"]).map((m: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 bg-card border border-border p-2 rounded-xl pr-4">
                           <div className="w-8 h-8 rounded-lg bg-zinc-950 text-white flex items-center justify-center text-xs font-black">
                              {m}
                           </div>
                           <span className="text-xs font-bold">User {m}</span>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="space-y-4 pt-4">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Timeline</h4>
                   <div className="space-y-4 border-l-2 border-border pl-6 relative">
                      {[
                        { title: "Project Created", date: "2 days ago", icon: Plus, color: "text-blue-500" },
                        { title: "Requirements Finalized", date: "Yesterday", icon: Check, color: "text-emerald-500" },
                        { title: "Development Started", date: "Today", icon: Zap, color: "text-amber-500" },
                      ].map((step, i) => (
                        <div key={i} className="relative">
                           <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-card border-2 border-border flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                           </div>
                           <p className="text-xs font-bold">{step.title}</p>
                           <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">{step.date}</p>
                        </div>
                      ))}
                   </div>
                </div>
              </div>

              <div className="p-6 border-t border-border bg-secondary/10 flex gap-3">
                 {user?.role === "Admin" && (
                   <button 
                     onClick={() => {
                       setProjectToEdit(selectedProject);
                       setIsEditModalOpen(true);
                       setIsDetailsOpen(false);
                     }}
                     className="flex-1 h-12 rounded-xl bg-card border border-border font-bold text-sm hover:bg-secondary transition-colors flex items-center justify-center gap-2"
                   >
                      <Edit2 className="w-4 h-4" /> Edit
                   </button>
                 )}
                 <button 
                    onClick={() => setIsDetailsOpen(false)}
                    className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity"
                 >
                    Close
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
