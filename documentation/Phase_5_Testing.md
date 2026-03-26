# PHASE 5: TESTING

## Project Title: StoreIt — Online Cloud Document Storage System

---

## 1. Test Cases (Table Format)

### 1.1 Authentication Module Test Cases

| TC ID | Test Case Description | Input | Expected Output | Actual Output | Status |
|-------|----------------------|-------|-----------------|---------------|--------|
| TC-01 | Valid user registration with new email | Name: "John Doe", Email: "john@test.com" | OTP sent, OTP modal displayed | OTP sent, OTP modal displayed | ✅ Pass |
| TC-02 | Registration with existing email | Email: "existing@test.com" | OTP sent (existing user detected, no duplicate) | OTP sent, existing user linked | ✅ Pass |
| TC-03 | Registration with invalid email format | Email: "invalid-email" | Validation error: "Invalid email" | Form shows "Invalid email" | ✅ Pass |
| TC-04 | Registration with empty name | Name: "" | Validation error for name field | "String must contain at least 2 character(s)" | ✅ Pass |
| TC-05 | Registration with short name (1 char) | Name: "J" | Validation error for name field | "String must contain at least 2 character(s)" | ✅ Pass |
| TC-06 | Valid OTP verification | 6-digit valid OTP | Session created, redirect to Dashboard | Session created, Dashboard loaded | ✅ Pass |
| TC-07 | Invalid OTP verification | Wrong 6-digit code | Error: "Invalid OTP. Please try again." | Error message displayed | ✅ Pass |
| TC-08 | OTP resend before cooldown | Click "Resend" within 60 seconds | Button disabled, shows countdown | Button disabled with timer | ✅ Pass |
| TC-09 | OTP resend after cooldown | Click "Resend" after 60 seconds | New OTP sent, timer resets | New OTP sent successfully | ✅ Pass |
| TC-10 | Sign In with registered email | Email: "john@test.com" | OTP sent, OTP modal displayed | OTP sent, modal opens | ✅ Pass |
| TC-11 | Sign In with unregistered email | Email: "unknown@test.com" | Error: "User not found" | Error returned, handled gracefully | ✅ Pass |
| TC-12 | User sign out | Click "Sign Out" | Session destroyed, redirect to /sign-in | Cookie deleted, redirected | ✅ Pass |
| TC-13 | Access protected route without session | Navigate to "/" without login | Redirect to /sign-in | Redirected to sign-in page | ✅ Pass |

### 1.2 File Upload Module Test Cases

| TC ID | Test Case Description | Input | Expected Output | Actual Output | Status |
|-------|----------------------|-------|-----------------|---------------|--------|
| TC-14 | Upload valid file (< 50 MB) | PDF file (2 MB) | File uploaded, appears in file list | File uploaded successfully | ✅ Pass |
| TC-15 | Upload file exceeding 50 MB | Video file (60 MB) | Error toast: "File too large" | Toast displayed, upload blocked | ✅ Pass |
| TC-16 | Upload file via drag-and-drop | Drag image file to upload area | Upload progress shown, file uploaded | File uploaded via drag-and-drop | ✅ Pass |
| TC-17 | Upload multiple files simultaneously | Select 3 files | All 3 files uploaded with progress | All files uploaded in parallel | ✅ Pass |
| TC-18 | Cancel file upload in progress | Click remove button during upload | File removed from upload queue | Upload cancelled for that file | ✅ Pass |
| TC-19 | Upload image file | JPG file (1 MB) | Categorized as "image" | Type set to "image" correctly | ✅ Pass |
| TC-20 | Upload document file | DOCX file (500 KB) | Categorized as "document" | Type set to "document" correctly | ✅ Pass |
| TC-21 | Upload video file | MP4 file (10 MB) | Categorized as "video" | Type set to "video" correctly | ✅ Pass |
| TC-22 | Upload audio file | MP3 file (5 MB) | Categorized as "audio" | Type set to "audio" correctly | ✅ Pass |
| TC-23 | Upload unknown file type | .xyz file (100 KB) | Categorized as "other" | Type set to "other" correctly | ✅ Pass |

### 1.3 File Management Module Test Cases

| TC ID | Test Case Description | Input | Expected Output | Actual Output | Status |
|-------|----------------------|-------|-----------------|---------------|--------|
| TC-24 | Rename file with valid name | New name: "report_final" | File renamed to "report_final.pdf" | Renamed successfully | ✅ Pass |
| TC-25 | Delete file (confirm) | Click Delete, confirm | File removed from DB and Storage | File deleted permanently | ✅ Pass |
| TC-26 | Delete file (cancel) | Click Delete, then Cancel | File remains unchanged | No changes applied | ✅ Pass |
| TC-27 | Share file with valid email | Email: "friend@test.com" | File shared, user added to users[] | Email added to shared list | ✅ Pass |
| TC-28 | Download file | Click Download | File downloads to local device | File downloaded successfully | ✅ Pass |
| TC-29 | View file details | Click Details | Modal shows name, size, type, date | Details displayed correctly | ✅ Pass |

### 1.4 Search and Sort Module Test Cases

| TC ID | Test Case Description | Input | Expected Output | Actual Output | Status |
|-------|----------------------|-------|-----------------|---------------|--------|
| TC-30 | Search with valid file name | Query: "report" | Matching files displayed in dropdown | Results shown correctly | ✅ Pass |
| TC-31 | Search with no matches | Query: "zzznomatch" | "No files found" message | "No files found" displayed | ✅ Pass |
| TC-32 | Search with empty query | Clear search input | Dropdown closes, results cleared | Dropdown closed, URL cleaned | ✅ Pass |
| TC-33 | Sort by date (newest first) | Select "Date created (newest)" | Files sorted newest to oldest | Sorted correctly | ✅ Pass |
| TC-34 | Sort by name (A-Z) | Select "Name (A-Z)" | Files sorted alphabetically | Sorted correctly | ✅ Pass |
| TC-35 | Sort by size (highest) | Select "Size (Highest)" | Files sorted largest to smallest | Sorted correctly | ✅ Pass |

### 1.5 Dashboard Module Test Cases

| TC ID | Test Case Description | Input | Expected Output | Actual Output | Status |
|-------|----------------------|-------|-----------------|---------------|--------|
| TC-36 | Dashboard loads with files | User has uploaded files | Chart shows storage usage, cards show categories | Displayed correctly | ✅ Pass |
| TC-37 | Dashboard with no files | New user with no uploads | "No files uploaded yet" message | Empty state shown | ✅ Pass |
| TC-38 | Recent uploads display | User uploaded 5 files | Last 10 uploads shown (or all if < 10) | Recent files listed | ✅ Pass |
| TC-39 | Category card navigation | Click "Documents" card | Navigates to /documents page | Navigated correctly | ✅ Pass |
| TC-40 | Storage chart accuracy | User has 100 MB used | Chart reflects 100 MB / 2 GB usage | Accurate visualization | ✅ Pass |

### 1.6 Admin Module Test Cases (New)

| TC ID | Test Case Description | Input | Expected Output | Actual Output | Status |
|-------|----------------------|-------|-----------------|---------------|--------|
| TC-41 | Admin login with valid credentials | Email: "admin@storeit.com", Password: "valid_password" | Redirect to Admin Dashboard | Logged in to Admin Portal | ✅ Pass |
| TC-42 | Admin login with invalid password | Email: "admin@storeit.com", Password: "wrong_password" | Error: "Invalid credentials" | Error message displayed | ✅ Pass |
| TC-43 | Non-admin user attempts admin login | Email: "user@test.com", Password: "user_password" | Error: "Unauthorized access" | Redirected with error | ✅ Pass |
| TC-44 | Platform analytics data accuracy | Overall system has 500 MB used | Admin chart shows 500 MB / Global Target | Statistics updated | ✅ Pass |
| TC-45 | Top Users activity list | Users with most uploads | List shows users sorted by storage used | Correct users displayed | ✅ Pass |
| TC-46 | Block a user account | Click "Block" on active user | User status becomes "Blocked", isActive=false | User blocked successfully | ✅ Pass |
| TC-47 | Unblock a user account | Click "Unblock" on blocked user | User status becomes "Active", isActive=true | User unblocked successfully | ✅ Pass |
| TC-48 | Blocked user attempt to sign in | Sign in as blocked user | Error: "Account is blocked" during OTP verification | Access denied to user | ✅ Pass |
| TC-49 | Admin navigation sidebar | Click through admin links | Smooth transition between Dash/Users | Navigated correctly | ✅ Pass |
| TC-50 | Admin sign out | Click "Sign Out" | Destroy admin session, redirect /admin-login | Admin signed out | ✅ Pass |

---

## 2. Unit Testing

Unit testing was conducted on individual functions and components to verify their isolated behavior:

| # | Unit | Test Description | Result |
|---|------|------------------|--------|
| 1 | `getFileType()` | Tested with pdf, jpg, mp4, mp3, xyz extensions | All types classified correctly ✅ |
| 2 | `convertFileSize()` | Tested with Bytes, KB, MB, GB range values | Converted accurately with proper formatting ✅ |
| 3 | `calculatePercentage()` | Tested with 0 bytes, 1 GB, 2 GB (full) | Percentages calculated correctly ✅ |
| 4 | `formatDateTime()` | Tested with ISO strings and null/undefined | Formatted correctly, returned "—" for null ✅ |
| 5 | `constructFileUrl()` | Tested with sample bucket file IDs | Correct Appwrite Storage URLs generated ✅ |
| 6 | `constructDownloadUrl()` | Tested with sample bucket file IDs | Correct download URLs generated ✅ |
| 7 | `getFileIcon()` | Tested with various extensions and types | Correct icon paths returned ✅ |
| 8 | `getUsageSummary()` | Tested with mock totalSpace object | Correct 4-item summary array returned ✅ |
| 9 | `getFileTypesParams()` | Tested with documents, images, media, others | Correct type arrays returned ✅ |
| 10 | `parseStringify()` | Tested with objects, arrays, nested structures | Deep clones produced correctly ✅ |
| 11 | `cn()` | Tested with conflicting Tailwind classes | Merged correctly with last class winning ✅ |
| 12 | `authFormSchema()` | Tested with sign-in and sign-up form types | Correct schema generated per type ✅ |

---

## 3. Integration Testing

Integration testing verified that multiple modules work correctly together:

| # | Integration Scenario | Modules Involved | Test Description | Result |
|---|---------------------|------------------|------------------|--------|
| 1 | User Registration → OTP → Dashboard | Auth Module, Dashboard Module | Register new user → Verify OTP → Dashboard loads with empty state | ✅ Pass |
| 2 | Upload File → Dashboard Update | Upload Module, Dashboard Module | Upload file → Dashboard chart and recently uploaded list refresh | ✅ Pass |
| 3 | Upload File → Category Page | Upload Module, File Display Module | Upload PDF → Navigate to Documents → File visible in list | ✅ Pass |
| 4 | Search → Navigation | Search Module, File Display Module | Search for file → Click result → Navigated to correct category | ✅ Pass |
| 5 | Share File → Shared User Access | File Management, Auth Module | Share file → Shared user sees file in their dashboard queries | ✅ Pass |
| 6 | Delete File → Storage Update | File Management, Dashboard Module | Delete file → Dashboard storage stats decrease accordingly | ✅ Pass |
| 7 | Sign Out → Protected Route | Auth Module, Navigation | Sign out → Attempt to access Dashboard → Redirected to Sign In | ✅ Pass |
| 8 | Session Expiry → Re-authentication | Auth Module | Session expires → User accesses any page → Redirected to Sign In | ✅ Pass |

---

## 4. System Testing

System testing was conducted on the complete StoreIt application to verify end-to-end functionality:

| # | System Test Scenario | Steps | Expected Result | Actual Result | Status |
|---|---------------------|-------|-----------------|---------------|--------|
| 1 | Complete User Journey | Register → Upload 3 files → Search → Rename → Share → Download → Delete → Sign Out | All operations complete successfully | All steps passed | ✅ Pass |
| 2 | Cross-Browser Compatibility | Access application on Chrome, Firefox, Edge | Consistent UI and functionality | Consistent across browsers | ✅ Pass |
| 3 | Responsive Design | Access on desktop (1920px), tablet (768px), mobile (375px) | Layout adapts correctly | Responsive at all breakpoints | ✅ Pass |
| 4 | Concurrent Operations | Upload file while another is uploading | Both uploads complete without interference | Both files uploaded | ✅ Pass |
| 5 | Network Failure Handling | Disable network during file upload | Graceful error handling, no data corruption | Error caught, UI shows error | ✅ Pass |
| 6 | Fresh User Experience | Register brand new account | Empty Dashboard with proper empty states | Empty states displayed | ✅ Pass |
| 7 | Performance Under Load | Upload 20 files of various types | All files categorized and displayed correctly | All operations successful | ✅ Pass |

---

## 5. Security Testing

| # | Security Test | Description | Expected Behavior | Result |
|---|--------------|-------------|-------------------|--------|
| 1 | XSS Attack via Search | Enter `<script>alert('XSS')</script>` in search | Input sanitized, no script execution | ✅ Secure |
| 2 | XSS Attack via File Name | Upload file named `<img onerror=alert(1)>` | Name rendered as text, no execution | ✅ Secure |
| 3 | Direct API Access without Auth | Call server action without session cookie | Error thrown: "No session" | ✅ Secure |
| 4 | Cookie Tampering | Modify appwrite-session cookie value | Session validation fails, redirect to sign-in | ✅ Secure |
| 5 | SQL/NoSQL Injection via Email | Enter `" OR 1=1` in email field | Zod validation rejects, Appwrite SDK parameterizes queries | ✅ Secure |
| 6 | CSRF Protection | SameSite=Strict cookie flag | Cross-site requests cannot access session | ✅ Secure |
| 7 | API Key Exposure | Inspect client-side JavaScript source | API key not present (server-side only via env vars) | ✅ Secure |
| 8 | Brute Force OTP | Submit multiple wrong OTPs rapidly | Appwrite rate limiting prevents abuse | ✅ Secure |
| 9 | File Path Traversal | Upload file with `../../etc/passwd` name | Appwrite Storage sanitizes file names | ✅ Secure |
| 10 | Unauthorized File Access | Access another user's file URL directly | File requires authenticated session with proper ownership | ✅ Secure |
| 11 | Admin Panel Access Leak | Regular user visits `/admin` URL | Server-side redirection to `/admin-login` for unauthorized users | ✅ Secure |
| 12 | Admin Label Verification | Manual session cookie creation | Admin server functions verify "admin" label badge via Users API | ✅ Secure |
| 13 | Cross-Account File Leak | Admin attempts to URL-fetch user file | Blocked by Appwrite permissions; admins only see metadata stats | ✅ Secure |
| 14 | Admin ID Spoofing | Manually set `appwrite-admin-id` cookie | Admin client fetches user by ID and verifies label independently | ✅ Secure |
| 15 | Short Admin Sessions | 24-hour limit on admin session | Automatic logout for admins after 24h idle time | ✅ Secure |

---

*End of Phase 5: Testing*
