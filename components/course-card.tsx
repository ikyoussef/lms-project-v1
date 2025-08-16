// Fichier : components/course-card.tsx

import Image from "next/image";
import Link from "next/link";
import { IconBadge } from "./icon-badge";
import { BookOpen } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { CourseProgress } from "./course-progress"; // 1. Importer le composant de progression

interface CourseCardProps {
    id: string;
    title: string;
    imageUrl: string;
    chaptersLength: number;
    price: number;
    progress: number | null;
    category: string;
}

export const CourseCard = ({
    id,
    title,
    imageUrl,
    chaptersLength,
    price,
    progress,
    category,
}: CourseCardProps) => {
    return (
        <Link href={`/courses/${id}`}>
            <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full flex flex-col">
                <div className="relative w-full aspect-video rounded-md overflow-hidden">
                    <Image
                        alt={title} // Amélioration : Utiliser le titre du cours pour l'attribut alt
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300" // Amélioration : Effet de zoom au survol
                        src={imageUrl}
                    />
                </div>
                <div className="flex flex-col pt-2 flex-grow">
                    <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
                        {title}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        {category}
                    </p>
                    <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
                        <div className="flex items-center gap-x-1 text-slate-500">
                            <IconBadge size="sm" icon={BookOpen} />
                            <span>
                                {chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters"}
                            </span>
                        </div>
                    </div>

                    {/* Le flex-grow ci-dessus pousse cet élément vers le bas */}
                    <div className="mt-auto"> 
                        {/* 2. Logique pour afficher soit la progression, soit le prix */}
                        {progress !== null ? (
                            // Si l'utilisateur a commencé le cours, on affiche sa progression
                            <CourseProgress
                                variant={progress === 100 ? "success" : "default"}
                                size="sm" // Utiliser la petite variante pour la carte
                                value={progress}
                            />
                        ) : (
                            // Sinon, on affiche le prix
                            <p className="text-md md:text-sm font-medium text-slate-700">
                                {formatPrice(price)}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}