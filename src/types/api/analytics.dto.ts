export interface StudyTimeAnalytics {
  total_minutes: number;
  daily_stats: Record<string, number>;
  weekly_stats: Record<string, number>;
  average_daily: number;
  preferred_times: Record<string, number>;
}

export interface QuizPerformance {
  total_attempts: number;
  average_accuracy: number;
  recent_scores: Array<Record<string, number>>;
  topic_accuracy: Record<string, number>;
}

export interface TopicAnalysis {
  strengths: Record<string, number>;
  weaknesses: Record<string, number>;
  balance: Record<string, number>;
  recommended_topics: string[];
}

export interface LearningPatterns {
  consistency_score: number;
  learning_style: string;
  study_habits: Record<string, number>;
  improvement_areas: string[];
}

export interface AnalyticsData {
  study_time: StudyTimeAnalytics;
  quiz_performance: QuizPerformance;
  topic_analysis: TopicAnalysis;
  learning_patterns: LearningPatterns;
  last_updated: string;
}
