import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Message } from '@/types/chat';

export function useMessages(selectedUserId: string | null) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedUserId && user) {
      fetchMessages();
      
      // Set up real-time subscription
      const channel = supabase
        .channel('messages')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'messages',
            filter: `or(and(sender_id.eq.${user.id},receiver_id.eq.${selectedUserId}),and(sender_id.eq.${selectedUserId},receiver_id.eq.${user.id}))`
          },
          () => {
            fetchMessages(); // Refetch messages on any change
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      setMessages([]);
    }
  }, [selectedUserId, user]);

  const fetchMessages = async () => {
    if (!selectedUserId || !user) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${selectedUserId}),and(sender_id.eq.${selectedUserId},receiver_id.eq.${user.id})`)
        .order('timestamp', { ascending: true });

      if (error) {
        throw error;
      }

      // Map database messages to frontend Message type
      const mappedMessages: Message[] = data.map(dbMessage => ({
        id: dbMessage.id,
        senderId: dbMessage.sender_id,
        content: dbMessage.content,
        timestamp: new Date(dbMessage.timestamp),
        isOwn: dbMessage.sender_id === user.id
      }));

      setMessages(mappedMessages);
      setError(null);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content: string) => {
    if (!selectedUserId || !user || !content.trim()) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: selectedUserId,
          content: content.trim(),
          status: 'sent'
        });

      if (error) {
        throw error;
      }

      // Message will be added via real-time subscription
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');
    }
  };

  return { messages, loading, error, sendMessage };
}