import { useState } from 'react';
import { Mic, Bot, User, Calendar, BookOpen, Languages } from 'lucide-react';
import clsx from 'clsx';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
}

const VoiceAssistant = () => {
    const [isListening, setIsListening] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: "Namaste! I am your Village Smart Assistant. Ask me anything about your studies.", sender: 'ai' }
    ]);

    const handleMicClick = () => {
        setIsListening(!isListening);
        if (!isListening) {
            // Simulate listening and response
            setTimeout(() => {
                setIsListening(false);
                const userMsg: Message = { id: Date.now().toString(), text: "Explain photosynthesis briefly.", sender: 'user' };
                setMessages(prev => [...prev, userMsg]);

                setTimeout(() => {
                    const aiMsg: Message = {
                        id: (Date.now() + 1).toString(),
                        text: "Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to create oxygen and energy in the form of sugar.",
                        sender: 'ai'
                    };
                    setMessages(prev => [...prev, aiMsg]);
                }, 1000);
            }, 2000);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] bg-background">
            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={clsx(
                            "flex gap-3 max-w-[85%]",
                            msg.sender === 'user' ? "ml-auto flex-row-reverse" : ""
                        )}
                    >
                        <div className={clsx(
                            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                            msg.sender === 'user' ? "bg-primary text-white" : "bg-secondary text-white"
                        )}>
                            {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                        </div>
                        <div className={clsx(
                            "p-3 rounded-2xl text-sm",
                            msg.sender === 'user'
                                ? "bg-primary text-white rounded-tr-none"
                                : "bg-white border border-gray-200 text-text-primary rounded-tl-none shadow-sm"
                        )}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isListening && (
                    <div className="flex gap-3 max-w-[85%] ml-auto flex-row-reverse animate-pulse">
                        <div className="w-8 h-8 rounded-full bg-primary/50 flex items-center justify-center flex-shrink-0">
                            <User size={16} className="text-white" />
                        </div>
                        <div className="p-3 rounded-2xl bg-primary/10 text-primary text-sm rounded-tr-none">
                            Listening...
                        </div>
                    </div>
                )}
            </div>

            {/* Suggested Actions */}
            <div className="p-2 overflow-x-auto flex gap-2 no-scrollbar">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-bold text-text-secondary whitespace-nowrap hover:bg-gray-50">
                    <Calendar size={14} /> Add to Timetable
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-bold text-text-secondary whitespace-nowrap hover:bg-gray-50">
                    <BookOpen size={14} /> Explain Chapter
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-bold text-text-secondary whitespace-nowrap hover:bg-gray-50">
                    <Languages size={14} /> Translate
                </button>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-200 flex flex-col items-center">
                <button
                    onClick={handleMicClick}
                    className={clsx(
                        "w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 mb-2",
                        isListening
                            ? "bg-red-500 text-white scale-110 animate-pulse"
                            : "bg-primary text-white hover:bg-primary-dark"
                    )}
                >
                    <Mic size={32} />
                </button>
                <p className="text-xs text-text-secondary font-medium">
                    {isListening ? "Listening..." : "Tap to Ask"}
                </p>
            </div>
        </div>
    );
};

export default VoiceAssistant;
