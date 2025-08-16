// Chemin : app/(dashboard)/teacher/courses/_components/image-form.tsx

"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle, Video } from "lucide-react";
import { Chapter, MuxData } from "@prisma/client";
import { UploadDropzone } from "@/lib/uploadthing"; // Assurez-vous que le chemin est correct
import MuxPlayer from "@mux/mux-player-react"
const formSchema = z.object({
  videoUrl: z.string().min(1),
});

interface ChapterVideoFormProps {
  initialData: Chapter & {muxData? : MuxData | null};
  courseId: string;
  chapterId: string;
}

const ChapterVideoForm = ({ initialData, courseId , chapterId}: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
      toast.success("Chapter updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter video
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a video
            </>
          )}
          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit video
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
              <MuxPlayer 
                playbackId={initialData?.muxData?.playbackId || ""}
              />
          </div>
        ))}
      {isEditing && (
        <div className="mt-2">
          <UploadDropzone
            endpoint="chapterVideo"
            onClientUploadComplete={(res) => {
              if (res?.[0].url) {
                onSubmit({ videoUrl: res[0].url });
              }
            }}
            onUploadError={(error: Error) => {
              toast.error(`ERROR! ${error.message}`);
            }}
            // ----- DÉBUT DES CHANGEMENTS DE COULEUR -----
            appearance={{
              container: "mt-2 border-dashed border-2 border-blue-300 rounded-md p-4 text-center",
              uploadIcon: "text-blue-400 h-12 w-12 mx-auto",
              label: "text-blue-600",
              button: "ut-ready:bg-blue-600 ut-uploading:bg-blue-400 after:bg-blue-500 bg-blue-500 text-white rounded-md p-2 mt-4",
              allowedContent: "text-xs text-blue-500 mt-1",
            }}
            // ----- FIN DES CHANGEMENTS DE COULEUR -----
          />
          <div className="text-xs text-muted-foreground mt-4 text-center">
            Upload this chapters&apos;s video
          </div>
        </div>
      )}

      {initialData.videoUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          Video can take a few minutes to process. Refresh the page if 
          video does not appear
        </div>
      )}
    </div>
  );
};

export default ChapterVideoForm;