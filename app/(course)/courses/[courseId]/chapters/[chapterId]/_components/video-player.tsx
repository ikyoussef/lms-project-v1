// Fichier : app/(course)/courses/[courseId]/chapters/[chapterId]/_components/video-player.tsx

"use client";

import axios from "axios";
import MuxPlayer from "@mux/mux-player-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

import { cn } from "@/lib/utils";
import { useConfettiStore } from "@/hooks/use-confetti-store";

interface VideoPlayerProps {
    playbackId: string;
    courseId: string;
    chapterId: string;
    nextChapterId?: string;
    isLocked: boolean;
    completeOnEnd: boolean;
    title: string;
};

export const VideoPlayer = ({
    playbackId,
    courseId,
    chapterId,
    nextChapterId,
    isLocked,
    completeOnEnd,
    title,
}: VideoPlayerProps) => {
    const [isReady, setIsReady] = useState(false);
    const router = useRouter();
    const confetti = useConfettiStore();

    // Cette fonction est appelée lorsque la vidéo est terminée
    const onEnded = async () => {
        try {
            // On informe notre API que le chapitre est terminé
            if (completeOnEnd) {
                await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
                    isCompleted: true,
                });
            }

            // Si ce n'est pas déjà fait, on déclenche les confettis
            if (!nextChapterId) {
                confetti.onOpen();
            }
            
            toast.success("Progress updated");
            router.refresh(); // Rafraîchit les Server Components (comme la sidebar)

            // Si il y a un chapitre suivant, on y navigue automatiquement
            if (nextChapterId) {
                router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
            }
        } catch {
            toast.error("Something went wrong");
        }
    }

    return (
        <div className="relative aspect-video">
            {/* Écran de chargement en attendant que le lecteur soit prêt */}
            {!isReady && !isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                    <Loader2 className="h-8 w-8 animate-spin text-secondary" />
                </div>
            )}

            {/* Écran de verrouillage si l'utilisateur n'a pas accès */}
            {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
                    <Lock className="h-8 w-8" />
                    <p className="text-sm">
                        This chapter is locked
                    </p>
                </div>
            )}

            {/* Le lecteur Mux, qui n'est pas visible tant qu'il n'est pas prêt */}
            {!isLocked && (
                <MuxPlayer
                    title={title}
                    className={cn(
                        !isReady && "hidden" // On le cache tant qu'il n'est pas prêt à jouer
                    )}
                    onCanPlay={() => setIsReady(true)} // Quand la vidéo est chargée, on met à jour l'état
                    onEnded={onEnded} // Quand la vidéo se termine, on appelle notre fonction
                    autoPlay
                    playbackId={playbackId}
                />
            )}
        </div>
    )
}