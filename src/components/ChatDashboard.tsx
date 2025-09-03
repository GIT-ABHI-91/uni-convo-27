import { useState } from 'react';
import { Sidebar } from './chat/Sidebar';
import { ChatWindow } from './chat/ChatWindow';
import { InfoPanel } from './chat/InfoPanel';
import { User, Message } from '../types/chat';

// Dummy data for demonstration
const dummyUsers: User[] = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    role: 'Faculty',
    status: 'online',
    email: 'sarah.chen@university.edu',
    lastSeen: new Date(),
    avatar: '/api/placeholder/32/32'
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    role: 'Alumni',
    status: 'away',
    email: 'mike.r@company.com',
    lastSeen: new Date(Date.now() - 1000 * 60 * 30),
    avatar: '/api/placeholder/32/32'
  },
  {
    id: '3',
    name: 'Emma Thompson',
    role: 'Student',
    status: 'online',
    email: 'emma.t@student.edu',
    lastSeen: new Date(),
    avatar: '/api/placeholder/32/32'
  },
  {
    id: '4',
    name: 'Prof. James Wilson',
    role: 'Faculty',
    status: 'offline',
    email: 'j.wilson@university.edu',
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2),
    avatar: '/api/placeholder/32/32'
  }
];

const dummyMessages: Record<string, Message[]> = {
  '1': [
    {
      id: '1',
      senderId: '1',
      content: 'Hi! How are you doing with your research project?',
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      isOwn: false
    },
    {
      id: '2',
      senderId: 'current-user',
      content: 'Going well! I\'ve been working on the data analysis section.',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      isOwn: true
    },
    {
      id: '3',
      senderId: '1',
      content: 'That\'s great to hear. Let me know if you need any help with the statistical methods.',
      timestamp: new Date(Date.now() - 1000 * 60 * 2),
      isOwn: false
    }
  ],
  '2': [
    {
      id: '4',
      senderId: '2',
      content: 'Hey! Would love to connect and share some industry insights.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      isOwn: false
    }
  ],
  '3': [
    {
      id: '5',
      senderId: 'current-user',
      content: 'Looking forward to our study group session tomorrow!',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      isOwn: true
    }
  ]
};

const currentUser: User = {
  id: 'current-user',
  name: 'Alex Johnson',
  role: 'Student',
  status: 'online',
  email: 'alex.j@student.edu',
  lastSeen: new Date(),
  avatar: '/api/placeholder/32/32'
};

export function ChatDashboard() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const filteredUsers = dummyUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (content: string) => {
    if (!selectedUser) return;
    
    // In a real app, this would send to backend via API/WebSocket
    console.log('Sending message:', content, 'to user:', selectedUser.id);
    
    // TODO: Add to local messages state and send via WebSocket
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      content,
      timestamp: new Date(),
      isOwn: true
    };
    
    // This would normally update the messages in state
    if (!dummyMessages[selectedUser.id]) {
      dummyMessages[selectedUser.id] = [];
    }
    dummyMessages[selectedUser.id].push(newMessage);
  };

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
            messages={selectedUser ? dummyMessages[selectedUser.id] || [] : []}
            onSendMessage={handleSendMessage}
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