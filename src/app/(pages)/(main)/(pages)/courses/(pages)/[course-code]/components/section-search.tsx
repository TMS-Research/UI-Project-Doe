import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useSectionsStore } from "@/stores/sections-store";
import { Search, X } from "lucide-react";

type SectionSearchProps = {
  courseId: string;
};

export function SectionSearch({ courseId }: SectionSearchProps) {
  const { searchQuery, setSearchQuery, resetSearch, fetchSections, isLoading } = useSectionsStore();

  useEffect(() => {
    if (courseId) {
      fetchSections(courseId);
    }
  }, [courseId, fetchSections]);

  const handleSearch = () => {
    // The search is already triggered by the setSearchQuery function
    // This button is mainly for UX purposes
  };

  const handleReset = () => {
    resetSearch();
  };

  return (
    <div className="flex gap-4">
      <div className="flex-1 relative">
        <Input
          type="text"
          placeholder="Search for sections..."
          className="w-full pr-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3"
            onClick={handleReset}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Button
        variant="default"
        onClick={handleSearch}
        disabled={isLoading}
      >
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </div>
  );
}
