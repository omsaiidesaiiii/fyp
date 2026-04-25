"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { parseStringify } from "@/lib/utils";
import crypto from "crypto";

const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};

export type ExpiryType = "1h" | "1d" | "30d" | "permanent";

export const getLatestShare = async (fileId: string) => {
  try {
    const { databases } = await createSessionClient();
    const shares = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.sharesCollectionId,
      [
        Query.equal("fileId", fileId),
        Query.equal("isRevoked", false),
        Query.orderDesc("$createdAt"),
        Query.limit(1)
      ]
    );

    return shares.total > 0 ? parseStringify(shares.documents[0]) : null;
  } catch (error) {
    handleError(error, "Failed to get latest share");
    return null;
  }
}

export const createShareLink = async ({ fileId, expiry = "30d" }: { fileId: string, expiry?: ExpiryType }) => {
  try {
    const { databases, account } = await createSessionClient();
    const user = await account.get();

    const token = crypto.randomBytes(16).toString("hex");
    
    let expiresAt: string;
    if (expiry === "1h") {
      expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    } else if (expiry === "1d") {
      expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    } else if (expiry === "30d") {
      expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    } else {
      // Permanent link, far future
      expiresAt = new Date("2099-12-31T23:59:59Z").toISOString();
    }

    const share = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.sharesCollectionId,
      ID.unique(),
      {
        fileId,
        token,
        expiresAt,
        createdBy: user.$id,
        isRevoked: false
      }
    );

    return parseStringify({ token, url: `/s/${token}`, share });
  } catch (error) {
    handleError(error, "Failed to create share link");
  }
};

export const revokeShareLink = async (shareId: string) => {
  try {
    const { databases } = await createSessionClient();
    const updated = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.sharesCollectionId,
      shareId,
      { isRevoked: true }
    );
    return parseStringify(updated);
  } catch (error) {
    handleError(error, "Failed to revoke share link");
  }
};

export const regenerateShareLink = async ({ fileId, expiry = "1h" }: { fileId: string, expiry?: ExpiryType }) => {
  try {
    const { databases } = await createSessionClient();
    
    // Revoke all existing active links for this file
    const existingShares = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.sharesCollectionId,
      [Query.equal("fileId", fileId), Query.equal("isRevoked", false)]
    );

    for (const doc of existingShares.documents) {
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.sharesCollectionId,
        doc.$id,
        { isRevoked: true }
      );
    }

    return await createShareLink({ fileId, expiry });
  } catch (error) {
    handleError(error, "Failed to regenerate share link");
  }
}

export const getShareLink = async (token: string) => {
  try {
    const { databases } = await createAdminClient();

    const shares = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.sharesCollectionId,
      [Query.equal("token", token)]
    );

    if (shares.total === 0) return null;

    return parseStringify(shares.documents[0]);
  } catch (error) {
    handleError(error, "Failed to get share link");
    return null;
  }
};
