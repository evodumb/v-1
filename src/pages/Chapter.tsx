import { useParams, useNavigate } from 'react-router-dom';
import { PlayCircle, CheckCircle2, Circle, Mic, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { api } from '../api';
import type { Subject, Chapter as ChapterType } from '../data/types';

const Chapter = () => {
    const { subjectId } = useParams();
    const navigate = useNavigate();
    const [subject, setSubject] = useState<Subject | undefined>(undefined);
    const [chapters, setChapters] = useState<ChapterType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (!subjectId) return;
            try {
                // Fetch subjects to find the current one (could be optimized with getSubjectById endpoint)
                const subjects = await api.getSubjects();
                const currentSubject = subjects.find(s => s.id === subjectId);
                setSubject(currentSubject);

                const chapterData = await api.getChapters(subjectId);
                setChapters(chapterData);
            } catch (error) {
                console.error("Failed to load chapter data", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [subjectId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    if (!subject) return <div>Subject not found</div>;

    return (
        <div className="p-6 pb-24">
            <div className={clsx("bg-gradient-to-r p-6 rounded-3xl text-white mb-8 shadow-lg", subject.color.replace('bg-', 'from-').replace('500', '500').replace('bg-', 'to-').replace('500', '600'))}>
                <h1 className="text-3xl font-display font-bold mb-2">{subject.name}</h1>
                <p className="opacity-90">{chapters.length} Chapters • {subject.progress}% Completed</p>
            </div>

            <div className="space-y-4">
                {chapters.map((chapter, index) => (
                    <div key={chapter.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                        <div className="flex gap-4 mb-4">
                            <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-200">
                                <img
                                    src={chapter.thumbnail}
                                    alt={chapter.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">#{index + 1}</span>
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-text-primary line-clamp-2 mb-1">{chapter.title}</h3>
                                    {chapter.isCompleted ? (
                                        <CheckCircle2 className="text-secondary" size={20} />
                                    ) : (
                                        <Circle className="text-gray-300" size={20} />
                                    )}
                                </div>
                                <p className="text-xs text-text-secondary line-clamp-2">{chapter.description}</p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => navigate(`/lesson/${chapter.id}`)}
                                className="flex-1 btn bg-primary/10 text-primary hover:bg-primary/20 py-2 text-sm"
                            >
                                <PlayCircle size={18} />
                                Start Lesson
                            </button>
                            <button className="btn bg-accent/10 text-accent hover:bg-accent/20 py-2 px-3">
                                <Mic size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Chapter;
