import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*', 
  },
});

const PORT = 8081;

app.use(cors());
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Mock Data Stores
let projects = [
  {
    id: '1',
    name: "Mobile App V2",
    description: "Redesigning the core mobile experience with a focus on speed and AI features.",
    status: "In Progress",
    progress: 65,
    members: ["JD", "SJ", "MR"],
    deadline: "2026-06-12",
    tasks: 24,
    priority: "High"
  },
  {
    id: '2',
    name: "Marketing Site",
    description: "New conversion-optimized landing pages for the Summer 2026 campaign.",
    status: "Planning",
    progress: 15,
    members: ["SJ", "AL"],
    deadline: "2026-07-05",
    tasks: 12,
    priority: "Medium"
  }
];

let teamMembers = [
  {
    id: '1',
    name: "John Doe",
    email: "john@taskly.ai",
    role: "Admin",
    status: "Active",
    tasks: 12,
    lastActive: "Now",
    avatar: "JD",
    productivity: 92,
    joinedDate: "2025-01-10"
  },
  {
    id: '2',
    name: "Sarah Jenkins",
    email: "sarah@taskly.ai",
    role: "Member",
    status: "Active",
    tasks: 24,
    lastActive: "12m ago",
    avatar: "SJ",
    productivity: 88,
    joinedDate: "2025-03-22"
  },
  {
    id: '3',
    name: "Mike Ross",
    email: "mike@taskly.ai",
    role: "Member",
    status: "Idle",
    tasks: 8,
    lastActive: "2h ago",
    avatar: "MR",
    productivity: 75,
    joinedDate: "2025-05-01"
  },
  {
    id: '4',
    name: "Mohit",
    email: "mohit@taskly.ai",
    role: "Member",
    status: "Active",
    tasks: 5,
    lastActive: "Now",
    avatar: "M",
    productivity: 90,
    joinedDate: "2025-06-01"
  },
  {
    id: '5',
    name: "Vansh Singh",
    email: "vansh.singh.int@ethara.ai",
    role: "Member",
    status: "Active",
    tasks: 3,
    lastActive: "Now",
    avatar: "VS",
    productivity: 98,
    joinedDate: "2026-01-01"
  },
  {
    id: '6',
    name: "Mohit Sharma",
    email: "mohitsharma@taskly.ai",
    role: "Member",
    status: "Active",
    tasks: 4,
    lastActive: "Now",
    avatar: "MS",
    productivity: 92,
    joinedDate: "2025-11-01"
  }
];

let tasks = [
  { id: "task-1", content: "Design landing page mockup", status: "TODO", priority: "high", due: "Tomorrow", comments: 3, assigneeId: "1", projectId: "1" },
  { id: "task-2", content: "Set up PostgreSQL database schema", status: "TODO", priority: "medium", due: "In 2 days", comments: 0, assigneeId: "2", projectId: "1" },
  { id: "task-3", content: "Implement JWT Authentication", status: "TODO", priority: "urgent", due: "Today", comments: 5, assigneeId: "2", projectId: "1" },
  { id: "task-4", content: "Create Next.js frontend structure", status: "IN_PROGRESS", priority: "medium", due: "Today", comments: 1, assigneeId: "3", projectId: "2" },
  { id: "task-5", content: "Finalize tech stack", status: "DONE", priority: "low", due: "Yesterday", comments: 0, assigneeId: "2", projectId: "2" },
  { id: "task-6", content: "Write API documentation", status: "TODO", priority: "low", due: "Past Due", comments: 1, assigneeId: "2", projectId: "1" },
  { id: "task-7", content: "Review PR #42", status: "IN_PROGRESS", priority: "high", due: "Today", comments: 2, assigneeId: "4", projectId: "1" },
  { id: "task-8", content: "Design user flow", status: "TODO", priority: "medium", due: "Tomorrow", comments: 0, assigneeId: "5", projectId: "2" },
  { id: "task-9", content: "Fix authentication bug", status: "IN_PROGRESS", priority: "urgent", due: "Today", comments: 4, assigneeId: "5", projectId: "1" },
];

// --- Routes ---

app.get('/api/ping', (req, res) => {
  res.json({ pong: true, version: '2.0.0', time: new Date().toISOString() });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth
app.post('/api/auth/login', (req, res) => {
  const email = (req.body.email || "").trim().toLowerCase();
  let user = teamMembers.find(m => m.email.toLowerCase() === email);
  
  if (!user) {
    // default mock fallback
    user = email.includes("member") ? teamMembers[1] : teamMembers[0];
  }

  res.json({
    token: 'mock-jwt-token-for-' + user.id,
    user: user
  });
});

// Member APIs
app.get('/api/member/stats', (req, res) => {
  // In a real app, use the user ID from the JWT token
  // Here we'll simulate by checking a header or just returning member 2's stats
  const memberId = req.query.userId || "2"; 
  
  const memberTasks = tasks.filter(t => t.assigneeId === memberId);
  const totalTasks = memberTasks.length;
  const completedTasks = memberTasks.filter(t => t.status === "DONE").length;
  const inProgressTasks = memberTasks.filter(t => t.status === "IN_PROGRESS").length;
  const overdueTasks = memberTasks.filter(t => t.due === "Past Due").length;

  res.json({
    totalTasks,
    completedTasks,
    inProgressTasks,
    overdueTasks
  });
});

app.get('/api/member/tasks', (req, res) => {
  const memberId = req.query.userId || "2";
  const memberTasks = tasks.filter(t => t.assigneeId === memberId);
  res.json(memberTasks);
});

app.get('/api/member/projects', (req, res) => {
  // Mock logic: members are assigned to specific projects in the projects array
  const memberId = req.query.userId || "2";
  const user = teamMembers.find(m => m.id === memberId);
  if (!user) return res.status(404).json({ message: "User not found" });

  // For mock purposes, Sarah (SJ) is in Project 1 and 2, Mike (MR) is in Project 1
  const memberProjects = projects.filter(p => p.members.includes(user.avatar));
  res.json(memberProjects);
});

app.get('/api/member/invites', (req, res) => {
  const email = req.query.email as string;
  if (!email) return res.status(400).json({ message: "Email required" });

  // Filter pending members with this email
  const invites = teamMembers.filter(m => m.email.toLowerCase() === email.toLowerCase() && m.status === "Pending");
  res.json(invites);
});

// Projects
app.get('/api/projects', (req, res) => {
  res.json(projects);
});

app.post('/api/projects', (req, res) => {
  const newProject = {
    id: String(projects.length + 1),
    ...req.body,
    progress: 0,
    tasks: 0,
    members: ["JD"]
  };
  projects.push(newProject);
  res.status(201).json(newProject);
});

app.patch('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  const index = projects.findIndex(p => p.id === id);
  if (index !== -1) {
    projects[index] = { ...projects[index], ...req.body };
    res.json(projects[index]);
  } else {
    res.status(404).json({ message: "Project not found" });
  }
});

app.delete('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  projects = projects.filter(p => p.id !== id);
  res.status(204).send();
});

// Team
app.get('/api/team', (req, res) => {
  res.json(teamMembers);
});

app.post('/api/team/invite', (req, res) => {
  const email = (req.body.email || "").trim().toLowerCase();
  
  // Check if already in team
  const existingMember = teamMembers.find(m => m.email.toLowerCase() === email);
  if (existingMember) {
    return res.status(200).json(existingMember); // Return existing instead of duplicate
  }

  const newMember = {
    id: String(teamMembers.length + 1),
    name: email.split('@')[0],
    email: email,
    role: "Member",
    status: "Pending",
    tasks: 0,
    lastActive: "Never",
    avatar: "",
    productivity: 0,
    joinedDate: new Date().toISOString().split('T')[0]
  };
  teamMembers.push(newMember);
  res.status(201).json(newMember);
});

app.patch('/api/team/:id', (req, res) => {
  const { id } = req.params;
  const index = teamMembers.findIndex(m => m.id === id);
  if (index !== -1) {
    teamMembers[index] = { ...teamMembers[index], ...req.body };
    res.json(teamMembers[index]);
  } else {
    res.status(404).json({ message: "Member not found" });
  }
});

app.delete('/api/team/:id', (req, res) => {
  const { id } = req.params;
  teamMembers = teamMembers.filter(m => m.id !== id);
  res.status(204).send();
});

// Tasks
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
  const newTask = {
    id: `task-${tasks.length + 1}`,
    content: req.body.content || "New Task",
    status: req.body.status || "TODO",
    priority: req.body.priority || "medium",
    due: req.body.due || "Today",
    comments: 0,
    assigneeId: req.body.assigneeId || "1",
    projectId: req.body.projectId || "1"
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.patch('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const index = tasks.findIndex(t => t.id === id);
  if (index !== -1) {
    tasks[index] = { ...tasks[index], ...req.body };
    // Trigger real-time update via socket if needed
    io.emit('task_updated', tasks[index]);
    res.json(tasks[index]);
  } else {
    res.status(404).json({ message: "Task not found" });
  }
});

app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  tasks = tasks.filter(t => t.id !== id);
  res.status(204).send();
});

// Analytics
app.get('/api/analytics', (req, res) => {
  res.json({
    completionRate: 94.2,
    avgTaskTime: "2.4 Days",
    velocity: 58.0,
    risk: "Low"
  });
});

// AI Assistant
app.post('/api/ai/analyze', async (req, res) => {
  setTimeout(() => {
    res.json({
      summary: "Your team is performing at 85% capacity. Sarah is over-capacity while Mike has room for more tasks.",
      risks: [
        { project: "Database Migration", risk: "High", reason: "3 tasks overdue" }
      ],
      recommendations: [
        "Reassign security audit to Mike",
        "Schedule sprint review for Friday"
      ]
    });
  }, 1000);
});

// Socket.io
io.on('connection', (socket) => {
  socket.on('task_moved', (data) => {
    socket.broadcast.emit('task_updated', data);
  });
});

// 404 Handler
app.use((req, res) => {
  console.log(`❌ 404 Not Found: ${req.method} ${req.url}`);
  res.status(404).json({ message: `Route ${req.method} ${req.url} not found` });
});

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
