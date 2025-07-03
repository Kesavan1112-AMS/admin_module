import { useQuery } from "@tanstack/react-query";
import { ApiHeaderPropsDemo } from "../props/Auth.props";

const useFetchData = (
  queryKey: string,
  fetchFunction: (header: ApiHeaderPropsDemo) => Promise<any>,
  header: ApiHeaderPropsDemo,
  config = {}
) => {
  return useQuery({
    queryKey: [queryKey],
    queryFn: () => fetchFunction(header),
    refetchOnWindowFocus: false,
    ...config,
  });
};

export const handleQueries = (queries: any[]) => {
  const isLoading = queries.some((q) => q.isLoading);
  const refetch = queries.map((q) => q.refetch);
  const data = queries.map((q) => q.data || []);

  return { isLoading, refetch, data };
};

const apiUtils = { useFetchData, handleQueries };
export default apiUtils;
