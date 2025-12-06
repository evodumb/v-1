import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Users, CheckSquare, Coins, MessageSquare, Clock, GraduationCap, Send, Plus } from 'lucide-react';
import clsx from 'clsx';
import { api } from '../api';
import type { ProjectDetails as IProjectDetails, BudgetRequest, ProjectTask, ProjectMember, DiscussionPost } from '../data/types';

const ProjectDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [project, setProject] = useState<IProjectDetails | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'team' | 'tasks' | 'budget' | 'discussion'>('overview');
    const [loading, setLoading] = useState(true);
    const [joinMessage, setJoinMessage] = useState('');
    const [discussionMsg, setDiscussionMsg] = useState('');
    const [discussionPosts, setDiscussionPosts] = useState<DiscussionPost[]>([]);

    // Mock user for now
    const CURRENT_USER_ID = 1;

    useEffect(() => {
        if (id) loadData();
    }, [id]);

    useEffect(() => {
        if (activeTab === 'discussion' && id) {
            loadDiscussion();
        }
    }, [activeTab, id]);

    const loadData = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const data = await api.getProjectDetails(id);
            setProject(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const loadDiscussion = async () => {
        if (!id) return;
        try {
            const posts = await api.getDiscussion(id);
            setDiscussionPosts(posts);
        } catch (error) {
            console.error(error);
        }
    };

    const handleJoin = async () => {
        if (!id) return;
        try {
            await api.joinProject(id, CURRENT_USER_ID, joinMessage);
            alert('Join request sent!');
            setJoinMessage('');
        } catch (error) {
            alert('Failed to join');
        }
    };

    const postMessage = async () => {
        if (!id || !discussionMsg.trim()) return;
        try {
            await api.postDiscussion(id, CURRENT_USER_ID, discussionMsg);
            setDiscussionMsg('');
            loadDiscussion();
        } catch (error) {
            console.error(error);
        }
    };

    const isMember = project?.members.some(m => m.user_id === CURRENT_USER_ID && m.status === 'approved');
    const isCreator = project?.creator_id === CURRENT_USER_ID;

    if (loading) return <div className="p-10 text-center">Loading...</div>;
    if (!project) return <div className="p-10 text-center">Project not found</div>;

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <div className="bg-white p-4 shadow-sm sticky top-0 z-10">
                <div className="flex items-center gap-3 mb-2">
                    <button onClick={() => navigate(-1)} className="p-1">
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-xl font-bold line-clamp-1 flex-1">{project.title}</h1>
                    <span className={clsx("text-xs px-2 py-1 rounded-full font-bold",
                        project.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    )}>
                        {project.status}
                    </span>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-hide text-sm font-medium">
                    {[
                        { id: 'overview', label: 'Overview' },
                        { id: 'team', label: 'Team' },
                        { id: 'tasks', label: 'Tasks' },
                        { id: 'budget', label: 'Budget' },
                        { id: 'discussion', label: 'Chat' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={clsx(
                                "whitespace-nowrap pb-2 border-b-2 px-1 transition-colors",
                                activeTab === tab.id ? "border-primary text-primary font-bold" : "border-transparent text-gray-500"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 pb-24">
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
                            <div>
                                <h3 className="text-sm font-bold text-gray-500 mb-1">DESCRIPTION</h3>
                                <p className="text-text-primary">{project.description}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-500 mb-1">GOAL</h3>
                                <p className="text-text-primary">{project.goal}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div className="bg-blue-50 p-3 rounded-lg">
                                    <div className="text-blue-500 text-xs font-bold uppercase mb-1">Required Budget</div>
                                    <div className="text-xl font-bold text-blue-700">₹{project.budget_needed}</div>
                                </div>
                                <div className="bg-purple-50 p-3 rounded-lg">
                                    <div className="text-purple-500 text-xs font-bold uppercase mb-1">Timeline</div>
                                    <div className="text-lg font-bold text-purple-700">3 Months</div>
                                </div>
                            </div>
                        </div>

                        {!isMember && project.status === 'Open' && (
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-primary/20">
                                <h3 className="font-bold text-lg mb-2">Join this Project</h3>
                                <textarea
                                    className="w-full p-3 bg-gray-50 rounded-lg text-sm mb-3 outline-none border border-gray-200"
                                    placeholder="Why do you want to join?"
                                    rows={2}
                                    value={joinMessage}
                                    onChange={e => setJoinMessage(e.target.value)}
                                />
                                <button
                                    onClick={handleJoin}
                                    className="w-full bg-primary text-white py-3 rounded-lg font-bold shadow-lg shadow-primary/20 hover:bg-primary/90"
                                >
                                    Request to Join
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'team' && (
                    <div className="space-y-3">
                        {project.members.map(member => (
                            <div key={member.id} className="bg-white p-3 rounded-xl shadow-sm flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">
                                        {member.name[0]}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">{member.name}</p>
                                        <p className="text-xs text-gray-500">{member.role}</p>
                                    </div>
                                </div>
                                <span className={clsx("text-xs px-2 py-1 rounded-full",
                                    member.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                )}>
                                    {member.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'tasks' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-lg">Project Tasks</h3>
                            {isMember && (
                                <button className="text-primary text-sm font-bold flex items-center gap-1">
                                    <Plus size={16} /> Add Task
                                </button>
                            )}
                        </div>
                        {project.tasks.map(task => (
                            <div key={task.id} className="bg-white p-3 rounded-xl shadow-sm border-l-4 border-l-primary flex items-center gap-3">
                                <button className={clsx("w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center",
                                    task.status === 'Done' ? "bg-green-500 border-green-500" : "border-gray-300"
                                )}>
                                    {task.status === 'Done' && <CheckSquare size={14} className="text-white" />}
                                </button>
                                <div className="flex-1">
                                    <p className={clsx("font-medium", task.status === 'Done' && "line-through text-gray-400")}>
                                        {task.title}
                                    </p>
                                    <p className="text-xs text-gray-400">Due: {task.deadline || 'No deadline'}</p>
                                </div>
                                <span className="text-xs font-bold px-2 py-1 bg-gray-100 rounded-md text-gray-600">
                                    {task.status}
                                </span>
                            </div>
                        ))}
                        {project.tasks.length === 0 && <p className="text-center text-gray-400 py-10">No tasks yet.</p>}
                    </div>
                )}

                {activeTab === 'budget' && (
                    <div className="space-y-4">
                        <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                            <p className="text-sm text-gray-500">Total Budget Needed</p>
                            <p className="text-2xl font-bold text-primary">₹{project.budget_needed}</p>
                        </div>

                        <h3 className="font-bold text-lg mt-4">Requests</h3>
                        {project.budget.map(req => (
                            <div key={req.id} className="bg-white p-3 rounded-xl shadow-sm">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-sm">{req.title}</h4>
                                    <span className="font-bold text-green-600">₹{req.amount}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{req.reason}</p>
                                <div className="mt-2 text-xs flex justify-between items-center">
                                    <span className={clsx("px-2 py-1 rounded-full",
                                        req.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                    )}>
                                        {req.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {isMember && (
                            <button className="w-full border-2 border-dashed border-gray-300 p-3 rounded-xl text-gray-500 font-bold hover:bg-gray-50">
                                + Request Funds
                            </button>
                        )}
                    </div>
                )}

                {activeTab === 'discussion' && (
                    <div className="flex flex-col h-full h-[60vh]">
                        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                            {discussionPosts.map(post => (
                                <div key={post.id} className={clsx("flex gap-2 max-w-[85%]",
                                    post.user_id === CURRENT_USER_ID ? "self-end flex-row-reverse" : "self-start"
                                )}>
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-xs font-bold">
                                        {post.name[0]}
                                    </div>
                                    <div className={clsx("p-3 rounded-2xl text-sm",
                                        post.user_id === CURRENT_USER_ID ? "bg-primary text-white rounded-tr-none" : "bg-white text-gray-800 shadow-sm rounded-tl-none"
                                    )}>
                                        <p className="font-bold text-[10px] opacity-70 mb-1">{post.name}</p>
                                        {post.message}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex gap-2">
                            <input
                                className="flex-1 p-3 rounded-full border border-gray-200 focus:border-primary outline-none"
                                placeholder="Type a message..."
                                value={discussionMsg}
                                onChange={e => setDiscussionMsg(e.target.value)}
                            />
                            <button
                                onClick={postMessage}
                                className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white shadow-lg disabled:opacity-50"
                                disabled={!discussionMsg.trim()}
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectDetails;
