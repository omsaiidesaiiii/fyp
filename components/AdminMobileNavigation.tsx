"use client";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LogOut, Menu, Shield, LayoutDashboard, Users as UsersIcon } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { signOutAdmin } from "@/lib/actions/admin.actions";

const adminNavItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    url: "/admin",
  },
  {
    name: "Users",
    icon: UsersIcon,
    url: "/admin/users",
  },
];

interface Props {
  adminName: string;
  adminEmail: string;
}

const AdminMobileNavigation = ({ adminName, adminEmail }: Props) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="flex h-[72px] items-center justify-between px-5 py-5 sm:px-10 lg:hidden bg-white border-b border-gray-100 shadow-sm">
      <Link href="/admin" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center shadow-lg shadow-red-500/10">
          <Shield className="w-4 h-4 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold text-dark-100 tracking-tight">
            File<span className="text-red-500">Vault</span>
          </span>
          <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-red-500/80 -mt-1">
            Admin
          </span>
        </div>
      </Link>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <div className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Menu className="w-6 h-6 text-gray-600" />
          </div>
        </SheetTrigger>
        <SheetContent className="bg-white p-0 border-l border-gray-100">
          <SheetTitle className="hidden">Admin Navigation</SheetTitle>

          <div className="flex h-full flex-col p-6">
            <div className="flex items-center gap-2 mb-10">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center shadow-lg shadow-red-500/10">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-dark-100">Admin Portal</span>
            </div>

            <nav className="flex-1 space-y-2">
              {adminNavItems.map(({ url, name, icon: Icon }) => (
                <Link
                  key={name}
                  href={url}
                  onClick={() => setOpen(false)}
                  className="block group"
                >
                  <li
                    className={cn(
                      "flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300",
                      pathname === url
                        ? "bg-red-50 text-red-500 shadow-sm"
                        : "text-gray-500 hover:bg-gray-50 hover:text-dark-100"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-5 h-5 transition-colors",
                        pathname === url ? "text-red-500" : "text-gray-400 group-hover:text-red-500"
                      )}
                    />
                    <span className="font-bold text-base tracking-tight">{name}</span>
                  </li>
                </Link>
              ))}
            </nav>

            <div className="mt-auto space-y-6 pt-6">
              <Separator className="bg-gray-100" />
              
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-gray-100 text-red-500 font-bold shadow-sm text-lg">
                  {adminName?.charAt(0) || "A"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-dark-100 truncate">{adminName}</p>
                  <p className="text-xs text-gray-400 truncate">{adminEmail}</p>
                </div>
              </div>

              <button
                onClick={() => signOutAdmin()}
                className="flex w-full items-center gap-4 px-4 py-4 rounded-2xl text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all duration-300 group"
              >
                <LogOut className="w-6 h-6 text-gray-400 group-hover:text-red-500" />
                <span className="font-bold text-base">Sign Out</span>
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default AdminMobileNavigation;
