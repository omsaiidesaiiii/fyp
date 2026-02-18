import React from "react";
import Sidebar from "@/components/Sidebar";
import MobileNavigation from "@/components/MobileNavigation";
import Header from "@/components/Header";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";

export const dynamic = "force-dynamic";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) return redirect("/sign-in");

  return (
    <main className="flex h-screen bg-[#f9fafb] overflow-hidden">
      <Sidebar {...currentUser} />

      <section className="flex h-full flex-1 flex-col relative z-10 transition-all">
        <MobileNavigation {...currentUser} />
        <Header userId={currentUser.$id} accountId={currentUser.accountId} />
        <div className="flex-1 overflow-auto px-5 py-7 sm:px-8 sm:py-8 scroll-smooth custom-scrollbar">
            <div className="mx-auto max-w-7xl w-full">
              {children}
            </div>
        </div>
      </section>

      <Toaster />
    </main>
  );
};
export default Layout;