import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '../../types/chat';
import { cn } from '@/lib/utils';

interface UserListItemProps {
  user: User;
  isSelected: boolean;
  onClick: () => void;
}

export function UserListItem({ user, isSelected, onClick }: UserListItemProps) {
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

  const formatLastSeen = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full p-3 rounded-lg text-left transition-colors',
        'hover:bg-accent hover:text-accent-foreground',
        isSelected && 'bg-primary/10 text-primary border border-primary/20'
      )}
    >
      <div className="flex items-center space-x-3">
        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className={`
            absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background
            ${getStatusColor(user.status)}
          `} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground truncate">
              {user.name}
            </p>
            {user.status !== 'online' && (
              <span className="text-xs text-muted-foreground">
                {formatLastSeen(user.lastSeen)}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {user.role}
          </p>
        </div>
      </div>
    </button>
  );
}