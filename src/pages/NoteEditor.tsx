import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Wand2, Save, Eye, Edit3, MessageCircle, X, Send, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { api } from '../api';
import clsx from 'clsx';

const NoteEditor = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isPreview, setIsPreview] = useState(false);
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);

    // Chat State
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
        { role: 'model', text: 'Hi! Ask me anything about this note.' }
    ]);
    const [chatLoading, setChatLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Get API Key from environment variable
    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

    useEffect(() => {
        if (id && id !== 'new') {
            loadNote();
        }
    }, [id]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages, isChatOpen]);

    const loadNote = async () => {
        try {
            const notes = await api.getNotes();
            const note = notes.find(n => n.id === parseInt(id!));
            if (note) {
                setTitle(note.title);
                setContent(note.content);
            }
        } catch (error) {
            console.error("Failed to load note", error);
        }
    };

    const handleSave = async () => {
        if (!title.trim()) return alert("Title is required");
        setLoading(true);
        try {
            if (id === 'new') {
                await api.createNote({ title, content });
            } else {
                await api.updateNote(parseInt(id!), { title, content });
            }
            navigate('/notebook');
        } catch (error) {
            console.error("Failed to save note", error);
            alert("Failed to save note");
        } finally {
            setLoading(false);
        }
    };

    const handleAskAI = async () => {
        if (!GEMINI_API_KEY) return alert("Please add VITE_GEMINI_API_KEY to .env");
        setAiLoading(true);
        try {
            const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = content
                ? `Summarize and improve this note:\n\n${content}`
                : `Write a short note about specific topics in ${title || 'general knowledge'}`;
            const result = await model.generateContent(prompt);
            setContent(prev => prev + "\n\n**AI Generated:**\n" + result.response.text());
        } catch (error) {
            console.error("AI Generation failed", error);
            alert("AI generation failed.");
        } finally {
            setAiLoading(false);
        }
    };

    const handleChatSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!chatInput.trim() || !GEMINI_API_KEY) return;

        const userMsg = chatInput;
        setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setChatInput('');
        setChatLoading(true);

        try {
            const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `Context (The user's current note content):\n${content || "(Empty Note)"}\n\nUser Question:\n${userMsg}\n\nAnswer the user's question based on the note context if applicable, or general knowledge. Keep it concise.`;

            const result = await model.generateContent(prompt);
            setChatMessages(prev => [...prev, { role: 'model', text: result.response.text() }]);
        } catch (error) {
            setChatMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error." }]);
        } finally {
            setChatLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-white overflow-hidden relative">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white z-20">
                <div className="flex items-center gap-2">
                    <button onClick={() => navigate(-1)} className="p-1 rounded-full hover:bg-gray-100">
                        <ChevronLeft size={24} className="text-text-primary" />
                    </button>
                    <input
                        type="text"
                        placeholder="Untitled Note"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="text-lg font-bold outline-none bg-transparent w-48"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsChatOpen(!isChatOpen)}
                        className={clsx(
                            "p-2 rounded-full transition-colors",
                            isChatOpen ? "bg-primary text-white" : "text-gray-500 hover:bg-gray-100"
                        )}
                    >
                        <MessageCircle size={20} />
                    </button>
                    <button
                        onClick={() => setIsPreview(!isPreview)}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                    >
                        {isPreview ? <Edit3 size={20} /> : <Eye size={20} />}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex items-center gap-1 px-4 py-2 bg-primary text-white rounded-full font-bold text-sm hover:bg-primary/90 disabled:opacity-70"
                    >
                        <Save size={16} /> Save
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden relative">
                <div className="flex-1 overflow-hidden relative">
                    {isPreview ? (
                        <div className="h-full overflow-y-auto p-4 prose prose-sm max-w-none">
                            <ReactMarkdown>{content}</ReactMarkdown>
                        </div>
                    ) : (
                        <textarea
                            className="w-full h-full p-4 resize-none outline-none text-base leading-relaxed font-mono"
                            placeholder="Start typing... use Markdown!"
                            value={content}
                            onChange={e => setContent(e.target.value)}
                        />
                    )}

                    {/* Summarize Fab (Only show if chat is closed or on mobile it might overlay) */}
                    {!isChatOpen && (
                        <button
                            onClick={handleAskAI}
                            disabled={aiLoading}
                            className="absolute bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-105 transition-transform disabled:opacity-70"
                        >
                            {aiLoading ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" /> : <Wand2 size={24} />}
                        </button>
                    )}
                </div>

                {/* Chat Sidebar */}
                <div
                    className={clsx(
                        "absolute right-0 top-0 bottom-0 w-80 bg-white border-l border-gray-200 shadow-2xl transition-transform duration-300 transform flex flex-col z-30",
                        isChatOpen ? "translate-x-0" : "translate-x-full"
                    )}
                >
                    <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 className="font-bold text-gray-700 flex items-center gap-2">
                            <Bot size={18} className="text-primary" /> Chat with Note
                        </h3>
                        <button onClick={() => setIsChatOpen(false)} className="text-gray-400 hover:text-gray-600">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                        {chatMessages.map((msg, idx) => (
                            <div key={idx} className={clsx("flex gap-2", msg.role === 'user' ? "flex-row-reverse" : "")}>
                                <div className={clsx(
                                    "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
                                    msg.role === 'user' ? "bg-primary text-white" : "bg-white border border-gray-200 text-purple-600"
                                )}>
                                    {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                                </div>
                                <div className={clsx(
                                    "p-2 rounded-xl text-sm max-w-[85%]",
                                    msg.role === 'user'
                                        ? "bg-primary text-white rounded-tr-none"
                                        : "bg-white border border-gray-200 text-gray-700 rounded-tl-none shadow-sm"
                                )}>
                                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                                </div>
                            </div>
                        ))}
                        {chatLoading && (
                            <div className="flex gap-2">
                                <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center mt-1">
                                    <Bot size={12} className="text-purple-600" />
                                </div>
                                <div className="bg-white border border-gray-200 p-2 rounded-xl rounded-tl-none shadow-sm text-gray-500 text-xs flex items-center gap-1">
                                    Thinking <span className="animate-pulse">...</span>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    <form onSubmit={handleChatSubmit} className="p-3 border-t border-gray-100 bg-white">
                        <div className="relative">
                            <input
                                type="text"
                                value={chatInput}
                                onChange={e => setChatInput(e.target.value)}
                                placeholder="Ask about this note..."
                                className="w-full pl-4 pr-10 py-2 bg-gray-100 rounded-full text-sm outline-none focus:ring-2 focus:ring-primary/20"
                            />
                            <button
                                type="submit"
                                disabled={chatLoading || !chatInput.trim()}
                                className="absolute right-1 top-1 p-1.5 bg-primary text-white rounded-full disabled:opacity-50 hover:bg-primary/90 transition-colors"
                            >
                                <Send size={14} />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NoteEditor;
