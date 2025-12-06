import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, BookOpen, BrainCircuit, BarChart3, Settings as SettingsIcon, ChevronLeft, Briefcase, NotebookPen } from 'lucide-react';
import clsx from 'clsx';

const Layout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Hide bottom nav on these routes
    const hideBottomNavRoutes = ['/', '/onboarding', '/lesson', '/quiz'];
    const showBottomNav = !hideBottomNavRoutes.some(route => location.pathname.startsWith(route) && route !== '/');

    // Hide top bar on these routes
    const hideTopBarRoutes = ['/', '/onboarding'];
    const showTopBar = !hideTopBarRoutes.includes(location.pathname);

    const navItems = [
        { icon: Home, label: 'Home', path: '/home' },
        { icon: BookOpen, label: 'Classes', path: '/classes' },
        { icon: Briefcase, label: 'Projects', path: '/projects' },
        { icon: NotebookPen, label: 'Notebook', path: '/notebook' },
        { icon: BrainCircuit, label: 'Quizzes', path: '/quizzes' },
        { icon: BarChart3, label: 'Progress', path: '/progress' },
        { icon: SettingsIcon, label: 'Settings', path: '/settings' },
    ];

    return (
        <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden relative">
            {/* Top Bar */}
            {showTopBar && (
                <header className="bg-primary text-white p-4 flex items-center gap-3 sticky top-0 z-10 shadow-md">
                    {location.pathname !== '/home' && (
                        <button onClick={() => navigate(-1)} className="p-1 hover:bg-white/10 rounded-full">
                            <ChevronLeft size={24} />
                        </button>
                    )}
                    <h1 className="text-xl font-display font-bold">Village Smart Learning</h1>
                </header>
            )}

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto pb-20">
                <Outlet />
            </main>

            {/* Bottom Navigation */}
            {showBottomNav && (
                <nav className="bg-surface border-t border-gray-200 fixed bottom-0 w-full max-w-md pb-safe">
                    <div className="flex justify-around items-center p-2">
                        {navItems.map((item) => {
                            const isActive = location.pathname.startsWith(item.path);
                            return (
                                <button
                                    key={item.path}
                                    onClick={() => navigate(item.path)}
                                    className={clsx(
                                        "flex flex-col items-center p-2 rounded-xl transition-all duration-200",
                                        isActive ? "text-primary bg-primary/10" : "text-text-light hover:text-primary/70"
                                    )}
                                >
                                    <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                    <span className="text-xs font-medium mt-1">{item.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </nav>
            )}
        </div>
    );
};

export default Layout;
