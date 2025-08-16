import { db } from '@/lib/db';
import { auth as clerkAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import Mux from "@mux/mux-node";

// Initialisation correcte du client Mux
const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});



export async function PATCH(req: Request, { params }: { params: { courseId: string; chapterId: string } }) {
  try {
    const { userId } = await clerkAuth();
    // const { isPublished, ...values } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId
      }
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await db.chapter.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId
      }
    });


      const muxData = await db.muxData.findUnique({
        where: {
          chapterId: params.chapterId,
        }
      });

      if (!chapter || !muxData || !chapter.title || !chapter.description || !chapter.videoUrl) {
            return new NextResponse("Missing required fields", { status: 400 });

      }

      const publishedChapter = await db.chapter.update({
        where: {
          id : params.chapterId,
          courseId: params.courseId,
        } , data : {
              isPublished : true ,
        }
      });

      const publishedChapterInCourse = await db.chapter.findMany({
        where: {
          courseId: params.courseId,
          isPublished : true ,
        }
      });
  
      if (!publishedChapterInCourse.length) {
          await db.course.update({
            where: {
              id: params.courseId,
            },
            data : {
              isPublished : false ,
            }
          
          });
      }

    return NextResponse.json(publishedChapter);

  } catch (error) {
    console.error("[CHAPTER_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}