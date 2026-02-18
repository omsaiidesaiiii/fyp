"use client";

import React, { useCallback, useState } from "react";

import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { cn, convertFileToUrl, getFileType } from "@/lib/utils";
import Image from "next/image";
import Thumbnail from "@/components/Thumbnail";
import { MAX_FILE_SIZE } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import { uploadFile } from "@/lib/actions/file.actions";
import { usePathname } from "next/navigation";

interface Props {
  ownerId: string;
  accountId: string;
  className?: string;
}

const FileUploader = ({ ownerId, accountId, className }: Props) => {
  const path = usePathname();
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setFiles(acceptedFiles);

      const uploadPromises = acceptedFiles.map(async (file) => {
        if (file.size > MAX_FILE_SIZE) {
          setFiles((prevFiles) =>
            prevFiles.filter((f) => f.name !== file.name),
          );

          return toast({
            description: (
              <p className="body-2 text-white">
                <span className="font-semibold">{file.name}</span> is too large.
                Max file size is 50MB.
              </p>
            ),
            className: "error-toast",
          });
        }

        return uploadFile({ file, ownerId, accountId, path }).then(
          (uploadedFile) => {
            if (uploadedFile) {
              setFiles((prevFiles) =>
                prevFiles.filter((f) => f.name !== file.name),
              );
            }
          },
        );
      });

      await Promise.all(uploadPromises);
    },
    [ownerId, accountId, path],
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleRemoveFile = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    fileName: string,
  ) => {
    e.stopPropagation();
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  return (
    <div {...getRootProps()} className="cursor-pointer">
      <input {...getInputProps()} />
      <Button type="button" className={cn("bg-brand hover:bg-brand-100 text-white font-medium h-11 rounded-full px-6 shadow-md transition-all gap-2 focus:ring-2 focus:ring-brand focus:ring-offset-2 outline-none", className)}>
        <Image
          src="/assets/icons/upload.svg"
          alt="upload"
          width={22}
          height={22}
          className="opacity-90"
        />
        <p>Upload</p>
      </Button>
      {files.length > 0 && (
        <ul className="fixed bottom-10 right-10 z-[100] flex w-full max-w-[480px] flex-col gap-3 rounded-[20px] bg-white p-7 shadow-2xl border border-gray-100 animate-in slide-in-from-bottom-5 duration-300">
          <h4 className="text-[18px] font-bold text-dark-100 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
            Uploading {files.length} {files.length === 1 ? 'file' : 'files'}
          </h4>

          {files.map((file, index) => {
            const { type, extension } = getFileType(file.name);

            return (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-gray-50 bg-gray-50/50 p-3"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <Thumbnail
                    type={type}
                    extension={extension}
                    url={convertFileToUrl(file)}
                    className="size-10 rounded-lg bg-white shadow-sm"
                  />

                  <div className="flex flex-col gap-1 overflow-hidden">
                    <p className="text-sm font-semibold text-dark-100 line-clamp-1">
                      {file.name}
                    </p>
                    <div className="flex items-center gap-2">
                         <span className="text-[10px] font-medium text-gray-400">Loading...</span>
                         <Image
                           src="/assets/icons/file-loader.gif"
                           width={60}
                           height={20}
                           alt="Loader"
                           className="opacity-60"
                         />
                    </div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"
                  onClick={(e) => handleRemoveFile(e, file.name)}
                >
                  <Image
                    src="/assets/icons/remove.svg"
                    width={20}
                    height={20}
                    alt="Remove"
                  />
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default FileUploader;