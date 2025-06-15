import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Message, InsertMessage } from "@shared/schema";

export function useChat(targetLanguage: string) {
  const [lastFetchTime, setLastFetchTime] = useState<Date>(new Date());

  // Initial messages fetch
  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
    refetchInterval: 3000, // Poll every 3 seconds
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (message: InsertMessage) => {
      const response = await apiRequest("POST", "/api/messages", message);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      setLastFetchTime(new Date());
    },
  });

  // Poll for new messages since last fetch
  useQuery({
    queryKey: ["/api/messages/since", lastFetchTime.toISOString()],
    enabled: lastFetchTime !== null,
    refetchInterval: 3000,
    queryFn: async () => {
      const response = await fetch(
        `/api/messages/since?timestamp=${lastFetchTime.toISOString()}`
      );
      if (!response.ok) throw new Error("Failed to fetch new messages");
      const newMessages = await response.json();
      
      if (newMessages.length > 0) {
        // Update the main messages query with new data
        queryClient.setQueryData(["/api/messages"], (oldMessages: Message[] = []) => {
          const messageIds = new Set(oldMessages.map(m => m.id));
          const uniqueNewMessages = newMessages.filter((m: Message) => !messageIds.has(m.id));
          return [...oldMessages, ...uniqueNewMessages].sort(
            (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
        });
        setLastFetchTime(new Date());
      }
      
      return newMessages;
    },
  });

  const sendMessage = (message: InsertMessage) => {
    sendMessageMutation.mutate(message);
  };

  return {
    messages,
    sendMessage,
    isLoading: isLoading || sendMessageMutation.isPending,
  };
}
