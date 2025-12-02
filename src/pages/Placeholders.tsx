

const Placeholder = ({ title }: { title: string }) => (
    <div className="p-6">
        <h1 className="text-2xl font-bold text-primary mb-4">{title}</h1>
        <p className="text-text-secondary">This screen is under construction.</p>
    </div>
);

export const Splash = () => <Placeholder title="Splash Screen" />;
export const Onboarding = () => <Placeholder title="Onboarding" />;
export const Home = () => <Placeholder title="Home" />;
export const Classes = () => <Placeholder title="Classes" />;
export const Chapter = () => <Placeholder title="Chapter" />;
export const LessonPlayer = () => <Placeholder title="Lesson Player" />;
export const Quiz = () => <Placeholder title="Quiz" />;
export const Progress = () => <Placeholder title="Progress" />;
export const VoiceAssistant = () => <Placeholder title="Voice Assistant" />;
export const Timetable = () => <Placeholder title="Timetable" />;
export const TeacherMode = () => <Placeholder title="Teacher Mode" />;
export const Settings = () => <Placeholder title="Settings" />;
