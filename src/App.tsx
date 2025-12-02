import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Splash from './pages/Splash';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Classes from './pages/Classes';
import Chapter from './pages/Chapter';
import LessonPlayer from './pages/LessonPlayer';
import Quiz from './pages/Quiz';
import Progress from './pages/Progress';
import VoiceAssistant from './pages/VoiceAssistant';
import Timetable from './pages/Timetable';
import TeacherMode from './pages/TeacherMode';
import Settings from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/onboarding" element={<Onboarding />} />

        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/classes/:subjectId" element={<Chapter />} />
          <Route path="/lesson/:lessonId" element={<LessonPlayer />} />
          <Route path="/quizzes" element={<Quiz />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/voice-assistant" element={<VoiceAssistant />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/teacher-mode" element={<TeacherMode />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
