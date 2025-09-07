// import { db } from "@/lib/db";
// import { Categories } from "./_components/categories";
// import { SearchInput } from "@/components/search-input";
// import { getCourses } from "@/actions/get-courses";
// import { auth} from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";
// import { CoursesList } from "@/components/courses-list";

// interface SerachPageProps{
//   searchParams : {
//     title : string;
//     categoryId : string;
//   }
// }

// const SearchPage = async ( { searchParams } : SerachPageProps ) => {

//   const { userId } = await auth();

//     if(!userId) {
//         redirect('/');
//     }
//   const categories = await db.category.findMany({
//     orderBy : {
//       name : "asc"
//     }
//   })

  


//   const courses = await getCourses({
//     userId,
//     ...searchParams

//   });
//   return (
//     <>
//       <div className="px-6 pt-6 md:hidden md:mb-0 block">
//         <SearchInput />
//       </div>
//       <div className="p-6 space-y-4">
//         <Categories 
//           items={categories}
        
//         />

//         <CoursesList
//             items={courses}
//         />
//       </div>
//     </>
//   )
// }
// export default  SearchPage;






// Fichier : app/(dashboard)/(routes)/search/page.tsx

// Fichier : app/(dashboard)/(routes)/search/page.tsx

// ===== AJOUTEZ CETTE LIGNE EN HAUT DU FICHIER =====
export const dynamic = 'force-dynamic';
// =================================================

import { db } from "@/lib/db";
import { SearchInput } from "@/components/search-input";
import { getCourses } from "@/actions/get-courses";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CoursesList } from "@/components/courses-list";
import { Categories } from "../search/_components/categories";

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  }
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
    // ... le reste de votre code est parfait et n'a pas besoin de changer ...
    const { userId } = await auth();

    if (!userId) {
        return redirect("/");
    }

    const categories = await db.category.findMany({
        orderBy: {
            name: "asc"
        }
    });

    const courses = await getCourses({
        userId,
        ...searchParams,
    });

    return (
        <>
            <div className="px-6 pt-6 md:hidden md:mb-0 block">
                <SearchInput />
            </div>
            <div className="p-6 space-y-4">
                <Categories
                    items={categories}
                />
                <CoursesList
                    items={courses}
                />
            </div>
        </>
    );
}

export default SearchPage;