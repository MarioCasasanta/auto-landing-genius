
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { File, Trash2 } from "lucide-react";
import { UseMutationResult } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface SwipeFileCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  file_url: string;
  deleteSwipeFile: UseMutationResult<void, Error, string>;
}

export function SwipeFileCard({
  id,
  title,
  description,
  category,
  file_url,
  deleteSwipeFile,
}: SwipeFileCardProps) {
  const { toast } = useToast();

  const handleDelete = () => {
    deleteSwipeFile.mutate(id, {
      onSuccess: () => {
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
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <File className="mr-2 h-4 w-4" />
            {title}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">
          {description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs bg-secondary px-2 py-1 rounded-full">
            {category}
          </span>
          <Button variant="link" size="sm" asChild>
            <a
              href={file_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              View File
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
