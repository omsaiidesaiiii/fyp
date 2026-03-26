# PHASE 2: REQUIREMENTS GATHERING & ANALYSIS

## Project Title: StoreIt — Online Cloud Document Storage System

---

## 1. Stakeholder Identification

| Stakeholder | Role | Interest |
|-------------|------|----------|
| End Users (Students, Professionals) | Primary users of the system | Upload, store, manage, search, and share files securely |
| Project Developer | Sole developer responsible for design, development, testing, and deployment | Successful completion and submission of the BCA final year project |
| Project Guide/Mentor | Academic supervisor | Review progress, provide guidance, and evaluate the final deliverable |
| College/University | Academic institution | Evaluate the project as part of BCA VI Semester curriculum |
| Appwrite (BaaS Provider) | Backend service provider | Provide Authentication, Database, and Storage APIs |

---

## 2. Understanding the Current System

Currently, users rely on the following methods for file storage and management:

1. **Local Storage (Hard Drives, USB Drives):** Files are stored on physical devices. Access is limited to the device on which files are stored. Risk of data loss due to hardware failure, theft, or corruption.


2. **Email Attachments:** Users often email files to themselves for backup or sharing purposes. This method is highly inefficient, has file size limitations (typically 25 MB), and results in disorganized file management.

3. **Existing Cloud Services (Google Drive, Dropbox, OneDrive):** While functional, these platforms have complex interfaces, bundled features that many users do not need, and often require paid subscriptions for meaningful storage capacity. They also require traditional password-based authentication.

4. **Physical File Cabinets (for documents):** Traditional paper-based storage, which is entirely manual, space-consuming, and non-searchable.

---

## 3. Drawbacks of the Existing System

| # | Drawback | Description |
|---|----------|-------------|
| 1 | Data Loss Risk | Local storage is vulnerable to hardware failure, corruption, and physical damage |
| 2 | Limited Accessibility | Files stored on local devices can only be accessed from that specific device |
| 3 | No Automatic Categorization | Existing systems require users to manually organize files into folders |
| 4 | Complex Authentication | Traditional password-based systems are prone to weak passwords, password reuse, and credential theft |
| 5 | Poor Search Capabilities | Local file systems have slow and basic search functionality |
| 6 | Limited Sharing Mechanisms | Sharing files via USB or email is cumbersome and lacks access control |
| 7 | No Storage Analytics | Users have no visual overview of their storage consumption by file type |
| 8 | Non-Responsive Interfaces | Many existing web-based solutions have suboptimal mobile experiences |
| 9 | Subscription Costs | Premium cloud storage solutions require monthly/annual subscriptions |

---

## 4. Proposed System

The proposed system, **StoreIt**, is a modern, web-based cloud document storage platform that addresses all identified drawbacks:

| Feature | Description |
|---------|-------------|
| **Cloud-Based Storage** | All files are stored securely on Appwrite cloud servers, accessible from any device |
| **Passwordless Authentication** | Email OTP-based login eliminates password vulnerabilities |
| **Automatic File Categorization** | Files are automatically classified into Documents, Images, Media, and Others |
| **Real-Time Search** | Debounced search with instant results across all file categories |
| **File Sharing** | Share files with other users via email-based access control |
| **Interactive Dashboard** | Visual storage usage chart, category summaries, and recent uploads |
| **Comprehensive File Actions** | Upload, Rename, Download, Share, View Details, Delete |
| **Drag-and-Drop Upload** | Intuitive file upload experience with progress indicators |
| **Sorting** | Sort files by date, name, or size in ascending/descending order |
| **Responsive Design** | Fully optimized for desktop, tablet, and mobile devices |
| **2 GB Free Storage** | Each user receives 2 GB of free cloud storage |

---

## 5. Functional Requirements

| FR ID | Requirement | Description | Priority |
|-------|-------------|-------------|----------|
| FR-01 | User Registration | Users can create an account by providing full name and email address | High |
| FR-02 | OTP-Based Login | System sends a 6-digit OTP to the user's email for verification | High |
| FR-03 | Session Management | Authenticated sessions are maintained using HTTP-only secure cookies with 30-day persistence, keeping users logged in across browser restarts | High |
| FR-04 | File Upload | Users can upload files (up to 50 MB each) using drag-and-drop or file picker | High |
| FR-05 | File Categorization | Uploaded files are automatically categorized based on extension | High |
| FR-06 | Dashboard Display | Dashboard shows storage usage chart, category summaries, and recent uploads | High |
| FR-07 | File Search | Users can search files by name with real-time debounced results | Medium |
| FR-08 | File Sorting | Users can sort files by date, name, or size | Medium |
| FR-09 | File Rename | Users can rename their uploaded files | Medium |
| FR-10 | File Download | Users can download their files to their local device | High |
| FR-11 | File Sharing | Users can share files with other registered users via email | Medium |
| FR-12 | File Deletion | Users can permanently delete files from their storage | High |
| FR-13 | File Details | Users can view detailed information about a file (name, type, size, date) | Low |
| FR-14 | User Sign Out | Users can securely sign out, which destroys their session | High |
| FR-15 | Storage Tracking | System tracks and displays per-user storage consumption | Medium |
| FR-16 | OTP Resend | Users can request a new OTP after a 60-second cooldown period | Medium |

---

## 6. Non-Functional Requirements

| NFR ID | Requirement | Description |
|--------|-------------|-------------|
| NFR-01 | **Performance** | Pages should load within 3 seconds under normal network conditions. Server-side rendering (SSR) ensures fast initial page loads. |
| NFR-02 | **Security** | All data transmission occurs over HTTPS. Sessions use HTTP-only, Secure, SameSite=Strict cookies. API keys are stored as environment variables. |
| NFR-03 | **Scalability** | The component-based architecture and Appwrite BaaS allow horizontal scaling as user base grows. |
| NFR-04 | **Usability** | The interface follows modern UI/UX principles with clear navigation, intuitive interactions, and accessibility standards. |
| NFR-05 | **Reliability** | Appwrite cloud ensures 99.9% uptime. Error handling is implemented at all critical points. |
| NFR-06 | **Responsiveness** | The UI adapts seamlessly to screen sizes ranging from 320px (mobile) to 1920px+ (desktop). |
| NFR-07 | **Maintainability** | Modular code structure with TypeScript type safety enables easy maintenance and future enhancements. |
| NFR-08 | **Portability** | The application runs on any modern web browser (Chrome, Firefox, Safari, Edge) on any operating system. |
| NFR-09 | **File Size Limit** | Maximum file upload size is 50 MB per file. Total user storage allocation is 2 GB. |
| NFR-10 | **Availability** | The application is available 24/7 via cloud hosting (Vercel + Appwrite Cloud). |

---

## 7. Context Level DFD (Level 0)

```
                    Context Level Data Flow Diagram (Level 0)
                    ==========================================

                          +-----------------------------+
      Registration/       |                             |       OTP Notification
      Login Request  ───► |                             | ───►  (via Email Service)
                          |                             |
      Upload File    ───► |                             |
                          |       StoreIt System        |
      Search Query   ───► |   (Cloud Document Storage)  |
                          |                             |
      File Action    ───► |                             | ───►  File Data
      (Rename/Delete/     |                             |       (Appwrite Storage)
       Share/Download)    |                             |
                          +-----------------------------+
                                     ▲    │
                                     │    │
                   ┌─────────────────┘    └──────────────────┐
                   │                                         │
              [End User]                              [Appwrite Cloud]
              (External Entity)                       (External Entity)

  External Entities:
  ├── End User: Registers, logs in, uploads files, searches, manages files
  └── Appwrite Cloud: Provides Authentication, Database, and Storage services
```

---

## 8. Level 1 DFD

```
                       Level 1 Data Flow Diagram
                       =========================

  [End User]
      │
      ├──── Email, Name ────────────►  [1.0 User Authentication]
      │                                       │
      │◄──── OTP Code ──────────────────────┘
      │                                       │
      │──── OTP Verification ──────►          │
      │                                       │
      │◄──── Session Cookie ────────          ▼
      │                              ┌─────────────────┐
      │                              │  D1: Users      │
      │                              │  Collection     │
      │                              └─────────────────┘
      │
      ├──── File Data ──────────────►  [2.0 File Upload]
      │                                       │
      │◄──── Upload Confirmation ────         ▼
      │                              ┌─────────────────┐
      │                              │  D2: Files      │
      │                              │  Collection     │
      │                              └─────────────────┘
      │                                       │
      │                                       ▼
      │                              ┌─────────────────┐
      │                              │  D3: Appwrite   │
      │                              │  Storage Bucket │
      │                              └─────────────────┘
      │
      ├──── Search Query ───────────►  [3.0 File Search & Sort]
      │◄──── Search Results ─────────         │
      │                                       ▼
      │                              ┌─────────────────┐
      │                              │  D2: Files      │
      │                              │  Collection     │
      │                              └─────────────────┘
      │
      ├──── File Action Request ────►  [4.0 File Management]
      │     (Rename/Delete/Share/             │
      │      Download/Details)                ▼
      │◄──── Action Confirmation ──  ┌─────────────────┐
      │                              │ D2: Files       │
      │                              │ Collection      │
      │                              └─────────────────┘
      │
      └──── Dashboard Request ──────►  [5.0 Dashboard & Analytics]
       ◄──── Storage Stats, Charts,          │
             Recent Files ──────────         ▼
                                     ┌─────────────────┐
                                     │ D2: Files       │
                                     │ Collection      │
                                     └─────────────────┘

  Data Stores:
  ├── D1: Users Collection (fullName, email, avatar, accountId)
  ├── D2: Files Collection (name, type, extension, size, url, owner, users, bucketFileId)
  └── D3: Appwrite Storage Bucket (actual binary file data)
```

---

## 9. Software Requirement Specification (SRS) Document

### 9.1 Introduction

#### 9.1.1 Purpose
This Software Requirement Specification (SRS) document provides a comprehensive description of the requirements for the StoreIt — Online Cloud Document Storage System. It defines the functional and non-functional requirements, system interfaces, design constraints, and quality attributes for the application.

#### 9.1.2 Scope
StoreIt is a web-based cloud document storage system designed for individual users. The system enables secure file storage, management, categorization, searching, sharing, and analytics through a modern, responsive web interface.

#### 9.1.3 Definitions and Acronyms

| Term | Definition |
|------|-----------|
| OTP | One-Time Password — a 6-digit code sent via email for authentication |
| BaaS | Backend-as-a-Service — Appwrite provides backend functionality |
| SSR | Server-Side Rendering — pages rendered on the server for faster loads |
| CRUD | Create, Read, Update, Delete — basic data manipulation operations |
| API | Application Programming Interface |
| UI/UX | User Interface / User Experience |
| DFD | Data Flow Diagram |
| SRS | Software Requirement Specification |

### 9.2 Overall Description

#### 9.2.1 Product Perspective
StoreIt is a self-contained, web-based application built using the Next.js framework with Appwrite as the backend service. It operates independently and does not require integration with any legacy systems.

#### 9.2.2 Product Features Summary
- Passwordless email OTP authentication
- File upload with drag-and-drop support (up to 50 MB per file)
- Automatic file type categorization
- Interactive dashboard with storage analytics
- Real-time search with debounce
- Multi-criteria file sorting
- File sharing via email
- Comprehensive file actions (Rename, Delete, Download, Details)
- Responsive design for all devices

#### 9.2.3 User Classes and Characteristics

| User Class | Description |
|------------|-------------|
| Registered User | Can upload, manage, search, sort, share, download, and delete files. Has access to the dashboard and all features. |
| Unregistered User | Can only access the Sign Up and Sign In pages. Must register to use the system. |

#### 9.2.4 Operating Environment
- **Client:** Any modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- **Server:** Vercel (Next.js hosting) + Appwrite Cloud (BaaS)
- **Network:** Standard internet connection (minimum 1 Mbps recommended)

#### 9.2.5 Design and Implementation Constraints
- Maximum file upload size: 50 MB per file
- Maximum total storage per user: 2 GB
- OTP validity: As configured by Appwrite (default 15 minutes)
- OTP resend cooldown: 60 seconds
- Application requires JavaScript enabled in the browser

### 9.3 System Features (Detailed)

#### SF-01: User Registration and Authentication
- **Description:** Users register with full name and email. Authentication is via email OTP.
- **Input:** Full Name, Email Address, 6-digit OTP
- **Process:** Create user account in Appwrite → Send OTP → Verify OTP → Create session
- **Output:** Authenticated user session, redirect to dashboard

#### SF-02: File Upload
- **Description:** Users upload files via drag-and-drop or file picker.
- **Input:** File data (binary), Owner ID, Account ID
- **Process:** Validate file size → Upload to Appwrite Storage → Create file document in database
- **Output:** File stored in cloud, document metadata saved, UI updated

#### SF-03: Dashboard
- **Description:** Displays storage analytics and recent uploads.
- **Input:** Current user's session
- **Process:** Fetch all files owned by user → Calculate storage per category → Render chart and summaries
- **Output:** Storage usage chart, category cards, recent uploads list

#### SF-04: File Search
- **Description:** Real-time search with 300ms debounce.
- **Input:** Search query string
- **Process:** Debounce input → Query files containing search text → Display results
- **Output:** List of matching files with thumbnails and metadata

#### SF-05: File Management
- **Description:** Rename, Delete, Share, Download, and View Details operations.
- **Input:** File ID, action type, additional parameters (new name, emails, etc.)
- **Process:** Execute corresponding CRUD operation via Appwrite SDK
- **Output:** Updated file state, success/error notification

### 9.4 External Interface Requirements

#### 9.4.1 User Interfaces
- Sign Up Page, Sign In Page, OTP Verification Modal
- Dashboard Page, File Category Pages (Documents, Images, Media, Others)
- Sidebar Navigation, Header with Search, Mobile Navigation

#### 9.4.2 Hardware Interfaces
No specialized hardware required. Standard device with internet access and a web browser.

#### 9.4.3 Software Interfaces
- **Appwrite SDK (node-appwrite v14):** For Authentication, Database, Storage, and Users APIs
- **Next.js Server Actions:** For secure server-side data fetching and mutations

#### 9.4.4 Communication Interfaces
- HTTPS for all client-server communication
- Appwrite REST API for backend operations
- Email service (via Appwrite) for OTP delivery

---

*End of Phase 2: Requirements Gathering & Analysis*
