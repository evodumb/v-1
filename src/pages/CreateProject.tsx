import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, GraduationCap, Coins } from 'lucide-react';
import { api } from '../api';
import type { Project } from '../data/types';

const CreateProject = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<Project>>({
        title: '',
        description: '',
        goal: '',
        budget_needed: 0,
        professor_id: undefined,
        creator_id: 1 // Mock user ID
    });

    const [needsProfessor, setNeedsProfessor] = useState(false);

    // Mock professors list - normally fetched from API
    const PROFESSORS = [
        { id: 2, name: 'Dr. Sharma' },
        { id: 5, name: 'Prof. Anjali' }
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.createProject({
                ...formData,
                id: `proj-${Date.now()}`, // Simple ID generation
                professor_id: needsProfessor ? formData.professor_id : undefined
            });
            navigate('/projects');
        } catch (error) {
            console.error("Failed to create project", error);
            alert("Failed to create project");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-6 pb-24">
            <div className="flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="p-1 rounded-full hover:bg-gray-100">
                    <ChevronLeft size={24} className="text-text-primary" />
                </button>
                <h2 className="text-2xl font-display font-bold text-text-primary">Create Project</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                    <label className="text-sm font-bold text-text-primary">Project Title</label>
                    <input
                        type="text"
                        required
                        className="w-full p-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                        placeholder="e.g. Solar Water Pump"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-bold text-text-primary">Short Description</label>
                    <textarea
                        required
                        rows={3}
                        className="w-full p-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
                        placeholder="What is this project about?"
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-bold text-text-primary">Goal / Problem Statement</label>
                    <textarea
                        required
                        rows={3}
                        className="w-full p-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
                        placeholder="What problem are you solving?"
                        value={formData.goal}
                        onChange={e => setFormData({ ...formData, goal: e.target.value })}
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-bold text-text-primary flex items-center gap-2">
                        <Coins size={16} />
                        Estimated Budget (₹)
                    </label>
                    <input
                        type="number"
                        min="0"
                        className="w-full p-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                        placeholder="0"
                        value={formData.budget_needed}
                        onChange={e => setFormData({ ...formData, budget_needed: parseInt(e.target.value) || 0 })}
                    />
                </div>

                <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-bold text-text-primary">Do you want a Professor to guide?</label>
                        <input
                            type="checkbox"
                            className="w-5 h-5 accent-primary"
                            checked={needsProfessor}
                            onChange={e => setNeedsProfessor(e.target.checked)}
                        />
                    </div>

                    {needsProfessor && (
                        <div className="space-y-2 animate-fadeIn">
                            <label className="text-xs text-text-secondary">Select Professor</label>
                            <select
                                className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-primary outline-none"
                                value={formData.professor_id || ''}
                                onChange={e => setFormData({ ...formData, professor_id: parseInt(e.target.value) })}
                                required={needsProfessor}
                            >
                                <option value="">-- Select Professor --</option>
                                {PROFESSORS.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-primary/90 transition-all active:scale-98 disabled:opacity-70"
                >
                    {loading ? 'Creating...' : 'Create Project'}
                </button>
            </form>
        </div>
    );
};

export default CreateProject;
