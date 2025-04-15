"use client";

import { useSearchParams } from "next/navigation";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

type QueryFn<T> = (params: URLSearchParams) => Promise<T>;

export function useSearchQuery<TData = unknown>(
  queryKeyPrefix: string,
  queryFn: QueryFn<TData>,
  options?: Omit<UseQueryOptions<TData, Error>, "queryKey" | "queryFn">,
) {
  const searchParams = useSearchParams();

  const queryKey = [queryKeyPrefix, Object.fromEntries(searchParams.entries())];

  return useQuery<TData, Error>({
    queryKey,
    queryFn: () => queryFn(searchParams),
    enabled: true,
    ...options,
  });
}
