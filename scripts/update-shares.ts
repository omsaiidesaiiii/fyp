import { Client, Databases } from "node-appwrite";
import { config } from "dotenv";

config({ path: ".env" });

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
  .setKey(process.env.NEXT_APPWRITE_KEY!);

const databases = new Databases(client);

async function update() {
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE!;
  const collectionId = process.env.NEXT_PUBLIC_APPWRITE_SHARES_COLLECTION!;
  
  try {
    await databases.createBooleanAttribute(databaseId, collectionId, "isRevoked", false, false);
    console.log("Attribute isRevoked created.");
  } catch (error) {
    console.error("Error creating isRevoked:", error);
  }

  try {
    await databases.updateDatetimeAttribute(databaseId, collectionId, "expiresAt", false);
    console.log("Attribute expiresAt updated to not required.");
  } catch (error) {
    console.error("Error updating expiresAt:", error);
  }
}

update();
