import { BarChart3, Clock, BookOpen, Trophy, Lightbulb } from 'lucide-react';
import { MOCK_STATS, SUBJECTS } from '../data/mockData';

const Progress = () => {
    const stats = MOCK_STATS;

    return (
        <div className="p-6 pb-24">
            <h2 className="text-2xl font-display font-bold text-text-primary mb-6">Your Progress</h2>

            {/* Top Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                    <div className="flex items-center gap-2 text-blue-600 mb-2">
                        <Clock size={20} />
                        <span className="font-bold text-sm">Study Time</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-900">{stats.totalHours}h</p>
                </div>
                <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
                    <div className="flex items-center gap-2 text-green-600 mb-2">
                        <BookOpen size={20} />
                        <span className="font-bold text-sm">Lessons</span>
                    </div>
                    <p className="text-2xl font-bold text-green-900">{stats.lessonsCompleted}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100">
                    <div className="flex items-center gap-2 text-purple-600 mb-2">
                        <Trophy size={20} />
                        <span className="font-bold text-sm">Quizzes</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-900">{stats.quizzesTaken}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
                    <div className="flex items-center gap-2 text-orange-600 mb-2">
                        <BarChart3 size={20} />
                        <span className="font-bold text-sm">Avg Score</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-900">{stats.averageScore}%</p>
                </div>
            </div>

            {/* Subject Performance Graph */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
                <h3 className="font-bold text-lg text-text-primary mb-4">Subject Performance</h3>
                <div className="space-y-4">
                    {SUBJECTS.map((subject) => (
                        <div key={subject.id}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-text-secondary">{subject.name}</span>
                                <span className="font-bold text-text-primary">{subject.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${subject.color}`}
                                    style={{ width: `${subject.progress}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* AI Study Tips */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="text-yellow-300" size={24} />
                    <h3 className="font-bold text-lg">AI Study Tip</h3>
                </div>
                <p className="text-white/90 leading-relaxed">
                    "You're doing great in Math! Try spending a bit more time on Science this week to balance your progress. Watch the 'Photosynthesis' lesson again."
                </p>
            </div>

            {/* Badges */}
            <div className="mt-8">
                <h3 className="font-bold text-lg text-text-primary mb-4">Earned Badges</h3>
                <div className="flex gap-4 overflow-x-auto pb-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex-shrink-0 flex flex-col items-center">
                            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center border-4 border-yellow-200 mb-2">
                                <Trophy size={32} className="text-yellow-600" />
                            </div>
                            <span className="text-xs font-bold text-text-secondary">Level {i}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Progress;
