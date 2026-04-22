import { Models } from "node-appwrite";
import Thumbnail from "@/components/Thumbnail";
import FormattedDateTime from "@/components/FormattedDateTime";
import { convertFileSize, formatDateTime } from "@/lib/utils";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useEffect } from "react";
import { createShareLink, getLatestShare, regenerateShareLink, revokeShareLink, ExpiryType } from "@/lib/actions/share.actions";
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
  const [activeShare, setActiveShare] = useState<Models.Document | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expiry, setExpiry] = useState<ExpiryType>("1h");

  useEffect(() => {
    const fetchShare = async () => {
      const share = await getLatestShare(file.$id);
      if (share) {
        setActiveShare(share);
        setShareLink(`${window.location.origin}/s/${share.token}`);
      }
    };
    fetchShare();
  }, [file.$id]);

  const handleGenerateLink = async () => {
    setIsLoading(true);
    try {
      const response = await createShareLink({ fileId: file.$id, expiry });
      if (response && response.url) {
        setShareLink(`${window.location.origin}${response.url}`);
        setActiveShare(response.share);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateLink = async () => {
    setIsLoading(true);
    try {
      const response = await regenerateShareLink({ fileId: file.$id, expiry });
      if (response && response.url) {
        setShareLink(`${window.location.origin}${response.url}`);
        setActiveShare(response.share);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeLink = async () => {
    if (!activeShare) return;
    setIsLoading(true);
    try {
      await revokeShareLink(activeShare.$id);
      setActiveShare(null);
      setShareLink(null);
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
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <p className="subtitle-2 text-light-100">Link Expiry</p>
              <div className="flex gap-4 items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="expiry" value="1h" checked={expiry === "1h"} onChange={() => setExpiry("1h")} className="w-4 h-4 text-brand" />
                  <span className="text-sm">1 hour</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="expiry" value="1d" checked={expiry === "1d"} onChange={() => setExpiry("1d")} className="w-4 h-4 text-brand" />
                  <span className="text-sm">1 day</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="expiry" value="permanent" checked={expiry === "permanent"} onChange={() => setExpiry("permanent")} className="w-4 h-4 text-brand" />
                  <span className="text-sm">Permanent</span>
                </label>
              </div>
            </div>
            <Button onClick={handleGenerateLink} disabled={isLoading} className="bg-brand hover:bg-brand-100 flex items-center justify-center h-12 w-full rounded-full">
              {isLoading ? <Loader2 className="animate-spin text-white" /> : "Generate Secure Link"}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <Input value={shareLink} readOnly className="share-input-field flex-1 text-sm bg-gray-50 text-gray-500" />
              <Button onClick={handleCopyLink} className="bg-brand hover:bg-brand-100 h-12 px-6 rounded-full flex items-center justify-center">
                Copy
              </Button>
            </div>
            
            <a 
              href={`https://wa.me/?text=${encodeURIComponent(`Here is a secure link to download "${file.name}":\n\n${shareLink}\n\n*Note: This link ${activeShare?.expiresAt?.startsWith("2099") ? "is permanent" : "will expire"}.*`)}`} 
              target="_blank" 
              rel="noreferrer"
              className="bg-[#25D366] hover:bg-[#20b858] text-white flex items-center justify-center gap-2 h-12 rounded-full font-medium transition-all"
            >
              <Image src="/assets/icons/share.svg" width={20} height={20} alt="WhatsApp" className="brightness-0 invert" />
              Share on WhatsApp
            </a>
            
            <p className="text-center text-xs text-gray-400">
              {activeShare?.expiresAt?.startsWith("2099") 
                ? "This link is secure and permanent." 
                : `This link is secure and will expire at ${new Date(activeShare?.expiresAt || "").toLocaleString()}`}
            </p>

            <div className="flex gap-2 mt-2">
              <Button onClick={handleRegenerateLink} disabled={isLoading} className="flex-1 bg-gray-100 text-gray-600 hover:bg-gray-200 h-10 rounded-full text-xs">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Regenerate"}
              </Button>
              <Button onClick={handleRevokeLink} disabled={isLoading} className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 h-10 rounded-full text-xs">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Revoke"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};