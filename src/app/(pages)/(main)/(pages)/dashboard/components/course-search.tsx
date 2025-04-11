import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface CourseSearchProps {
  onSearch: (query: string) => void;
  onFilterChange: (subject: string) => void;
}

const subjects = ["All Subjects", "Computer Science", "Mathematics", "Psychology", "Engineering", "Business"];

export function CourseSearch({ onSearch, onFilterChange }: CourseSearchProps) {
  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <Input
          type="text"
          placeholder="Search for courses..."
          className="w-full"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <Select onValueChange={onFilterChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Filter by subject" />
        </SelectTrigger>
        <SelectContent>
          {subjects.map((subject) => (
            <SelectItem
              key={subject}
              value={subject.toLowerCase()}
            >
              {subject}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="default">Search</Button>
    </div>
  );
}
