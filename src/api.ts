import type { Subject, Chapter, Quiz, TimetableItem, ProgressStats, User, Project, ProjectDetails, ProjectTask, BudgetRequest, DiscussionPost, Note } from './data/types';

const API_URL = 'http://localhost:3001/api';

export const api = {
    getSubjects: async (): Promise<Subject[]> => {
        const res = await fetch(`${API_URL}/subjects`);
        if (!res.ok) throw new Error('Failed to fetch subjects');
        return res.json();
    },

    getChapters: async (subjectId?: string): Promise<Chapter[]> => {
        const query = subjectId ? `?subjectId=${subjectId}` : '';
        const res = await fetch(`${API_URL}/chapters${query}`);
        if (!res.ok) throw new Error('Failed to fetch chapters');
        return res.json();
    },

    getChapterById: async (id: string): Promise<Chapter> => {
        const res = await fetch(`${API_URL}/chapters/${id}`);
        if (!res.ok) throw new Error('Failed to fetch chapter');
        return res.json();
    },

    getQuizzes: async (): Promise<Quiz[]> => {
        const res = await fetch(`${API_URL}/quizzes`);
        if (!res.ok) throw new Error('Failed to fetch quizzes');
        return res.json();
    },

    getTimetable: async (): Promise<TimetableItem[]> => {
        const res = await fetch(`${API_URL}/timetable`);
        if (!res.ok) throw new Error('Failed to fetch timetable');
        return res.json();
    },

    getStats: async (): Promise<ProgressStats> => {
        const res = await fetch(`${API_URL}/stats`);
        if (!res.ok) throw new Error('Failed to fetch stats');
        return res.json();
    },

    getUser: async (): Promise<User> => {
        const res = await fetch(`${API_URL}/user`);
        if (!res.ok) throw new Error('Failed to fetch user');
        return res.json();
    },

    createChapter: async (chapter: Partial<Chapter>): Promise<void> => {
        const res = await fetch(`${API_URL}/chapters`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(chapter)
        });
        if (!res.ok) throw new Error('Failed to create chapter');
    },

    createQuiz: async (quiz: Partial<Quiz>): Promise<void> => {
        const res = await fetch(`${API_URL}/quizzes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(quiz)
        });
        if (!res.ok) throw new Error('Failed to create quiz');
    },

    // Projects
    getProjects: async (filter?: string, userId?: number): Promise<Project[]> => {
        const query = new URLSearchParams();
        if (filter) query.append('filter', filter);
        if (userId) query.append('userId', userId.toString());

        const res = await fetch(`${API_URL}/projects?${query.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch projects');
        return res.json();
    },

    createProject: async (project: Partial<Project>): Promise<void> => {
        const res = await fetch(`${API_URL}/projects`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(project)
        });
        if (!res.ok) throw new Error('Failed to create project');
    },

    updateProject: async (id: string, updates: Partial<Project>): Promise<void> => {
        const res = await fetch(`${API_URL}/projects/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
        if (!res.ok) throw new Error('Failed to update project');
    },

    getProjectDetails: async (id: string): Promise<ProjectDetails> => {
        const res = await fetch(`${API_URL}/projects/${id}`);
        if (!res.ok) throw new Error('Failed to fetch project details');
        return res.json();
    },

    joinProject: async (id: string, userId: number, message: string): Promise<void> => {
        const res = await fetch(`${API_URL}/projects/${id}/join`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, message })
        });
        if (!res.ok) throw new Error('Failed to join project');
    },

    updateMember: async (projectId: string, memberId: number, update: { status?: string, role?: string }): Promise<void> => {
        const res = await fetch(`${API_URL}/projects/${projectId}/members/${memberId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(update)
        });
        if (!res.ok) throw new Error('Failed to update member');
    },

    addTask: async (projectId: string, task: Partial<ProjectTask>): Promise<void> => {
        const res = await fetch(`${API_URL}/projects/${projectId}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
        });
        if (!res.ok) throw new Error('Failed to add task');
    },

    updateTask: async (taskId: number, status: string): Promise<void> => {
        const res = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        if (!res.ok) throw new Error('Failed to update task');
    },

    addBudgetRequest: async (projectId: string, budget: Partial<BudgetRequest>): Promise<void> => {
        const res = await fetch(`${API_URL}/projects/${projectId}/budget`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(budget)
        });
        if (!res.ok) throw new Error('Failed to add budget request');
    },

    getDiscussion: async (projectId: string): Promise<DiscussionPost[]> => {
        const res = await fetch(`${API_URL}/projects/${projectId}/discussion`);
        if (!res.ok) throw new Error('Failed to fetch discussion');
        return res.json();
    },

    postDiscussion: async (projectId: string, userId: number, message: string): Promise<void> => {
        const res = await fetch(`${API_URL}/projects/${projectId}/discussion`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, message })
        });
        if (!res.ok) throw new Error('Failed to post message');
    },

    // AI Notebook
    getNotes: async (): Promise<Note[]> => {
        const res = await fetch(`${API_URL}/notes`);
        if (!res.ok) throw new Error('Failed to fetch notes');
        return res.json();
    },

    createNote: async (note: Partial<Note>): Promise<Note> => {
        const res = await fetch(`${API_URL}/notes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(note)
        });
        if (!res.ok) throw new Error('Failed to create note');
        return res.json();
    },

    updateNote: async (id: number, note: Partial<Note>): Promise<void> => {
        const res = await fetch(`${API_URL}/notes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(note)
        });
        if (!res.ok) throw new Error('Failed to update note');
    },

    deleteNote: async (id: number): Promise<void> => {
        const res = await fetch(`${API_URL}/notes/${id}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error('Failed to delete note');
    }
};
