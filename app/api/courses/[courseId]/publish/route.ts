import { db } from '@/lib/db';
import { auth as clerkAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import Mux from "@mux/mux-node";


export async function PATCH(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const { userId } = await clerkAuth();
    // const { isPublished, ...values } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId
      }, include : {
              chapters : {
                include : {
                  muxData : true,
                }
              }
      }
    });

    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }

    const hasPublishedChapter = course.chapters.some((chapter) => chapter.isPublished);


      if (!course.title || !course.description || !course.imageUrl || !course.categoryId || !hasPublishedChapter ) {
            return new NextResponse("Missing required fields", { status: 401 });

      }

      const publishedCourse = await db.course.update({
        where: {
          id : params.courseId,
          userId: userId,
        } , data : {
              isPublished : true ,
        }
      });



    return NextResponse.json(publishedCourse);

  } catch (error) {
    console.error("[COURSE_ID_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}