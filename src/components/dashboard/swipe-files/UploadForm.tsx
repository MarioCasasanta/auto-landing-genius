
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function UploadForm() {
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
          profile_id: user.id,
          title,
          description,
          category,
          file_url: publicUrl,
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
  );
}
