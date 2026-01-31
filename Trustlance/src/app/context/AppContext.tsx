import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'client' | 'freelancer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  reliabilityScore?: number;
}

export type EscrowStatus = 'locked' | 'released' | 'refunded' | 'disputed';
export type MilestoneStatus = 'pending' | 'in_progress' | 'submitted' | 'approved' | 'rejected';
export type DisputeStatus = 'open' | 'under_review' | 'resolved';

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  amount: number;
  status: MilestoneStatus;
  dueDate: string;
  submittedDate?: string;
  approvedDate?: string;
  files?: string[];
  notes?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  clientId: string;
  freelancerId?: string;
  totalAmount: number;
  escrowStatus: EscrowStatus;
  createdAt: string;
  deadline: string;
  milestones: Milestone[];
}

export interface Message {
  id: string;
  projectId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  attachments?: string[];
}

export interface Dispute {
  id: string;
  projectId: string;
  raisedBy: string;
  reason: string;
  status: DisputeStatus;
  createdAt: string;
  resolution?: string;
  resolvedAt?: string;
}

interface AppContextType {
  currentUser: User | null;
  login: (email: string, password: string, role: UserRole) => void;
  signup: (name: string, email: string, password: string, role: UserRole) => void;
  logout: () => void;
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  updateMilestone: (projectId: string, milestoneId: string, updates: Partial<Milestone>) => void;
  messages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  disputes: Dispute[];
  addDispute: (dispute: Omit<Dispute, 'id' | 'createdAt'>) => void;
  resolveDispute: (id: string, resolution: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    role: 'client',
    avatar: 'SJ'
  },
  {
    id: '2',
    name: 'Alex Chen',
    email: 'alex@example.com',
    role: 'freelancer',
    avatar: 'AC',
    reliabilityScore: 95
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@trustlance.com',
    role: 'admin',
    avatar: 'AD'
  }
];

const mockProjects: Project[] = [
  {
    id: 'proj-1',
    title: 'E-commerce Website Redesign',
    description: 'Complete redesign of our e-commerce platform with modern UI/UX',
    clientId: '1',
    freelancerId: '2',
    totalAmount: 5000,
    escrowStatus: 'locked',
    createdAt: '2026-01-15T10:00:00Z',
    deadline: '2026-03-15T23:59:59Z',
    milestones: [
      {
        id: 'mile-1',
        projectId: 'proj-1',
        title: 'Initial Design Mockups',
        description: 'Create wireframes and high-fidelity mockups for all main pages',
        amount: 1500,
        status: 'approved',
        dueDate: '2026-01-30T23:59:59Z',
        submittedDate: '2026-01-28T14:30:00Z',
        approvedDate: '2026-01-29T09:15:00Z'
      },
      {
        id: 'mile-2',
        projectId: 'proj-1',
        title: 'Frontend Development',
        description: 'Implement responsive frontend with React and Tailwind CSS',
        amount: 2500,
        status: 'submitted',
        dueDate: '2026-02-20T23:59:59Z',
        submittedDate: '2026-02-18T16:45:00Z',
        files: ['frontend-build.zip', 'documentation.pdf']
      },
      {
        id: 'mile-3',
        projectId: 'proj-1',
        title: 'Backend Integration & Testing',
        description: 'Connect to APIs, implement checkout flow, conduct thorough testing',
        amount: 1000,
        status: 'in_progress',
        dueDate: '2026-03-10T23:59:59Z'
      }
    ]
  },
  {
    id: 'proj-2',
    title: 'Mobile App UI Design',
    description: 'Design user interface for iOS and Android fitness tracking app',
    clientId: '1',
    totalAmount: 3000,
    escrowStatus: 'locked',
    createdAt: '2026-01-20T14:00:00Z',
    deadline: '2026-02-28T23:59:59Z',
    milestones: [
      {
        id: 'mile-4',
        projectId: 'proj-2',
        title: 'User Flow & Wireframes',
        description: 'Create complete user journey and wireframes',
        amount: 1000,
        status: 'pending',
        dueDate: '2026-02-05T23:59:59Z'
      },
      {
        id: 'mile-5',
        projectId: 'proj-2',
        title: 'High-Fidelity Designs',
        description: 'Design all screens with brand guidelines',
        amount: 1500,
        status: 'pending',
        dueDate: '2026-02-20T23:59:59Z'
      },
      {
        id: 'mile-6',
        projectId: 'proj-2',
        title: 'Design System & Handoff',
        description: 'Create design system documentation and developer handoff',
        amount: 500,
        status: 'pending',
        dueDate: '2026-02-28T23:59:59Z'
      }
    ]
  }
];

const mockMessages: Message[] = [
  {
    id: 'msg-1',
    projectId: 'proj-1',
    senderId: '1',
    senderName: 'Sarah Johnson',
    content: 'Hi Alex! The mockups look great. Just a few minor adjustments needed on the checkout page.',
    timestamp: '2026-01-28T10:30:00Z'
  },
  {
    id: 'msg-2',
    projectId: 'proj-1',
    senderId: '2',
    senderName: 'Alex Chen',
    content: 'Thanks Sarah! I\'ll make those changes and resubmit today.',
    timestamp: '2026-01-28T11:15:00Z'
  },
  {
    id: 'msg-3',
    projectId: 'proj-1',
    senderId: '2',
    senderName: 'Alex Chen',
    content: 'I\'ve submitted the frontend milestone. Please review when you have a chance!',
    timestamp: '2026-02-18T16:50:00Z'
  }
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [disputes, setDisputes] = useState<Dispute[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }

    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }

    const savedMessages = localStorage.getItem('messages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }

    const savedDisputes = localStorage.getItem('disputes');
    if (savedDisputes) {
      setDisputes(JSON.parse(savedDisputes));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('disputes', JSON.stringify(disputes));
  }, [disputes]);

  const login = (email: string, password: string, role: UserRole) => {
    // Mock authentication - in real app, this would call an API
    const user = mockUsers.find(u => u.email === email && u.role === role);
    if (user) {
      setCurrentUser(user);
    } else {
      // For demo purposes, create a new user
      const newUser: User = {
        id: Date.now().toString(),
        name: email.split('@')[0],
        email,
        role,
        avatar: email.substring(0, 2).toUpperCase()
      };
      setCurrentUser(newUser);
    }
  };

  const signup = (name: string, email: string, password: string, role: UserRole) => {
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role,
      avatar: name.substring(0, 2).toUpperCase(),
      reliabilityScore: role === 'freelancer' ? 100 : undefined
    };
    setCurrentUser(newUser);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const addProject = (project: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject: Project = {
      ...project,
      id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setProjects([...projects, newProject]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(projects.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const updateMilestone = (projectId: string, milestoneId: string, updates: Partial<Milestone>) => {
    setProjects(projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          milestones: p.milestones.map(m =>
            m.id === milestoneId ? { ...m, ...updates } : m
          )
        };
      }
      return p;
    }));
  };

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    setMessages([...messages, newMessage]);
  };

  const addDispute = (dispute: Omit<Dispute, 'id' | 'createdAt'>) => {
    const newDispute: Dispute = {
      ...dispute,
      id: `disp-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setDisputes([...disputes, newDispute]);
  };

  const resolveDispute = (id: string, resolution: string) => {
    setDisputes(disputes.map(d =>
      d.id === id
        ? { ...d, status: 'resolved', resolution, resolvedAt: new Date().toISOString() }
        : d
    ));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        login,
        signup,
        logout,
        projects,
        addProject,
        updateProject,
        updateMilestone,
        messages,
        addMessage,
        disputes,
        addDispute,
        resolveDispute
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
