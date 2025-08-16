// Importez 'auth' mais renommez-le immédiatement en 'clerkAuth'
import { db } from '@/lib/db';
import { auth as clerkAuth } from '@clerk/nextjs/server'; 
import { NextResponse } from 'next/server';

// ... le reste de vos imports

export async function DELETE(req: Request ,{params} : {params : {courseId : string , attachmentId : string}}) {
  try {
    const { userId } = await clerkAuth();
    // const { courseId } = params;
    // const values = await req.json();



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

      const attachment = await db.attachment.delete({
        where : {
            courseId : params.courseId ,
            id : params.attachmentId 
        }
    });
    return NextResponse.json(attachment);

  } catch (error) {
    console.log("[COURSES_ID_ATTACHMENTS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}