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
    name: string;
    language: 'en' | 'hi' | 'te' | 'ta' | 'kn';
    grade: string;
}
