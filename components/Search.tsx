"use client";

import React, { useEffect, useState } from "react";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getFiles } from "@/lib/actions/file.actions";
import { Models } from "node-appwrite";
import Thumbnail from "@/components/Thumbnail";
import FormattedDateTime from "@/components/FormattedDateTime";
import { useDebounce } from "use-debounce";
const Search = () => {
  const [query, setQuery] = useState("");
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || "";
  const [results, setResults] = useState<Models.Document[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const path = usePathname();
  const [debouncedQuery] = useDebounce(query, 300);

  useEffect(() => {
    const fetchFiles = async () => {
      if (debouncedQuery.length === 0) {
        setResults([]);
        setOpen(false);
        return router.push(path.replace(searchParams.toString(), ""));
      }

      const files = await getFiles({ types: [], searchText: debouncedQuery });
      setResults(files.documents);
      setOpen(true);
    };

    fetchFiles();
  }, [debouncedQuery]);

  useEffect(() => {
    if (!searchQuery) {
      setQuery("");
    }
  }, [searchQuery]);

  const handleClickItem = (file: Models.Document) => {
    setOpen(false);
    setResults([]);

    router.push(
      `/${file.type === "video" || file.type === "audio" ? "media" : file.type + "s"}?query=${query}`,
    );
  };

  return (
    <div className="relative w-full md:max-w-[480px]">
      <div className="flex items-center gap-3 bg-white rounded-full px-4 py-3 border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-brand/20 focus-within:border-brand transition-all">
        <Image
          src="/assets/icons/search.svg"
          alt="Search"
          width={20}
          height={20}
          className="opacity-50"
        />
        <Input
          value={query}
          placeholder="Search..."
          className="border-none shadow-none focus-visible:ring-0 p-0 h-auto placeholder:text-gray-400 text-[15px] w-full"
          onChange={(e) => setQuery(e.target.value)}
        />

        {open && (
          <div className="absolute top-14 left-0 w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
            <ul className="flex flex-col">
              {results.length > 0 ? (
                results.map((file) => (
                  <li
                    className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                    key={file.$id}
                    onClick={() => handleClickItem(file)}
                  >
                    <div className="flex items-center gap-3">
                      <Thumbnail
                        type={file.type}
                        extension={file.extension}
                        url={file.url}
                        className="size-10 min-w-10 rounded-lg"
                      />
                      <p className="text-sm font-semibold text-dark-100 line-clamp-1">
                        {file.name}
                      </p>
                    </div>

                    <FormattedDateTime
                      date={file.$createdAt}
                      className="text-xs text-gray-400 font-medium"
                    />
                  </li>
                ))
              ) : (
                <p className="p-6 text-center text-gray-400 text-sm">No files found</p>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;