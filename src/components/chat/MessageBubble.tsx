import { Message } from '../../types/chat';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={cn(
      'flex',
      message.isOwn ? 'justify-end' : 'justify-start'
    )}>
      <div className={cn(
        'max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-2xl shadow-sm',
        message.isOwn
          ? 'bg-chat-sent text-chat-sent-foreground ml-12'
          : 'bg-chat-received text-chat-received-foreground mr-12'
      )}>
        <p className="text-sm leading-relaxed break-words">
          {message.content}
        </p>
        <p className={cn(
          'text-xs mt-1',
          message.isOwn 
            ? 'text-chat-sent-foreground/70' 
            : 'text-chat-received-foreground/70'
        )}>
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
}