import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WifiOff, PlayCircle, Award, Mic, ChevronRight, Check } from 'lucide-react';
import clsx from 'clsx';

const LANGUAGES = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
];

const ONBOARDING_STEPS = [
    {
        title: "Learn Offline",
        subtitle: "No Internet Needed",
        description: "Access all your lessons, quizzes, and notes without an internet connection.",
        icon: WifiOff,
        color: "bg-blue-500"
    },
    {
        title: "Watch Classes",
        subtitle: "Anytime, Anywhere",
        description: "High-quality video lessons from expert teachers available 24/7.",
        icon: PlayCircle,
        color: "bg-green-500"
    },
    {
        title: "Take Quizzes",
        subtitle: "Improve Your Skills",
        description: "Test your knowledge with fun quizzes and track your progress.",
        icon: Award,
        color: "bg-yellow-500"
    },
    {
        title: "Voice Assistant",
        subtitle: "Ask Questions Freely",
        description: "Stuck on a topic? Just ask our AI assistant in your local language.",
        icon: Mic,
        color: "bg-purple-500"
    }
];

const Onboarding = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const [showLanguageSelector, setShowLanguageSelector] = useState(true);

    const handleNext = () => {
        if (step < ONBOARDING_STEPS.length - 1) {
            setStep(step + 1);
        } else {
            navigate('/home');
        }
    };

    if (showLanguageSelector) {
        return (
            <div className="min-h-screen bg-background p-6 flex flex-col">
                <div className="flex-1 flex flex-col justify-center">
                    <h1 className="text-3xl font-display font-bold text-primary mb-2 text-center">Welcome!</h1>
                    <p className="text-text-secondary text-center mb-8">Please select your language</p>

                    <div className="space-y-3">
                        {LANGUAGES.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => setSelectedLanguage(lang.code)}
                                className={clsx(
                                    "w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all",
                                    selectedLanguage === lang.code
                                        ? "border-primary bg-primary/5"
                                        : "border-gray-200 hover:border-primary/50"
                                )}
                            >
                                <div className="flex flex-col items-start">
                                    <span className={clsx("font-bold text-lg", selectedLanguage === lang.code ? "text-primary" : "text-text-primary")}>
                                        {lang.native}
                                    </span>
                                    <span className="text-sm text-text-light">{lang.label}</span>
                                </div>
                                {selectedLanguage === lang.code && (
                                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                        <Check size={14} className="text-white" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={() => setShowLanguageSelector(false)}
                    className="btn btn-primary w-full mt-6"
                >
                    Continue
                </button>
            </div>
        );
    }

    const currentStep = ONBOARDING_STEPS[step];
    const Icon = currentStep.icon;

    return (
        <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
            {/* Background Decoration */}
            <div className={`absolute top-0 left-0 w-full h-1/2 ${currentStep.color} rounded-b-[3rem] transition-colors duration-500 ease-in-out`}></div>

            <div className="flex-1 flex flex-col items-center justify-center p-6 z-10">
                <div className="bg-white p-8 rounded-full shadow-xl mb-8 animate-fade-in">
                    <Icon size={64} className={clsx("text-gray-800", currentStep.color.replace('bg-', 'text-'))} />
                </div>

                <h2 className="text-3xl font-display font-bold text-text-primary text-center mb-2">
                    {currentStep.title}
                </h2>
                <h3 className="text-xl font-medium text-primary text-center mb-4">
                    {currentStep.subtitle}
                </h3>
                <p className="text-text-secondary text-center max-w-xs">
                    {currentStep.description}
                </p>
            </div>

            <div className="p-6 z-10">
                <div className="flex justify-center gap-2 mb-8">
                    {ONBOARDING_STEPS.map((_, index) => (
                        <div
                            key={index}
                            className={clsx(
                                "w-2 h-2 rounded-full transition-all duration-300",
                                index === step ? "w-8 bg-primary" : "bg-gray-300"
                            )}
                        />
                    ))}
                </div>

                <button
                    onClick={handleNext}
                    className="btn btn-primary w-full group"
                >
                    {step === ONBOARDING_STEPS.length - 1 ? "Get Started" : "Next"}
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default Onboarding;
