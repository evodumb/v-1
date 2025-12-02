import type { Subject, Chapter, Quiz, TimetableItem, ProgressStats } from './types';

export const SUBJECTS: Subject[] = [
    {
        id: 'math',
        name: 'Mathematics',
        icon: 'Calculator',
        color: 'bg-blue-500',
        totalChapters: 12,
        progress: 45
    },
    {
        id: 'science',
        name: 'Science',
        icon: 'FlaskConical',
        color: 'bg-green-500',
        totalChapters: 10,
        progress: 30
    },
    {
        id: 'english',
        name: 'English',
        icon: 'BookOpen',
        color: 'bg-yellow-500',
        totalChapters: 8,
        progress: 60
    },
    {
        id: 'social',
        name: 'Social Studies',
        icon: 'Globe',
        color: 'bg-orange-500',
        totalChapters: 15,
        progress: 20
    },
    {
        id: 'computer',
        name: 'Computer Basics',
        icon: 'Monitor',
        color: 'bg-purple-500',
        totalChapters: 5,
        progress: 80
    }
];

export const CHAPTERS: Chapter[] = [
    {
        id: 'math-1',
        subjectId: 'math',
        title: 'Introduction to Algebra',
        description: 'Learn the basics of variables and equations.',
        thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=600',
        isCompleted: true,
        notes: 'Algebra is a branch of mathematics dealing with symbols and the rules for manipulating those symbols.'
    },
    {
        id: 'math-2',
        subjectId: 'math',
        title: 'Geometry Fundamentals',
        description: 'Understanding shapes, angles, and dimensions.',
        thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=600',
        isCompleted: false,
        notes: 'Geometry is all about shapes and their properties.'
    },
    {
        id: 'science-1',
        subjectId: 'science',
        title: 'Photosynthesis',
        description: 'How plants make their own food.',
        thumbnail: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&q=80&w=600',
        isCompleted: false,
        notes: 'Photosynthesis is the process used by plants to convert light energy into chemical energy.'
    }
];

export const QUIZZES: Quiz[] = [
    {
        id: 'math-quiz-1',
        subjectId: 'math',
        title: 'Algebra Basics',
        level: 'Easy',
        questions: [
            {
                id: 'q1',
                question: 'What is 2x if x = 3?',
                options: ['5', '6', '9', '4'],
                correctAnswer: 1,
                explanation: '2x means 2 multiplied by x. So 2 * 3 = 6.'
            },
            {
                id: 'q2',
                question: 'Solve for y: y + 5 = 10',
                options: ['2', '5', '15', '50'],
                correctAnswer: 1,
                explanation: 'Subtract 5 from both sides: y = 10 - 5 = 5.'
            }
        ]
    }
];

export const TIMETABLE: TimetableItem[] = [
    {
        id: '1',
        title: 'Math Class',
        day: 'Monday',
        time: '09:00 AM',
        type: 'Class'
    },
    {
        id: '2',
        title: 'Science Revision',
        day: 'Monday',
        time: '11:00 AM',
        type: 'Study'
    },
    {
        id: '3',
        title: 'English Quiz',
        day: 'Tuesday',
        time: '10:00 AM',
        type: 'Quiz'
    }
];

export const MOCK_STATS: ProgressStats = {
    totalHours: 12.5,
    lessonsCompleted: 15,
    quizzesTaken: 5,
    averageScore: 85,
    streakDays: 3
};
