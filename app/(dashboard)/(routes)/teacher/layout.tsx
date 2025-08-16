// Fichier : app/(dashboard)/(routes)/teacher/layout.tsx

import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const TeacherLayout = async ({ children }: { children: ReactNode }) => {
    // 1. On récupère l'ID de l'utilisateur actuellement connecté
    const { userId } = await auth(); // Clerk v5

    // 2. On utilise notre fonction de vérification
    // Si l'ID de l'utilisateur ne correspond pas à l'ID de l'enseignant...
    if (!isTeacher(userId)) {
        // 3. ...on le redirige immédiatement vers la page d'accueil.
        // L'exécution du code s'arrête ici, et l'enfant (`{children}`) n'est jamais rendu.
        return redirect("/");
    }
    
    // 4. Si la vérification passe, on affiche simplement la page demandée.
    return <>{children}</>;
}
 
export default TeacherLayout;