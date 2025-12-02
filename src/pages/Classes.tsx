import { useNavigate } from 'react-router-dom';
import { BookOpen, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { SUBJECTS } from '../data/mockData';
import * as Icons from 'lucide-react';

const Classes = () => {
    const navigate = useNavigate();

    return (
        <div className="p-6 pb-24">
            <h2 className="text-2xl font-display font-bold text-text-primary mb-6">Select Subject</h2>

            <div className="grid gap-4">
                {SUBJECTS.map((subject) => {
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
