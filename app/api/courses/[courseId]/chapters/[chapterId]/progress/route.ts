// Fichier : app/api/courses/[courseId]/chapters/[chapterId]/progress/route.ts

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string } }
) {
    try {
        // 1. Authentifier l'utilisateur
        const { userId } = await auth();
        // 2. Récupérer l'état de complétion depuis le corps de la requête
        const { isCompleted } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // 3. Utiliser "upsert" pour créer ou mettre à jour la progression de l'utilisateur
        // C'est l'opération la plus importante de cette route.
        const userProgress = await db.userProgress.upsert({
            where: {
                // On trouve l'enregistrement unique basé sur la combinaison de userId et chapterId
                userId_chapterId: {
                    userId,
                    chapterId: params.chapterId,
                }
            },
            // Si l'enregistrement est trouvé, on le met à jour
            update: {
                isCompleted
            },
            // S'il n'est pas trouvé, on le crée
            create: {
                userId,
                chapterId: params.chapterId,
                isCompleted,
            }
        });

        // 4. Renvoyer une réponse de succès avec les données mises à jour
        return NextResponse.json(userProgress);

    } catch (error) {
        console.error("[CHAPTER_ID_PROGRESS]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}