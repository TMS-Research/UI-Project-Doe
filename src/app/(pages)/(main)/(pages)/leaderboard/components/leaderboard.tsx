"use client";

import { useState, useEffect } from "react";
import { Card } from "../../../../../../components/ui/card";
import { Input } from "../../../../../../components/ui/input";
import { Label } from "../../../../../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../../../../../components/ui/radio-group";
import confetti from "canvas-confetti";

interface LeaderboardEntry {
  rank: number;
  user_id: string;
  username: string;
  score: number;
  level: number;
  avatar?: string;
}

interface LeaderboardResponse {
  scope: string;
  entries: LeaderboardEntry[];
  period_start: string;
  period_end: string;
}

// Confetti animation function
const fireConfetti = () => {
  // First burst
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });

  // Second burst after a small delay
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
    });
  }, 250);
};

// Mock data for development
const mockLeaderboardData: Record<string, LeaderboardResponse> = {
  global: {
    scope: "global",
    entries: [
      {
        rank: 1,
        user_id: "1",
        username: "Eleanor Pena",
        score: 150,
        level: 25,
        avatar: "https://i.pravatar.cc/150?img=1",
      },
      {
        rank: 2,
        user_id: "2",
        username: "Theresa Webb",
        score: 125,
        level: 24,
        avatar: "https://i.pravatar.cc/150?img=2",
      },
      {
        rank: 3,
        user_id: "3",
        username: "Esther Howard",
        score: 120,
        level: 23,
        avatar: "https://i.pravatar.cc/150?img=3",
      },
      {
        rank: 4,
        user_id: "4",
        username: "Dianne Russell",
        score: 82,
        level: 22,
        avatar: "https://i.pravatar.cc/150?img=4",
      },
      {
        rank: 5,
        user_id: "5",
        username: "Nguyen Shane",
        score: 76,
        level: 21,
        avatar: "https://i.pravatar.cc/150?img=5",
      },
      {
        rank: 6,
        user_id: "6",
        username: "Henry Arthur",
        score: 74,
        level: 20,
        avatar: "https://i.pravatar.cc/150?img=6",
      },
      {
        rank: 7,
        user_id: "7",
        username: "Miles Esther",
        score: 72,
        level: 19,
        avatar: "https://i.pravatar.cc/150?img=7",
      },
      {
        rank: 8,
        user_id: "8",
        username: "Black Marvin",
        score: 70,
        level: 18,
        avatar: "https://i.pravatar.cc/150?img=8",
      },
      {
        rank: 9,
        user_id: "9",
        username: "Flores Juanita",
        score: 67,
        level: 17,
        avatar: "https://i.pravatar.cc/150?img=9",
      },
      {
        rank: 10,
        user_id: "10",
        username: "Anna Lee",
        score: 65,
        level: 16,
        avatar: "https://i.pravatar.cc/150?img=10",
      },
    ],
    period_start: "2024-01-01T00:00:00.000Z",
    period_end: "2024-12-31T23:59:59.999Z",
  },
  school: {
    scope: "school",
    entries: [
      {
        rank: 1,
        user_id: "1",
        username: "Eleanor Pena",
        score: 150,
        level: 25,
        avatar: "https://i.pravatar.cc/150?img=1",
      },
      {
        rank: 2,
        user_id: "2",
        username: "Theresa Webb",
        score: 125,
        level: 24,
        avatar: "https://i.pravatar.cc/150?img=2",
      },
      {
        rank: 3,
        user_id: "3",
        username: "Esther Howard",
        score: 120,
        level: 23,
        avatar: "https://i.pravatar.cc/150?img=3",
      },
      {
        rank: 4,
        user_id: "4",
        username: "Dianne Russell",
        score: 82,
        level: 22,
        avatar: "https://i.pravatar.cc/150?img=4",
      },
      {
        rank: 5,
        user_id: "5",
        username: "Nguyen Shane",
        score: 76,
        level: 21,
        avatar: "https://i.pravatar.cc/150?img=5",
      },
    ],
    period_start: "2024-01-01T00:00:00.000Z",
    period_end: "2024-12-31T23:59:59.999Z",
  },
  weekly: {
    scope: "weekly",
    entries: [
      {
        rank: 1,
        user_id: "1",
        username: "Eleanor Pena",
        score: 150,
        level: 25,
        avatar: "https://i.pravatar.cc/150?img=1",
      },
      {
        rank: 2,
        user_id: "2",
        username: "Theresa Webb",
        score: 125,
        level: 24,
        avatar: "https://i.pravatar.cc/150?img=2",
      },
      {
        rank: 3,
        user_id: "3",
        username: "Esther Howard",
        score: 120,
        level: 23,
        avatar: "https://i.pravatar.cc/150?img=3",
      },
      {
        rank: 4,
        user_id: "4",
        username: "Dianne Russell",
        score: 82,
        level: 22,
        avatar: "https://i.pravatar.cc/150?img=4",
      },
      {
        rank: 5,
        user_id: "5",
        username: "Nguyen Shane",
        score: 76,
        level: 21,
        avatar: "https://i.pravatar.cc/150?img=5",
      },
    ],
    period_start: "2024-04-09T00:00:00.000Z",
    period_end: "2024-04-16T23:59:59.999Z",
  },
};

const TopThreeLeaders = ({ entries }: { entries: LeaderboardEntry[] }) => {
  const top3 = entries.slice(0, 3);
  const [second, first, third] = [top3[1], top3[0], top3[2]];

  return (
    <div className="relative h-[300px] mb-8">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
        <div className="text-center mb-4">
          <div className="text-xl font-semibold text-black">Top 3 Leaders</div>
        </div>
      </div>

      <div className="flex justify-center items-end h-full gap-4">
        {/* Second Place */}
        <div className="text-center mb-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-2 mx-auto border-4 border-gray-300">
              {/* <Image
                src={second.avatar || ""}
                alt={second.username}
                width={96}
                height={96}
                className="object-cover"
              /> */}
            </div>
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
              2
            </div>
          </div>
          <h3 className="font-semibold">{second.username}</h3>
          <p className="text-sm text-gray-600">Earn {second.score} Points</p>
        </div>

        {/* First Place */}
        <div className="text-center mb-4 -mt-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden mb-2 mx-auto border-4 border-yellow-400">
              {/* <Image
                src={first.avatar || ""}
                alt={first.username}
                width={128}
                height={128}
                className="object-cover"
              /> */}
            </div>
            <div className="absolute bottom-0 right-0 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold">
              1
            </div>
          </div>
          <h3 className="font-semibold">{first.username}</h3>
          <p className="text-sm text-gray-600">Earn {first.score} Points</p>
        </div>

        {/* Third Place */}
        <div className="text-center mb-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-2 mx-auto border-4 border-amber-700">
              {/* <Image
                src={third.avatar || ""}
                alt={third.username}
                width={96}
                height={96}
                className="object-cover"
              /> */}
            </div>
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-amber-700 rounded-full flex items-center justify-center text-white font-bold">
              3
            </div>
          </div>
          <h3 className="font-semibold">{third.username}</h3>
          <p className="text-sm text-gray-600">Earn {third.score} Points</p>
        </div>
      </div>
    </div>
  );
};

export function Leaderboard() {
  const [scope, setScope] = useState<"global" | "school" | "weekly">("global");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fire confetti effect on component mount
  useEffect(() => {
    // Small delay to ensure the page is loaded
    const timer = setTimeout(() => {
      fireConfetti();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Simulate loading state when changing scope
  const handleScopeChange = (value: string) => {
    setLoading(true);
    setScope(value as "global" | "school" | "weekly");
    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const filteredEntries = mockLeaderboardData[scope].entries.filter((entry) =>
    entry.username.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <Card className="p-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Leaderboard</h2>
            <RadioGroup
              defaultValue="global"
              value={scope}
              onValueChange={handleScopeChange}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="global"
                  id="global"
                />
                <Label htmlFor="global">Global</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="school"
                  id="school"
                />
                <Label htmlFor="school">School</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="weekly"
                  id="weekly"
                />
                <Label htmlFor="weekly">Weekly</Label>
              </div>
            </RadioGroup>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <TopThreeLeaders entries={filteredEntries} />

              <div className="flex justify-between items-center mb-4">
                <Input
                  type="search"
                  placeholder="Search contributors..."
                  className="max-w-xs"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="text-sm text-gray-500">
                  {filteredEntries.length > 3 &&
                    `${4} - ${filteredEntries.length} of ${filteredEntries.length} contributors`}
                </div>
              </div>

              <div className="space-y-4">
                {filteredEntries.slice(3).map((entry) => (
                  <Card
                    key={entry.user_id}
                    className="p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 flex items-center justify-center bg-primary/10 rounded-full">
                          {entry.rank}
                        </div>
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          {/* <Image
                              src={entry.avatar || ""}
                              alt={entry.username}
                              width={40}
                              height={40}
                              className="object-cover"
                            /> */}
                        </div>
                        <div>
                          <p className="font-semibold">{entry.username}</p>
                          <p className="text-sm text-muted-foreground">Level {entry.level}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{entry.score} Points</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
