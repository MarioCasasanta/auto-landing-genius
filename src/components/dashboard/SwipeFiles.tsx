import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Upload, File, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function SwipeFiles() {
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const { toast } = useToast();
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
      toast({
        title: "Success",
        description: "Swipe file deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete swipe file",
        variant: "destructive",
      });
      console.error("Error deleting swipe file:", error);
    },
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!title || !category) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "No user found",
          variant: "destructive",
        });
        return;
      }

      setUploading(true);
      const fileExt = file.name.split(".").pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from("landing-page-assets")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      if (data) {
        const { data: { publicUrl } } = supabase.storage
          .from("landing-page-assets")
          .getPublicUrl(data.path);

        const { error: insertError } = await supabase.from("swipe_files").insert({
          title,
          description,
          category,
          file_url: publicUrl,
          profile_id: user.id,
        });

        if (insertError) throw insertError;

        queryClient.invalidateQueries({ queryKey: ["swipe-files"] });
        toast({
          title: "Success",
          description: "Swipe file uploaded successfully",
        });

        // Reset form
        setTitle("");
        setDescription("");
        setCategory("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload swipe file",
        variant: "destructive",
      });
      console.error("Error uploading swipe file:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Swipe Files</h1>

      <Card>
        <CardHeader>
          <CardTitle>Upload New Swipe File</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter file title"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Enter file category"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter file description"
              />
            </div>
            <div>
              <input
                type="file"
                className="hidden"
                id="file-upload"
                onChange={handleFileUpload}
              />
              <Label htmlFor="file-upload">
                <Button
                  variant="outline"
                  className="w-full cursor-pointer"
                  disabled={uploading}
                  asChild
                >
                  <span>
                    <Upload className="mr-2 h-4 w-4" />
                    {uploading ? "Uploading..." : "Upload File"}
                  </span>
                </Button>
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          swipeFiles?.map((file) => (
            <Card key={file.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <File className="mr-2 h-4 w-4" />
                    {file.title}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteSwipeFile.mutate(file.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  {file.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-secondary px-2 py-1 rounded-full">
                    {file.category}
                  </span>
                  <Button variant="link" size="sm" asChild>
                    <a
                      href={file.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View File
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}