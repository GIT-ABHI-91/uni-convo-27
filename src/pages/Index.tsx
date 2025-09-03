import { ChatDashboard } from '@/components/ChatDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="relative h-screen">
      <div className="absolute top-4 right-4 z-50">
        <div className="flex items-center gap-4 bg-card/80 backdrop-blur-sm border rounded-lg px-4 py-2">
          <span className="text-sm text-muted-foreground">
            Welcome, {user?.user_metadata?.name || user?.email}
          </span>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </div>
      <ChatDashboard />
    </div>
  );
};

export default Index;
