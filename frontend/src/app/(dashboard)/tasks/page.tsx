"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { 
  Plus, 
  MoreHorizontal, 
  Calendar, 
  MessageSquare, 
  Paperclip, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Edit2,
  Trash2,
  ArrowRightCircle,
  Clock,
  Filter,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/store/useAuth";
import axios from "axios";

interface Task {
  id: string;
  content: string;
  priority: string;
  due: string;
  comments: number;
  attachments: number;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  assigneeId: string;
}

// Mock Data
const initialData: {
  columns: Record<string, { id: string; title: string; taskIds: string[] }>;
  tasks: Record<string, Task>;
  columnOrder: string[];
} = {
  columns: {
    "todo": { id: "todo", title: "To Do", taskIds: ["task-1", "task-2", "task-3"] },
    "in-progress": { id: "in-progress", title: "In Progress", taskIds: ["task-4"] },
    "done": { id: "done", title: "Done", taskIds: ["task-5"] }
  },
  tasks: {
    "task-1": { id: "task-1", content: "Design landing page mockup", priority: "high", due: "Tomorrow", comments: 3, attachments: 1, status: "TODO", assigneeId: "2" },
    "task-2": { id: "task-2", content: "Set up PostgreSQL database schema", priority: "medium", due: "In 2 days", comments: 0, attachments: 0, status: "TODO", assigneeId: "1" },
    "task-3": { id: "task-3", content: "Implement JWT Authentication", priority: "urgent", due: "Today", comments: 5, attachments: 2, status: "TODO", assigneeId: "3" },
    "task-4": { id: "task-4", content: "Create Next.js frontend structure", priority: "medium", due: "Today", comments: 1, attachments: 0, status: "IN_PROGRESS", assigneeId: "2" },
    "task-5": { id: "task-5", content: "Finalize tech stack", priority: "low", due: "Yesterday", comments: 0, attachments: 0, status: "DONE", assigneeId: "1" },
  },
  columnOrder: ["todo", "in-progress", "done"],
};

const PriorityBadge = ({ level }: { level: string }) => {
  const styles: Record<string, string> = {
    low: "bg-emerald-500/10 text-emerald-500",
    medium: "bg-blue-500/10 text-blue-500",
    high: "bg-amber-500/10 text-amber-500",
    urgent: "bg-red-500/10 text-red-500",
  };
  return (
    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-current/20 flex items-center gap-1 ${styles[level]}`}>
      <div className="w-1 h-1 rounded-full bg-current" />
      {level}
    </span>
  );
}

import { io } from "socket.io-client";

// ... (keep PriorityBadge)

export default function KanbanBoardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(initialData);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTaskMenu, setActiveTaskMenu] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterPriority, setFilterPriority] = useState("all");
  
  const [newTask, setNewTask] = useState({
    content: "",
    priority: "medium",
    due: "Today",
    assigneeId: "2"
  });

  const [taskToEdit, setTaskToEdit] = useState<any>(null);

  useEffect(() => {
    fetchTasks();
    fetchTeam();

    // Socket setup
    const socket = io("http://localhost:8081");
    socket.on("task_updated", (updatedTask) => {
      // Re-fetch tasks on any update for consistency
      fetchTasks();
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const fetchTeam = async () => {
    try {
      const res = await axios.get("http://localhost:8081/api/team");
      setTeamMembers(res.data);
    } catch (err) {
      console.error("Failed to fetch team", err);
    }
  };

  const fetchTasks = async () => {
    if (!user) return;
    // Don't set loading on socket refreshes to avoid flicker
    // setIsLoading(true); 
    
    try {
      const url = user.role === "Admin" 
        ? "http://localhost:8081/api/tasks"
        : `http://localhost:8081/api/member/tasks?userId=${user.id}`;
      
      const res = await axios.get(url);
      const fetchedTasks = res.data;
      
      const tasksMap: any = {};
      const todoIds: string[] = [];
      const inProgressIds: string[] = [];
      const doneIds: string[] = [];
      
      fetchedTasks.forEach((t: any) => {
        tasksMap[t.id] = { ...t, comments: t.comments || 0, attachments: 0 };
        if (t.status === "DONE") doneIds.push(t.id);
        else if (t.status === "IN_PROGRESS") inProgressIds.push(t.id);
        else todoIds.push(t.id);
      });
      
      setData({
        columns: {
          "todo": { id: "todo", title: "To Do", taskIds: todoIds },
          "in-progress": { id: "in-progress", title: "In Progress", taskIds: inProgressIds },
          "done": { id: "done", title: "Done", taskIds: doneIds }
        },
        tasks: tasksMap,
        columnOrder: ["todo", "in-progress", "done"]
      });
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const startColumn = data.columns[source.droppableId as keyof typeof data.columns];
    const finishColumn = data.columns[destination.droppableId as keyof typeof data.columns];

    // Local state update for immediate feedback
    if (startColumn === finishColumn) {
      const newTaskIds = Array.from(startColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = { ...startColumn, taskIds: newTaskIds };
      setData({ ...data, columns: { ...data.columns, [newColumn.id]: newColumn } });
    } else {
      const startTaskIds = Array.from(startColumn.taskIds);
      startTaskIds.splice(source.index, 1);
      const newStartColumn = { ...startColumn, taskIds: startTaskIds };

      const finishTaskIds = Array.from(finishColumn.taskIds);
      finishTaskIds.splice(destination.index, 0, draggableId);
      const newFinishColumn = { ...finishColumn, taskIds: finishTaskIds };

      setData({
        ...data,
        columns: { ...data.columns, [newStartColumn.id]: newStartColumn, [newFinishColumn.id]: newFinishColumn }
      });

      // Backend update for status change
      try {
        const newStatus = destination.droppableId === "todo" ? "TODO" : 
                         destination.droppableId === "in-progress" ? "IN_PROGRESS" : "DONE";
        await axios.patch(`http://localhost:8081/api/tasks/${draggableId}`, { status: newStatus });
      } catch (err) {
        console.error("Failed to update task status", err);
        fetchTasks(); // Revert on failure
      }
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8081/api/tasks", {
        content: newTask.content,
        priority: newTask.priority,
        due: newTask.due,
        status: "TODO",
        assigneeId: newTask.assigneeId,
        projectId: "1"
      });
      
      const createdTask = res.data;
      const newTasks = { ...data.tasks, [createdTask.id]: createdTask };
      const newTodoColumn = { 
        ...data.columns.todo, 
        taskIds: [createdTask.id, ...data.columns.todo.taskIds] 
      };

      setData({
        ...data,
        tasks: newTasks as any,
        columns: { ...data.columns, todo: newTodoColumn }
      });
      setIsTaskModalOpen(false);
      setNewTask({ content: "", priority: "medium", due: "Today", assigneeId: "2" });
    } catch (err) {
      console.error("Failed to create task", err);
    }
  };

  const handleEditTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskToEdit) return;

    try {
      const res = await axios.patch(`http://localhost:8081/api/tasks/${taskToEdit.id}`, {
        content: taskToEdit.content,
        priority: taskToEdit.priority,
        due: taskToEdit.due,
        assigneeId: taskToEdit.assigneeId
      });

      const updatedTasks = {
        ...data.tasks,
        [taskToEdit.id]: {
          ...data.tasks[taskToEdit.id as keyof typeof data.tasks],
          ...res.data
        }
      };

      setData({
        ...data,
        tasks: updatedTasks as any
      });
      setIsEditModalOpen(false);
      setTaskToEdit(null);
    } catch (err) {
      console.error("Failed to update task", err);
    }
  };

  const handleDeleteTask = async (taskId: string, columnId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await axios.delete(`http://localhost:8081/api/tasks/${taskId}`);
      const column = data.columns[columnId as keyof typeof data.columns];
      const newTaskIds = column.taskIds.filter(id => id !== taskId);
      const newTasks = { ...data.tasks };
      delete newTasks[taskId as keyof typeof data.tasks];

      setData({
        ...data,
        tasks: newTasks as any,
        columns: { ...data.columns, [columnId]: { ...column, taskIds: newTaskIds } }
      });
      setActiveTaskMenu(null);
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  const handleMoveTask = async (taskId: string, currentColumnId: string) => {
    const columns = Object.keys(data.columns);
    const currentIndex = columns.indexOf(currentColumnId);
    const nextIndex = (currentIndex + 1) % columns.length;
    const nextColumnId = columns[nextIndex];

    const newStatus = nextColumnId === "todo" ? "TODO" : 
                     nextColumnId === "in-progress" ? "IN_PROGRESS" : "DONE";

    try {
      await axios.patch(`http://localhost:8081/api/tasks/${taskId}`, { status: newStatus });
      
      const startColumn = data.columns[currentColumnId as keyof typeof data.columns];
      const finishColumn = data.columns[nextColumnId as keyof typeof data.columns];

      const startTaskIds = Array.from(startColumn.taskIds);
      startTaskIds.splice(startTaskIds.indexOf(taskId), 1);
      const newStartColumn = { ...startColumn, taskIds: startTaskIds };

      const finishTaskIds = Array.from(finishColumn.taskIds);
      finishTaskIds.push(taskId);
      const newFinishColumn = { ...finishColumn, taskIds: finishTaskIds };

      setData({
        ...data,
        columns: { ...data.columns, [currentColumnId]: newStartColumn, [nextColumnId]: newFinishColumn }
      });
      setActiveTaskMenu(null);
    } catch (err) {
      console.error("Failed to move task", err);
    }
  };

  if (isLoading) return <div className="p-10 text-center font-bold text-muted-foreground animate-pulse">Loading board...</div>;

  return (
    <div className="h-full flex flex-col space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{user?.role === "Member" ? "My Tasks" : "Board"}</h1>
          <p className="text-muted-foreground mt-1">Manage and organize tasks across development sprints.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
             <button 
               onClick={() => setIsFilterOpen(!isFilterOpen)}
               className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm border flex items-center gap-2 ${isFilterOpen ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border hover:bg-secondary'}`}
             >
               <Filter className="w-4 h-4" /> 
               {filterPriority === 'all' ? 'Filter Board' : `Priority: ${filterPriority}`}
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
                       <p className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Filter by Priority</p>
                       {["all", "low", "medium", "high", "urgent"].map((p) => (
                         <button
                           key={p}
                           onClick={() => {
                             setFilterPriority(p);
                             setIsFilterOpen(false);
                           }}
                           className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${filterPriority === p ? 'bg-primary/10 text-primary' : 'hover:bg-secondary text-muted-foreground hover:text-foreground'}`}
                         >
                           <span className="capitalize">{p}</span>
                           {filterPriority === p && <Check className="w-3.5 h-3.5" />}
                         </button>
                       ))}
                    </motion.div>
                  </>
                )}
             </AnimatePresence>
          </div>

          {user?.role === "Admin" && (
            <button 
              onClick={() => setIsTaskModalOpen(true)}
              className="px-5 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20"
            >
              <Plus className="w-4 h-4" /> New Task
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-8 h-full items-start">
            {data.columnOrder.map((columnId) => {
              const column = data.columns[columnId as keyof typeof data.columns];
              let tasks = column.taskIds.map((taskId) => data.tasks[taskId as keyof typeof data.tasks]);
              
              // Apply Filter
              if (filterPriority !== "all") {
                tasks = tasks.filter(t => t.priority === filterPriority);
              }

              return (
                <div key={column.id} className="w-[350px] shrink-0 flex flex-col max-h-full bg-secondary/10 rounded-2xl border border-border/50 overflow-hidden">
                  <div className="flex items-center justify-between p-4 bg-secondary/20 border-b border-border">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-sm uppercase tracking-widest">{column.title}</h3>
                      <span className="text-[10px] font-black bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                        {tasks.length}
                      </span>
                    </div>
                    {user?.role === "Admin" && (
                      <button 
                        onClick={() => setIsTaskModalOpen(true)}
                        className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 overflow-y-auto p-4 transition-colors space-y-4 ${
                          snapshot.isDraggingOver ? "bg-primary/5" : "bg-transparent"
                        }`}
                        style={{ minHeight: "150px" }}
                      >
                        {tasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`group p-5 rounded-2xl border border-border bg-card shadow-sm transition-all relative ${
                                  snapshot.isDragging ? "shadow-2xl ring-2 ring-primary rotate-1 scale-[1.02] z-50" : "hover:border-primary/40 hover:shadow-md"
                                }`}
                              >
                                <div className="flex justify-between items-start mb-4">
                                  <PriorityBadge level={task.priority} />
                                  <div className="relative">
                                    <button 
                                      onClick={() => setActiveTaskMenu(activeTaskMenu === task.id ? null : task.id)}
                                      className="text-muted-foreground p-1 hover:bg-secondary rounded-lg transition-colors"
                                    >
                                      <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                    
                                    {/* Task Action Menu */}
                                    <AnimatePresence>
                                      {activeTaskMenu === task.id && (
                                        <>
                                          <div className="fixed inset-0 z-10" onClick={() => setActiveTaskMenu(null)} />
                                          <motion.div 
                                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                            className="absolute right-0 mt-2 w-44 bg-card border border-border rounded-xl shadow-2xl z-20 overflow-hidden p-1"
                                          >
                                            <button 
                                              onClick={() => {
                                                setTaskToEdit(task);
                                                setIsEditModalOpen(true);
                                                setActiveTaskMenu(null);
                                              }}
                                              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all hover:bg-secondary"
                                            >
                                              <Edit2 className="w-3.5 h-3.5" /> Edit Task
                                            </button>
                                            <button 
                                              onClick={() => handleMoveTask(task.id, column.id)}
                                              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all hover:bg-secondary"
                                            >
                                              <ArrowRightCircle className="w-3.5 h-3.5" /> Quick Move
                                            </button>
                                            <button 
                                              onClick={() => alert("Reminder set for tomorrow")}
                                              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all hover:bg-secondary"
                                            >
                                              <Clock className="w-3.5 h-3.5" /> Set Reminder
                                            </button>
                                            <div className="h-px bg-border my-1" />
                                            <button 
                                              onClick={() => handleDeleteTask(task.id, column.id)}
                                              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all hover:bg-red-500/10 text-red-500"
                                            >
                                              <Trash2 className="w-3.5 h-3.5" /> Delete Task
                                            </button>
                                          </motion.div>
                                        </>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                </div>
                                <p className="text-[13px] font-bold leading-relaxed mb-6 group-hover:text-primary transition-colors">
                                  {task.content}
                                </p>
                                <div className="flex items-center justify-between pt-4 border-t border-border/50 text-[10px] font-bold text-muted-foreground">
                                  <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1.5">
                                      <Calendar className="w-3.5 h-3.5 text-primary/60" /> {task.due}
                                    </span>
                                  </div>
                                    <div className="flex items-center gap-3">
                                      {task.comments > 0 && (
                                        <span className="flex items-center gap-1.5">
                                          <MessageSquare className="w-3.5 h-3.5" /> {task.comments}
                                        </span>
                                      )}
                                      <div className="w-7 h-7 rounded-full bg-zinc-950 text-white flex items-center justify-center text-[9px] font-black border-2 border-background shadow-sm ml-1 group-hover:border-primary/20 transition-all overflow-hidden">
                                        {teamMembers.find(m => m.id === task.assigneeId)?.avatar || "U"}
                                      </div>
                                    </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>

      {/* New Task Modal */}
      <AnimatePresence>
        {isTaskModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsTaskModalOpen(false)}
               className="absolute inset-0 bg-black/80 backdrop-blur-md"
             />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 20 }}
               className="relative bg-card border border-border rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
             >
               <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/10">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <CheckCircle2 className="w-5 h-5" />
                     </div>
                     <h2 className="text-xl font-bold">New Sprint Task</h2>
                  </div>
                  <button onClick={() => setIsTaskModalOpen(false)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                     <X className="w-5 h-5" />
                  </button>
               </div>
               <form onSubmit={handleCreateTask} className="p-8 space-y-6">
                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Task Content</label>
                     <textarea 
                       required
                       value={newTask.content}
                       onChange={e => setNewTask({...newTask, content: e.target.value})}
                       placeholder="What needs to be done?"
                       className="w-full h-32 p-4 rounded-2xl border border-border bg-background outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-bold text-sm resize-none"
                     />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Priority</label>
                        <select 
                          value={newTask.priority}
                          onChange={e => setNewTask({...newTask, priority: e.target.value})}
                          className="w-full h-12 px-4 rounded-xl border border-border bg-background outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-bold text-xs cursor-pointer"
                        >
                           <option value="low">Low</option>
                           <option value="medium">Medium</option>
                           <option value="high">High</option>
                           <option value="urgent">Urgent</option>
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Due Date</label>
                        <input 
                          value={newTask.due}
                          onChange={e => setNewTask({...newTask, due: e.target.value})}
                          type="text" 
                          placeholder="e.g. Today, Tomorrow" 
                          className="w-full h-12 px-4 rounded-xl border border-border bg-background outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-bold text-xs"
                        />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Assign Member</label>
                     <select 
                       value={newTask.assigneeId}
                       onChange={e => setNewTask({...newTask, assigneeId: e.target.value})}
                       className="w-full h-12 px-4 rounded-xl border border-border bg-background outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-bold text-xs cursor-pointer"
                     >
                        {teamMembers.map((m: any) => (
                          <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                        ))}
                     </select>
                  </div>
                  <div className="flex gap-3 pt-4">
                     <button 
                       type="button"
                       onClick={() => setIsTaskModalOpen(false)}
                       className="flex-1 h-12 rounded-xl bg-secondary text-secondary-foreground font-bold hover:bg-secondary/80 transition-all border border-border"
                     >
                       Cancel
                     </button>
                     <button 
                       type="submit"
                       className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-all shadow-xl shadow-primary/20"
                     >
                       Add to Board
                     </button>
                  </div>
               </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Task Modal */}
      <AnimatePresence>
        {isEditModalOpen && taskToEdit && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
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
               className="relative bg-card border border-border rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
             >
               <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/10">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Edit2 className="w-5 h-5" />
                     </div>
                     <h2 className="text-xl font-bold">Edit Task</h2>
                  </div>
                  <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                     <X className="w-5 h-5" />
                  </button>
               </div>
               <form onSubmit={handleEditTask} className="p-8 space-y-6">
                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Task Content</label>
                     <textarea 
                       required
                       value={taskToEdit.content}
                       onChange={e => setTaskToEdit({...taskToEdit, content: e.target.value})}
                       className="w-full h-32 p-4 rounded-2xl border border-border bg-background outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-bold text-sm resize-none"
                     />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Priority</label>
                        <select 
                          value={taskToEdit.priority}
                          onChange={e => setTaskToEdit({...taskToEdit, priority: e.target.value})}
                          className="w-full h-12 px-4 rounded-xl border border-border bg-background outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-bold text-xs cursor-pointer"
                        >
                           <option value="low">Low</option>
                           <option value="medium">Medium</option>
                           <option value="high">High</option>
                           <option value="urgent">Urgent</option>
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Due Date</label>
                        <input 
                          value={taskToEdit.due}
                          onChange={e => setTaskToEdit({...taskToEdit, due: e.target.value})}
                          type="text" 
                          className="w-full h-12 px-4 rounded-xl border border-border bg-background outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-bold text-xs"
                        />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Re-assign Member</label>
                     <select 
                       value={taskToEdit.assigneeId}
                       onChange={e => setTaskToEdit({...taskToEdit, assigneeId: e.target.value})}
                       className="w-full h-12 px-4 rounded-xl border border-border bg-background outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-bold text-xs cursor-pointer"
                     >
                        {teamMembers.map((m: any) => (
                          <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                     </select>
                  </div>
                  <div className="flex gap-3 pt-4">
                     <button 
                       type="button"
                       onClick={() => setIsEditModalOpen(false)}
                       className="flex-1 h-12 rounded-xl bg-secondary text-secondary-foreground font-bold hover:bg-secondary/80 transition-all border border-border"
                     >
                       Cancel
                     </button>
                     <button 
                       type="submit"
                       className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-all shadow-xl shadow-primary/20"
                     >
                       Save Changes
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
