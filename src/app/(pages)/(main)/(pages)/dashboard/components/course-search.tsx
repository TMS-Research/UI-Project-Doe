import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCoursesStore } from "@/stores/courses-store";
import { Search, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSearchQuery } from "@/hooks/use-search-query";
import { useDebounce } from "@/hooks/use-debounce";
import axiosInstance from "@/app/api/axios";

const subjects = ["All Subjects", "Computer Science", "Mathematics", "Psychology", "Engineering", "Business"];

async function fetchSearchData(params: URLSearchParams) {
  try {
    const keyword = params.get("keyword");
    const subject = params.get("subject");
    const queryParams = new URLSearchParams();

    if (keyword) queryParams.set("keyword", keyword);
    if (subject && subject !== "all subjects") queryParams.set("subject", subject);

    const response = await axiosInstance.get(`/courses?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
}

export function CourseSearch() {
  const { searchQuery, selectedSubject, setSearchQuery, setSelectedSubject, resetSearch, fetchCourses, isLoading } =
    useCoursesStore();

  const router = useRouter();
  const searchParams = useSearchParams();

  const [inputValue, setInputValue] = useState(searchQuery);
  const debouncedSearchQuery = useDebounce(inputValue, 300);
  const { isLoading: isSearching } = useSearchQuery("courses", fetchSearchData);

  // Initialize from URL params only once on mount
  useEffect(() => {
    const search = searchParams.get("search");
    const subject = searchParams.get("subject");

    if (search) {
      setSearchQuery(search);
    }
    if (subject) {
      setSelectedSubject(subject);
    }
  }, [searchParams, setSearchQuery, setSelectedSubject]);

  // Update URL when debounced search changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearchQuery) {
      params.set("keyword", debouncedSearchQuery);
    } else {
      params.delete("keyword");
    }
    router.push(`/dashboard?${params.toString()}`);
  }, [debouncedSearchQuery, router, searchParams]);

  const handleSearch = useCallback(
    (value: string) => {
      setInputValue(value);
      setSearchQuery(value);
    },
    [setSearchQuery],
  );

  const handleReset = useCallback(() => {
    setInputValue("");
    resetSearch();
    const params = new URLSearchParams(searchParams.toString());
    params.delete("keyword");
    router.push(`/dashboard?${params.toString()}`);
  }, [resetSearch, router, searchParams]);

  const handleSubjectChange = useCallback(
    (value: string) => {
      setSelectedSubject(value);
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all subjects") {
        params.set("subject", value);
      } else {
        params.delete("subject");
      }
      router.push(`/dashboard?${params.toString()}`);
    },
    [setSelectedSubject, router, searchParams],
  );

  return (
    <div className="flex gap-4">
      <div className="flex-1 relative">
        <Input
          type="text"
          placeholder="Search for courses..."
          className="w-full pr-10"
          value={inputValue}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {inputValue && (
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
      <Select
        value={selectedSubject}
        onValueChange={handleSubjectChange}
      >
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
      <Button
        variant="default"
        onClick={() => fetchCourses()}
        disabled={isLoading || isSearching}
      >
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </div>
  );
}
