import { useState } from 'react';
import { Lock, Upload, FilePlus, BrainCircuit, Bluetooth, Users, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

const TeacherMode = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = () => {
        if (password === 'admin123') {
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('Invalid Password');
        }
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
        { title: 'Upload Content Pack', icon: Upload, color: 'bg-blue-500' },
        { title: 'Add New Lesson', icon: FilePlus, color: 'bg-green-500' },
        { title: 'Create Quiz', icon: BrainCircuit, color: 'bg-purple-500' },
        { title: 'Import via Bluetooth', icon: Bluetooth, color: 'bg-indigo-500' },
        { title: 'Student Analytics', icon: Users, color: 'bg-orange-500' },
    ];

    return (
        <div className="p-6 pb-24">
            <h2 className="text-2xl font-display font-bold text-text-primary mb-6">Admin Panel</h2>

            <div className="space-y-4">
                {MENU_ITEMS.map((item) => (
                    <button
                        key={item.title}
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
        </div>
    );
};

export default TeacherMode;
