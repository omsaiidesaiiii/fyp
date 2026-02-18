# PHASE 1: PROJECT PLANNING

## Project Title: StoreIt — Online Cloud Document Storage System

---

## 1. Problem Statement

In the current digital era, individuals and organizations generate a vast volume of digital documents, images, videos, and other media files on a daily basis. Managing, organizing, and securely storing these files remains a significant challenge. Traditional methods of file storage—such as local hard drives, USB drives, and physical servers—are prone to data loss due to hardware failure, theft, accidental deletion, and natural disasters. Moreover, sharing files across devices and with other users using conventional methods is cumbersome and often insecure.

Existing cloud storage solutions, while functional, frequently impose limitations such as complex user interfaces, inadequate file categorization, lack of real-time search capabilities, and insufficient sharing mechanisms. Many platforms also require users to remember complex passwords, leading to security vulnerabilities.

There is a clear need for a modern, secure, user-friendly, and feature-rich online cloud document storage system that enables users to upload, organize, search, share, and manage their digital files from anywhere, using any device, with a streamlined authentication process and an intuitive dashboard interface.

**StoreIt** addresses this problem by providing a comprehensive cloud-based document storage platform with passwordless OTP-based authentication, intelligent file categorization, real-time search, file sharing, and a visually appealing, responsive user interface.

---

## 2. Project Objectives

The primary objectives of the StoreIt project are:

1. **To design and develop a secure cloud-based document storage platform** that allows users to upload, store, and manage files of various types including documents, images, videos, audio, and other media.

2. **To implement a passwordless authentication system** using email-based OTP (One-Time Password) verification, enhancing security by eliminating traditional password vulnerabilities.

3. **To provide intelligent file categorization** that automatically classifies uploaded files into categories such as Documents, Images, Media (Video/Audio), and Others based on file extensions.

4. **To develop a real-time search functionality** with debounced search queries that enable users to quickly locate files across all categories.

5. **To enable file sharing capabilities** allowing users to share files with other registered users via email-based access control.

6. **To build an interactive dashboard** with storage usage visualization (charts), recent uploads summary, and category-wise storage consumption analytics.

7. **To implement comprehensive file management operations** including Upload, Rename, Download, Share, View Details, and Delete functionalities.

8. **To ensure responsive design** that provides an optimal user experience across desktop, tablet, and mobile devices.

9. **To utilize modern web technologies** — Next.js, Tailwind CSS, ShadCN UI, and Appwrite — for building a scalable, maintainable, and high-performance application.

10. **To deploy the application on a cloud platform** ensuring high availability and accessibility from anywhere in the world.

---

## 3. Scope of the Project

### 3.1 In Scope

| Area | Description |
|------|-------------|
| User Registration & Authentication | Email-based OTP authentication (passwordless), user profile management |
| File Upload | Drag-and-drop and click-to-upload functionality, support for multiple file types (up to 50 MB per file) |
| File Management | Rename, Delete, Download, View Details, Share files |
| File Categorization | Automatic categorization into Documents, Images, Media, Others |
| Search | Real-time debounced search across all file categories |
| Sorting | Sort files by Date Created (Newest/Oldest), Name (A-Z/Z-A), Size (Highest/Lowest) |
| Dashboard | Interactive storage usage chart, category-wise storage summary, recent uploads list |
| File Sharing | Share files with other users via email |
| Responsive Design | Mobile-first design with dedicated mobile navigation |
| Storage Management | 2 GB storage allocation per user with usage tracking |

### 3.2 Out of Scope

- Offline file access and synchronization
- File versioning and revision history
- Real-time collaborative file editing
- Third-party integrations (Google Drive, Dropbox)
- Admin panel for system-wide user management
- Payment gateway integration for premium storage plans
- Desktop native application

---

## 4. PERT Chart (Text Format)

```
PERT Chart — StoreIt Project
=============================

    [A] ──► [B] ──► [C] ──► [D] ──► [E] ──► [F] ──► [G] ──► [H]
     │        │        │        │        │        │        │        │
     ▼        ▼        ▼        ▼        ▼        ▼        ▼        ▼
  Req.     Sys.     DB       UI       Backend  Testing  Review   Deploy
  Gather   Design   Design   Design   Coding   & QA     & Demo   & Submit

Activity Table:
+------+-------------------------------+----------+----------+----------+----------+
| ID   | Activity                      | Optimist.| Most Lik.| Pessimist| Expected |
|      |                               | (days)   | (days)   | (days)   | (days)   |
+------+-------------------------------+----------+----------+----------+----------+
| A    | Requirement Gathering         |    3     |    5     |    7     |    5     |
| B    | System Design & Architecture  |    4     |    6     |    10    |    6.3   |
| C    | Database Design               |    2     |    3     |    5     |    3.2   |
| D    | UI/UX Design & Prototyping    |    5     |    7     |    10    |    7.2   |
| E    | Backend & Frontend Coding     |   15     |   20     |    30    |   20.8   |
| F    | Testing & Quality Assurance   |    4     |    6     |    10    |    6.3   |
| G    | Project Review & Demo         |    2     |    3     |    4     |    3     |
| H    | Deployment & Submission       |    2     |    3     |    5     |    3.2   |
+------+-------------------------------+----------+----------+----------+----------+
|      | TOTAL ESTIMATED DURATION      |          |          |          |   55 days|
+------+-------------------------------+----------+----------+----------+----------+

Expected Time (Te) = (O + 4M + P) / 6

Critical Path: A → B → C → D → E → F → G → H
```

---

## 5. Gantt Chart (Tabular Format)

```
Gantt Chart — StoreIt Project (Duration: ~8 Weeks)
====================================================

+------+----------------------------+--------+--------+---+---+---+---+---+---+---+---+
| ID   | Task                       | Start  | End    |W1 |W2 |W3 |W4 |W5 |W6 |W7 |W8 |
+------+----------------------------+--------+--------+---+---+---+---+---+---+---+---+
| 1    | Requirement Gathering      | Week 1 | Week 1 |███|   |   |   |   |   |   |   |
| 2    | Feasibility Study          | Week 1 | Week 1 |███|   |   |   |   |   |   |   |
| 3    | System Design              | Week 2 | Week 2 |   |███|   |   |   |   |   |   |
| 4    | Database Design            | Week 2 | Week 3 |   |███|▓▓ |   |   |   |   |   |
| 5    | UI/UX Design               | Week 3 | Week 3 |   |   |███|   |   |   |   |   |
| 6    | Environment Setup          | Week 3 | Week 3 |   |   |▓▓ |   |   |   |   |   |
| 7    | Authentication Module      | Week 4 | Week 4 |   |   |   |███|   |   |   |   |
| 8    | File Upload Module         | Week 4 | Week 5 |   |   |   |███|██ |   |   |   |
| 9    | Dashboard Module           | Week 5 | Week 5 |   |   |   |   |███|   |   |   |
| 10   | Search & Sort Module       | Week 5 | Week 6 |   |   |   |   |▓▓ |██ |   |   |
| 11   | File Actions Module        | Week 6 | Week 6 |   |   |   |   |   |███|   |   |
| 12   | Testing                    | Week 6 | Week 7 |   |   |   |   |   |▓▓ |███|   |
| 13   | Bug Fixing & Optimization  | Week 7 | Week 7 |   |   |   |   |   |   |███|   |
| 14   | Documentation              | Week 7 | Week 8 |   |   |   |   |   |   |▓▓ |██ |
| 15   | Project Review & Demo      | Week 8 | Week 8 |   |   |   |   |   |   |   |███|
| 16   | Final Submission           | Week 8 | Week 8 |   |   |   |   |   |   |   |▓▓ |
+------+----------------------------+--------+--------+---+---+---+---+---+---+---+---+

Legend: ███ = Full Week Activity | ▓▓ = Partial Week Activity
```

---

## 6. Feasibility Study

### 6.1 Technical Feasibility

The StoreIt project is technically feasible as it utilizes well-established, industry-standard, open-source technologies:

| Component | Technology | Feasibility Justification |
|-----------|-----------|--------------------------|
| Frontend Framework | Next.js 16 (React 19) | Mature, production-ready framework with server-side rendering, file-based routing, and server actions |
| Styling | Tailwind CSS 4, ShadCN UI | Utility-first CSS framework with pre-built accessible UI components |
| Backend-as-a-Service | Appwrite | Open-source BaaS providing Authentication, Database, Storage, and Users APIs |
| Language | TypeScript | Adds static type safety to JavaScript, reducing runtime errors |
| Form Handling | React Hook Form + Zod | Efficient form state management with schema-based validation |
| Deployment | Vercel | Seamless deployment platform optimized for Next.js applications |

All selected technologies are open-source, well-documented, and have active community support. The development team possesses adequate knowledge and skills to implement the project using these technologies. The required hardware (standard laptop/desktop with 8 GB+ RAM) and software tools (VS Code, Node.js, Git) are readily available.

**Conclusion:** The project is **technically feasible**.

### 6.2 Economic Feasibility

| Cost Category | Description | Estimated Cost (INR) |
|--------------|-------------|---------------------|
| Development Hardware | Laptop/Desktop (already available) | ₹0 (existing) |
| Software Tools | VS Code, Node.js, Git, Appwrite (all open-source/free) | ₹0 |
| Appwrite Cloud | Free tier — 10 GB storage, 750K function executions | ₹0 |
| Domain Name | Optional custom domain | ₹500–₹1,000/year |
| Vercel Hosting | Free tier for hobby projects | ₹0 |
| Internet | Broadband connection (already available) | ₹0 (existing) |
| **Total Estimated Cost** | | **₹0 – ₹1,000** |

The project leverages entirely free and open-source tools and services. The Appwrite free tier provides sufficient resources (10 GB database, 2 GB storage per bucket) for project development and demonstration. Vercel offers free hosting for Next.js projects.

**Conclusion:** The project is **economically feasible** with minimal to zero cost.

### 6.3 Operational Feasibility

- **User Acceptance:** The system provides an intuitive, modern, and visually appealing interface with minimal learning curve. Users familiar with basic web browsing can operate the system without training.
- **Passwordless Authentication:** OTP-based login eliminates the burden of remembering passwords, improving user adoption.
- **Drag-and-Drop Upload:** Familiar interaction pattern that reduces friction in file upload workflows.
- **Responsive Design:** The application is fully responsive, allowing users to access their files from any device (desktop, tablet, or mobile).
- **Real-Time Feedback:** Toast notifications, loading indicators, and progress animations keep users informed of operation status.
- **Maintenance:** The modular component-based architecture (React components) allows easy maintenance and future enhancements.

**Conclusion:** The project is **operationally feasible**.

### 6.4 Legal Feasibility

- **Open-Source Compliance:** All technologies used (Next.js — MIT License, Tailwind CSS — MIT License, ShadCN UI — MIT License, Appwrite — BSD 3-Clause License) are open-source with permissive licenses that allow commercial and academic use.
- **Data Privacy:** User data (email, name) is stored securely on the Appwrite platform with encrypted connections (HTTPS/TLS). Session management uses HTTP-only secure cookies.
- **User Consent:** Users voluntarily register and upload files to the platform.
- **No Copyright Infringement:** All code is original or sourced from permissive open-source libraries. No proprietary or copyrighted software is used.
- **IT Act 2000 Compliance:** The system follows standard security practices compliant with the Information Technology Act, 2000 (India).

**Conclusion:** The project is **legally feasible**.

### 6.5 Schedule Feasibility

The project is planned over an 8-week timeline, which is adequate for the scope defined:

| Phase | Duration | Status |
|-------|----------|--------|
| Planning & Requirements | Week 1 | ✅ Completed |
| Design (System + DB + UI) | Weeks 2–3 | ✅ Completed |
| Development (Coding) | Weeks 3–6 | ✅ Completed |
| Testing & QA | Weeks 6–7 | ✅ Completed |
| Documentation & Review | Weeks 7–8 | ✅ Completed |
| Final Submission | Week 8 | ✅ Completed |

The project follows an incremental development methodology, allowing parallel progress on frontend and backend tasks. The use of Appwrite as a Backend-as-a-Service significantly reduces backend development time.

**Conclusion:** The project is **schedule feasible** and has been completed within the planned timeline.

---

*End of Phase 1: Project Planning*
