import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

const Splash = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/onboarding');
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen bg-primary flex flex-col items-center justify-center text-white p-6">
            <div className="bg-white/20 p-6 rounded-full mb-6 animate-bounce">
                <GraduationCap size={64} className="text-white" />
            </div>
            <h1 className="text-4xl font-display font-bold mb-2 text-center">Village Smart Learning</h1>
            <p className="text-lg text-white/80 text-center">Offline Education for Everyone</p>

            <div className="mt-12 flex gap-2">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-white rounded-full animate-pulse delay-100"></div>
                <div className="w-3 h-3 bg-white rounded-full animate-pulse delay-200"></div>
            </div>
        </div>
    );
};

export default Splash;
