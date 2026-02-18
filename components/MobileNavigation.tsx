"use client";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Separator } from "@radix-ui/react-separator";
import { navItems } from "@/constants";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import FileUploader from "@/components/FileUploader";
import { signOutUser } from "@/lib/actions/user.actions";

interface Props {
  $id: string;
  accountId: string;
  fullName: string;
  avatar: string;
  email: string;
}

const MobileNavigation = ({
  $id: ownerId,
  accountId,
  fullName,
  avatar,
  email,
}: Props) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="flex h-[60px] items-center justify-between px-5 bg-white border-b border-gray-200 md:hidden z-50">
      <Link href="/">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center shadow-md shadow-brand/20">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                <path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z" />
                </svg>
            </div>
            <span className="text-xl font-bold text-dark-100 tracking-wide">File<span className="text-brand">Vault</span></span>
        </div>
      </Link>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <Image
            src="/assets/icons/menu.svg"
            alt="Search"
            width={28}
            height={28}
            className="opacity-70"
          />
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0 border-r-0">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <div className="flex flex-col h-full bg-white">
            
            {/* Header in Sheet */}
            <div className="p-6 pb-2">
                <div className="flex items-center gap-3">
                    <Image
                      src={avatar}
                      alt="avatar"
                      width={44}
                      height={44}
                      className="rounded-full ring-2 ring-gray-100 object-cover"
                    />
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold text-dark-100 truncate">{fullName}</p>
                      <p className="text-xs text-gray-400 truncate font-medium">{email}</p>
                    </div>
                </div>
            </div>

            <Separator className="bg-gray-100 mx-5 my-2" />
            
            <nav className="flex-1 overflow-y-auto px-4 py-4">
              <ul className="flex flex-col gap-2">
                {navItems.map(({ url, name, icon }) => {
                   const isActive = pathname === url;
                   return (
                    <Link key={name} href={url} onClick={() => setOpen(false)}>
                      <li
                        className={cn(
                          "flex items-center gap-4 px-4 py-3.5 rounded-full transition-all duration-200 group text-[15px] font-medium",
                          isActive
                            ? "bg-brand text-white shadow-md shadow-brand/20"
                            : "text-gray-500 hover:bg-gray-50 hover:text-dark-100"
                        )}
                      >
                        <Image
                          src={icon}
                          alt={name}
                          width={24}
                          height={24}
                          className={cn(
                            "transition-all object-contain",
                            isActive ? "brightness-0 invert" : "opacity-70"
                          )}
                        />
                        <p>{name}</p>
                      </li>
                    </Link>
                  )
                })}
              </ul>
            </nav>

            <div className="p-5 flex flex-col gap-4 bg-gray-50 border-t border-gray-100">
               <div className="w-full">
                 <FileUploader ownerId={ownerId} accountId={accountId} className="w-full" />
               </div>
               
               <Button
                type="submit"
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-red-500 hover:bg-red-50 hover:border-red-100 hover:text-red-600 shadow-sm rounded-full h-11"
                onClick={async () => await signOutUser()}
              >
                <Image
                  src="/assets/icons/logout.svg"
                  alt="logo"
                  width={20}
                  height={20}
                  className="opacity-70"
                />
                <p>Logout</p>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default MobileNavigation;