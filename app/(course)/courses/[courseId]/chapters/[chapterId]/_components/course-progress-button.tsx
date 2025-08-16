// Fichier : .../_components/course-progress-button.tsx

"use client";

import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface CourseProgressButtonProps {
    chapterId: string;
    courseId: string;
    nextChapterId?: string;
    isCompleted?: boolean;
};

export const CourseProgressButton = ({
    chapterId,
    courseId,
    nextChapterId,
    isCompleted,
}: CourseProgressButtonProps) => {
    const router = useRouter();
    const confetti = useConfettiStore();
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);

            // Mettre à jour la progression via notre API
            // On inverse l'état de complétion actuel
            await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
                isCompleted: !isCompleted
            });

            // Si on vient de terminer le chapitre ET qu'il n'y a pas de chapitre suivant,
            // alors c'est la fin du cours : on lance les confettis !
            if (!isCompleted && !nextChapterId) {
                confetti.onOpen();
            }
            
            // Si on vient de terminer le chapitre ET qu'il y a un chapitre suivant,
            // on navigue automatiquement vers ce dernier.
            if (!isCompleted && nextChapterId) {
                router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
            }

            toast.success("Progress updated");
            router.refresh(); // Très important pour rafraîchir la sidebar et les données du serveur

        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    // On détermine l'icône et le texte du bouton en fonction de l'état de complétion
    const Icon = isCompleted ? XCircle : CheckCircle;
    const buttonText = isCompleted ? "Mark as not complete" : "Mark as complete";

    return (
        <Button
            onClick={onClick}
            disabled={isLoading}
            type="button"
            variant={isCompleted ? "outline" : "success"} // Style différent si c'est complété
            className="w-full md:w-auto"
        >
            {buttonText}
            <Icon className="h-4 w-4 ml-2" />
        </Button>
    )
}