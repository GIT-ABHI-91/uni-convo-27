import { useState } from 'react';
import { Sidebar } from './chat/Sidebar';
import { ChatWindow } from './chat/ChatWindow';
import { InfoPanel } from './chat/InfoPanel';
import { User } from '../types/chat';
import { useAuth } from '@/contexts/AuthContext';
import { useUsers } from '@/hooks/useUsers';
import { useMessages } from '@/hooks/useMessages';

export function ChatDashboard() {
  const { user: authUser } = useAuth();
  const { users, loading: usersLoading } = useUsers();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const { messages, sendMessage } = useMessages(selectedUser?.id || null);

  // Find current user from the users list
  const currentUser = users.find(u => u.id === authUser?.id);

  const filteredUsers = users
    .filter(user => user.id !== authUser?.id) // Exclude current user
    .filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

  if (usersLoading || !currentUser) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 transition-transform duration-200 ease-in-out
        fixed lg:relative z-50 lg:z-auto
        w-80 lg:w-1/5 min-w-[320px] h-full
      `}>
        <Sidebar
          currentUser={currentUser}
          users={filteredUsers}
          selectedUser={selectedUser}
          searchQuery={searchQuery}
          onUserSelect={setSelectedUser}
          onSearchChange={setSearchQuery}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row min-w-0">
        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          <ChatWindow
            selectedUser={selectedUser}
            messages={messages}
            onSendMessage={sendMessage}
            onMobileMenuToggle={() => setIsMobileSidebarOpen(true)}
          />
        </div>

        {/* Info Panel - Hidden on mobile */}
        <div className="hidden xl:block w-80 border-l border-border">
          <InfoPanel selectedUser={selectedUser} />
        </div>
      </div>
    </div>
  );
}