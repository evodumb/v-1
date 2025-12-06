import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Search, Filter, BookOpen, Briefcase, GraduationCap } from 'lucide-react';
import clsx from 'clsx';
import { api } from '../api';
import type { Project } from '../data/types';

const ProjectsHome = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [filter, setFilter] = useState<string>('all'); // all, my, open, under_professor
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProjects();
    }, [filter]);

    const loadProjects = async () => {
        setLoading(true);
        try {
            // Mock userId = 1 for "My Projects" filter since we don't have auth yet
            const userId = 1;
            const data = await api.getProjects(filter === 'all' ? undefined : filter, userId);
            setProjects(data);
        } catch (error) {
            console.error("Failed to load projects", error);
        } finally {
            setLoading(false);
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const colors = {
            'Open': 'bg-green-100 text-green-700',
            'Closed': 'bg-red-100 text-red-700',
            'Under Review': 'bg-yellow-100 text-yellow-700'
        };
        return (
            <span className={`text-xs px-2 py-1 rounded-full font-bold ${colors[status as keyof typeof colors] || 'bg-gray-100'}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="p-6 space-y-6 pb-24">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-display font-bold text-text-primary">Projects</h2>
                <button
                    onClick={() => navigate('/projects/create')}
                    className="bg-primary text-white p-2 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
                >
                    <Plus size={24} />
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {[
                    { id: 'all', label: 'All Projects' },
                    { id: 'my', label: 'My Projects' },
                    { id: 'open', label: 'Open' },
                    { id: 'under_professor', label: 'Under Professor' }
                ].map(f => (
                    <button
                        key={f.id}
                        onClick={() => setFilter(f.id)}
                        className={clsx(
                            "px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all",
                            filter === f.id
                                ? "bg-primary text-white shadow-md"
                                : "bg-white text-text-secondary border border-gray-100"
                        )}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-10 text-gray-500">Loading projects...</div>
                ) : projects.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-2xl border border-gray-100">
                        <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-text-secondary font-medium">No projects found.</p>
                        <button
                            onClick={() => navigate('/projects/create')}
                            className="mt-4 text-primary font-bold text-sm"
                        >
                            Create your first project
                        </button>
                    </div>
                ) : (
                    projects.map(project => (
                        <div
                            key={project.id}
                            onClick={() => navigate(`/projects/${project.id}`)}
                            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 active:scale-98 transition-transform cursor-pointer"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-text-primary text-lg line-clamp-1">{project.title}</h3>
                                <StatusBadge status={project.status} />
                            </div>

                            <p className="text-sm text-text-secondary line-clamp-2 mb-3">
                                {project.description}
                            </p>

                            {project.professor_id && (
                                <div className="flex items-center gap-2 text-xs text-purple-600 font-medium mb-3 bg-purple-50 px-2 py-1 rounded-lg w-fit">
                                    <GraduationCap size={14} />
                                    <span>Under Professor Guidance</span>
                                </div>
                            )}

                            <div className="flex justify-between items-center text-xs text-text-light border-t border-gray-50 pt-3 mt-1">
                                <div className="flex items-center gap-1">
                                    <span className="font-medium">By {project.creatorName || 'Student'}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Users size={14} />
                                    <span>{project.memberCount || 1} Members</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProjectsHome;
