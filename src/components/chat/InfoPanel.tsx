import { Mail, Clock, User as UserIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '../../types/chat';

interface InfoPanelProps {
  selectedUser: User | null;
}

export function InfoPanel({ selectedUser }: InfoPanelProps) {
  if (!selectedUser) {
    return (
      <div className="h-full p-6 bg-card">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <UserIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              User Info Panel
            </h3>
            <p className="text-muted-foreground text-sm">
              Select a user to view their information
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

  const formatLastSeen = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 1) return 'Active now';
    if (diffMins < 60) return `Active ${diffMins} minutes ago`;
    if (diffHours < 24) return `Active ${diffHours} hours ago`;
    if (diffDays < 7) return `Active ${diffDays} days ago`;
    return `Last seen ${date.toLocaleDateString()}`;
  };

  return (
    <div className="h-full p-6 bg-card space-y-6">
      {/* User Profile */}
      <div className="text-center">
        <div className="relative inline-block mb-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-medium text-lg">
              {selectedUser.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className={`
            absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-background
            ${getStatusColor(selectedUser.status)}
          `} />
        </div>
        
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {selectedUser.name}
        </h3>
        
        <Badge variant={getRoleBadgeVariant(selectedUser.role)} className="mb-4">
          {selectedUser.role}
        </Badge>
        
        <p className="text-sm text-muted-foreground capitalize">
          {selectedUser.status}
        </p>
      </div>

      {/* User Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-sm font-medium">{selectedUser.email}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Last Seen</p>
              <p className="text-sm font-medium">
                {formatLastSeen(selectedUser.lastSeen)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Integration placeholders for:
          </p>
          <ul className="text-sm text-muted-foreground mt-2 space-y-1">
            <li>• Schedule meeting</li>
            <li>• View shared files</li>
            <li>• Block/Report user</li>
            <li>• Export chat history</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}