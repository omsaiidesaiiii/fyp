import React from "react";
import Image from "next/image";
import { cn, getFileIcon } from "@/lib/utils";
import { File } from "lucide-react";

interface Props {
  type: string;
  extension: string;
  url?: string;
  imageClassName?: string;
  className?: string;
}

export const Thumbnail = ({
  type,
  extension,
  url = "",
  imageClassName,
  className,
}: Props) => {
  const isImage = type === "image" && extension !== "svg";

  return (
    <div className={cn("thumbnail flex items-center justify-center overflow-hidden", className)}>
      {isImage ? (
        <Image
          src={url}
          alt="thumbnail"
          width={100}
          height={100}
          className={cn(
            "size-8 object-cover",
            imageClassName,
            isImage && "thumbnail-image",
          )}
        />
      ) : (
        <Image
        src={getFileIcon(extension, type)}
        alt="thumbnail"
        width={100}
        height={100}
        className={cn(
          "size-8 object-contain",
          imageClassName,
        )}
      />
      )}
    </div>
  );
};
export default Thumbnail;