

import Image from "next/image";
import Link from "next/link";
import { Models } from "node-appwrite";
import { FileText, Image as ImageIcon, Film, Package, Clock } from "lucide-react";

import ActionDropdown from "@/components/ActionDropdown";
import { Chart } from "@/components/Chart";
import { FormattedDateTime } from "@/components/FormattedDateTime";
import { Thumbnail } from "@/components/Thumbnail";
import { getFiles, getTotalSpaceUsed } from "@/lib/actions/file.actions";
import { convertFileSize, getUsageSummary } from "@/lib/utils";

const Dashboard = async () => {
  // Parallel requests
  const [files, totalSpace] = await Promise.all([
    getFiles({ types: [], limit: 10 }),
    getTotalSpaceUsed(),
  ]);

  // Get usage summary
  const usageSummary = getUsageSummary(totalSpace);

  // Helper to get icon and color based on title
  const getCategoryStyles = (title: string) => {
      switch(title) {
          case 'Documents': return { icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' };
          case 'Images': return { icon: ImageIcon, color: 'text-purple-500', bg: 'bg-purple-500/10' };
          case 'Media': return { icon: Film, color: 'text-orange-500', bg: 'bg-orange-500/10' };
          default: return { icon: Package, color: 'text-green-500', bg: 'bg-green-500/10' };
      }
  };

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 xl:gap-10">
      {/* LEFT COLUMN: Overview & Stats */}
      <section className="space-y-6">
        {/* Storage Chart Card */}
        <div className="rounded-[20px] bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-lg">
           <Chart used={totalSpace.used} />
        </div>

        {/* File Type Summary Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-2">
          {usageSummary.map((summary) => {
            const { icon: Icon, color, bg } = getCategoryStyles(summary.title);
            
            return (
            <Link
              href={summary.url}
              key={summary.title}
              className="relative overflow-hidden rounded-[20px] bg-white p-5 shadow-sm ring-1 ring-gray-100 transition-all hover:scale-[1.02] hover:shadow-md group"
            >
              <div className="z-10 relative flex flex-col justify-between h-full gap-4">
                 <div className="flex items-start justify-between">
                    <div className={`rounded-full p-3 transition-colors ${bg} group-hover:bg-opacity-80`}>
                      <Icon className={`w-6 h-6 ${color}`} />
                    </div>
                    <h4 className="text-xl font-bold text-dark-100">
                      {convertFileSize(summary.size) || 0}
                    </h4>
                 </div>

                 <div className="space-y-1">
                    <h5 className="font-semibold text-gray-500 group-hover:text-brand transition-colors">{summary.title}</h5>
                    <div className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <FormattedDateTime date={summary.latestDate} className="inline" />
                    </div>
                 </div>
              </div>
              
              {/* Decorator */}
              <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-2xl transition-colors pointer-events-none opacity-50 ${bg}`} />
            </Link>
          )})}
        </div>
      </section>

      {/* RIGHT COLUMN: Recent Activity */}
      <section className="rounded-[20px] bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-dark-100">Recent Uploads</h2>
            <Link href="/documents" className="text-sm font-medium text-brand hover:underline">View All</Link>
        </div>

        {files.documents.length > 0 ? (
          <ul className="flex flex-col gap-4">
            {files.documents.map((file: Models.Document) => (
              <Link
                href={file.url}
                target="_blank"
                className="flex items-center gap-4 rounded-xl p-3 hover:bg-gray-50 transition-colors group"
                key={file.$id}
              >
                <Thumbnail
                  type={file.type}
                  extension={file.extension}
                  url={file.url}
                  className="!size-12 rounded-lg bg-gray-100 group-hover:bg-white transition-colors"
                  imageClassName="!size-6"
                />

                <div className="flex flex-1 items-center justify-between">
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-bold text-dark-100 line-clamp-1 group-hover:text-brand transition-colors">{file.name}</p>
                    <FormattedDateTime
                      date={file.$createdAt}
                      className="text-xs text-gray-400 font-medium"
                    />
                  </div>
                  <ActionDropdown file={file} />
                </div>
              </Link>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
             <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-gray-400" />
             </div>
             <p className="text-gray-400">No files uploaded yet.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;