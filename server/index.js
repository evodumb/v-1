import express from 'express';
import cors from 'cors';
import { getDb } from './db.js';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Get all subjects
app.get('/api/subjects', async (req, res) => {
    try {
        const db = await getDb();
        const subjects = await db.all('SELECT * FROM subjects');
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get chapters for a subject
app.get('/api/chapters', async (req, res) => {
    try {
        const { subjectId } = req.query;
        const db = await getDb();

        let query = 'SELECT * FROM chapters';
        let params = [];

        if (subjectId) {
            query += ' WHERE subjectId = ?';
            params.push(subjectId);
        }

        const chapters = await db.all(query, params);
        // Convert integer boolean to JS boolean
        const formattedChapters = chapters.map(c => ({
            ...c,
            isCompleted: !!c.isCompleted
        }));

        res.json(formattedChapters);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a single chapter (lesson)
app.get('/api/chapters/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = await getDb();
        const chapter = await db.get('SELECT * FROM chapters WHERE id = ?', id);

        if (!chapter) {
            return res.status(404).json({ error: 'Chapter not found' });
        }

        res.json({
            ...chapter,
            isCompleted: !!chapter.isCompleted
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get quizzes
app.get('/api/quizzes', async (req, res) => {
    try {
        const db = await getDb();
        const quizzes = await db.all('SELECT * FROM quizzes');
        const formattedQuizzes = quizzes.map(q => ({
            ...q,
            questions: JSON.parse(q.questions)
        }));
        res.json(formattedQuizzes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get timetable
app.get('/api/timetable', async (req, res) => {
    try {
        const db = await getDb();
        const timetable = await db.all('SELECT * FROM timetable');
        res.json(timetable);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get progress stats
app.get('/api/stats', async (req, res) => {
    try {
        const db = await getDb();
        const stats = await db.get('SELECT * FROM progress_stats');
        res.json(stats || {});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user info (mock)
app.get('/api/user', async (req, res) => {
    res.json({
        name: 'Student',
        language: 'en',
        grade: '5'
    });
});

// Create a chapter (lesson)
app.post('/api/chapters', async (req, res) => {
    try {
        const { id, subjectId, title, description, videoUrl, thumbnail, notes } = req.body;
        const db = await getDb();

        await db.run(
            'INSERT INTO chapters (id, subjectId, title, description, videoUrl, thumbnail, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
            id, subjectId, title, description, videoUrl, thumbnail, notes
        );

        res.status(201).json({ message: 'Chapter created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a quiz
app.post('/api/quizzes', async (req, res) => {
    try {
        const { id, subjectId, title, level, questions } = req.body;
        const db = await getDb();

        await db.run(
            'INSERT INTO quizzes (id, subjectId, title, level, questions) VALUES (?, ?, ?, ?, ?)',
            id, subjectId, title, level, JSON.stringify(questions)
        );

        res.status(201).json({ message: 'Quiz created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- PROJECTS MODULE API ---

// Get all projects
app.get('/api/projects', async (req, res) => {
    try {
        const { filter, userId } = req.query; // filter: 'my', 'open', 'completed', 'under_professor'
        const db = await getDb();

        let query = `
            SELECT p.*, u.name as creatorName, 
            (SELECT COUNT(*) FROM project_members pm WHERE pm.project_id = p.id AND pm.status = 'approved') as memberCount 
            FROM projects p 
            JOIN users u ON p.creator_id = u.id
        `;
        let params = [];
        let conditions = [];

        if (filter === 'open') {
            conditions.push("p.status = 'Open'");
        } else if (filter === 'completed') {
            conditions.push("p.status = 'Closed'");
        } else if (filter === 'under_professor') {
            conditions.push("p.professor_id IS NOT NULL");
        } else if (filter === 'my' && userId) {
            // Projects where user is creator OR member
            conditions.push(`(p.creator_id = ? OR EXISTS (SELECT 1 FROM project_members pm WHERE pm.project_id = p.id AND pm.user_id = ?))`);
            params.push(userId, userId);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY p.created_at DESC';

        const projects = await db.all(query, params);
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a project
app.post('/api/projects', async (req, res) => {
    try {
        const { id, title, description, goal, budget_needed, professor_id, creator_id } = req.body;
        const db = await getDb();

        await db.run(
            'INSERT INTO projects (id, title, description, goal, budget_needed, professor_id, creator_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
            id, title, description, goal, budget_needed, professor_id, creator_id
        );

        // Add creator as a member (Leader)
        await db.run(
            'INSERT INTO project_members (project_id, user_id, role, status) VALUES (?, ?, ?, ?)',
            id, creator_id, 'Team Leader', 'approved'
        );

        res.status(201).json({ message: 'Project created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single project details
app.get('/api/projects/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = await getDb();

        const project = await db.get(`
            SELECT p.*, u.name as creatorName 
            FROM projects p 
            JOIN users u ON p.creator_id = u.id 
            WHERE p.id = ?
        `, id);

        if (!project) return res.status(404).json({ error: 'Project not found' });

        // Get members
        const members = await db.all(`
            SELECT pm.*, u.name, u.grade 
            FROM project_members pm 
            JOIN users u ON pm.user_id = u.id 
            WHERE pm.project_id = ?
        `, id);

        // Get tasks
        const tasks = await db.all('SELECT * FROM project_tasks WHERE project_id = ?', id);

        // Get budget
        const budget = await db.all('SELECT * FROM budget_requests WHERE project_id = ?', id);

        res.json({ ...project, members, tasks, budget });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update project (e.g., status)
app.put('/api/projects/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, professor_id } = req.body;
        const db = await getDb();

        if (status) {
            await db.run('UPDATE projects SET status = ? WHERE id = ?', status, id);
        }
        if (professor_id !== undefined) {
            await db.run('UPDATE projects SET professor_id = ? WHERE id = ?', professor_id, id);
        }

        res.json({ message: 'Project updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Join request
app.post('/api/projects/:id/join', async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id, message } = req.body; // Message could be stored if we added a column, for now we just create membership
        const db = await getDb();

        // Check if already member
        const existing = await db.get('SELECT * FROM project_members WHERE project_id = ? AND user_id = ?', id, user_id);
        if (existing) return res.status(400).json({ error: 'Already requested or joined' });

        await db.run(
            'INSERT INTO project_members (project_id, user_id, role, status) VALUES (?, ?, ?, ?)',
            id, user_id, 'Member', 'pending'
        );
        res.json({ message: 'Join request sent' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Manage Member (Approve/Reject/Assign Role)
app.put('/api/projects/:id/members/:memberId', async (req, res) => {
    try {
        const { memberId } = req.params;
        const { status, role } = req.body;
        const db = await getDb();

        if (status) {
            await db.run('UPDATE project_members SET status = ? WHERE id = ?', status, memberId);
        }
        if (role) {
            await db.run('UPDATE project_members SET role = ? WHERE id = ?', role, memberId);
        }
        res.json({ message: 'Member updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Tasks
app.post('/api/projects/:id/tasks', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, assigned_to, deadline } = req.body;
        const db = await getDb();

        await db.run(
            'INSERT INTO project_tasks (project_id, title, assigned_to, deadline, status) VALUES (?, ?, ?, ?, ?)',
            id, title, assigned_to, deadline, 'Pending'
        );
        res.status(201).json({ message: 'Task added' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/tasks/:taskId', async (req, res) => {
    try {
        const { taskId } = req.params;
        const { status } = req.body;
        const db = await getDb();
        await db.run('UPDATE project_tasks SET status = ? WHERE id = ?', status, taskId);
        res.json({ message: 'Task updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Budget
app.post('/api/projects/:id/budget', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, amount, reason } = req.body;
        const db = await getDb();

        await db.run(
            'INSERT INTO budget_requests (project_id, title, amount, reason, status) VALUES (?, ?, ?, ?, ?)',
            id, title, amount, reason, 'Pending'
        );
        res.status(201).json({ message: 'Budget request added' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Discussion
app.get('/api/projects/:id/discussion', async (req, res) => {
    try {
        const { id } = req.params;
        const db = await getDb();
        const posts = await db.all(`
            SELECT dp.*, u.name 
            FROM discussion_posts dp 
            JOIN users u ON dp.user_id = u.id 
            WHERE dp.project_id = ? 
            ORDER BY dp.created_at ASC
        `, id);
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/projects/:id/discussion', async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id, message } = req.body;
        const db = await getDb();

        await db.run(
            'INSERT INTO discussion_posts (project_id, user_id, message) VALUES (?, ?, ?)',
            id, user_id, message
        );
        res.status(201).json({ message: 'Message posted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- AI NOTEBOOK API ---

// Get all notes
app.get('/api/notes', async (req, res) => {
    try {
        const db = await getDb();
        const notes = await db.all('SELECT * FROM notes ORDER BY created_at DESC');
        res.json(notes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create note
app.post('/api/notes', async (req, res) => {
    try {
        const { title, content } = req.body;
        const db = await getDb();
        const result = await db.run(
            'INSERT INTO notes (title, content) VALUES (?, ?)',
            title, content
        );
        res.status(201).json({ id: result.lastID, message: 'Note created' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update note
app.put('/api/notes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        const db = await getDb();
        await db.run(
            'UPDATE notes SET title = ?, content = ? WHERE id = ?',
            title, content, id
        );
        res.json({ message: 'Note updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete note
app.delete('/api/notes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = await getDb();
        await db.run('DELETE FROM notes WHERE id = ?', id);
        res.json({ message: 'Note deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
