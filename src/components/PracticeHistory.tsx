"use client";

import axiosInstance from "@/app/api/axios";
import { Button } from "@/components/ui/button";
import { useSectionsStore } from "@/stores/sections-store";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, History } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useMemo } from "react";

interface PracticeHistorySession {
  order: number;
  date_taken: string;
  score: number;
  time_taken: string;
  session_id: string;
}

interface PracticeHistoryResponse {
  sessions: PracticeHistorySession[];
}

const ITEMS_PER_PAGE = 5;

export default function PracticeHistory() {
  const { activeSection } = useSectionsStore();
  const params = useParams();
  const courseCode = params["course-code"] as string;
  const syllabusCode = params["syllabus-code"] as string;
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch practice history
  const { data: historyData, isLoading } = useQuery<PracticeHistoryResponse>({
    queryKey: ["practice-history", activeSection?.id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/practice/history`, {
        params: { section_id: activeSection?.id },
      });
      return response.data;
    },
    enabled: !!activeSection?.id,
  });

  // Calculate pagination values
  const paginatedData = useMemo(() => {
    if (!historyData?.sessions) return { sessions: [], total: 0, totalPages: 0 };

    // Sort sessions by order in descending order
    const sortedSessions = [...historyData.sessions].sort((a, b) => b.order - a.order);

    const total = sortedSessions.length;
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const sessions = sortedSessions.slice(startIndex, endIndex);

    return { sessions, total, totalPages };
  }, [historyData?.sessions, currentPage]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < paginatedData.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h4 className="font-medium mb-4 flex items-center gap-2">
          <History className="w-4 h-4" />
          Practice History
        </h4>
        <div className="flex flex-col items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading practice history...</p>
        </div>
      </div>
    );
  }

  if (!historyData?.sessions || historyData.sessions.length === 0) {
    return (
      <div className="space-y-4">
        <h4 className="font-medium mb-4 flex items-center gap-2">
          <History className="w-4 h-4" />
          Practice History
        </h4>
        <div className="flex flex-col items-center justify-center py-8 border rounded-lg">
          <p className="text-muted-foreground">No practice history available yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="font-medium mb-4 flex items-center gap-2">
        <History className="w-4 h-4" />
        Practice History
      </h4>
      <div className="space-y-4">
        {paginatedData.sessions.map((session) => (
          <div
            key={session.session_id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div>
              <div className="font-medium">Practice Session {session.order + 1}</div>
              <div className="text-sm text-muted-foreground">{new Date(session.date_taken).toLocaleDateString()}</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="font-medium">{session.score}%</div>
                <div className="text-sm text-muted-foreground">{session.time_taken}</div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                asChild
              >
                <Link href={`/courses/${courseCode}/learn/${syllabusCode}/practice?session=${session.session_id}`}>
                  Review
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
          {Math.min(currentPage * ITEMS_PER_PAGE, paginatedData.total)} of {paginatedData.total} entries
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {paginatedData.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === paginatedData.totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
