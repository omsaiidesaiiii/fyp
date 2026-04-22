import { getShareLink } from "@/lib/actions/share.actions";
import { createAdminClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  if (!token) {
    return new NextResponse("Token is missing", { status: 400 });
  }

  const share = await getShareLink(token);

  if (!share) {
    return new NextResponse("Invalid share link", { status: 404 });
  }

  const expiresAt = new Date(share.expiresAt);
  if (expiresAt < new Date()) {
    return new NextResponse("Share link has expired", { status: 410 });
  }

  try {
    const { databases, storage } = await createAdminClient();
    const file = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      share.fileId
    );

    if (!file) {
      return new NextResponse("File not found", { status: 404 });
    }

    const buffer = await storage.getFileDownload(
      appwriteConfig.bucketId,
      file.bucketFileId
    );

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${file.name}"`,
      },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
