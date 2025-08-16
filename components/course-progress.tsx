// Fichier : components/course-progress.tsx

"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface CourseProgressProps {
  value: number;
  variant?: "default" | "success"; // Permet de changer la couleur en fonction du contexte
  size?: "default" | "sm";
}

// On définit les classes de couleur pour chaque variante
const colorByVariant = {
  default: "text-sky-700",
  success: "text-emerald-700",
};

// On définit les classes de taille pour le texte
const sizeByVariant = {
  default: "text-sm",
  sm: "text-xs",
};

export const CourseProgress = ({
  value,
  variant = "default", // Valeur par défaut si non fournie
  size = "default",    // Valeur par défaut si non fournie
}: CourseProgressProps) => {
  return (
    <div>
      {/* Le composant de base de shadcn/ui */}
      <Progress
        className="h-2"
        variant={variant}
        value={value}
        // Note : pour changer la couleur de la barre elle-même,
        // vous pouvez ajouter des classes ici ou modifier le composant ui/progress.tsx
        // Exemple : variant === "success" ? "bg-emerald-500" : ""
      />
      {/* L'étiquette de texte qui affiche le pourcentage */}
      <p className={cn(
        "font-medium mt-2",
        colorByVariant[variant], // Applique la classe de couleur
        sizeByVariant[size],     // Applique la classe de taille
      )}>
        {Math.round(value)}% Complete
      </p>
    </div>
  );
};