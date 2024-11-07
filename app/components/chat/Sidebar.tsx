import { Home, MessageSquare, Settings, Star, User } from 'lucide-react';
import { Logo } from '~/components/Logo';
export function Sidebar() {
    return (
        <div className="w-64 bg-zinc-900 text-white flex flex-col">
            <div className="px-4 py-6 pb-4 border-b border-zinc-800">
                <Logo fill="#fff" className="w-36 mb-2" />
                <span className="text-xs font-semibold tracking-wider text-primary uppercase m-0">Support Bot</span>
            </div>
            <div className="flex-1 overflow-auto">
                <div className="p-4">
                    <button className="w-full bg-yellow-200 text-zinc-900 rounded-lg py-2 px-4 flex items-center justify-center space-x-2">
                        <span>Add new chat</span>
                    </button>
                </div>
                <div className="px-2">
                    <div className="flex items-center space-x-2 px-4 py-2 text-sm text-zinc-400">
                        <Star className="w-4 h-4" />
                        <span>Favorites</span>
                    </div>
                    <nav className="space-y-1">
                        {['UI/UX Design Brief', 'QA Process Explained', 'Privacy Policy'].map((item) => (
                            <a
                                key={item}
                                href="#"
                                className="flex items-center space-x-2 px-4 py-2 text-sm rounded-lg hover:bg-zinc-800"
                            >
                                <MessageSquare className="w-4 h-4" />
                                <span>{item}</span>
                            </a>
                        ))}
                    </nav>
                </div>
            </div>
            <div className="p-4 border-t border-zinc-800">
                <nav className="space-y-2">
                    <a href="#" className="flex items-center space-x-2 px-4 py-2 text-sm rounded-lg hover:bg-zinc-800">
                        <Home className="w-4 h-4" />
                        <span>Home</span>
                    </a>
                    <a href="#" className="flex items-center space-x-2 px-4 py-2 text-sm rounded-lg hover:bg-zinc-800">
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                    </a>
                    <a href="#" className="flex items-center space-x-2 px-4 py-2 text-sm rounded-lg hover:bg-zinc-800">
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                    </a>
                </nav>
            </div>
        </div>
    );
} 