export interface CourseSection {
  id: string;
  title: string;
  description: string;
  order: number;
  content?: {
    topics: string[];
  };
}

export interface Course {
  id: string;
  title: string;
  code: string;
  description: string;
  category: string;
  difficulty_level: string;
  instructor_info: {
    name: string;
    title: string;
    avatar?: string;
  };
  progress: number;
  lastAccessed: string;
  imageUrl?: string;
  is_enrolled?: boolean;
  sections?: CourseSection[];
}
