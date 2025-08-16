// Importez 'auth' mais renommez-le immédiatement en 'clerkAuth'
import { db } from '@/lib/db';
import { isTeacher } from '@/lib/teacher';
import { auth as clerkAuth } from '@clerk/nextjs/server'; 
import { NextResponse } from 'next/server';

// ... le reste de vos imports

export async function POST(req: Request) {
  try {
    // Utilisez 'await' pour attendre le résultat de la fonction asynchrone
    const { userId } = await clerkAuth();
    const {title} = await req.json();



    if (!userId || !isTeacher(userId)) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.create({
        data : {
            userId,
            title,
        }
    })
    return NextResponse.json(course);

  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}