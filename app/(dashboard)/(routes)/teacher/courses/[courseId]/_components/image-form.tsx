// Chemin : app/(dashboard)/teacher/courses/_components/image-form.tsx

"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { Course } from "@prisma/client";
import { UploadDropzone } from "@/lib/uploadthing"; // Assurez-vous que le chemin est correct

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "Image is required",
  }),
});

interface ImageFormProps {
  initialData: Course;
  courseId: string;
}

const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Course image updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course image
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.imageUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add an image
            </>
          )}
          {!isEditing && initialData.imageUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit image
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.imageUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <Image
              alt="Upload"
              fill
              className="object-cover rounded-md"
              src={initialData.imageUrl}
            />
          </div>
        ))}
      {isEditing && (
        <div className="mt-2">
          <UploadDropzone
            endpoint="courseImage"
            onClientUploadComplete={(res) => {
              if (res?.[0].url) {
                onSubmit({ imageUrl: res[0].url });
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
            16:9 aspect ratio recommended
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageForm;