import { Search, X, Menu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User } from '../../types/chat';
import { UserListItem } from './UserListItem';
import { UserProfile } from './UserProfile';

interface SidebarProps {
  currentUser: User;
  users: User[];
  selectedUser: User | null;
  searchQuery: string;
  onUserSelect: (user: User) => void;
  onSearchChange: (query: string) => void;
  onMobileClose?: () => void;
}

export function Sidebar({
  currentUser,
  users,
  selectedUser,
  searchQuery,
  onUserSelect,
  onSearchChange,
  onMobileClose
}: SidebarProps) {
  return (
    <div className="h-full bg-card border-r border-border flex flex-col">
      {/* Mobile Header */}
      <div className="flex lg:hidden items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Messages</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onMobileClose}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-border">
        <UserProfile user={currentUser} />
      </div>

      {/* Search */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-secondary/50 border-border focus:bg-background"
          />
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {users.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p>No users found</p>
            </div>
          ) : (
            users.map((user) => (
              <UserListItem
                key={user.id}
                user={user}
                isSelected={selectedUser?.id === user.id}
                onClick={() => {
                  onUserSelect(user);
                  onMobileClose?.();
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}