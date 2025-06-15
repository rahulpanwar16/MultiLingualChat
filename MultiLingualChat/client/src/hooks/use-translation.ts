import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function useTranslation() {
  const { toast } = useToast();

  const retryTranslationMutation = useMutation({
    mutationFn: async ({ messageId, targetLanguage }: { messageId: number; targetLanguage: string }) => {
      const response = await apiRequest("POST", `/api/messages/${messageId}/translate`, {
        targetLanguage,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      toast({
        title: "Translation retried",
        description: "The message has been translated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Translation failed",
        description: "Unable to translate the message. Please try again later.",
        variant: "destructive",
      });
    },
  });

  const retryTranslation = (messageId: number, targetLanguage: string) => {
    retryTranslationMutation.mutate({ messageId, targetLanguage });
  };

  return {
    retryTranslation,
    isRetrying: retryTranslationMutation.isPending,
  };
}
