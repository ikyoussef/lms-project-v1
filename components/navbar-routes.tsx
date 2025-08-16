// Fichier : components/navbar-routes.tsx

"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { isTeacher } from "@/lib/teacher"; // On importe notre fonction de vérification

// Pour obtenir le userId côté client, on utilise un hook de Clerk
import { useAuth } from "@clerk/nextjs";

import { SearchInput } from "./search-input";

export const NavbarRoutes = () => {
    // On utilise le hook `useAuth` qui est conçu pour les Composants Client
    const { userId } = useAuth();
    const pathname = usePathname();

    // On détermine la page actuelle pour afficher les bons boutons
    const isTeacherPage = pathname?.startsWith("/teacher");
    const isCoursePage = pathname?.includes("/courses");
    const isSearchPage = pathname === "/search";

    return (
        <>
            {/* On n'affiche la barre de recherche que sur la page de recherche */}
            {isSearchPage && (
                <div className="hidden md:block">
                    <SearchInput />
                </div>
            )}
            <div className="flex gap-x-2 ml-auto">
                {/* 
                  Si on est sur une page "enseignant" ou une page de cours,
                  on affiche un bouton "Exit" pour retourner au mode étudiant (la page de recherche).
                  Sinon, si on est en mode étudiant et qu'on EST l'enseignant, on affiche le bouton "Teacher mode".
                */}
                {isTeacherPage || isCoursePage ? (
                    <Link href="/search">
                        <Button size="sm" variant="ghost">
                            <LogOut className="h-4 w-4 mr-2" />
                            Exit
                        </Button>
                    </Link>
                ) : isTeacher(userId) ? ( // On vérifie si l'utilisateur est l'enseignant
                    <Link href="/teacher/courses">
                        <Button size="sm" variant="ghost">
                            Teacher mode
                        </Button>
                    </Link>
                ) : null}

                {/* 
                  Le <UserButton> de Clerk gère tout pour nous :
                  - Affiche l'avatar et le menu si l'utilisateur est connecté.
                  - Affiche un bouton "Sign in" si l'utilisateur n'est pas connecté.
                */}
                <UserButton
                    afterSignOutUrl="/"
                />
            </div>
        </>
    )
}