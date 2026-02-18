import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Search from "@/components/Search";
import FileUploader from "@/components/FileUploader";
import { signOutUser } from "@/lib/actions/user.actions";

const Header = ({
  userId,
  accountId,
}: {
  userId: string;
  accountId: string;
}) => {
  return (
    <header className="flex items-center justify-between gap-5 px-5 py-5 sm:px-8  backdrop-blur-md border-gray-200 sticky top-0 z-30 transition-all">
      <Search />
      <div className="hidden md:flex items-center gap-4">
        <FileUploader ownerId={userId} accountId={accountId} />
        <form
          action={async () => {
             "use server";
             await signOutUser();
           }}
        >
          <Button type="submit" className="sign-out-button p-0 md:h-11 md:w-11 bg-white hover:bg-gray-50 border border-gray-200 rounded-full shadow-sm">
            <Image
              src="/assets/icons/logout.svg"
              alt="logo"
              width={22}
              height={22}
              className="w-5 h-5 opacity-70"
            />
          </Button>
        </form>
      </div>
    </header>
  );
};
export default Header;