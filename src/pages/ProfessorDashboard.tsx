import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Coins, CheckCircle, XCircle } from 'lucide-react';
import { api } from '../api';
import type { Project, BudgetRequest } from '../data/types';

const ProfessorDashboard = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    // Mock logged in professor
    const PROFESSOR_ID = 2;

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            // Fetch all projects and filter by professor_id (Inefficient but fine for MVP)
            const allProjects = await api.getProjects();
            const myProjects = allProjects.filter(p => p.professor_id === PROFESSOR_ID);
            setProjects(myProjects);
        } catch (error) {
            console.error(error);
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
                <h2 className="text-2xl font-display font-bold text-text-primary">Professor Dashboard</h2>
            </div>

            <div className="bg-purple-100 p-4 rounded-xl text-purple-800 font-medium text-sm mb-4">
                👋 Welcome, Dr. Sharma! You are guiding {projects.length} projects.
            </div>

            <div className="space-y-4">
                <h3 className="font-bold text-lg text-gray-700">Your Projects</h3>
                {loading ? (
                    <div className="text-gray-500 text-center py-4">Loading...</div>
                ) : projects.length === 0 ? (
                    <div className="text-gray-500 text-center py-4">No projects assigned yet.</div>
                ) : (
                    projects.map(project => (
                        <div
                            key={project.id}
                            onClick={() => navigate(`/projects/${project.id}`)}
                            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-lg">{project.title}</h4>
                                <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">{project.status}</span>
                            </div>
                            <p className="text-sm text-gray-500 line-clamp-1 mb-3">{project.description}</p>

                            <div className="flex gap-2 text-xs">
                                <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                    Budget: ₹{project.budget_needed}
                                </div>
                                <div className="bg-purple-50 text-purple-700 px-2 py-1 rounded">
                                    Created by: {project.creatorName}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProfessorDashboard;
