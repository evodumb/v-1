export interface Subject {
    id: string;
    name: string;
    icon: string; // Lucide icon name or emoji
    color: string; // Tailwind color class
    totalChapters: number;
    progress: number;
}

export interface Chapter {
    id: string;
    subjectId: string;
    title: string;
    description: string;
    videoUrl?: string;
    thumbnail?: string;
    isCompleted: boolean;
    notes: string;
}

export interface Lesson {
    id: string;
    chapterId: string;
    title: string;
    content: string;
    duration: string;
}

export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number; // Index of correct option
    explanation?: string;
}

export interface Quiz {
    id: string;
    subjectId: string;
    title: string;
    level: 'Easy' | 'Medium' | 'Hard';
    questions: QuizQuestion[];
}

export interface TimetableItem {
    id: string;
    title: string;
    day: string;
    time: string;
    type: 'Class' | 'Study' | 'Quiz';
}

export interface ProgressStats {
    totalHours: number;
    lessonsCompleted: number;
    quizzesTaken: number;
    averageScore: number;
    streakDays: number;
}

export interface User {
    id?: number;
    name: string;
    language: 'en' | 'hi' | 'te' | 'ta' | 'kn';
    grade: string;
}

export interface Project {
    id: string;
    title: string;
    description: string;
    goal: string;
    status: 'Open' | 'Closed' | 'Under Review';
    budget_needed: number;
    professor_id?: number;
    creator_id: number;
    creatorName?: string;
    memberCount?: number;
    created_at?: string;
}

export interface ProjectMember {
    id: number;
    project_id: string;
    user_id: number;
    name: string;
    grade: string;
    role: string;
    status: 'pending' | 'approved' | 'rejected';
}

export interface ProjectTask {
    id: number;
    project_id: string;
    title: string;
    assigned_to?: number;
    deadline?: string;
    status: 'Pending' | 'In Progress' | 'Done';
}

export interface BudgetRequest {
    id: number;
    project_id: string;
    title: string;
    amount: number;
    reason: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    professor_note?: string;
}

export interface DiscussionPost {
    id: number;
    project_id: string;
    user_id: number;
    name: string;
    message: string;
    created_at: string;
}

export interface ProjectDetails extends Project {
    members: ProjectMember[];
    tasks: ProjectTask[];
    budget: BudgetRequest[];
}

export interface Note {
    id: number;
    title: string;
    content: string;
    created_at: string;
}

