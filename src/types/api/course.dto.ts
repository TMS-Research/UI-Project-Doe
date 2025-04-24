export interface CourseSection {
  id: string;
  title: string;
  order: number;
  slug: string;
}

export interface CourseTopic {
  id: string;
  title: string;
  topic_order: number;
  sections: CourseSection[];
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
    bio: string;
    email: string;
  };
  created_at: string;
  updated_at: string | null;
  topics: CourseTopic[];
  is_enrolled: boolean;
  enrollment_date: string;
  completion_percentage: string;
  // Additional properties for dashboard display
  imageUrl?: string;
  instructor?: string;
  duration?: string;
  level?: string;
  rating?: number;
  enrolled?: number;
  image?: string;
}
