import { useNavigate } from 'react-router-dom';
import { BookOpen, BrainCircuit, Mic, BarChart3, Settings, GraduationCap, PlayCircle, Quote } from 'lucide-react';
import clsx from 'clsx';
import { CHAPTERS } from '../data/mockData';

const Home = () => {
    const navigate = useNavigate();
    const lastStudiedChapter = CHAPTERS[0]; // Mock last studied

    const MENU_ITEMS = [
        { title: 'Classes', icon: BookOpen, path: '/classes', color: 'bg-blue-500', shadow: 'shadow-blue-500/30' },
        { title: 'Quizzes', icon: BrainCircuit, path: '/quizzes', color: 'bg-green-500', shadow: 'shadow-green-500/30' },
        { title: 'Voice Assistant', icon: Mic, path: '/voice-assistant', color: 'bg-purple-500', shadow: 'shadow-purple-500/30' },
        { title: 'Progress', icon: BarChart3, path: '/progress', color: 'bg-orange-500', shadow: 'shadow-orange-500/30' },
        { title: 'Teacher Mode', icon: GraduationCap, path: '/teacher-mode', color: 'bg-pink-500', shadow: 'shadow-pink-500/30' },
        { title: 'Settings', icon: Settings, path: '/settings', color: 'bg-gray-500', shadow: 'shadow-gray-500/30' },
    ];

    return (
        <div className="p-6 space-y-6">
            {/* Daily Quote */}
            <div className="bg-gradient-to-r from-accent to-accent-dark rounded-2xl p-6 text-white shadow-lg shadow-accent/20 relative overflow-hidden">
                <Quote className="absolute top-2 right-2 text-white/20" size={48} />
                <p className="text-lg font-medium italic mb-2 relative z-10">"Education is the most powerful weapon which you can use to change the world."</p>
                <p className="text-sm text-white/80 font-bold relative z-10">- Nelson Mandela</p>
            </div>

            {/* Continue Learning */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-lg text-text-primary">Continue Learning</h3>
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">Maths</span>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                            src={lastStudiedChapter.thumbnail}
                            alt={lastStudiedChapter.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <PlayCircle className="text-white" size={24} />
                        </div>
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-text-primary line-clamp-1">{lastStudiedChapter.title}</h4>
                        <p className="text-xs text-text-secondary mb-2 line-clamp-1">{lastStudiedChapter.description}</p>
                        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-primary h-full w-3/4 rounded-full"></div>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => navigate(`/lesson/${lastStudiedChapter.id}`)}
                    className="w-full mt-3 py-2 text-sm font-bold text-primary bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors"
                >
                    Resume Lesson
                </button>
            </div>

            {/* Main Menu Grid */}
            <div className="grid grid-cols-2 gap-4">
                {MENU_ITEMS.map((item) => (
                    <button
                        key={item.title}
                        onClick={() => navigate(item.path)}
                        className={clsx(
                            "flex flex-col items-center justify-center p-6 rounded-2xl transition-transform active:scale-95",
                            "bg-white border border-gray-100 shadow-sm hover:shadow-md"
                        )}
                    >
                        <div className={clsx("w-14 h-14 rounded-full flex items-center justify-center mb-3 text-white shadow-lg", item.color, item.shadow)}>
                            <item.icon size={28} />
                        </div>
                        <span className="font-bold text-text-primary text-sm">{item.title}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Home;
