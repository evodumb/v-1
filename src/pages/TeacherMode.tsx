import { useState, useEffect } from 'react';
import { Lock, Upload, FilePlus, BrainCircuit, Bluetooth, Users, ChevronRight, ArrowLeft, Check, Plus, Trash2, FolderOpen, CheckCircle, XCircle } from 'lucide-react';
import clsx from 'clsx';
import { api } from '../api';
import type { Subject, ProgressStats, Project } from '../data/types';

const TeacherMode = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [activeView, setActiveView] = useState<'menu' | 'analytics' | 'add-lesson' | 'create-quiz' | 'projects'>('menu');
    const [subjects, setSubjects] = useState<Subject[]>([]);

    // Form States
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        if (isAuthenticated && activeView !== 'menu') {
            loadSubjects();
        }
    }, [isAuthenticated, activeView]);

    const loadSubjects = async () => {
        try {
            const data = await api.getSubjects();
            setSubjects(data);
        } catch (e) {
            console.error("Failed to load subjects", e);
        }
    };

    const handleLogin = () => {
        if (password === 'admin123') {
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('Invalid Password');
        }
    };

    const goBack = () => {
        setActiveView('menu');
        setSuccessMsg('');
        setError('');
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
                <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-sm text-center">
                    <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 text-pink-600">
                        <Lock size={32} />
                    </div>
                    <h2 className="text-2xl font-display font-bold text-text-primary mb-2">Teacher Mode</h2>
                    <p className="text-text-secondary mb-6">Please enter the admin password to continue.</p>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter Password"
                        className="w-full p-4 rounded-xl border border-gray-200 mb-4 focus:border-primary outline-none text-center text-lg"
                    />

                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                    <button
                        onClick={handleLogin}
                        className="btn btn-primary w-full"
                    >
                        Unlock Panel
                    </button>
                </div>
            </div>
        );
    }

    const MENU_ITEMS = [
        { id: 'projects', title: 'Manage Projects', icon: FolderOpen, color: 'bg-indigo-500' },
        { id: 'add-lesson', title: 'Add New Lesson', icon: FilePlus, color: 'bg-green-500' },
        { id: 'create-quiz', title: 'Create Quiz', icon: BrainCircuit, color: 'bg-purple-500' },
        { id: 'analytics', title: 'Student Analytics', icon: Users, color: 'bg-orange-500' },
        { id: 'upload', title: 'Upload Content Pack', icon: Upload, color: 'bg-blue-500' },
        { id: 'ble', title: 'Import via Bluetooth', icon: Bluetooth, color: 'bg-indigo-500' },
    ];

    const renderMenu = () => (
        <>
            <h2 className="text-2xl font-display font-bold text-text-primary mb-6">Admin Panel</h2>

            <div className="space-y-4">
                {MENU_ITEMS.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => {
                            if (['add-lesson', 'create-quiz', 'analytics', 'projects'].includes(item.id)) {
                                setActiveView(item.id as any);
                            }
                        }}
                        className="w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:border-primary/50 transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md", item.color)}>
                                <item.icon size={24} />
                            </div>
                            <span className="font-bold text-text-primary">{item.title}</span>
                        </div>
                        <ChevronRight className="text-gray-300 group-hover:text-primary transition-colors" />
                    </button>
                ))}
            </div>

            <div className="mt-8 p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                <h3 className="font-bold text-yellow-800 mb-2">Storage Status</h3>
                <div className="w-full bg-yellow-200 h-2 rounded-full overflow-hidden mb-2">
                    <div className="bg-yellow-500 h-full w-[75%]"></div>
                </div>
                <p className="text-xs text-yellow-700">12.5 GB used of 16 GB</p>
            </div>
        </>
    );

    return (
        <div className="p-6 pb-24 min-h-screen bg-gray-50">
            {activeView !== 'menu' && (
                <button onClick={goBack} className="flex items-center gap-2 text-text-secondary hover:text-primary mb-4 font-medium transition-colors">
                    <ArrowLeft size={20} />
                    Back to Menu
                </button>
            )}

            {activeView === 'menu' && renderMenu()}
            {activeView === 'analytics' && <AnalyticsView />}
            {activeView === 'add-lesson' && <AddLessonView subjects={subjects} />}
            {activeView === 'create-quiz' && <CreateQuizView subjects={subjects} />}
            {activeView === 'projects' && <ProjectsManagerView />}
        </div>
    );
};

// --- Sub-Components ---

const ProjectsManagerView = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            // Fetch all projects (we can filter in UI or API)
            const data = await api.getProjects();
            // In a real app we might only want 'Open' or 'Under Review' projects, but let's show all for admin
            setProjects(data);
        } catch (e) {
            console.error("Failed to load projects", e);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (projectId: string, newStatus: 'Open' | 'Closed' | 'Under Review') => {
        try {
            await api.updateProject(projectId, { status: newStatus });
            loadProjects(); // Refresh
        } catch (e) {
            console.error("Failed to update status", e);
        }
    };

    if (loading) return <div className="text-center p-8">Loading projects...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-text-primary">Manage Projects</h2>

            {projects.length === 0 ? (
                <div className="text-center text-gray-500 p-8">No projects found.</div>
            ) : (
                <div className="space-y-4">
                    {projects.map((project) => (
                        <div key={project.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-lg text-text-primary">{project.title}</h3>
                                    <p className="text-xs text-text-secondary">Created by {project.creatorName}</p>
                                </div>
                                <span className={clsx(
                                    "px-3 py-1 rounded-full text-xs font-bold",
                                    project.status === 'Open' ? "bg-green-100 text-green-700" :
                                        project.status === 'Closed' ? "bg-gray-100 text-gray-700" :
                                            "bg-yellow-100 text-yellow-700"
                                )}>
                                    {project.status}
                                </span>
                            </div>
                            <p className="text-sm text-text-secondary mb-4 line-clamp-2">{project.description}</p>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => updateStatus(project.id, 'Under Review')}
                                    disabled={project.status === 'Under Review'}
                                    className="flex-1 py-2 rounded-xl text-sm font-bold border border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 disabled:opacity-50"
                                >
                                    Flag for Review
                                </button>
                                <button
                                    onClick={() => updateStatus(project.id, 'Closed')}
                                    disabled={project.status === 'Closed'}
                                    className="flex-1 py-2 rounded-xl text-sm font-bold border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                                >
                                    Close Project
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const AnalyticsView = () => {
    const [stats, setStats] = useState<ProgressStats | null>(null);

    useEffect(() => {
        api.getStats().then(setStats);
    }, []);

    if (!stats) return <div className="text-center p-8">Loading stats...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-text-primary">Student Analytics</h2>
            <div className="grid grid-cols-2 gap-4">
                <StatCard title="Total Hours" value={stats.totalHours} color="bg-blue-500" />
                <StatCard title="Lessons Done" value={stats.lessonsCompleted} color="bg-green-500" />
                <StatCard title="Quizzes Taken" value={stats.quizzesTaken} color="bg-purple-500" />
                <StatCard title="Avg Score" value={`${stats.averageScore}%`} color="bg-orange-500" />
            </div>
        </div>
    );
};

const StatCard = ({ title, value, color }: { title: string, value: string | number, color: string }) => (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className={clsx("w-3 h-3 rounded-full mb-2", color)}></div>
        <p className="text-text-secondary text-sm">{title}</p>
        <p className="text-2xl font-bold text-text-primary">{value}</p>
    </div>
);

const AddLessonView = ({ subjects }: { subjects: Subject[] }) => {
    const [formData, setFormData] = useState({
        subjectId: '',
        title: '',
        description: '',
        videoUrl: '',
        notes: ''
    });
    const [msg, setMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.createChapter({
                id: crypto.randomUUID(),
                ...formData
            });
            setMsg('Lesson added successfully!');
            setFormData({ subjectId: '', title: '', description: '', videoUrl: '', notes: '' });
        } catch (error) {
            setMsg('Error adding lesson.');
        }
    };

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6">Add New Lesson</h2>
            {msg && <div className={clsx("p-3 rounded-lg mb-4 text-sm font-bold", msg.includes('Error') ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600")}>{msg}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-text-secondary mb-1">Subject</label>
                    <select
                        required
                        className="w-full p-3 rounded-xl border border-gray-200 focus:border-primary outline-none"
                        value={formData.subjectId}
                        onChange={e => setFormData({ ...formData, subjectId: e.target.value })}
                    >
                        <option value="">Select Subject</option>
                        {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
                <input
                    required placeholder="Lesson Title"
                    className="w-full p-3 rounded-xl border border-gray-200 outline-none"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
                <textarea
                    required placeholder="Description"
                    className="w-full p-3 rounded-xl border border-gray-200 outline-none"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
                <input
                    placeholder="Video URL (Optional)"
                    className="w-full p-3 rounded-xl border border-gray-200 outline-none"
                    value={formData.videoUrl}
                    onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                />
                <textarea
                    placeholder="Notes content (Markdown)"
                    className="w-full p-3 rounded-xl border border-gray-200 outline-none h-32"
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                />
                <button type="submit" className="btn btn-primary w-full">Create Lesson</button>
            </form>
        </div>
    );
};

const CreateQuizView = ({ subjects }: { subjects: Subject[] }) => {
    const [formData, setFormData] = useState({
        subjectId: '',
        title: '',
        level: 'Easy' as const
    });
    const [questions, setQuestions] = useState<Array<{ question: string, options: string[], correctAnswer: number }>>([
        { question: '', options: ['', '', '', ''], correctAnswer: 0 }
    ]);
    const [msg, setMsg] = useState('');

    const addQuestion = () => {
        setQuestions([...questions, { question: '', options: ['', '', '', ''], correctAnswer: 0 }]);
    };

    const updateQuestion = (idx: number, field: string, value: any) => {
        const newQs = [...questions];
        (newQs[idx] as any)[field] = value;
        setQuestions(newQs);
    };

    const updateOption = (qIdx: number, oIdx: number, value: string) => {
        const newQs = [...questions];
        newQs[qIdx].options[oIdx] = value;
        setQuestions(newQs);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.createQuiz({
                id: crypto.randomUUID(),
                ...formData,
                questions: questions.map((q, i) => ({ id: i.toString(), ...q }))
            });
            setMsg('Quiz created successfully!');
            // Reset form
            setFormData({ subjectId: '', title: '', level: 'Easy' });
            setQuestions([{ question: '', options: ['', '', '', ''], correctAnswer: 0 }]);
        } catch (error) {
            setMsg('Error creating quiz.');
        }
    };

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-6">Create New Quiz</h2>
            {msg && <div className={clsx("p-3 rounded-lg mb-4 text-sm font-bold", msg.includes('Error') ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600")}>{msg}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <select
                        required
                        className="w-full p-3 rounded-xl border border-gray-200 outline-none"
                        value={formData.subjectId}
                        onChange={e => setFormData({ ...formData, subjectId: e.target.value })}
                    >
                        <option value="">Select Subject</option>
                        {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                    <select
                        className="w-full p-3 rounded-xl border border-gray-200 outline-none"
                        value={formData.level}
                        onChange={e => setFormData({ ...formData, level: e.target.value as any })}
                    >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                </div>
                <input
                    required placeholder="Quiz Title"
                    className="w-full p-3 rounded-xl border border-gray-200 outline-none"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                />

                <div className="space-y-4">
                    <h3 className="font-bold text-lg">Questions</h3>
                    {questions.map((q, qIdx) => (
                        <div key={qIdx} className="p-4 bg-gray-50 rounded-xl border border-gray-200 relative">
                            <button
                                type="button"
                                onClick={() => setQuestions(questions.filter((_, i) => i !== qIdx))}
                                className="absolute top-2 right-2 text-red-400 hover:text-red-500"
                            >
                                <Trash2 size={18} />
                            </button>
                            <input
                                required placeholder={`Question ${qIdx + 1}`}
                                className="w-full p-2 mb-3 rounded-lg border border-gray-200 outline-none"
                                value={q.question}
                                onChange={e => updateQuestion(qIdx, 'question', e.target.value)}
                            />
                            <div className="grid grid-cols-2 gap-2">
                                {q.options.map((opt, oIdx) => (
                                    <input
                                        key={oIdx}
                                        required placeholder={`Option ${oIdx + 1}`}
                                        className={clsx(
                                            "w-full p-2 rounded-lg border outline-none text-sm transition-colors",
                                            q.correctAnswer === oIdx ? "border-green-500 bg-green-50" : "border-gray-200"
                                        )}
                                        value={opt}
                                        onChange={e => updateOption(qIdx, oIdx, e.target.value)}
                                        // Click to mark as correct (simple UI for now)
                                        onClick={(e) => {
                                            if (e.detail === 2) updateQuestion(qIdx, 'correctAnswer', oIdx); // Double click to set answer? No, let's use a radio or just a label
                                        }}
                                    />
                                ))}
                            </div>
                            <div className="mt-2 flex items-center gap-2 text-xs text-secondary">
                                <span>Correct Answer:</span>
                                {[0, 1, 2, 3].map(i => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => updateQuestion(qIdx, 'correctAnswer', i)}
                                        className={clsx(
                                            "w-6 h-6 rounded-full flex items-center justify-center font-bold border",
                                            q.correctAnswer === i ? "bg-green-500 text-white border-green-500" : "bg-white text-gray-400 border-gray-200"
                                        )}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addQuestion}
                        className="w-full py-3 border-2 border-dashed border-primary/30 text-primary font-bold rounded-xl hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
                    >
                        <Plus size={20} /> Add Question
                    </button>
                </div>

                <button type="submit" className="btn btn-primary w-full">Save Quiz</button>
            </form>
        </div>
    );
};

export default TeacherMode;
