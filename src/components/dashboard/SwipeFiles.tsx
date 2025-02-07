
import { UploadForm } from "./swipe-files/UploadForm";
import { SwipeFileCard } from "./swipe-files/SwipeFileCard";
import { useSwipeFiles } from "@/hooks/use-swipe-files";

export default function SwipeFiles() {
  const { swipeFiles, isLoading, deleteSwipeFile } = useSwipeFiles();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Swipe Files</h1>
      <UploadForm />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          swipeFiles?.map((file) => (
            <SwipeFileCard
              key={file.id}
              {...file}
              deleteSwipeFile={deleteSwipeFile}
            />
          ))
        )}
      </div>
    </div>
  );
}
