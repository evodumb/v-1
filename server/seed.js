import { getDb } from './db.js';

const SUBJECTS = [
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

const CHAPTERS = [
    // Math Chapters
    {
        id: 'math-1',
        subjectId: 'math',
        title: 'Introduction to Algebra',
        description: 'Learn the basics of variables and equations.',
        thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=600',
        isCompleted: 1,
        notes: 'Algebra is a branch of mathematics dealing with symbols and the rules for manipulating those symbols. Key concepts include:\n\n1. Variables: Letters like x, y, z representing unknown numbers.\n2. Expressions: Combinations of variables and numbers (e.g., 2x + 3).\n3. Equations: Mathematical sentences showing equality (e.g., 2x = 10).\n\nRemember: What you do to one side of an equation, you must do to the other!',
        videoUrl: 'https://www.youtube.com/watch?v=NybHckSEQBI'
    },
    {
        id: 'math-2',
        subjectId: 'math',
        title: 'Geometry Fundamentals',
        description: 'Understanding shapes, angles, and dimensions.',
        thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=600',
        isCompleted: 0,
        notes: 'Geometry explores shapes, sizes, and properties of space. \n\n- Point: A location in space.\n- Line: A straight path extending infinitely.\n- Angle: Formed by two rays sharing an endpoint.\n\nCommon shapes include Triangles (3 sides), Quadrilaterals (4 sides), and Circles.',
        videoUrl: 'https://www.youtube.com/watch?v=302eJ3TzJQU'
    },
    {
        id: 'math-3',
        subjectId: 'math',
        title: 'Fractions and Decimals',
        description: 'Mastering parts of a whole and decimal points.',
        thumbnail: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&q=80&w=600',
        isCompleted: 0,
        notes: 'Fractions represent equal parts of a whole. \n\n- Numerator: The top number (how many parts).\n- Denominator: The bottom number (total parts).\n\nDecimals are another way to write fractions whose denominators are powers of 10. Example: 0.5 = 5/10 = 1/2.',
        videoUrl: ''
    },
    {
        id: 'math-4',
        subjectId: 'math',
        title: 'Basic Trigonometry',
        description: 'Introduction to sine, cosine, and tangent.',
        thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=600',
        isCompleted: 0,
        notes: 'Trigonometry deals with the relationships between the sides and angles of triangles.\n\nSOH-CAH-TOA:\n- Sine = Opposite / Hypotenuse\n- Cosine = Adjacent / Hypotenuse\n- Tangent = Opposite / Adjacent',
        videoUrl: ''
    },

    // Science Chapters
    {
        id: 'science-1',
        subjectId: 'science',
        title: 'Photosynthesis',
        description: 'How plants make their own food.',
        thumbnail: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&q=80&w=600',
        isCompleted: 0,
        notes: 'Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll.\n\nEquation:\n6CO2 + 6H2O + Light Energy -> C6H12O6 (Glucose) + 6O2 (Oxygen).\n\nIt occurs in the chloroplasts usually found in plant leaves.',
        videoUrl: 'https://www.youtube.com/watch?v=UPBMG5EYydo'
    },
    {
        id: 'science-2',
        subjectId: 'science',
        title: 'The Solar System',
        description: 'Explore the planets and stars in our galaxy.',
        thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600',
        isCompleted: 0,
        notes: 'The Solar System consists of the Sun and everything bound to it by gravity: the planets Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune; dwarf planets such as Pluto; dozens of moons; and millions of asteroids, comets, and meteoroids.',
        videoUrl: 'https://www.youtube.com/watch?v=libKVRa01L8'
    },
    {
        id: 'science-3',
        subjectId: 'science',
        title: 'Human Body Systems',
        description: 'Understanding how our body works.',
        thumbnail: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=600',
        isCompleted: 0,
        notes: 'The human body is a complex network of systems:\n\n1. Circulatory System: Moves blood, nutrients, oxygen.\n2. Digestive System: Breaks down food.\n3. Nervous System: Controls the body (brain, spinal cord).\n4. Respiratory System: Breathing (lungs).',
        videoUrl: ''
    },
    {
        id: 'science-4',
        subjectId: 'science',
        title: 'States of Matter',
        description: 'Solids, liquids, and gases.',
        thumbnail: 'https://images.unsplash.com/photo-1480044965905-02098d419e96?auto=format&fit=crop&q=80&w=600',
        isCompleted: 0,
        notes: 'Matter is anything that has mass and takes up space.\n\n- Solids: Definite shape and volume.\n- Liquids: Definite volume but take the shape of their container.\n- Gases: No definite shape or volume, expanding to fill space.',
        videoUrl: ''
    },

    // English Chapters
    {
        id: 'english-1',
        subjectId: 'english',
        title: 'Parts of Speech',
        description: 'Nouns, Verbs, Adjectives, and more.',
        thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600',
        isCompleted: 1,
        notes: 'Parts of speech are categories of words based on their function.',
        videoUrl: ''
    },
    {
        id: 'english-2',
        subjectId: 'english',
        title: 'Creative Writing',
        description: 'Learn how to write engaging stories.',
        thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=600',
        isCompleted: 0,
        notes: 'Creative writing expresses thoughts and feelings in an imaginative way.',
        videoUrl: ''
    },
    {
        id: 'english-3',
        subjectId: 'english',
        title: 'Reading Comprehension',
        description: 'Improve your understanding of texts.',
        thumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
        isCompleted: 0,
        notes: 'Reading comprehension is the ability to process text and understand its meaning.',
        videoUrl: ''
    },

    // Computer Chapters
    {
        id: 'computer-1',
        subjectId: 'computer',
        title: 'Introduction to Computers',
        description: 'Basics of hardware and software.',
        thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600',
        isCompleted: 1,
        notes: 'A computer is a machine that can be instructed to carry out sequences of arithmetic or logical operations.',
        videoUrl: ''
    },
    {
        id: 'computer-2',
        subjectId: 'computer',
        title: 'Internet Safety',
        description: 'Staying safe while browsing online.',
        thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600',
        isCompleted: 0,
        notes: 'Internet safety is the knowledge of maximizing the user\'s personal safety against security risks to private information and property associated with using the internet.',
        videoUrl: ''
    }
];

const QUIZZES = [
    {
        id: 'math-quiz-1',
        subjectId: 'math',
        title: 'Algebra Basics',
        level: 'Easy',
        questions: JSON.stringify([
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
            },
            {
                id: 'q3',
                question: 'What is 3 squared?',
                options: ['6', '9', '12', '33'],
                correctAnswer: 1,
                explanation: '3 squared is 3 * 3 = 9.'
            }
        ])
    },
    {
        id: 'math-quiz-2',
        subjectId: 'math',
        title: 'Geometry Challenge',
        level: 'Medium',
        questions: JSON.stringify([
            {
                id: 'q1',
                question: 'How many sides does a hexagon have?',
                options: ['5', '6', '7', '8'],
                correctAnswer: 1,
                explanation: 'A hexagon is a polygon with 6 sides.'
            },
            {
                id: 'q2',
                question: 'What is the sum of angles in a triangle?',
                options: ['180', '360', '90', '270'],
                correctAnswer: 0,
                explanation: 'The sum of angles in any triangle is always 180 degrees.'
            }
        ])
    },
    {
        id: 'science-quiz-1',
        subjectId: 'science',
        title: 'Photosynthesis Quiz',
        level: 'Medium',
        questions: JSON.stringify([
            {
                id: 'q1',
                question: 'What gas do plants absorb?',
                options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Helium'],
                correctAnswer: 1,
                explanation: 'Plants absorb Carbon Dioxide for photosynthesis.'
            },
            {
                id: 'q2',
                question: 'What is the green pigment in plants?',
                options: ['Chlorophyll', 'Melanin', 'Hemoglobin', 'Keratin'],
                correctAnswer: 0,
                explanation: 'Chlorophyll is the green pigment responsible for absorbing light.'
            }
        ])
    },
    {
        id: 'english-quiz-1',
        subjectId: 'english',
        title: 'Grammar Galaxy',
        level: 'Easy',
        questions: JSON.stringify([
            {
                id: 'q1',
                question: 'Identify the verb: "She runs fast."',
                options: ['She', 'Runs', 'Fast', 'None'],
                correctAnswer: 1,
                explanation: '"Runs" is the action word.'
            },
            {
                id: 'q2',
                question: 'What is the past tense of "Go"?',
                options: ['Goed', 'Gone', 'Went', 'Going'],
                correctAnswer: 2,
                explanation: 'The past tense of "Go" is "Went".'
            }
        ])
    }
];

const TIMETABLE = [
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
    },
    {
        id: '4',
        title: 'History Lesson',
        day: 'Wednesday',
        time: '02:00 PM',
        type: 'Class'
    },
    {
        id: '5',
        title: 'Computer Lab',
        day: 'Thursday',
        time: '11:00 AM',
        type: 'Class'
    },
    {
        id: '6',
        title: 'Weekly Revision',
        day: 'Friday',
        time: '04:00 PM',
        type: 'Study'
    },
    {
        id: '7',
        title: 'Science Quiz',
        day: 'Saturday',
        time: '10:00 AM',
        type: 'Quiz'
    }
];

const MOCK_STATS = {
    totalHours: 24.5,
    lessonsCompleted: 23,
    quizzesTaken: 12,
    averageScore: 88,
    streakDays: 5
};

async function seed() {
    const db = await getDb();

    console.log('Seeding subjects...');
    await db.run('DELETE FROM subjects');
    for (const s of SUBJECTS) {
        await db.run(
            'INSERT INTO subjects (id, name, icon, color, totalChapters, progress) VALUES (?, ?, ?, ?, ?, ?)',
            s.id, s.name, s.icon, s.color, s.totalChapters, s.progress
        );
    }

    console.log('Seeding chapters...');
    await db.run('DELETE FROM chapters');
    for (const c of CHAPTERS) {
        await db.run(
            'INSERT INTO chapters (id, subjectId, title, description, thumbnail, isCompleted, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
            c.id, c.subjectId, c.title, c.description, c.thumbnail, c.isCompleted, c.notes
        );
    }

    console.log('Seeding quizzes...');
    await db.run('DELETE FROM quizzes');
    for (const q of QUIZZES) {
        await db.run(
            'INSERT INTO quizzes (id, subjectId, title, level, questions) VALUES (?, ?, ?, ?, ?)',
            q.id, q.subjectId, q.title, q.level, q.questions
        );
    }

    console.log('Seeding timetable...');
    await db.run('DELETE FROM timetable');
    for (const t of TIMETABLE) {
        await db.run(
            'INSERT INTO timetable (id, title, day, time, type) VALUES (?, ?, ?, ?, ?)',
            t.id, t.title, t.day, t.time, t.type
        );
    }

    console.log('Seeding stats...');
    // Only insert if empty to preserve user progress potentially (though here we just reset for simplicity)
    await db.run('DELETE FROM progress_stats');
    await db.run(
        'INSERT INTO progress_stats (totalHours, lessonsCompleted, quizzesTaken, averageScore, streakDays) VALUES (?, ?, ?, ?, ?)',
        MOCK_STATS.totalHours, MOCK_STATS.lessonsCompleted, MOCK_STATS.quizzesTaken, MOCK_STATS.averageScore, MOCK_STATS.streakDays
    );

    console.log('Seeding users...');
    await db.run('DELETE FROM users');
    // Mock users: 1 student (Creator), 1 Professor, 1 other student
    const USERS = [
        { id: 1, name: 'Raju Student', language: 'en', grade: '10th' },
        { id: 2, name: 'Dr. Sharma (Prof)', language: 'en', grade: 'PhD' },
        { id: 3, name: 'Meena Friend', language: 'en', grade: '10th' }
    ];
    for (const u of USERS) {
        await db.run(
            'INSERT INTO users (id, name, language, grade) VALUES (?, ?, ?, ?)',
            u.id, u.name, u.language, u.grade
        );
    }

    console.log('Seeding projects...');
    await db.run('DELETE FROM projects');
    const PROJECTS = [
        {
            id: 'proj-1',
            title: 'Solar Water Pump',
            description: 'Building a low-cost solar pump for irrigation.',
            goal: 'Help farmers reduce electricity costs.',
            status: 'Open',
            budget_needed: 5000,
            professor_id: 2,
            creator_id: 1
        },
        {
            id: 'proj-2',
            title: 'Waste Management System',
            description: 'Recycling organic waste in the village.',
            goal: 'Clean village streets.',
            status: 'Under Review',
            budget_needed: 2000,
            professor_id: null,
            creator_id: 3
        }
    ];
    for (const p of PROJECTS) {
        await db.run(
            'INSERT INTO projects (id, title, description, goal, status, budget_needed, professor_id, creator_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            p.id, p.title, p.description, p.goal, p.status, p.budget_needed, p.professor_id, p.creator_id
        );
    }

    console.log('Seeding project members...');
    await db.run('DELETE FROM project_members');
    // Raju is creator of proj-1 (automatically leader but let's add explicitly if needed, or just members)
    // Let's add Meena to proj-1
    await db.run('INSERT INTO project_members (project_id, user_id, role, status) VALUES (?, ?, ?, ?)', 'proj-1', 3, 'Research Member', 'approved');

    console.log('Seeding project tasks...');
    await db.run('DELETE FROM project_tasks');
    await db.run('INSERT INTO project_tasks (project_id, title, assigned_to, deadline, status) VALUES (?, ?, ?, ?, ?)', 'proj-1', 'Market Survey', 3, '2025-12-20', 'In Progress');

    console.log('Seeding complete!');
}

seed().catch(console.error);
