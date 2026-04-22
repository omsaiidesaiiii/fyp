"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { parseStringify } from "@/lib/utils";

const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};

export const createShareLink = async ({ fileId }: { fileId: string }) => {
  try {
    const { databases, account } = await createSessionClient();
    const user = await account.get();

    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour from now

    const share = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.sharesCollectionId,
      ID.unique(),
      {
        fileId,
        token,
        expiresAt,
        createdBy: user.$id,
      }
    );

    return parseStringify({ token, url: `/s/${token}`, share });
  } catch (error) {
    handleError(error, "Failed to create share link");
  }
};

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
