import { Models } from "node-appwrite";
import Thumbnail from "@/components/Thumbnail";
import FormattedDateTime from "@/components/FormattedDateTime";
import { convertFileSize, formatDateTime } from "@/lib/utils";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { createShareLink } from "@/lib/actions/share.actions";
import { Loader2 } from "lucide-react";

const ImageThumbnail = ({ file }: { file: Models.Document }) => (
  <div className="file-details-thumbnail">
    <Thumbnail type={file.type} extension={file.extension} url={file.url} />
    <div className="flex flex-col">
      <p className="subtitle-2 mb-1">{file.name}</p>
      <FormattedDateTime date={file.$createdAt} className="caption" />
    </div>
  </div>
);

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex">
    <p className="file-details-label text-left">{label}</p>
    <p className="file-details-value text-left">{value}</p>
  </div>
);

export const FileDetails = ({ file }: { file: Models.Document }) => {
  return (
    <>
      <ImageThumbnail file={file} />
      <div className="space-y-4 px-2 pt-2">
        <DetailRow label="Format:" value={file.extension} />
        <DetailRow label="Size:" value={convertFileSize(file.size)} />
        <DetailRow label="Owner:" value={file.owner.fullName} />
        <DetailRow label="Last edit:" value={formatDateTime(file.$updatedAt)} />
      </div>
    </>
  );
};

interface Props {
  file: Models.Document;
  onInputChange: React.Dispatch<React.SetStateAction<string[]>>;
  onRemove: (email: string) => void;
}

export const ShareInput = ({ file, onInputChange, onRemove }: Props) => {
  return (
    <>
      <ImageThumbnail file={file} />

      <div className="share-wrapper">
        <p className="subtitle-2 pl-1 text-light-100">
          Share file with other users
        </p>
        <Input
          type="email"
          placeholder="Enter email address"
          onChange={(e) => onInputChange(e.target.value.trim().split(","))}
          className="share-input-field"
        />
        <div className="pt-4">
          <div className="flex justify-between">
            <p className="subtitle-2 text-light-100">Shared with</p>
            <p className="subtitle-2 text-light-200">
              {file.users.length} users
            </p>
          </div>

          <ul className="pt-2">
            {file.users.map((email: string) => (
              <li
                key={email}
                className="flex items-center justify-between gap-2"
              >
                <p className="subtitle-2">{email}</p>
                <Button
                  onClick={() => onRemove(email)}
                  className="share-remove-user"
                >
                  <Image
                    src="/assets/icons/remove.svg"
                    alt="Remove"
                    width={24}
                    height={24}
                    className="remove-icon"
                  />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export const WhatsAppShare = ({ file }: { file: Models.Document }) => {
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateLink = async () => {
    setIsLoading(true);
    try {
      const response = await createShareLink({ fileId: file.$id });
      if (response && response.url) {
        setShareLink(`${window.location.origin}${response.url}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
    }
  };

  return (
    <>
      <ImageThumbnail file={file} />
      <div className="share-wrapper flex flex-col gap-4 pt-4">
        {!shareLink ? (
          <Button onClick={handleGenerateLink} disabled={isLoading} className="bg-brand hover:bg-brand-100 flex items-center justify-center h-12 w-full rounded-full">
            {isLoading ? <Loader2 className="animate-spin text-white" /> : "Generate Secure Link"}
          </Button>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <Input value={shareLink} readOnly className="share-input-field flex-1 text-sm bg-gray-50 text-gray-500" />
              <Button onClick={handleCopyLink} className="bg-brand hover:bg-brand-100 h-12 px-6 rounded-full flex items-center justify-center">
                Copy
              </Button>
            </div>
            
            <a 
              href={`https://wa.me/?text=${encodeURIComponent(`Here is a secure link to download "${file.name}":\n\n${shareLink}\n\n*Note: This link expires in 1 hour.*`)}`} 
              target="_blank" 
              rel="noreferrer"
              className="bg-[#25D366] hover:bg-[#20b858] text-white flex items-center justify-center gap-2 h-12 rounded-full font-medium transition-all"
            >
              <Image src="/assets/icons/share.svg" width={20} height={20} alt="WhatsApp" className="brightness-0 invert" />
              Share on WhatsApp
            </a>
            
            <p className="text-center text-xs text-gray-400">
              This link is secure and will expire in 1 hour.
            </p>
          </div>
        )}
      </div>
    </>
  );
};