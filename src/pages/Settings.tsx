import { useState } from 'react';
import { Globe, Type, Download, Save, Moon, Volume2, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

const Settings = () => {
    const [fontSize, setFontSize] = useState('Medium');
    const [darkMode, setDarkMode] = useState(false);

    const SECTIONS = [
        {
            title: 'Preferences',
            items: [
                { icon: Globe, label: 'App Language', value: 'English', color: 'bg-blue-500' },
                { icon: Type, label: 'Font Size', value: fontSize, color: 'bg-green-500', action: () => setFontSize(f => f === 'Medium' ? 'Large' : 'Medium') },
                { icon: Moon, label: 'Dark Mode', value: darkMode ? 'On' : 'Off', color: 'bg-purple-500', action: () => setDarkMode(!darkMode) },
                { icon: Volume2, label: 'Sound Effects', value: 'On', color: 'bg-pink-500' },
            ]
        },
        {
            title: 'Data & Storage',
            items: [
                { icon: Download, label: 'Offline Content', value: '1.2 GB', color: 'bg-orange-500' },
                { icon: Save, label: 'Backup & Restore', value: 'Last: Today', color: 'bg-indigo-500' },
            ]
        }
    ];

    return (
        <div className="p-6 pb-24">
            <h2 className="text-2xl font-display font-bold text-text-primary mb-6">Settings</h2>

            <div className="space-y-8">
                {SECTIONS.map((section) => (
                    <div key={section.title}>
                        <h3 className="text-sm font-bold text-text-secondary uppercase mb-4 ml-2">{section.title}</h3>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            {section.items.map((item, index) => (
                                <button
                                    key={item.label}
                                    onClick={item.action}
                                    className={clsx(
                                        "w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors",
                                        index !== section.items.length - 1 && "border-b border-gray-100"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center text-white", item.color)}>
                                            <item.icon size={20} />
                                        </div>
                                        <span className="font-medium text-text-primary">{item.label}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-text-secondary font-medium">{item.value}</span>
                                        <ChevronRight size={18} className="text-gray-300" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}

                <div className="text-center pt-8">
                    <p className="text-text-secondary font-medium">Village Smart Learning</p>
                    <p className="text-xs text-text-light">Version 1.0.0 • Offline Build</p>
                </div>
            </div>
        </div>
    );
};

export default Settings;
