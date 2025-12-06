import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Volume2, Mic, FileText, Play, Pause, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { api } from '../api';
import type { Chapter } from '../data/types';

const LessonPlayer = () => {
    const { lessonId } = useParams();
    const navigate = useNavigate();
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeTab, setActiveTab] = useState<'video' | 'notes'>('video');
    const [chapter, setChapter] = useState<Chapter | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadChapter = async () => {
            if (!lessonId) return;
            try {
                // In our mock data structure, lessonId is the same as chapterId
                const data = await api.getChapterById(lessonId);
                setChapter(data);
            } catch (error) {
                console.error("Failed to load lesson", error);
            } finally {
                setLoading(false);
            }
        };
        loadChapter();
    }, [lessonId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    if (!chapter) return <div>Lesson not found</div>;

    return (
        <div className="flex flex-col h-screen bg-background">
            {/* Video Player Area */}
            <div className="relative w-full aspect-video bg-black flex items-center justify-center">
                <img
                    src={chapter.thumbnail}
                    alt={chapter.title}
                    className={clsx("w-full h-full object-cover opacity-50", isPlaying && "hidden")}
                />

                {!isPlaying && (
                    <button
                        onClick={() => setIsPlaying(true)}
                        className="absolute z-10 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                    >
                        <Play size={32} className="text-white ml-1" />
                    </button>
                )}

                {isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-white">Video Playing Simulation...</p>
                        <button
                            onClick={() => setIsPlaying(false)}
                            className="absolute bottom-4 left-4 text-white"
                        >
                            <Pause size={24} />
                        </button>
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('video')}
                        className={clsx(
                            "flex-1 py-3 font-bold text-sm flex items-center justify-center gap-2",
                            activeTab === 'video' ? "text-primary border-b-2 border-primary" : "text-text-secondary"
                        )}
                    >
                        <Play size={16} /> Lesson
                    </button>
                    <button
                        onClick={() => setActiveTab('notes')}
                        className={clsx(
                            "flex-1 py-3 font-bold text-sm flex items-center justify-center gap-2",
                            activeTab === 'notes' ? "text-primary border-b-2 border-primary" : "text-text-secondary"
                        )}
                    >
                        <FileText size={16} /> Notes
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <h1 className="text-2xl font-display font-bold text-text-primary mb-2">{chapter.title}</h1>
                    <p className="text-text-secondary mb-6">{chapter.description}</p>

                    {activeTab === 'notes' && (
                        <div className="prose prose-sm max-w-none">
                            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 mb-4">
                                <h3 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
                                    <FileText size={16} /> Lesson Notes
                                </h3>
                                <p className="text-yellow-900/80 whitespace-pre-wrap font-medium leading-relaxed">
                                    {chapter.notes}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <button className="btn btn-secondary py-4">
                            <Volume2 size={20} />
                            Read Aloud
                        </button>
                        <button className="btn btn-accent py-4">
                            <Mic size={20} />
                            Ask Doubt
                        </button>
                    </div>
                </div>

                {/* Bottom Navigation */}
                <div className="p-4 border-t border-gray-200 bg-white flex justify-between items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-text-secondary font-medium hover:text-primary"
                    >
                        <ChevronLeft size={20} /> Previous
                    </button>
                    <button
                        onClick={() => navigate('/quizzes')}
                        className="btn btn-primary py-2 px-6 text-sm"
                    >
                        Take Quiz <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LessonPlayer;
