# PHASE 3: PROJECT DESIGN

## Project Title: StoreIt — Online Cloud Document Storage System

---

## 1. Architectural Design

### 1.1 Architecture Pattern: Three-Tier Architecture

StoreIt follows a **Three-Tier Architecture** pattern, separating the application into three distinct logical layers:

```
+================================================================+
|                    THREE-TIER ARCHITECTURE                      |
+================================================================+
|                                                                  |
|  ┌────────────────────────────────────────────────────────────┐  |
|  │                  PRESENTATION TIER                         │  |
|  │               (Client-Side / Browser)                      │  |
|  │                                                            │  |
|  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │  |
|  │  │  Auth    │  │ Dashboard│  │  File    │  │  Search  │  │  |
|  │  │  Pages   │  │  Page    │  │  Pages   │  │  Module  │  │  |
|  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │  |
|  │                                                            │  |
|  │  Technologies: React 19, Next.js 16, Tailwind CSS 4,      │  |
|  │                ShadCN UI, Lucide Icons                     │  |
|  └────────────────────────────────────────────────────────────┘  |
|                              │                                   |
|                              ▼                                   |
|  ┌────────────────────────────────────────────────────────────┐  |
|  │                   APPLICATION TIER                         │  |
|  │              (Server-Side / Next.js Server)                │  |
|  │                                                            │  |
|  │  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐  │  |
|  │  │ user.actions │  │ file.actions │  │ Appwrite       │  │  |
|  │  │    .ts       │  │    .ts       │  │ Client Setup   │  │  |
|  │  └──────────────┘  └──────────────┘  └────────────────┘  │  |
|  │                                                            │  |
|  │  Technologies: Next.js Server Actions, node-appwrite SDK,  │  |
|  │                TypeScript, Zod Validation                  │  |
|  └────────────────────────────────────────────────────────────┘  |
|                              │                                   |
|                              ▼                                   |
|  ┌────────────────────────────────────────────────────────────┐  |
|  │                     DATA TIER                              │  |
|  │              (Appwrite Cloud Services)                     │  |
|  │                                                            │  |
|  │  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐  │  |
|  │  │ Authentication│  │   Database   │  │    Storage     │  │  |
|  │  │   Service    │  │   Service    │  │    Bucket      │  │  |
|  │  └──────────────┘  └──────────────┘  └────────────────┘  │  |
|  │                                                            │  |
|  │  Services: Appwrite Auth, Appwrite Database,               │  |
|  │            Appwrite Storage                                │  |
|  └────────────────────────────────────────────────────────────┘  |
+================================================================+
```

**Tier 1 – Presentation Tier:** React components rendered via Next.js, handling UI rendering, user interactions, form inputs, and visual feedback (toast notifications, loaders).

**Tier 2 – Application/Business Logic Tier:** Next.js Server Actions (`user.actions.ts`, `file.actions.ts`) process business logic on the server, including authentication flows, file CRUD operations, storage calculations, and query construction.

**Tier 3 – Data Tier:** Appwrite Cloud provides three core services — Authentication (OTP, sessions), Database (Users and Files collections), and Storage (file binary storage bucket).

---

## 2. Module Design

### Module 1: Authentication Module
- **Files:** `AuthForm.tsx`, `OTPModal.tsx`, `user.actions.ts`
- **Description:** Handles user registration and login via email OTP. Includes OTP resend with 60-second cooldown, session creation using HTTP-only cookies with 30-day persistence, and sign-out with session destruction.
- **Flow:** User enters email → Server sends OTP → User enters OTP → Server verifies → Session created → Redirect to Dashboard.

### Module 2: File Upload Module
- **Files:** `FileUploader.tsx`, `file.actions.ts`
- **Description:** Provides drag-and-drop and click-to-browse file upload functionality. Validates file size (max 50 MB), uploads binary to Appwrite Storage Bucket, creates file metadata document in the database, and shows real-time upload progress.

### Module 3: Dashboard Module
- **Files:** `app/(root)/page.tsx`, `Chart.tsx`
- **Description:** Displays an interactive donut/pie chart showing total storage used, four category summary cards (Documents, Images, Media, Others), and a recent uploads list with file thumbnails, names, and dates.

### Module 4: File Management Module
- **Files:** `ActionDropdown.tsx`, `ActionsModalContent.tsx`, `Card.tsx`
- **Description:** Provides a dropdown menu for each file with operations: Rename, View Details, Share, Download, and Delete. Each action opens a modal dialog with appropriate UI (input field for rename, email input for share, confirmation for delete).

### Module 5: Search Module
- **Files:** `Search.tsx`
- **Description:** Real-time search bar with 300ms debounce using the `use-debounce` library. Queries all file types and displays matching results in a dropdown overlay with file thumbnails and creation dates. Clicking a result navigates to the appropriate category page.

### Module 6: Navigation Module
- **Files:** `Sidebar.tsx`, `MobileNavigation.tsx`, `Header.tsx`
- **Description:** Desktop sidebar with navigation links (Dashboard, Documents, Images, Media, Others) and user profile display. Mobile hamburger menu with sheet overlay. Header with search bar and file upload button.

### Module 7: File Display Module
- **Files:** `app/(root)/[type]/page.tsx`, `Sort.tsx`, `Thumbnail.tsx`, `FormattedDateTime.tsx`
- **Description:** Dynamic route pages for each file category. Displays files in a responsive grid with cards showing thumbnails, file names, sizes, and dates. Includes sorting controls for multiple criteria.

### Module 8: Admin Module (New)
- **Files:** `admin.actions.ts`, `AdminSidebar.tsx`, `AdminUsersTable.tsx`, `AdminLoginForm.tsx`
- **Description:** Centralized management system for platform administrators. Provides aggregated storage analytics, user activity lists, and moderation tools (block/unblock).
- **Privacy Design:** Strictly enforces data privacy by displaying only aggregated storage sizes and file counts. Admins cannot view, download, or manage individual user files.

---

## 3. Database Design

StoreIt uses **Appwrite Database** with two primary collections:

### Collection 1: Users Collection

| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| $id | String | Primary Key (auto-generated) | Unique document identifier |
| fullName | String | Required, Max 128 chars | User's full name |
| email | String | Required, Unique | User's email address |
| avatar | URL (String) | Required | URL to user's avatar image |
| accountId | String | Required | Reference to Appwrite Auth account ID |
| isActive | Boolean | Required (Default: True) | Account status (Active/Blocked) |
| $createdAt | DateTime | Auto-generated | Account creation timestamp |
| $updatedAt | DateTime | Auto-generated | Last update timestamp |

### Collection 2: Files Collection

| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| $id | String | Primary Key (auto-generated) | Unique document identifier |
| name | String | Required | File name with extension |
| type | String | Required (enum: document, image, video, audio, other) | File category type |
| extension | String | Required | File extension (pdf, jpg, mp4, etc.) |
| size | Integer | Required | File size in bytes |
| url | URL (String) | Required | Appwrite Storage file view URL |
| owner | String | Required (FK → Users.$id) | Reference to file owner's user document |
| accountId | String | Required | Owner's Appwrite Auth account ID |
| users | String[] (Array) | Optional | List of email addresses the file is shared with |
| bucketFileId | String | Required | Reference to the actual file in Appwrite Storage Bucket |
| $createdAt | DateTime | Auto-generated | File upload timestamp |
| $updatedAt | DateTime | Auto-generated | Last modification timestamp |

### Storage Bucket

| Property | Value |
|----------|-------|
| Bucket ID | Configured via environment variable |
| Maximum File Size | 50 MB |
| Total Bucket Size | 2 GB per user allocation |
| Allowed File Types | All (documents, images, videos, audio, others) |

---

## 4. ER Diagram (Text Format)

```
                        ENTITY-RELATIONSHIP DIAGRAM
                        ===========================

    ┌─────────────────────┐          ┌─────────────────────────┐
    │       USERS         │          │         FILES           │
    ├─────────────────────┤          ├─────────────────────────┤
    │ PK  $id             │          │ PK  $id                 │
    │     fullName        │          │     name                │
    │     email (Unique)  │          │     type                │
    │     avatar          │          │     extension           │
    │     accountId       │◄────┐    │     size                │
    │     $createdAt      │     │    │     url                 │
    │     $updatedAt      │     │    │ FK  owner ──────────────┤──► USERS.$id
    └─────────────────────┘     │    │     accountId           │
                                │    │     users[] (emails)    │
                                │    │     bucketFileId ───────┤──► STORAGE_BUCKET
    ┌─────────────────────┐     │    │     $createdAt          │
    │  APPWRITE AUTH      │     │    │     $updatedAt          │
    ├─────────────────────┤     │    └─────────────────────────┘
    │ PK  $id (accountId) │─────┘
    │     email           │     ┌─────────────────────────────┐
    │     sessions[]      │     │     STORAGE BUCKET          │
    └─────────────────────┘     ├─────────────────────────────┤
                                │ PK  $id (bucketFileId)      │
                                │     file (binary data)      │
                                │     name                    │
                                │     sizeOriginal            │
                                │     mimeType                │
                                └─────────────────────────────┘

    Relationships:
    ├── USERS (1) ──── owns ────── (N) FILES           [One-to-Many]
    ├── USERS (N) ──── shared ──── (N) FILES           [Many-to-Many via users[]]
    ├── APPWRITE AUTH (1) ── linked ── (1) USERS       [One-to-One]
    └── FILES (1) ──── stored in ── (1) STORAGE BUCKET [One-to-One]
```

---

## 5. Activity Diagrams

### 5.1 User Authentication Activity

```
    [Start]
       │
       ▼
   ┌──────────┐
   │ Open App │
   └────┬─────┘
        │
        ▼
   ┌──────────────┐     Yes    ┌───────────────┐
   │ Has Account? │──────────► │ Sign In Page  │
   └──────┬───────┘            └──────┬────────┘
       No │                           │
          ▼                           ▼
   ┌──────────────┐            ┌──────────────┐
   │ Sign Up Page │            │ Enter Email  │
   └──────┬───────┘            └──────┬───────┘
          │                           │
          ▼                           ▼
   ┌───────────────┐           ┌──────────────┐
   │ Enter Name &  │           │ Send OTP to  │
   │ Email         │           │ Email        │
   └──────┬────────┘           └──────┬───────┘
          │                           │
          ▼                           ▼
   ┌──────────────┐            ┌──────────────┐
   │ Send OTP     │            │ Enter OTP    │
   └──────┬───────┘            └──────┬───────┘
          │                           │
          ▼                           ▼
   ┌─────────────────┐         ┌──────────────────┐
   │ Enter OTP Code  │         │ Verify OTP       │
   └──────┬──────────┘         └──────┬───────────┘
          │                           │
          ▼                       ┌───┴──────┐
   ┌──────────────┐          Valid│          │Invalid
   │ Verify OTP   │               ▼          ▼
   └──────┬───────┘        ┌──────────┐ ┌────────────┐
          │                │ Create   │ │ Show Error │
          ▼                │ Session  │ │ Retry OTP  │
   ┌──────────────┐        └────┬─────┘ └────────────┘
   │ Create User  │             │
   │ Document     │             ▼
   └──────┬───────┘        ┌──────────┐
          │                │ Redirect │
          ▼                │ to       │
   ┌──────────────┐        │Dashboard │
   │ Create       │        └──────────┘
   │ Session      │
   └──────┬───────┘
          │
          ▼
   ┌────────────┐
   │ Redirect   │
   │ Dashboard  │
   └────────────┘
        │
        ▼
     [End]
```

### 5.2 File Upload Activity

```
    [Start]
       │
       ▼
   ┌───────────────────────┐
   │ Click Upload Button / │
   │ Drag-and-Drop Files   │
   └──────────┬────────────┘
              │
              ▼
   ┌──────────────────┐
   │ Files Selected   │
   └──────────┬───────┘
              │
              ▼
   ┌──────────────────────┐    > 50 MB    ┌──────────────────┐
   │ Validate File Size   │──────────────►│ Show Error Toast │
   └──────────┬───────────┘               │ "File too large" │
              │ ≤ 50 MB                   └──────────────────┘
              ▼
   ┌──────────────────────┐
   │ Show Upload Progress │
   │ (Animated Loader)    │
   └──────────┬───────────┘
              │
              ▼
   ┌──────────────────────┐
   │ Upload Binary to     │
   │ Appwrite Storage     │
   └──────────┬───────────┘
              │
              ▼
   ┌──────────────────────┐
   │ Create File Document │
   │ in Database          │
   └──────────┬───────────┘
              │
              ▼
   ┌──────────────────────┐
   │ Revalidate Page Path │
   │ (Refresh File List)  │
   └──────────┬───────────┘
              │
              ▼
           [End]
```

---

## 6. Use Case Diagram

```
                           USE CASE DIAGRAM
                           =================

        ┌─────────────────────────────────────────────────┐
        │              StoreIt System                      │
        │                                                  │
        │    ┌─────────────────┐                           │
        │    │  Register       │◄──────────┐               │
        │    └─────────────────┘           │               │
        │    ┌─────────────────┐           │               │
        │    │  Sign In (OTP)  │◄──────────┤               │
        │    └─────────────────┘           │               │
        │    ┌─────────────────┐           │               │
        │    │  Upload File    │◄──────────┤               │
        │    └─────────────────┘           │               │
        │    ┌─────────────────┐           │               │
        │    │  View Dashboard │◄──────────┤    ┌──────┐   │
        │    └─────────────────┘           ├────│ User │   │
        │    ┌─────────────────┐           │    └──────┘   │
        │    │  Search Files   │◄──────────┤   (Actor)     │
        │    └─────────────────┘           │               │
        │    ┌─────────────────┐           │               │
        │    │  Manage Files   │◄──────────┤               │
        │    └─────────────────┘           │               │
        │                                  │               │
        │    ┌───────────────────┐         │               │
        │    │  Admin Login      │◄────────┤               │
        │    │  (Password)       │         │               │
        │    └───────────────────┘         │               │
        │    ┌───────────────────┐         │               │
        │    │  View Platform    │◄────────┤               │
        │    │  Analytics        │         │    ┌───────┐  │
        │    └───────────────────┘         ├────│ Admin │  │
        │    ┌───────────────────┐         │    └───────┘  │
        │    │  Block/Unblock    │◄────────┤    (Actor)    │
        │    │  Users            │         │               │
        │    └───────────────────┘         │               │
        │                                  │               │
        │    ┌─────────────────┐           │               │
        │    │  Sign Out       │◄──────────┘               │
        │    └─────────────────┘                           │
        │                                                  │
        └──────────────────────────────────────────────────┘
         │
         │    ┌──────────────────┐
         └───►│ Appwrite Cloud   │  (Secondary Actor)
              │ (Auth, DB,       │
              │  Storage)        │
              └──────────────────┘

  Actors:
  ├── User (Primary Actor): End user who interacts with common storage features
  ├── Admin (Primary Actor): Privileged user who manages the platform
  └── Appwrite Cloud (Secondary Actor): Provides backend services
```

---

## 7. UI/UX Design Explanation

### 7.1 Design Philosophy
StoreIt adopts a **clean, minimalist, and modern design** approach inspired by leading SaaS applications. The UI prioritizes clarity, usability, and visual hierarchy.

### 7.2 Color Palette
| Color | Hex Code | Usage |
|-------|----------|-------|
| Brand (Indigo) | #4F46E5 | Primary buttons, active states, links, accents |
| Dark | #1A1A2E | Headings, primary text |
| Background | #F9FAFB | Page background |
| White | #FFFFFF | Cards, modals, sidebar |
| Gray-400 | #9CA3AF | Secondary text, placeholders |
| Red-500 | #EF4444 | Error messages, delete actions |
| Green-500 | #22C55E | Success indicators |

### 7.3 Typography
- **Primary Font:** Geist Sans (Google Fonts) — Clean, modern sans-serif
- **Monospace Font:** Geist Mono — For code-like elements
- **Heading Sizes:** 3xl (32px) for page titles, xl (20px) for section headers
- **Body Text:** sm (14px) for regular content, xs (12px) for metadata

### 7.4 Layout Structure
- **Desktop:** Fixed sidebar (256px width) + Scrollable main content area
- **Mobile:** Full-width content with hamburger menu (Sheet overlay)
- **Header:** Sticky header with search bar and upload button
- **Cards:** Rounded (20px border-radius), subtle shadows, hover scale effects

### 7.5 Key UI Pages
1. **Sign Up / Sign In Pages** — Split-screen layout with branding panel (left) and form (right)
2. **OTP Verification Modal** — Centered dialog with 6-digit OTP input slots
3. **Dashboard** — Two-column grid with storage chart (left) and recent uploads (right)
4. **File Category Pages** — Responsive grid (1–4 columns) with file cards and sort controls
5. **Admin Dashboard** — Premium light-themed dashboard with "Platform Health" metrics and red accents
6. **User Management Page** — Searchable table with status indicators and administrative action buttons
7. **File Action Modals** — Dialog-based modals for Rename, Share, Delete confirmations

---

## 8. Algorithm Design

### 8.1 File Type Classification Algorithm

```
ALGORITHM: getFileType(fileName)
INPUT: fileName (String)
OUTPUT: { type: String, extension: String }

1. EXTRACT extension from fileName by splitting on "." and taking the last element
2. CONVERT extension to lowercase
3. IF extension is empty THEN RETURN { type: "other", extension: "" }
4. DEFINE documentExtensions = [pdf, doc, docx, txt, xls, xlsx, csv, rtf, ...]
5. DEFINE imageExtensions = [jpg, jpeg, png, gif, bmp, svg, webp]
6. DEFINE videoExtensions = [mp4, avi, mov, mkv, webm, ...]
7. DEFINE audioExtensions = [mp3, wav, ogg, flac, m4a]
8. IF extension IN documentExtensions THEN RETURN { type: "document", extension }
9. IF extension IN imageExtensions THEN RETURN { type: "image", extension }
10. IF extension IN videoExtensions THEN RETURN { type: "video", extension }
11. IF extension IN audioExtensions THEN RETURN { type: "audio", extension }
12. ELSE RETURN { type: "other", extension }
```

### 8.2 Storage Calculation Algorithm

```
ALGORITHM: getTotalSpaceUsed()
INPUT: Current authenticated user
OUTPUT: totalSpace object with per-category sizes

1. GET currentUser from session
2. FETCH all files WHERE owner = currentUser.$id
3. INITIALIZE totalSpace = { image: {size:0}, document: {size:0},
                              video: {size:0}, audio: {size:0},
                              other: {size:0}, used: 0, all: 2GB }
4. FOR EACH file IN files:
   a. DETERMINE fileType from file.type
   b. ADD file.size to totalSpace[fileType].size
   c. ADD file.size to totalSpace.used
   d. IF file.$updatedAt > totalSpace[fileType].latestDate:
      UPDATE totalSpace[fileType].latestDate
5. RETURN totalSpace
```

### 8.3 Debounced Search Algorithm

```
ALGORITHM: DebouncedSearch(query)
INPUT: User search query string
OUTPUT: List of matching files

1. ON user input change, SET query = input value
2. APPLY 300ms debounce delay
3. IF debounced query is empty:
   a. CLEAR results
   b. CLOSE dropdown
   c. REMOVE query params from URL
4. ELSE:
   a. CALL getFiles({ types: [], searchText: debouncedQuery })
   b. SET results = response.documents
   c. OPEN dropdown to display results
5. ON result click:
   a. CLOSE dropdown
   b. NAVIGATE to appropriate category page with query parameter
```

---

## 9. Security Design

| Security Measure | Implementation |
|------------------|----------------|
| **Passwordless Authentication** | Email OTP for regular users eliminates password storage |
| **Admin RBAC (Role-Based Access Control)** | Admins use traditional Email/Password auth; strictly restricted by "admin" labels in Appwrite |
| **Separate Admin Sessions** | Admin sessions expire after 24 hours (shorter persistence) compared to 30 days for users |
| **HTTP-Only Cookies** | Tokens stored in HTTP-only, Secure (`appwrite-admin-session`) and ID-tracking cookies |
| **Data Privacy Policy** | Admin server actions (`getAdminDashboardData`) aggregate statistics on the fly; never allow fetching individual file details |
| **Secure Cookie Flag** | Cookies marked `Secure` and `SameSite=Strict` to prevent CSRF and session hijacking |
| **Account Locking** | Administrative ability to block users by setting `isActive` to `false` in the database |
| **Environment Variables** | Secret API keys never exposed to browsers; only used by Server Actions |
| **Input Validation** | Zod schema validation on both user and admin login forms |
| **OTP Resend Rate Limiting** | 60-second cooldown prevents brute-forcing or spamming the OTP service |

---

*End of Phase 3: Project Design*
