
"use server";

import { createAdminClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { Query, Client, Account } from "node-appwrite";
import { parseStringify } from "@/lib/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// ============================== ADMIN SESSION CLIENT
const createAdminSessionClient = async () => {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId);

  const session = (await cookies()).get("appwrite-admin-session");

  if (!session || !session.value) throw new Error("No admin session");

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
  };
};

// ============================== SIGN IN ADMIN (Email + Password)
export const signInAdmin = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    // 1. Create a clean client to authenticate the user
    const client = new Client()
      .setEndpoint(appwriteConfig.endpointUrl)
      .setProject(appwriteConfig.projectId);

    const account = new Account(client);

    // 2. Authenticate with email + password to get the session
    const session = await account.createEmailPasswordSession(email, password);

    // 3. Use the ADMIN client (with API KEY) to check labels
    // This is much more reliable than using a session client on the server
    const { users } = await createAdminClient();
    const user = await users.get(session.userId);

    if (!user.labels || !user.labels.includes("admin")) {
      // If not an admin, delete the session we just created
      // We need to use the session client to delete the session
      client.setSession(session.secret);
      await account.deleteSession(session.$id);
      
      return parseStringify({
        success: false,
        error: "Access denied. You are not an administrator.",
      });
    }

    // 4. Set admin session and ID cookies
    const cookieStore = await cookies();
    
    cookieStore.set("appwrite-admin-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      maxAge: 60 * 60 * 24, // 1 day
    });

    cookieStore.set("appwrite-admin-id", session.userId, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      maxAge: 60 * 60 * 24, // 1 day
    });

    return parseStringify({ success: true });
  } catch (error: any) {
    console.log("Admin sign-in error:", error);
    return parseStringify({
      success: false,
      error: error.message || "Invalid email or password.",
    });
  }
};

// ============================== GET CURRENT ADMIN
export const getCurrentAdmin = async () => {
  try {
    const cookieStore = await cookies();
    const sessionSecret = cookieStore.get("appwrite-admin-session");
    const adminId = cookieStore.get("appwrite-admin-id");

    if (!sessionSecret || !adminId) return null;

    // Use the ADMIN client to get full user details directly by ID
    // This avoids the "role: guests" scope error on the server
    const { users } = await createAdminClient();
    const user = await users.get(adminId.value);

    // Verify admin label
    if (!user.labels || !user.labels.includes("admin")) return null;

    return parseStringify(user);
  } catch (error) {
    console.log("GetCurrentAdmin error:", error);
    return null;
  }
};

// ============================== SIGN OUT ADMIN
export const signOutAdmin = async () => {
  try {
    // We'll use a manual delete because the session client might fail scope checks
    const cookieStore = await cookies();
    cookieStore.delete("appwrite-admin-session");
    cookieStore.delete("appwrite-admin-id");
  } catch (error) {
    console.log("Admin sign-out error:", error);
  } finally {
    redirect("/admin-login");
  }
};

// ============================== GET ADMIN DASHBOARD DATA
// Returns aggregated stats only — NO individual file details (privacy)
export const getAdminDashboardData = async () => {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Unauthorized");

  const { databases, users } = await createAdminClient();

  try {
    // Fetch all data in parallel
    const [dbUsers, authUsers, allFiles] = await Promise.all([
      databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        [Query.limit(100)],
      ),
      users.list([Query.limit(100)]),
      // Removed Query.select to avoid "Cannot select attributes" error
      databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.filesCollectionId,
        [Query.limit(5000)], // Increased limit to capture more files for global stats
      ),
    ]);

    // Build a map of auth user statuses by ID
    const authStatusMap: Record<
      string,
      { status: boolean; registration: string }
    > = {};
    authUsers.users.forEach((authUser) => {
      authStatusMap[authUser.$id] = {
        status: authUser.status,
        registration: authUser.registration,
      };
    });

    // Calculate per-user storage (aggregated sizes only — no file details)
    const userStorageMap: Record<
      string,
      { size: number; fileCount: number; typeBreakdown: Record<string, number> }
    > = {};

    let totalStorage = 0;

    allFiles.documents.forEach((file) => {
      // Safely handle owner ID whether it's a string or an object (relationship)
      let ownerId = "";
      if (typeof file.owner === "string") {
        ownerId = file.owner;
      } else if (file.owner && typeof file.owner === "object") {
        ownerId = file.owner.$id;
      }

      if (!ownerId) return; // Skip if no owner found

      if (!userStorageMap[ownerId]) {
        userStorageMap[ownerId] = {
          size: 0,
          fileCount: 0,
          typeBreakdown: {},
        };
      }

      const fileSize = file.size || 0;
      userStorageMap[ownerId].size += fileSize;
      userStorageMap[ownerId].fileCount += 1;
      totalStorage += fileSize;

      // Track storage by file type
      const fileType = file.type || "other";
      userStorageMap[ownerId].typeBreakdown[fileType] =
        (userStorageMap[ownerId].typeBreakdown[fileType] || 0) + fileSize;
    });

    // Calculate type breakdown for overall stats
    const overallTypeBreakdown: Record<string, { size: number; count: number }> =
      {};
    allFiles.documents.forEach((file) => {
      const fileType = file.type || "other";
      if (!overallTypeBreakdown[fileType]) {
        overallTypeBreakdown[fileType] = { size: 0, count: 0 };
      }
      overallTypeBreakdown[fileType].size += file.size;
      overallTypeBreakdown[fileType].count += 1;
    });

    // Merge user data (privacy-safe: only names, emails, sizes — no file details)
    const usersWithStorage = dbUsers.documents.map((user) => {
      const storage = userStorageMap[user.$id] || {
        size: 0,
        fileCount: 0,
        typeBreakdown: {},
      };
      const authInfo = authStatusMap[user.accountId] || {
        status: true,
        registration: user.$createdAt,
      };

      return {
        $id: user.$id,
        accountId: user.accountId,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar,
        $createdAt: user.$createdAt,
        storageUsed: storage.size,
        fileCount: storage.fileCount,
        typeBreakdown: storage.typeBreakdown,
        isActive: authInfo.status,
        registration: authInfo.registration,
      };
    });

    return parseStringify({
      totalUsers: dbUsers.total,
      totalFiles: allFiles.total,
      totalStorage,
      overallTypeBreakdown,
      usersWithStorage,
    });
  } catch (error) {
    console.log("Error fetching admin dashboard data:", error);
    throw error;
  }
};

// ============================== TOGGLE USER STATUS (Block / Unblock)
export const toggleUserStatus = async ({
  accountId,
  currentStatus,
}: {
  accountId: string;
  currentStatus: boolean;
}) => {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Unauthorized");

  // Prevent admin from blocking themselves
  if (accountId === admin.$id) {
    return parseStringify({
      success: false,
      error: "Cannot change your own status.",
    });
  }

  try {
    const { users } = await createAdminClient();
    const updatedUser = await users.updateStatus(accountId, !currentStatus);

    return parseStringify({
      success: true,
      isActive: updatedUser.status,
    });
  } catch (error) {
    console.log("Error toggling user status:", error);
    return parseStringify({
      success: false,
      error: "Failed to update user status.",
    });
  }
};
