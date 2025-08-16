// Importez 'auth' mais renommez-le immédiatement en 'clerkAuth'
import { db } from '@/lib/db';
import { auth as clerkAuth } from '@clerk/nextjs/server'; 
import { NextResponse } from 'next/server';

// ... le reste de vos imports

export async function POST(req: Request ,{params} : {params : {courseId : string}}) {
  try {
    const { userId } = await clerkAuth();
    // const { url } = await req.json();
    const { title } = await req.json();



    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
        where : {
            id : params.courseId,
            userId : userId
        }
    });

      if (!courseOwner) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

      const lastChapter = await db.chapter.findFirst({
        where : {
            courseId : params.courseId,
        },
        orderBy : {
          position : "desc",
        }
    });

    const newPosition = lastChapter ? lastChapter.position+1 : 1;

    const chapter = await db.chapter.create({
      data : {
        title,
        courseId : params.courseId,
        position : newPosition
      }
    })
    return NextResponse.json(chapter);

  } catch (error) {
    console.log("[COURSES_ID_ATTACHMENTS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}