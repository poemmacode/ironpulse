"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ProfileCard from "@/components/dashboard/profile-card";
import Navbar from "@/components/layout/navbar";
import Button from "@/components/ui/button";
import Card, { CardContent, CardHeader } from "@/components/ui/card";
import { LogOut, Mail, Calendar } from "lucide-react";

interface Profile {
  name: string | null;
  email: string;
  level: number;
  currentXp: number;
  targetXp: number;
  streakDays: number;
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        setProfile(data.profile);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-blue-600 dark:border-zinc-700 dark:border-t-blue-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 pb-24 pt-6 dark:bg-zinc-950">
      <div className="mx-auto max-w-lg space-y-6 px-4">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Profile
        </h1>

        {profile && (
          <>
            <ProfileCard
              name={profile.name}
              level={profile.level}
              currentXp={profile.currentXp}
              targetXp={profile.targetXp}
              streakDays={profile.streakDays}
            />

            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Account
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-zinc-400" />
                    <span className="text-zinc-600 dark:text-zinc-300">
                      {profile.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-zinc-400" />
                    <span className="text-zinc-600 dark:text-zinc-300">
                      Joined{" "}
                      {new Date(profile.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              variant="danger"
              size="lg"
              className="w-full gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              Log Out
            </Button>
          </>
        )}
      </div>
      <Navbar />
    </div>
  );
}
