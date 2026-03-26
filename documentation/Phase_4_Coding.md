# PHASE 4: CODING

## Project Title: StoreIt — Online Cloud Document Storage System

---

## 4.a Environment and Backend Setup

### Environment Setup

The development environment for StoreIt is configured as follows:

| Tool/Technology | Version | Purpose |
|-----------------|---------|---------|
| Node.js | v20+ LTS | JavaScript runtime environment |
| npm | v10+ | Package manager for dependency management |
| Next.js | 16.1.6 | React-based full-stack web framework |
| TypeScript | ^5.0 | Typed JavaScript for code reliability |
| Tailwind CSS | ^4.0 | Utility-first CSS framework |
| ShadCN UI | Latest | Pre-built accessible UI component library |
| Appwrite Cloud | Latest | Backend-as-a-Service (Auth, DB, Storage) |
| VS Code | Latest | Integrated Development Environment (IDE) |
| Git | Latest | Version control system |

**Project Initialization:**
The project was initialized using the `create-next-app` scaffolding tool with TypeScript and Tailwind CSS enabled. ShadCN UI components were added via the `shadcn` CLI. The Appwrite SDK (`node-appwrite`) was installed for server-side backend operations.

**Environment Variables (.env):**
```
NEXT_PUBLIC_APPWRITE_ENDPOINT=<Appwrite Cloud Endpoint URL>
NEXT_PUBLIC_APPWRITE_PROJECT=<Appwrite Project ID>
NEXT_PUBLIC_APPWRITE_DATABASE=<Database ID>
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION=<Users Collection ID>
NEXT_PUBLIC_APPWRITE_FILES_COLLECTION=<Files Collection ID>
NEXT_PUBLIC_APPWRITE_BUCKET=<Storage Bucket ID>
NEXT_APPWRITE_KEY=<Server-side API Key (Secret)>
```

### Database Implementation

The database is implemented using **Appwrite Database Service** with two collections:

#### Table 1: Users Collection

| Field | Type | Key | Constraint | Description |
|-------|------|-----|------------|-------------|
| $id | String (36) | PK | Auto-generated, Unique | Document identifier |
| fullName | String (128) | — | Required | User's full display name |
| email | String (320) | — | Required, Unique | User's email address |
| avatar | URL (2048) | — | Required | URL of user's avatar image |
| accountId | String (36) | FK → Appwrite Auth | Required | Links to Appwrite Auth User |
| $createdAt | DateTime | — | Auto-generated | Creation timestamp |
| $updatedAt | DateTime | — | Auto-generated | Last update timestamp |

#### Table 2: Files Collection

| Field | Type | Key | Constraint | Description |
|-------|------|-----|------------|-------------|
| $id | String (36) | PK | Auto-generated, Unique | Document identifier |
| name | String (256) | — | Required | File name with extension |
| type | String (20) | — | Required, Enum | File category type |
| extension | String (20) | — | Required | File extension |
| size | Integer | — | Required, ≥ 0 | File size in bytes |
| url | URL (2048) | — | Required | Appwrite Storage file URL |
| owner | String (36) | FK → Users.$id | Required | File owner reference |
| accountId | String (36) | — | Required | Owner's Appwrite Auth ID |
| users | String[] | — | Optional | Shared users' email list |
| bucketFileId | String (36) | FK → Storage Bucket | Required | Storage Bucket file reference |
| $createdAt | DateTime | — | Auto-generated | Upload timestamp |
| $updatedAt | DateTime | — | Auto-generated | Last modification timestamp |

**Constraints Used:**
- **Primary Key:** `$id` (auto-generated unique identifier for each document)
- **Foreign Key:** `owner` field in Files references `$id` in Users collection; `accountId` references Appwrite Auth user
- **Unique Constraint:** `email` field in Users collection
- **Required Constraint:** All fields marked as Required must have a value upon document creation
- **Enum Constraint:** `type` field accepts only: `document`, `image`, `video`, `audio`, `other`
- **Size Constraint:** File upload limited to 50 MB (50 × 1024 × 1024 bytes)

**Sample Data Insertion:**

User document creation occurs during the registration flow in `createAccount()`:
```typescript
await databases.createDocument(
  appwriteConfig.databaseId,
  appwriteConfig.usersCollectionId,
  ID.unique(),
  { fullName, email, avatar: avatarPlaceholderUrl, accountId }
);
```

File document creation occurs during file upload in `uploadFile()`:
```typescript
const fileDocument = {
  type: getFileType(bucketFile.name).type,
  name: bucketFile.name,
  url: constructFileUrl(bucketFile.$id),
  extension: getFileType(bucketFile.name).extension,
  size: bucketFile.sizeOriginal,
  owner: ownerId,
  accountId,
  users: [],
  bucketFileId: bucketFile.$id,
};
await databases.createDocument(..., fileDocument);
```

---

## 4.b Frontend Development

### UI Pages Created

| # | Page/Route | File Path | Description |
|---|-----------|-----------|-------------|
| 1 | Sign Up | `app/(auth)/sign-up/page.tsx` | User registration form |
| 2 | Sign In | `app/(auth)/sign-in/page.tsx` | User login form |
| 3 | Dashboard | `app/(root)/page.tsx` | Main dashboard with charts and recent files |
| 4 | Documents | `app/(root)/[type]/page.tsx` (type=documents) | Documents file listing |
| 5 | Images | `app/(root)/[type]/page.tsx` (type=images) | Images file listing |
| 6 | Media | `app/(root)/[type]/page.tsx` (type=media) | Video/Audio file listing |
| 7 | Others | `app/(root)/[type]/page.tsx` (type=others) | Other files listing |
| 8 | Admin Login | `app/(admin-auth)/admin-login/page.tsx` | Specialized admin sign-in |
| 9 | Admin Dashboard | `app/(admin)/admin/page.tsx` | Platform-wide storage analytics |
| 10 | User Management | `app/(admin)/admin/users/page.tsx` | Admin tools for account moderation |

### Forms Created

| Form | Component | Fields | Validation |
|------|-----------|--------|------------|
| Sign Up Form | `AuthForm.tsx` | Full Name (min 2, max 50 chars), Email (valid format) | Zod schema with zodResolver |
| Sign In Form | `AuthForm.tsx` | Email (valid format) | Zod schema with zodResolver |
| Admin Login Form | `AdminLoginForm.tsx` | Email, Password | Zod schema validation |
| OTP Form | `OTPModal.tsx` | 6-digit OTP code | Input length validation |
| Rename Form | `ActionDropdown.tsx` | New file name | Non-empty validation |
| Share Form | `ActionsModalContent.tsx` | Email addresses | Array of email strings |
| Search Form | `Search.tsx` | Search query text | Debounced 300ms input |

### CSS Styling

StoreIt uses **Tailwind CSS v4** for all styling with the following approach:
- **Utility-First Classes:** All styling is applied via Tailwind utility classes directly in JSX
- **Custom CSS Variables:** Brand colors and theme tokens defined in `globals.css`
- **ShadCN Theme Integration:** ShadCN UI components use CSS variables for theming
- **Tailwind Merge:** `cn()` utility function merges Tailwind classes to prevent conflicts
- **Animations:** `tw-animate-css` library for entrance animations (slide-in, fade-in)

### JavaScript Validations

| Validation | Implementation | Location |
|------------|----------------|----------|
| Email Format | Zod `z.string().email()` | AuthForm.tsx |
| Full Name Length | Zod `z.string().min(2).max(50)` | AuthForm.tsx |
| File Size Limit | `file.size > MAX_FILE_SIZE (50MB)` check | FileUploader.tsx |
| OTP Length | `maxLength={6}` on InputOTP component | OTPModal.tsx |
| Search Debounce | 300ms debounce via `use-debounce` library | Search.tsx |
| Session Validation | Cookie existence check on every protected route | appwrite/index.ts |

### Responsive Design

The application implements a mobile-first responsive design strategy:

| Breakpoint | Width | Layout Behavior |
|------------|-------|-----------------|
| Mobile (Default) | < 768px | Single column, hamburger menu, stacked cards |
| Tablet (md) | ≥ 768px | Two-column grid, sidebar visible |
| Desktop (lg) | ≥ 1024px | Three-column file grid |
| Wide Desktop (xl) | ≥ 1280px | Four-column file grid, max-width 7xl container |

Key responsive implementations:
- `Sidebar.tsx`: Hidden on mobile (`hidden md:flex`), visible on desktop
- `MobileNavigation.tsx`: Visible on mobile only, uses Sheet overlay
- Dashboard: `grid-cols-1 md:grid-cols-2` for responsive chart/uploads layout
- File Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`

---

## 4.c Backend Logic

### Server-Side Scripts

All backend logic is implemented using **Next.js Server Actions** (files marked with `"use server"` directive). This ensures that sensitive operations execute exclusively on the server, never exposing API keys or business logic to the client.

| File | Purpose |
|------|---------|
| `lib/actions/user.actions.ts` | User authentication, registration, session management |
| `lib/actions/file.actions.ts` | File CRUD operations, storage calculations |
| `lib/actions/admin.actions.ts` | Admin dashboard stats, user moderation, admin auth |
| `lib/appwrite/index.ts` | Appwrite Client initialization (Session & Admin) |
| `lib/appwrite/config.ts` | Environment variable configuration |

### Database Connection

Two types of Appwrite clients are used:

**1. Admin Client** (`createAdminClient`): Uses the server-side API Key for privileged operations (creating users, managing files across all users).

**2. Session Client** (`createSessionClient`): Uses the user's session cookie for user-scoped operations (fetching current user, reading user's files).

### CRUD Operations

| Operation | Function | Description |
|-----------|----------|-------------|
| **Create** User | `createAccount()` | Creates user document in Users collection |
| **Read** User | `getCurrentUser()` | Fetches authenticated user's document |
| **Read** User by Email | `getUserByEmail()` | Queries Users collection by email |
| **Create** File | `uploadFile()` | Uploads to Storage + creates File document |
| **Read** Files | `getFiles()` | Lists files with filtering, search, and sort |
| **Update** File Name | `renameFile()` | Updates file's name field |
| **Update** File Users | `updateFileUsers()` | Updates shared users array |
| **Delete** File | `deleteFile()` | Removes document + storage file |
| **Read** Storage Stats | `getTotalSpaceUsed()` | Calculates per-category storage usage (User) |
| **Read** Platform Stats | `getAdminDashboardData()`| Aggregates global storage across all users (Admin)|
| **Update** User Status | `toggleUserStatus()` | Blocks or unblocks a specific user account (Admin)|
| **Read** All Users | `getAllUsers()` | Fetches list of all platform users (Admin) |

### Business Logic

- **OTP Authentication Flow:** `sendEmailOTP()` → checks for existing user → uses existing ID or generates new → calls `account.createEmailToken()` → returns accountId for OTP verification
- **File Type Detection:** `getFileType()` classifies files by extension into 5 categories
- **Storage URL Construction:** `constructFileUrl()` and `constructDownloadUrl()` build Appwrite Storage REST URLs
- **Query Building:** `createQueries()` dynamically builds Appwrite Query arrays based on filters, sorts, and limits
- **Dynamic Path Revalidation:** `revalidatePath()` is called after every mutation to refresh the UI

### Module-Wise Explanation

#### Authentication Module
- `sendEmailOTP()`: Sends OTP via Appwrite's `createEmailToken` API
- `createAccount()`: Creates new user + sends OTP + creates user document in DB
- `verifySecret()`: Verifies OTP → creates session → sets HTTP-only secure cookie with 30-day persistence (`maxAge`)
- `signInUser()`: Verifies user exists → sends OTP → returns accountId
- `signOutUser()`: Deletes current session → clears cookie → redirects to sign-in
- `getCurrentUser()`: Reads session → gets Appwrite account → fetches user document

#### File Management Module
- `uploadFile()`: Accepts file buffer → uploads to Storage Bucket → creates metadata document
- `getFiles()`: Accepts types, search, sort, limit → builds queries → returns documents
- `renameFile()`: Updates file name with new name + original extension
- `updateFileUsers()`: Updates the shared users email array on a file document
- `deleteFile()`: Deletes document from DB → deletes binary from Storage Bucket
- `getTotalSpaceUsed()`: Aggregates file sizes by category for the current user

#### Search Module
- `Search.tsx` (client component): Captures input → debounces by 300ms → calls `getFiles()` → displays results in dropdown overlay → navigates on click

---

## 4.d Error Handling

### Input Validation Techniques

| Input | Validation Method | Error Message |
|-------|-------------------|---------------|
| Email | Zod `z.string().email()` | "Invalid email" |
| Full Name | Zod `z.string().min(2).max(50)` | "String must contain at least 2 character(s)" |
| File Size | `file.size > MAX_FILE_SIZE` comparison | "{filename} is too large. Max file size is 50MB." |
| OTP Code | `maxLength={6}` InputOTP constraint | "Invalid OTP. Please try again." |
| Session | Cookie existence check (persists 30 days) | "No session" (redirects to sign-in) |

### Exception Handling

All server actions use try-catch blocks with a centralized error handler:
```typescript
const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};
```

Each server action wraps its logic in try-catch:
```typescript
export const uploadFile = async (props) => {
  try {
    // ... upload logic
  } catch (error) {
    handleError(error, "Failed to upload file");
  }
};
```

### Error Messages

| Scenario | Error Message | Display Method |
|----------|---------------|----------------|
| Account Creation Failure | "Failed to create account. Please try again." | Error banner (red background) |
| OTP Verification Failure | "Failed to verify OTP. Please try again." | Error text below OTP input |
| Invalid OTP | "Invalid OTP. Please try again." | Error text below OTP input |
| File Too Large | "{filename} is too large. Max file size is 50MB." | Toast notification |
| User Not Found | "User not found" | Returned as error response |
| No Session | Redirect to /sign-in | Automatic redirect |
| File Operation Failure | Console logged + error thrown | Terminal/server logs |

### Function-Level Testing

Each function in the server actions is independently testable:
- **`getUserByEmail()`**: Tested by querying with known and unknown emails
- **`sendEmailOTP()`**: Tested by triggering OTP send and verifying response contains accountId
- **`createAccount()`**: Tested with new and existing email addresses
- **`verifySecret()`**: Tested with valid and invalid OTP codes
- **`uploadFile()`**: Tested with valid files, oversized files, and invalid file types
- **`getFiles()`**: Tested with various filter combinations (types, search, sort, limit)
- **`renameFile()`**: Tested with valid new names
- **`deleteFile()`**: Tested to ensure both document and storage file are removed

---

*End of Phase 4: Coding*
