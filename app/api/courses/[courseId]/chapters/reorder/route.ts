// Importez 'auth' mais renommez-le immédiatement en 'clerkAuth'
import { db } from '@/lib/db';
import { auth as clerkAuth } from '@clerk/nextjs/server'; 
import { NextResponse } from 'next/server';
import { it } from 'node:test';

// ... le reste de vos imports

export async function PUT(req: Request ,{params} : {params : {courseId : string}}) {
  try {
    const { userId } = await clerkAuth();
    // const { url } = await req.json();



    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

      const { list } = await req.json();


    const courseOwner = await db.course.findUnique({
        where : {
            id : params.courseId,
            userId : userId
        }
    });

    if (!courseOwner) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    for(const item of list){
      await db.chapter.update({
        where : {
            id : item.id,
        },data : {
            position : item.position
        }
      });
    }



    return NextResponse.json("Success" , {status : 200});
  } catch (error) {
    console.log("[REORDER]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}