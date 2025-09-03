import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User } from '../../types/chat';

interface UserProfileProps {
  user: User;
}

export function UserProfile({ user }: UserProfileProps) {
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

  const getRoleBadgeVariant = (role: User['role']) => {
    switch (role) {
      case 'Faculty':
        return 'default';
      case 'Alumni':
        return 'secondary';
      case 'Student':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <div className="relative">
        <Avatar className="h-12 w-12">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="bg-primary/10 text-primary font-medium">
            {user.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div className={`
          absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-background
          ${getStatusColor(user.status)}
        `} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium text-foreground truncate">
            {user.name}
          </p>
          <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
            {user.role}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground capitalize">
          {user.status}
        </p>
      </div>
    </div>
  );
}