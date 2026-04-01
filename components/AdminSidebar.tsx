"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Shield, LayoutDashboard, Users as UsersIcon } from "lucide-react";
import { cn } from "@/lib/utils";
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

type Props = {
  adminName: string;
  adminEmail: string;
};

const AdminSidebar = ({ adminName, adminEmail }: Props) => {
  const pathname = usePathname();

  return (
    <aside className="remove-scrollbar hidden h-screen w-[280px] flex-col overflow-auto bg-white px-7 py-7 lg:flex border-r border-gray-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      <Link href="/admin" className="flex items-center gap-2 mb-10 pl-3">
        <div className="w-9 h-9 bg-red-500 rounded-lg flex items-center justify-center shadow-lg shadow-red-500/10">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold text-dark-100 tracking-tight">
            File<span className="text-red-500">Vault</span>
          </span>
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-red-500/80 -mt-1">
            Admin Portal
          </span>
        </div>
      </Link>

      <nav className="flex-1 space-y-2">
        {adminNavItems.map(({ url, name, icon: Icon }) => (
          <Link key={name} href={url} className="block group">
            <li
              className={cn(
                "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300",
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
              <span className="font-bold text-sm tracking-tight">{name}</span>
              
            </li>
          </Link>
        ))}
      </nav>

      <div className="mt-auto space-y-4 pt-6">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-100 text-red-500 font-bold shadow-sm">
            {adminName?.charAt(0) || "A"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-dark-100 truncate">{adminName}</p>
            <p className="text-xs text-gray-400 truncate">{adminEmail}</p>
          </div>
        </div>

        <button
          onClick={() => signOutAdmin()}
          className="flex w-full items-center gap-4 px-4 py-3.5 rounded-2xl text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all duration-300 group"
        >
          <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
          <span className="font-bold text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
