'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useTheme } from "@/contexts/theme-context"
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function Solver() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const { isDarkMode, toggleTheme } = useTheme()
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
        return;
      }

      const fetchUserData = async () => {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
          setXp(data.xp || 0);
          setLevel(Math.floor((data.xp || 0) / 25) + 1);
          setStreak(data.streakCount || 0);
        }
      };

      const fetchRecentActivity = async () => {
        const historyQuery = query(
          collection(db, 'history'),
          where('userId', '==', user.uid),
          orderBy('timestamp', 'desc'),
          limit(5)
        );
        const snapshot = await getDocs(historyQuery);
        setRecentActivity(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      };

      fetchUserData();
      fetchRecentActivity();
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="app-container flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className={`content-container ${isDarkMode ? "content-container-dark" : "content-container-light"}`}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Profile Section */}
        <Card className="p-6">
          <div className="flex items-center gap-6">
            <img
              src={user.photoURL || '/default-avatar.png'}
              alt="Profile"
              className="w-20 h-20 rounded-full border-4 border-primary"
            />
            <div>
              <h1 className="text-2xl font-bold">{user.displayName || user.name || 'Math Explorer'}</h1>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary">Level {level}</Badge>
                <Badge variant="outline">🔥 {streak} Day Streak</Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Progress Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Level Progress</h2>
            <Progress value={(xp % 25) / 25 * 100} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              {xp % 25} / 25 XP to Level {level + 1}
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Daily Challenge</h2>
            <p className="text-lg">∫x² dx</p>
            <button 
              onClick={() => router.push('/solver')}
              className="mt-4 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
            >
              Solve Now
            </button>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">{activity.question}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(activity.timestamp?.toDate()).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant="secondary">{activity.type}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}