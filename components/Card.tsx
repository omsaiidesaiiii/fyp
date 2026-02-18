"use client";

import { Models } from "node-appwrite";
import { useState } from "react";
import Thumbnail from "@/components/Thumbnail";
import { convertFileSize } from "@/lib/utils";
import FormattedDateTime from "@/components/FormattedDateTime";
import ActionDropdown from "@/components/ActionDropdown";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";

const Card = ({ file }: { file: Models.Document }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <>
      <div 
        onClick={() => setIsPreviewOpen(true)}
        className="file-card flex flex-col justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm hover:shadow-lg transition-all border border-gray-100 group relative overflow-hidden cursor-pointer"
      >
        <div className="flex justify-between items-start">
          <Thumbnail
            type={file.type}
            extension={file.extension}
            url={file.url}
            className="size-14 min-w-14 rounded-xl bg-gray-50 group-hover:bg-indigo-50 transition-colors"
            imageClassName="!size-8"
          />

          <div onClick={(e) => e.stopPropagation()}>
            <ActionDropdown file={file} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-[15px] font-bold text-dark-100 line-clamp-1 group-hover:text-brand transition-colors">
            {file.name}
          </p>
          
          <div className="flex items-center justify-between">
             <FormattedDateTime
               date={file.$createdAt}
               className="text-xs text-gray-400 font-medium"
             />
             <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
               {convertFileSize(file.size)}
             </span>
          </div>

          <p className="text-[11px] text-gray-400 line-clamp-1 mt-1">
            By: {file.owner.fullName}
          </p>
        </div>
      </div>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-[95vw] md:max-w-[900px] p-0 overflow-hidden bg-black/95 border-none shadow-2xl rounded-3xl ring-0 outline-none animate-in fade-in zoom-in-95 duration-300">
          <DialogTitle className="sr-only">Preview of {file.name}</DialogTitle>
          <div className="relative w-full h-full flex flex-col items-center justify-center p-6 min-h-[400px]">
             {/* Header Info */}
             <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent z-50">
                <div className="flex flex-col">
                    <h3 className="text-white font-bold text-lg line-clamp-1">{file.name}</h3>
                    <p className="text-gray-400 text-xs">{convertFileSize(file.size)} • {file.extension.toUpperCase()}</p>
                </div>
                <button 
                    onClick={() => setIsPreviewOpen(false)}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white backdrop-blur-md"
                >
                    <X className="w-5 h-5" />
                </button>
             </div>

             {/* Dynamic Content */}
             <div className="mt-14 w-full flex items-center justify-center">
                {file.type === "image" ? (
                    <img 
                        src={file.url} 
                        alt={file.name} 
                        className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl animate-in zoom-in-90 duration-500" 
                    />
                ) : file.type === "video" ? (
                    <video 
                        src={file.url} 
                        controls 
                        autoPlay 
                        className="max-w-full max-h-[75vh] w-full rounded-xl shadow-2xl animate-in fade-in duration-500" 
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center gap-8 py-20 text-white animate-in slide-in-from-bottom-10 duration-500">
                        <Thumbnail
                            type={file.type}
                            extension={file.extension}
                            className="size-40 rounded-3xl bg-white/5 border border-white/10 shadow-inner"
                            imageClassName="!size-20"
                        />
                        <div className="text-center space-y-3">
                            <p className="text-2xl font-bold">{file.name}</p>
                            <p className="text-gray-400 text-sm">Preview not available for this file type.</p>
                        </div>
                        <a 
                            href={file.url} 
                            target="_blank" 
                            className="px-10 py-4 bg-indigo-600 rounded-full font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                        >
                            Open File
                        </a>
                    </div>
                )}
             </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default Card;