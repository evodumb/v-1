import { useNavigate } from 'react-router-dom';
import { BookOpen, ChevronRight, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import * as Icons from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../api';
import type { Subject } from '../data/types';

const Classes = () => {
    const navigate = useNavigate();
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSubjects = async () => {
            try {
                const data = await api.getSubjects();
                setSubjects(data);
            } catch (error) {
                console.error("Failed to load subjects", error);
            } finally {
                setLoading(false);
            }
        };
        loadSubjects();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    return (
        <div className="p-6 pb-24">
            <h2 className="text-2xl font-display font-bold text-text-primary mb-6">Select Subject</h2>

            <div className="grid gap-4">
                {subjects.map((subject) => {
                    // Dynamically get icon component
                    const IconComponent = (Icons as any)[subject.icon] || BookOpen;

                    return (
                        <button
                            key={subject.id}
                            onClick={() => navigate(`/classes/${subject.id}`)}
                            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 transition-all active:scale-95 hover:shadow-md"
                        >
                            <div className={clsx("w-16 h-16 rounded-xl flex items-center justify-center text-white shadow-md", subject.color)}>
                                <IconComponent size={32} />
                            </div>

                            <div className="flex-1 text-left">
                                <h3 className="font-bold text-lg text-text-primary">{subject.name}</h3>
                                <p className="text-sm text-text-secondary">{subject.totalChapters} Chapters</p>

                                <div className="mt-2 w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                    <div
                                        className={clsx("h-full rounded-full", subject.color)}
                                        style={{ width: `${subject.progress}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                                <ChevronRight size={20} />
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default Classes;
