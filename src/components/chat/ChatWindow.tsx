import { useState, useRef, useEffect } from 'react';
import { Send, Menu, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Message } from '../../types/chat';
import { MessageBubble } from './MessageBubble';

interface ChatWindowProps {
  selectedUser: User | null;
  messages: Message[];
  onSendMessage: (content: string) => void;
  onMobileMenuToggle: () => void;
}

export function ChatWindow({
  selectedUser,
  messages,
  onSendMessage,
  onMobileMenuToggle
}: ChatWindowProps) {
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim() && selectedUser) {
      onSendMessage(messageInput.trim());
      setMessageInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e as any);
    }
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center p-4 border-b border-border bg-card">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMobileMenuToggle}
            className="text-muted-foreground hover:text-foreground"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="ml-3 text-lg font-semibold">Messages</h1>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex items-center justify-center bg-secondary/30">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
              <Menu className="h-12 w-12 text-primary/50" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              No conversation selected
            </h3>
            <p className="text-muted-foreground">
              Choose a user from the sidebar to start messaging
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'online':
        return 'bg-status-online';
      case 'away':
        return 'bg-status-away';
      case 'offline':
        return 'bg-status-offline';
      default:
        return 'bg-status-offline';
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMobileMenuToggle}
            className="lg:hidden text-muted-foreground hover:text-foreground"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {selectedUser.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className={`
              absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background
              ${getStatusColor(selectedUser.status)}
            `} />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">
              {selectedUser.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {selectedUser.role} • {selectedUser.status}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary/20">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">
                No messages yet
              </p>
              <p className="text-sm text-muted-foreground">
                Send a message to start the conversation
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-card">
        <form onSubmit={handleSend} className="flex space-x-2">
          <Input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 bg-secondary/50 border-border focus:bg-background"
          />
          <Button
            type="submit"
            disabled={!messageInput.trim()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}