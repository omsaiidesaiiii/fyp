import React from "react";
import Sort from "@/components/Sort";
import { getFiles } from "@/lib/actions/file.actions";
import { Models } from "node-appwrite";
import Card from "@/components/Card";
import { getFileTypesParams } from "@/lib/utils";

const Page = async ({ searchParams, params }: SearchParamProps) => {
  const type = ((await params)?.type as string) || "";
  const searchText = ((await searchParams)?.query as string) || "";
  const sort = ((await searchParams)?.sort as string) || "";

  const types = getFileTypesParams(type) as FileType[];

  const files = await getFiles({ types, searchText, sort });

  return (
    <div className="mx-auto w-full max-w-7xl">
      <section className="w-full flex flex-col gap-6 mb-8">
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold capitalize text-dark-100">{type}</h1>
            <div className="hidden sm:block">
               <span className="text-gray-400 text-sm font-medium">Total: <span className="text-dark-100 font-bold ml-1">0 MB</span> (Placeholder)</span>
            </div>
        </div>

        <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-500 pl-4">{files.total} items found</p>
          <div className="min-w-[200px]">
            <Sort />
          </div>
        </div>
      </section>

      {/* Render the files */}
      {files.total > 0 ? (
        <section className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {files.documents.map((file: Models.Document) => (
            <Card key={file.$id} file={file} />
          ))}
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                 <p className="text-3xl">📂</p>
             </div>
             <p className="text-lg font-semibold text-dark-100">No matching files</p>
             <p className="text-gray-400 max-w-xs mt-1">Try adjusting your filters or upload a new file.</p>
        </div>
      )}
    </div>
  );
};

export default Page;