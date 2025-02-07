
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useSwipeFiles() {
  const queryClient = useQueryClient();

  const { data: swipeFiles, isLoading } = useQuery({
    queryKey: ["swipe-files"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("swipe_files")
        .select("*")
        .eq("profile_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const deleteSwipeFile = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("swipe_files").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["swipe-files"] });
    },
  });

  return {
    swipeFiles,
    isLoading,
    deleteSwipeFile,
  };
}
