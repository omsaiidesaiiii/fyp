import React from "react";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/actions/admin.actions";
import AdminSidebar from "@/components/AdminSidebar";
import AdminMobileNavigation from "@/components/AdminMobileNavigation";

export const dynamic = "force-dynamic";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const admin = await getCurrentAdmin();

  if (!admin) return redirect("/admin-login");

  return (
    <main className="flex h-screen bg-gray-900 overflow-hidden">
      <AdminSidebar adminName={admin.name} adminEmail={admin.email} />

      <section className="flex h-full flex-1 flex-col relative z-10 transition-all">
        <AdminMobileNavigation
          adminName={admin.name}
          adminEmail={admin.email}
        />
        <div className="flex-1 overflow-auto px-5 py-7 sm:px-8 sm:py-8 scroll-smooth custom-scrollbar bg-gray-50">
          <div className="mx-auto max-w-7xl w-full">{children}</div>
        </div>
      </section>
    </main>
  );
};

export default AdminLayout;
