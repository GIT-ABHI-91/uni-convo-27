import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/chat';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch users from the database
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('name');

      if (usersError) {
        throw usersError;
      }

      // Fetch user status
      const { data: statusData, error: statusError } = await supabase
        .from('user_status')
        .select('*');

      if (statusError) {
        console.warn('Could not fetch user status:', statusError);
      }

      // Map database users to frontend User type
      const mappedUsers: User[] = usersData.map(dbUser => {
        const userStatus = statusData?.find(s => s.user_id === dbUser.id);
        
        return {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          role: dbUser.role as 'Student' | 'Faculty' | 'Alumni',
          status: (userStatus?.status as 'online' | 'away' | 'offline') || 'offline',
          lastSeen: userStatus?.updated_at ? new Date(userStatus.updated_at) : new Date(dbUser.created_at),
          avatar: `/api/placeholder/32/32` // Using placeholder for now
        };
      });

      setUsers(mappedUsers);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  return { users, loading, error, refetch: fetchUsers };
}