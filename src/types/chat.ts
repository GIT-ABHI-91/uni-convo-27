export type UserStatus = 'online' | 'away' | 'offline';

export type UserRole = 'Student' | 'Faculty' | 'Alumni';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  email: string;
  lastSeen: Date;
  avatar?: string;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  isOwn: boolean;
}