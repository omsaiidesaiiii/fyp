import { Client, Databases, Permission, Role } from "node-appwrite";
import { config } from "dotenv";

config({ path: ".env" });

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
  .setKey(process.env.NEXT_APPWRITE_KEY!);

const databases = new Databases(client);

async function setup() {
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE!;
  try {
    const collection = await databases.createCollection(
      databaseId,
      "unique()",
      "shares",
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ]
    );

    console.log("Collection created:", collection.$id);

    await databases.createStringAttribute(databaseId, collection.$id, "fileId", 255, true);
    await databases.createStringAttribute(databaseId, collection.$id, "token", 255, true);
    await databases.createDatetimeAttribute(databaseId, collection.$id, "expiresAt", true);
    await databases.createStringAttribute(databaseId, collection.$id, "createdBy", 255, true);

    console.log("Attributes created.");
    console.log(`Add this to .env:\nNEXT_PUBLIC_APPWRITE_SHARES_COLLECTION="${collection.$id}"`);
  } catch (error) {
    console.error("Error setting up collection:", error);
  }
}

setup();
