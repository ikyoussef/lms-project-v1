// // Fichier : app/(course)/courses/[courseId]/chapters/[chapterId]/page.tsx

// import { getChapter } from "@/actions/get-chapter";
// import { auth } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";
// import { File } from "lucide-react";

// // On importe tous les composants nécessaires
// import Banner  from "@/components/banner";
// import { VideoPlayer } from "./_components/video-player";
// import { CourseEnrollButton } from "./_components/course-enroll-button";
// import { Separator } from "@/components/ui/separator";
// import { Preview } from "@/components/preview";
// import { CourseProgress } from "@/components/course-progress";
// import { CourseProgressButton } from "./_components/course-progress-button";
// // import { CourseProgressButton } from "./_components/course-progress-button";

// const ChapterIdPage = async ({
//     params
// }: {
//     params: { courseId: string; chapterId: string; }
// }) => {
//     const { userId } = await auth();

//     if (!userId) {
//         return redirect("/");
//     }

//     const {
//         chapter,
//         course,
//         muxData,
//         attachments,
//         nextChapter,
//         userProgress,
//         purchase,
//     } = await getChapter({
//         userId,
//         chapterId: params.chapterId,
//         courseId: params.courseId,
//     });

//     if (!chapter || !course) {
//         return redirect("/");
//     }

//     const isLocked = !chapter.isFree && !purchase;
//     const completeOnEnd = !!purchase && !userProgress?.isCompleted;

//     return (
//         <div className="flex flex-col">
//             {/* Les bannières restent en haut pour une visibilité maximale */}
//             {userProgress?.isCompleted && (
//                 <Banner variant="success" label="You already completed this chapter." />
//             )}
//             {isLocked && (
//                 <Banner variant="warning" label="You need to purchase this course to watch this chapter." />
//             )}

//             <div className="flex flex-col max-w-4xl mx-auto pb-20">
//                 {/* 1. Lecteur Vidéo */}
//                 <div className="p-4">
//                     {muxData?.playbackId && (
//                         <VideoPlayer
//                             chapterId={params.chapterId}
//                             title={chapter.title}
//                             courseId={params.courseId}
//                             nextChapterId={nextChapter?.id}
//                             playbackId={muxData.playbackId}
//                             isLocked={isLocked}
//                             completeOnEnd={completeOnEnd}
//                         />
//                     )}
//                 </div>

//                 {/* 2. En-tête du chapitre (Titre + Bouton de progression) */}
//                 <div className="p-4 flex flex-col md:flex-row items-center justify-between">
//                     {/* <div className="f md:flex-row items-start   gap-4"> */}
//                         <h2 className="text-2xl font-semibold mb-2">
//                             {chapter.title}
//                         </h2>
//                         {/* On affiche le bouton d'achat OU le bouton de progression */}
//                         {purchase ? (
//                             <div>
//                                 <CourseProgressButton 
//                                     chapterId={params.chapterId}
//                                     courseId={params.courseId}
//                                     nextChapterId={nextChapter?.id}
//                                     isCompleted={!!userProgress?.isCompleted}
//                                 />
//                             </div>
//                         ) : (
//                             <CourseEnrollButton
//                                 courseId={params.courseId}
//                                 price={course.price!}
//                             />
//                         )}
//                     {/* </div> */}
//                 </div>

//                 <Separator className="my-8" />

//                 {/* 3. Description et Pièces Jointes */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                     {/* Colonne de gauche pour la description */}
//                     <div className="md:col-span-2">
//                         <h2 className="text-xl font-semibold mb-4">About this chapter</h2>
//                         <div className="prose dark:prose-invert max-w-none">
//                             <Preview value={chapter.description!} />
//                         </div>
//                     </div>

//                     {/* Colonne de droite pour les pièces jointes (si elles existent) */}
//                     {!!attachments.length && (
//                         <div className="md:col-span-1">
//                             <h2 className="text-xl font-semibold mb-4">Resources</h2>
//                             <div className="space-y-2">
//                                 {attachments.map((attachment) => (
//                                     <a
//                                         href={attachment.url}
//                                         target="_blank"
//                                         key={attachment.id}
//                                         className="flex items-center p-3 w-full bg-sky-100 border text-sky-700 rounded-md hover:underline hover:bg-sky-200 transition"
//                                     >
//                                         <File className="h-4 w-4 mr-2 flex-shrink-0" />
//                                         <p className="line-clamp-1">{attachment.name}</p>
//                                     </a>
//                                 ))}
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default ChapterIdPage;




// Fichier : app/(course)/courses/[courseId]/chapters/[chapterId]/page.tsx

import { getChapter } from "@/actions/get-chapter";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { File } from "lucide-react";

// On importe tous les composants nécessaires
import Banner  from "@/components/banner";
import { VideoPlayer } from "./_components/video-player";
import { CourseEnrollButton } from "./_components/course-enroll-button";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { CourseProgressButton } from "./_components/course-progress-button";

// ===== DÉBUT DE LA CORRECTION =====

// On définit un type pour nos paramètres de route spécifiques
type ChapterIdPageParams = {
    courseId: string;
    chapterId: string;
};

// On utilise le type générique PageProps de Next.js
// Il gère correctement les `params` et `searchParams`
type ChapterIdPageProps = {
    params: ChapterIdPageParams;
};

const ChapterIdPage = async ({
    params
}: {
    params: { courseId: string; chapterId: string; }
}) => {
// ===== FIN DE LA CORRECTION =====

    const { userId } = await auth();

    if (!userId) {
        return redirect("/");
    }

    const {
        chapter,
        course,
        muxData,
        attachments,
        nextChapter,
        userProgress,
        purchase,
    } = await getChapter({
        userId,
        chapterId: params.chapterId,
        courseId: params.courseId,
    });

    if (!chapter || !course) {
        return redirect("/");
    }

    const isLocked = !chapter.isFree && !purchase;
    const completeOnEnd = !!purchase && !userProgress?.isCompleted;

    return (
        <div>
            {userProgress?.isCompleted && (
                <Banner variant="success" label="You already completed this chapter." />
            )}
            {isLocked && (
                <Banner variant="warning" label="You need to purchase this course to watch this chapter." />
            )}

            <div className="flex flex-col max-w-4xl mx-auto pb-20">
                <div className="p-4">
                    {muxData?.playbackId && (
                        <VideoPlayer
                            chapterId={params.chapterId}
                            title={chapter.title}
                            courseId={params.courseId}
                            nextChapterId={nextChapter?.id}
                            playbackId={muxData.playbackId}
                            isLocked={isLocked}
                            completeOnEnd={completeOnEnd}
                        />
                    )}
                </div>
                
                <div className="p-4 flex flex-col md:flex-row items-center justify-between">
                    <h2 className="text-2xl font-semibold mb-2">
                        {chapter.title}
                    </h2>
                    {purchase ? (
                        <CourseProgressButton
                            chapterId={params.chapterId}
                            courseId={params.courseId}
                            nextChapterId={nextChapter?.id}
                            isCompleted={!!userProgress?.isCompleted}
                        />
                    ) : (
                        <CourseEnrollButton
                            courseId={params.courseId}
                            price={course.price!}
                        />
                    )}
                </div>
                
                <Separator />
                
                <div className="p-4">
                  <Preview value={chapter.description!} />
                </div>
                
                {!!attachments.length && (
                    <>
                        <Separator />
                        <div className="p-4">
                            <h3 className="text-xl font-semibold mb-2">Attachments</h3>
                            <div className="space-y-2">
                                {attachments.map((attachment) => (
                                    <a
                                        href={attachment.url}
                                        target="_blank"
                                        key={attachment.id}
                                        className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                                    >
                                        <File className="h-4 w-4 mr-2" />
                                        <p className="line-clamp-1">
                                            {attachment.name}
                                        </p>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default ChapterIdPage;