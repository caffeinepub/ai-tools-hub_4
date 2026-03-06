import { useQuery } from "@tanstack/react-query";
import type { AITool } from "../backend.d";
import { useActor } from "./useActor";

export function useGetAllTools() {
  const { actor, isFetching } = useActor();
  return useQuery<AITool[]>({
    queryKey: ["allTools"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTools();
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function useGetFeaturedTools() {
  const { actor, isFetching } = useActor();
  return useQuery<AITool[]>({
    queryKey: ["featuredTools"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFeaturedTools();
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}
