// Fichier : app/(dashboard)/(routes)/(root)/page.tsx

import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { CoursesList } from "@/components/courses-list";
import { auth } from "@clerk/nextjs/server";
import { CheckCircle, Clock } from "lucide-react";
import { redirect } from "next/navigation";
import { InfoCard } from "./_components/info-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function RootPage() {
    // 1. On récupère le userId. Il peut être `null` si le visiteur n'est pas connecté.
    const { userId } = await auth();

    // 2. Si l'utilisateur N'EST PAS connecté, on affiche la page de bienvenue publique.
    if (!userId) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] p-6 text-center">
                <h1 className="text-4xl font-bold">Welcome to Our Learning Platform</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Your journey to knowledge starts here. Browse our courses or sign in to continue.
                </p>
                <div className="mt-8 flex gap-x-4">
                    <Link href="/search">
                        <Button size="lg">Browse Courses</Button>
                    </Link>
                    <Link href="/sign-in">
                        <Button size="lg" variant="outline">Login</Button>
                    </Link>
                </div>
            </div>
        );
    }

    // 3. Si l'utilisateur EST connecté, on exécute la logique du tableau de bord.
    // On appelle notre action pour obtenir les données formatées.
    const {
        completedCourses,
        coursesInProgress
    } = await getDashboardCourses(userId);

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold">My Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoCard
                    icon={Clock}
                    label="In Progress"
                    numberOfItems={coursesInProgress.length}
                />
                <InfoCard
                    icon={CheckCircle}
                    label="Completed"
                    numberOfItems={completedCourses.length}
                    variant="success"
                />
            </div>
            {/* On réutilise le composant CoursesList que nous avons déjà créé ! */}
            <CoursesList
                items={[...coursesInProgress, ...completedCourses]}
            />
        </div>
    );
}