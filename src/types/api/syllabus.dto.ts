export interface SyllabusContent {
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  chapter: number;
  progress: number;
  completed: boolean;
  content: {
    topics: string[];
    resources: string[];
  };
  nextLesson: string | null;
  prevLesson: string | null;
}
