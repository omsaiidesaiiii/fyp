"use client";

import Link from "next/link";
import Image from "next/image";
import { navItems } from "@/constants";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface Props {
  fullName: string;
  avatar: string;
  email: string;
}

const Sidebar = ({ fullName, avatar, email }: Props) => {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-64 flex-col overflow-hidden bg-white border-r border-gray-200 p-5 md:flex shadow-sm z-50 transition-all duration-300">
      <Link href="/" className="mb-8 flex items-center gap-3 pl-2">
        <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center shadow-lg shadow-brand/20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
            <path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z" />
            </svg>
        </div>
        <span className="text-2xl font-bold text-dark-100 tracking-wide">File<span className="text-brand">Vault</span></span>
      </Link>

      <nav className="flex-1">
        <ul className="flex flex-col gap-2">
          {navItems.map(({ url, name, icon }) => {
            const isActive = pathname === url;
            return (
              <Link key={name} href={url} className="w-full">
                <li
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-200 group text-sm font-medium",
                    isActive
                      ? "bg-brand text-white shadow-md shadow-brand/20"
                      : "text-gray-500 hover:bg-gray-100 hover:text-dark-100"
                  )}
                >
                  <Image
                    src={icon}
                    alt={name}
                    width={22}
                    height={22}
                    className={cn(
                      "transition-all object-contain",
                      isActive ? "brightness-0 invert" : "opacity-70 group-hover:opacity-100"
                    )}
                  />
                  <p className="truncate">{name}</p>
                </li>
              </Link>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto flex items-center gap-3 rounded-2xl bg-gray-50 p-3 border border-gray-100">
        <Image
          src={avatar}
          alt="Avatar"
          width={40}
          height={40}
          className="rounded-full shrink-0 object-cover"
        />
        <div className="overflow-hidden">
          <p className="text-sm font-bold text-dark-100 truncate">{fullName}</p>
          <p className="text-[11px] text-gray-400 truncate font-medium">{email}</p>
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;