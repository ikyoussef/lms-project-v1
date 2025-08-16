import { createUploadthing, type FileRouter } from "uploadthing/next";
// import { UploadThingError } from "uploadthing/server";
import { auth  } from '@clerk/nextjs/server'; 
import { isTeacher } from "@/lib/teacher";

const f = createUploadthing();

const handleAuth = async () => {
  const { userId } = await auth(); // << await ici est essentiel

  const isAuthorized = isTeacher(userId);

    if(!userId  || !isAuthorized) throw new Error("Unhautorized");
    return {userId};
}

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {

    courseImage : f({image : {maxFileSize : "4MB" , maxFileCount : 1}})
    .middleware( () => auth())
    .onUploadComplete(() => {}),
    courseAttachment : f(["text" , "image" , "audio" , "pdf"])
    .middleware(() => handleAuth())
    .onUploadComplete( () => {}),
    chapterVideo : f({ video: {maxFileCount: 1 , maxFileSize: "512GB"}})
        .middleware(() => handleAuth())
        .onUploadComplete(() => {})
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;