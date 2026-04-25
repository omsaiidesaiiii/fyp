import { Models } from "node-appwrite";
import Thumbnail from "@/components/Thumbnail";
import FormattedDateTime from "@/components/FormattedDateTime";
import { convertFileSize, formatDateTime } from "@/lib/utils";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useEffect } from "react";
import { createShareLink, getLatestShare, regenerateShareLink, ExpiryType } from "@/lib/actions/share.actions";
import { Loader2 } from "lucide-react";

const formatExpiry = (expiresAt: string) => {
  if (expiresAt.startsWith("2099")) return "Anyone with the link can view";
  
  const diffTime = new Date(expiresAt).getTime() - Date.now();
  if (diffTime <= 0) return "Link expired";
  
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 30) return "Expires in 30 days";
  if (diffDays > 14) {
    return `Expires on ${new Date(expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  }
  if (diffDays > 1) return `Expires in ${diffDays} days`;
  
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
  return `Expires in ${diffHours} hour${diffHours > 1 ? 's' : ''}`;
};

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

export const ShareModal = ({ file, onInputChange, onRemove }: Props) => {
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [activeShare, setActiveShare] = useState<Models.Document | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const fetchOrGenerateShare = async () => {
      setIsLoading(true);
      try {
        let share = await getLatestShare(file.$id);
        
        if (!share) {
          // Auto-generate a 30-day link if none exists
          const response = await createShareLink({ fileId: file.$id, expiry: "30d" });
          if (response && response.share) {
            share = response.share;
          }
        } else {
          // Upgrade old links (like 1h or 1d) automatically to 30d
          const diffDays = Math.ceil((new Date(share.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          if (diffDays <= 29 && !share.expiresAt.startsWith("2099")) {
            const response = await regenerateShareLink({ fileId: file.$id, expiry: "30d" });
            if (response && response.share) {
              share = response.share;
            }
          }
        }

        if (share) {
          setActiveShare(share);
          setShareLink(`${window.location.origin}/s/${share.token}`);
        }
      } catch (error) {
        console.error("Failed to fetch or generate share link", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrGenerateShare();
  }, [file.$id]);

  const handleCopyLink = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const isPermanent = activeShare?.expiresAt?.startsWith("2099");

  return (
    <div className="space-y-6">
      <ImageThumbnail file={file} />

      <div className="space-y-6">
        {/* Email Sharing Section */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-800">Share with people</p>
          <Input
            type="email"
            placeholder="Add email addresses (comma separated)"
            onChange={(e) => onInputChange(e.target.value.trim().split(","))}
            className="h-11 rounded-lg border-gray-200 bg-gray-50 focus-visible:ring-brand shadow-sm text-sm w-full"
          />
          
          {file.users.length > 0 && (
            <div className="pt-2">
              <p className="text-xs font-medium text-gray-500 mb-2">People with access</p>
              <ul className="space-y-2">
                {file.users.map((email: string) => (
                  <li
                    key={email}
                    className="flex items-center justify-between gap-2 p-2 rounded-lg bg-gray-50/50"
                  >
                    <p className="text-sm text-gray-700 font-medium truncate flex-1 min-w-0">{email}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemove(email)}
                      className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors shrink-0"
                    >
                      <Image src="/assets/icons/remove.svg" alt="Remove" width={16} height={16} />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Link Sharing Section */}
        <div className="space-y-4 pt-5 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <p className="text-sm font-semibold text-gray-800">Get link</p>
            {shareLink && activeShare?.expiresAt && (
              <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider bg-gray-100/80 px-2 py-0.5 rounded-sm w-fit shrink-0">
                {formatExpiry(activeShare.expiresAt)}
              </p>
            )}
          </div>
          
          {isLoading ? (
            <div className="h-11 w-full bg-gray-100 animate-pulse rounded-xl" />
          ) : shareLink ? (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <div className="w-full flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 flex items-center shadow-sm overflow-hidden min-w-0">
                  <p className="text-[13px] text-gray-600 truncate w-full font-mono">{shareLink}</p>
                </div>
                <Button 
                  onClick={handleCopyLink} 
                  className={`${isCopied ? 'bg-gray-800 hover:bg-gray-900 text-white' : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'} h-[42px] px-5 w-full sm:w-auto rounded-lg font-medium shadow-sm transition-colors shrink-0`}
                >
                  {isCopied ? 'Copied' : 'Copy'}
                </Button>
              </div>
              
              <div className="flex flex-col gap-2">
                <a 
                  href={`https://wa.me/?text=${encodeURIComponent(`Here is a secure link to download "${file.name}":\n\n${shareLink}\n\n*Note: ${activeShare?.expiresAt ? formatExpiry(activeShare.expiresAt) : ''}.*`)}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-[#25D366] hover:bg-[#22bf5b] text-white flex items-center justify-center gap-2 h-11 w-full rounded-lg text-sm font-semibold transition-colors shadow-sm"
                >
                  <Image src="/assets/icons/whatsapp.svg" width={16} height={16} alt="WhatsApp" className="opacity-90" />
                  Share on WhatsApp
                </a>

                <a 
                  href={`https://t.me/share/url?url=${encodeURIComponent(shareLink!)}&text=${encodeURIComponent(`Here is a secure link to download "${file.name}"`)}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-[#229ED9] hover:bg-[#1c8ac7] text-white flex items-center justify-center gap-2 h-11 w-full rounded-lg text-sm font-semibold transition-colors shadow-sm"
                >
                  <Image src="/assets/icons/telegram.svg" width={16} height={16} alt="Telegram" className="opacity-90" />
                  Share on Telegram
                </a>
              </div>
            </div>
          ) : (
            <p className="text-sm text-red-500">Failed to generate link. Please try again.</p>
          )}
        </div>
      </div>
    </div>
  );
};