"use client";

import axiosInstance from "@/app/api/axios";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AnalyticsData } from "@/types/api/analytics.dto";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Crown, Flame, Heart, Target, Trophy, Zap } from "lucide-react";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Define badge types and their colors
const BADGE_TYPES = {
  LEARNING: "learning",
  ACHIEVEMENT: "achievement",
  SOCIAL: "social",
  STREAK: "streak",
} as const;

type BadgeType = (typeof BADGE_TYPES)[keyof typeof BADGE_TYPES];

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: BadgeType;
  unlocked: boolean;
  progress: number;
  dateUnlocked: string | null;
  color: string;
  exp: number;
}

interface Achievements {
  badges: Badge[];
  currentStreak: {
    days: number;
    longestStreak: number;
    lastStudyDate: string;
  };
}

// Mock analytics data
const mockAnalyticsData: AnalyticsData = {
  study_time: {
    total_minutes: 1875,
    daily_stats: {
      Mon: 120,
      Tue: 90,
      Wed: 150,
      Thu: 105,
      Fri: 180,
      Sat: 240,
      Sun: 60,
    },
    weekly_stats: {
      "Week 1": 420,
      "Week 2": 540,
      "Week 3": 380,
      "Week 4": 535,
    },
    average_daily: 135,
    preferred_times: {
      Morning: 35,
      Afternoon: 25,
      Evening: 40,
    },
  },
  quiz_performance: {
    total_attempts: 24,
    average_accuracy: 0.76,
    recent_scores: [
      { date: "2025-04-10", score: 0.85 },
      { date: "2025-04-08", score: 0.72 },
      { date: "2025-04-05", score: 0.78 },
    ],
    topic_accuracy: {
      "Data Structures": 0.82,
      Algorithms: 0.65,
      "System Design": 0.78,
      "Web Development": 0.91,
      Databases: 0.72,
    },
  },
  topic_analysis: {
    strengths: {
      "Web Development": 91,
      "Data Structures": 82,
      "System Design": 78,
      Databases: 72,
      Algorithms: 65,
    },
    weaknesses: {
      Compilers: 45,
      "Machine Learning": 52,
      Networking: 58,
    },
    balance: {
      Frontend: 85,
      Backend: 75,
      DevOps: 60,
    },
    recommended_topics: ["Algorithms", "Machine Learning", "Networking", "Compilers"],
  },
  learning_patterns: {
    consistency_score: 0.68,
    learning_style: "Visual-Interactive",
    study_habits: {
      Continuous: 42,
      Spaced: 28,
      "Group Study": 15,
      "Solo Learning": 65,
    },
    improvement_areas: [
      "Study consistency throughout the week",
      "Balance theory with practice",
      "Engage more with group discussions",
      "Space out learning sessions",
    ],
  },
  last_updated: new Date().toISOString(),
};

// Monthly sales data for the chart
const monthlyCourseEngagementData = [
  { name: "Apr 1", value: 65 },
  { name: "Apr 2", value: 75 },
  { name: "Apr 3", value: 85 },
  { name: "Apr 4", value: 70 },
  { name: "Apr 5", value: 55 },
  { name: "Apr 6", value: 90 },
  { name: "Apr 7", value: 65 },
  { name: "Apr 8", value: 65 },
  { name: "Apr 9", value: 75 },
  { name: "Apr 10", value: 80 },
];

// Mock achievements data
const mockAchievements: Achievements = {
  badges: [
    {
      id: "1",
      name: "Study Champion",
      description: "Complete 5 courses in a month",
      icon: "Crown",
      type: BADGE_TYPES.ACHIEVEMENT,
      unlocked: true,
      progress: 100,
      dateUnlocked: "2024-03-15",
      color: "from-purple-400 to-purple-600",
      exp: 100,
    },
    {
      id: "2",
      name: "7-Day Warrior",
      description: "Study for 7 days in a row",
      icon: "Flame",
      type: BADGE_TYPES.STREAK,
      unlocked: true,
      progress: 100,
      dateUnlocked: "2024-03-20",
      color: "from-orange-400 to-red-600",
      exp: 75,
    },
    {
      id: "3",
      name: "Quiz Master",
      description: "Achieve 90% accuracy in 10 quizzes",
      icon: "Target",
      type: BADGE_TYPES.LEARNING,
      unlocked: false,
      progress: 70,
      dateUnlocked: null,
      color: "from-blue-400 to-blue-600",
      exp: 50,
    },
    {
      id: "4",
      name: "Knowledge Seeker",
      description: "Study 3 different subjects",
      icon: "BookOpen",
      type: BADGE_TYPES.LEARNING,
      unlocked: true,
      progress: 100,
      dateUnlocked: "2024-03-18",
      color: "from-green-400 to-green-600",
      exp: 60,
    },
    {
      id: "5",
      name: "Social Butterfly",
      description: "Help 5 other students",
      icon: "Heart",
      type: BADGE_TYPES.SOCIAL,
      unlocked: false,
      progress: 40,
      dateUnlocked: null,
      color: "from-pink-400 to-pink-600",
      exp: 80,
    },
    {
      id: "6",
      name: "Quick Learner",
      description: "Complete a course in record time",
      icon: "Zap",
      type: BADGE_TYPES.ACHIEVEMENT,
      unlocked: false,
      progress: 25,
      dateUnlocked: null,
      color: "from-yellow-400 to-yellow-600",
      exp: 90,
    },
  ],
  currentStreak: {
    days: 5,
    longestStreak: 7,
    lastStudyDate: "2024-03-20",
  },
};

// Helper function to render badge icon
const renderBadgeIcon = (iconName: string) => {
  const icons = {
    Crown: <Crown className="w-6 h-6" />,
    Flame: <Flame className="w-6 h-6" />,
    Target: <Target className="w-6 h-6" />,
    BookOpen: <BookOpen className="w-6 h-6" />,
    Heart: <Heart className="w-6 h-6" />,
    Zap: <Zap className="w-6 h-6" />,
  };
  return icons[iconName as keyof typeof icons] || <Trophy className="w-6 h-6" />;
};

export default function MyStatsPage() {
  // Using mock data with useQuery for analytics
  const { data: analyticsData } = useQuery<AnalyticsData>({
    queryKey: ["analytics"],
    queryFn: async () => {
      // In development, return mock data
      if (process.env.NODE_ENV === "development") {
        return Promise.resolve(mockAnalyticsData);
      }
      // In production, use the real API
      const response = await axiosInstance.get("/analytics");
      return response.data;
    },
    initialData: mockAnalyticsData,
  });

  // Using mock data with useQuery for achievements
  const { data: achievements } = useQuery<Achievements>({
    queryKey: ["achievements"],
    queryFn: async () => {
      // In development, return mock data
      if (process.env.NODE_ENV === "development") {
        return Promise.resolve(mockAchievements);
      }
      // In production, use the real API
      const response = await axiosInstance.get("/achievements");
      return response.data;
    },
    initialData: mockAchievements,
  });

  return (
    <div className="container mx-auto py-6 space-y-8 mt-12">
      <h1 className="text-2xl font-bold">My Stats</h1>

      {/* Stat cards row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-red-400 to-red-500 text-white">
          <CardContent className="p-6">
            <div className="flex flex-col">
              <span className="text-sm font-medium mb-1">Total Study Time</span>
              <span className="text-2xl font-bold">{Math.floor(analyticsData?.study_time.total_minutes / 60)}h</span>
              <div className="flex justify-between items-center mt-4">
                <div className="relative h-16 w-16 rounded-full bg-background/20 flex items-center justify-center">
                  <div className="absolute h-12 w-12 rounded-full border-2 border-white flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 8v4l3 3" />
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                      />
                    </svg>
                  </div>
                </div>
                <span className="text-lg font-bold">80%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-400 to-blue-500 text-white">
          <CardContent className="p-6">
            <div className="flex flex-col">
              <span className="text-sm font-medium mb-1">Quiz Average</span>
              <span className="text-2xl font-bold">
                {(analyticsData?.quiz_performance.average_accuracy * 100).toFixed(1)}%
              </span>
              <div className="flex justify-between items-center mt-4">
                <div className="relative h-16 w-16 rounded-full bg-background/20 flex items-center justify-center">
                  <div className="absolute h-12 w-12 rounded-full border-2 border-white flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                <span className="text-lg font-bold">100%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-400 to-purple-500 text-white">
          <CardContent className="p-6">
            <div className="flex flex-col">
              <span className="text-sm font-medium mb-1">Consistency Score</span>
              <span className="text-2xl font-bold">
                {(analyticsData?.learning_patterns.consistency_score * 100).toFixed(0)}%
              </span>
              <div className="flex justify-between items-center mt-4">
                <div className="relative h-16 w-16 rounded-full bg-background/20 flex items-center justify-center">
                  <div className="absolute h-12 w-12 rounded-full border-2 border-white flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 20s8-4 8-10V6l-8-4-8 4v4c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                </div>
                <span className="text-lg font-bold">75%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-400 to-emerald-500 text-white">
          <CardContent className="p-6">
            <div className="flex flex-col">
              <span className="text-sm font-medium mb-1">Learning Style</span>
              <span className="text-2xl font-bold">{analyticsData?.learning_patterns.learning_style}</span>
              <div className="flex justify-between items-center mt-4">
                <div className="relative h-16 w-16 rounded-full bg-background/20 flex items-center justify-center">
                  <div className="absolute h-12 w-12 rounded-full border-2 border-white flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 20s8-4 8-10V6l-8-4-8 4v4c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                </div>
                <span className="text-lg font-bold">75%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course engagement chart */}
      <Card className="bg-background shadow-sm">
        <CardHeader>
          <CardTitle>Study Time (Last 10 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={monthlyCourseEngagementData}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} />
                <Bar
                  dataKey="value"
                  radius={[5, 5, 0, 0]}
                >
                  {monthlyCourseEngagementData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.value < 70 ? "#ff4c61" : "#4569ef"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Achievements Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold">Achievements</h2>
            <p className="text-sm text-muted-foreground">Unlock badges and earn XP by completing challenges</p>
          </div>
          <div className="flex items-center gap-3 bg-orange-100 px-4 py-2 rounded-full">
            <Flame className="w-5 h-5 text-orange-500" />
            <div className="flex flex-col">
              <span className="font-semibold text-orange-600">{achievements?.currentStreak.days} Day Streak</span>
              <span className="text-xs text-orange-500">Best: {achievements?.currentStreak.longestStreak} days</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements?.badges.map((badge: Badge) => (
            <Card
              key={badge.id}
              className={cn(
                "overflow-hidden transition-all duration-300 hover:shadow-lg",
                badge.unlocked ? "bg-background" : "bg-gray-50",
              )}
            >
              <div className={cn("absolute top-0 left-0 w-1 h-full bg-gradient-to-b", badge.color)} />
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-lg bg-gradient-to-br", badge.color, "text-white")}>
                      {renderBadgeIcon(badge.icon)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{badge.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{badge.description}</p>
                    </div>
                  </div>
                  <Badge
                    variant={badge.unlocked ? "default" : "outline"}
                    className="h-6"
                  >
                    +{badge.exp} XP
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{badge.progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-300", badge.color)}
                      style={{ width: `${badge.progress}%` }}
                    />
                  </div>
                  {badge.unlocked && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
                      <Trophy className="w-3 h-3" />
                      Unlocked on {new Date().toLocaleDateString()}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
