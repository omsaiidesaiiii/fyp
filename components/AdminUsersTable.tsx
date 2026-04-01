"use client";

import { toggleUserStatus } from "@/lib/actions/admin.actions";
import { convertFileSize } from "@/lib/utils";
import {
  ShieldCheck,
  ShieldOff,
  Search,
  Users as UsersIcon,
  FileText,
  HardDrive,
} from "lucide-react";
import { useState, useTransition } from "react";

interface UserData {
  $id: string;
  accountId: string;
  fullName: string;
  email: string;
  avatar: string;
  $createdAt: string;
  storageUsed: number;
  fileCount: number;
  isActive: boolean;
  registration: string;
}

const UserRow = ({ user }: { user: UserData }) => {
  const [isActive, setIsActive] = useState(user.isActive);
  const [isPending, startTransition] = useTransition();

  const handleToggleStatus = () => {
    startTransition(async () => {
      const result = await toggleUserStatus({
        accountId: user.accountId,
        currentStatus: isActive,
      });
      if (result.success) {
        setIsActive(result.isActive);
      }
    });
  };

  const joinedDate = new Date(user.$createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <img
            src={user.avatar}
            alt={user.fullName}
            className="w-9 h-9 rounded-full object-cover shrink-0"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-dark-100 truncate">
              {user.fullName}
            </p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-4 text-sm text-gray-500 font-medium">
        {joinedDate}
      </td>
      <td className="px-5 py-4">
        <div className="text-sm font-bold text-dark-100">
          {convertFileSize(user.storageUsed)}
        </div>
        <div className="text-xs text-gray-400">{user.fileCount} files</div>
      </td>
      <td className="px-5 py-4">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
            isActive
              ? "bg-green-50 text-green-600 ring-1 ring-green-200"
              : "bg-red-50 text-red-500 ring-1 ring-red-200"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-green-500" : "bg-red-500"}`}
          />
          {isActive ? "Active" : "Blocked"}
        </span>
      </td>
      <td className="px-5 py-4">
        <button
          onClick={handleToggleStatus}
          disabled={isPending}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            isActive
              ? "bg-red-50 text-red-500 hover:bg-red-100 ring-1 ring-red-100"
              : "bg-green-50 text-green-600 hover:bg-green-100 ring-1 ring-green-100"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isPending ? (
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : isActive ? (
            <ShieldOff className="w-3.5 h-3.5" />
          ) : (
            <ShieldCheck className="w-3.5 h-3.5" />
          )}
          {isActive ? "Block" : "Unblock"}
        </button>
      </td>
    </tr>
  );
};

const UsersTable = ({ initialData }: { initialData: any }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = initialData.usersWithStorage.filter(
    (user: UserData) =>
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-dark-100">User Management</h1>
          <p className="text-gray-500 mt-1">
            View and manage all registered users on the platform
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
          <div className="rounded-xl p-3 bg-blue-500/10">
            <UsersIcon className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-dark-100">
              {initialData.totalUsers}
            </p>
            <p className="text-xs text-gray-400 font-medium">Total Users</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
          <div className="rounded-xl p-3 bg-purple-500/10">
            <FileText className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-dark-100">
              {initialData.totalFiles}
            </p>
            <p className="text-xs text-gray-400 font-medium">Total Files</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
          <div className="rounded-xl p-3 bg-orange-500/10">
            <HardDrive className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-dark-100">
              {convertFileSize(initialData.totalStorage)}
            </p>
            <p className="text-xs text-gray-400 font-medium">
              Total Storage Used
            </p>
          </div>
        </div>
      </div>

      {/* Search & Table */}
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 overflow-hidden">
        {/* Search */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">
                  User
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">
                  Joined
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">
                  Storage
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user: UserData) => (
                  <UserRow key={user.$id} user={user} />
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <UsersIcon className="w-10 h-10 text-gray-300" />
                      <p className="text-gray-400 font-medium">
                        {searchQuery
                          ? "No users match your search."
                          : "No users registered yet."}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersTable;
