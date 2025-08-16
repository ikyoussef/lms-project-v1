import { db } from '@/lib/db';
import { auth as clerkAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import Mux from "@mux/mux-node";



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

      const unpublishedChapter = await db.chapter.update({
        where: {
          id : params.chapterId,
          courseId: params.courseId,
        } , data : {
              isPublished : false ,
        }
      });

      const publishedChaptersInCourse = await db.chapter.findMany({
        where : {
          courseId : params.courseId,
          isPublished : true,
        }
      });

      if (!publishedChaptersInCourse.length) {
        await db.course.update({
          where : {
            id : params.courseId,
          } , data : {
            isPublished : false,
          }
        });
      }

    return NextResponse.json(unpublishedChapter);

  } catch (error) {
    console.error("[CHAPTER_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}