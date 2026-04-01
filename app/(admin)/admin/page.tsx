import { getAdminDashboardData } from "@/lib/actions/admin.actions";
import { convertFileSize } from "@/lib/utils";
import { Users, FileText, HardDrive, Image, Film, Music, Package } from "lucide-react";
import Link from "next/link";

const AdminDashboard = async () => {
  const data = await getAdminDashboardData();

  const statCards = [
    {
      label: "Total Users",
      value: data.totalUsers,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      decorator: "bg-blue-500/10",
    },
    {
      label: "Total Files",
      value: data.totalFiles,
      icon: FileText,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      decorator: "bg-purple-500/10",
    },
    {
      label: "Storage Used",
      value: convertFileSize(data.totalStorage),
      icon: HardDrive,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      decorator: "bg-orange-500/10",
    },
  ];

  const typeIcons: Record<string, { icon: typeof FileText; color: string; label: string }> = {
    document: { icon: FileText, color: "text-blue-500", label: "Documents" },
    image: { icon: Image, color: "text-purple-500", label: "Images" },
    video: { icon: Film, color: "text-orange-500", label: "Videos" },
    audio: { icon: Music, color: "text-green-500", label: "Audio" },
    other: { icon: Package, color: "text-gray-500", label: "Others" },
  };

  // Sort users by storage (highest first)
  const topUsers = [...data.usersWithStorage]
    .sort((a: any, b: any) => b.storageUsed - a.storageUsed)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-dark-100">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Overview of platform usage and statistics
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-500">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-dark-100">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`rounded-xl p-3 transition-transform group-hover:scale-110 ${stat.bg}`}
                >
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <div
                className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-2xl pointer-events-none opacity-50 ${stat.decorator}`}
              />
            </div>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Storage by File Type */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="text-lg font-bold text-dark-100 mb-5">
            Storage by File Type
          </h2>
          <div className="space-y-4">
            {Object.entries(data.overallTypeBreakdown).length > 0 ? (
              Object.entries(data.overallTypeBreakdown).map(
                ([type, info]: [string, any]) => {
                  const typeInfo = typeIcons[type] || typeIcons.other;
                  const Icon = typeInfo.icon;
                  const percentage =
                    data.totalStorage > 0
                      ? ((info.size / data.totalStorage) * 100).toFixed(1)
                      : "0";

                  return (
                    <div key={type} className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gray-50`}
                      >
                        <Icon className={`w-5 h-5 ${typeInfo.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-semibold text-dark-100">
                            {typeInfo.label}
                          </span>
                          <span className="text-xs text-gray-400 font-medium">
                            {info.count} files · {percentage}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              type === "document"
                                ? "bg-blue-500"
                                : type === "image"
                                  ? "bg-purple-500"
                                  : type === "video"
                                    ? "bg-orange-500"
                                    : type === "audio"
                                      ? "bg-green-500"
                                      : "bg-gray-400"
                            }`}
                            style={{
                              width: `${Math.max(2, parseFloat(percentage))}%`,
                            }}
                          />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {convertFileSize(info.size)}
                        </p>
                      </div>
                    </div>
                  );
                }
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="w-10 h-10 text-gray-300 mb-3" />
                <p className="text-gray-400 text-sm">
                  No files uploaded yet on the platform.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Top Users by Storage */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-dark-100">
              Top Users by Storage
            </h2>
            <Link
              href="/admin/users"
              className="text-sm font-medium text-red-500 hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {topUsers.length > 0 ? (
              topUsers.map((user: any, index: number) => (
                <div
                  key={user.$id}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-sm font-bold text-gray-500">
                    {index + 1}
                  </div>
                  <img
                    src={user.avatar}
                    alt={user.fullName}
                    className="w-9 h-9 rounded-full object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-dark-100 truncate">
                      {user.fullName}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-dark-100">
                      {convertFileSize(user.storageUsed)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {user.fileCount} files
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="w-10 h-10 text-gray-300 mb-3" />
                <p className="text-gray-400 text-sm">
                  No users registered yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
