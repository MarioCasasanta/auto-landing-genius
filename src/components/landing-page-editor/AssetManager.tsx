
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Upload, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AssetManagerProps {
  onSelectImage: (url: string) => void;
}

export default function AssetManager({ onSelectImage }: AssetManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const { data: images, isLoading, refetch } = useQuery({
    queryKey: ["landing-page-assets"],
    queryFn: async () => {
      const { data, error } = await supabase.storage
        .from("landing-page-assets")
        .list();

      if (error) throw error;

      const urls = await Promise.all(
        data.map(async (file) => {
          const { data: { publicUrl } } = supabase.storage
            .from("landing-page-assets")
            .getPublicUrl(file.name);
          return {
            name: file.name,
            url: publicUrl,
          };
        })
      );

      return urls;
    },
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsUploading(true);
      const fileExt = file.name.split(".").pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("landing-page-assets")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      await refetch();
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <ImageIcon className="mr-2 h-4 w-4" />
          Select Image
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Asset Manager</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload">
              <Button
                variant="outline"
                className="w-full"
                disabled={isUploading}
                asChild
              >
                <span>
                  <Upload className="mr-2 h-4 w-4" />
                  {isUploading ? "Uploading..." : "Upload Image"}
                </span>
              </Button>
            </label>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images?.map((image) => (
                <Card
                  key={image.name}
                  className="cursor-pointer hover:border-primary transition-all"
                  onClick={() => onSelectImage(image.url)}
                >
                  <CardContent className="p-2">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-32 object-cover rounded-md"
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
