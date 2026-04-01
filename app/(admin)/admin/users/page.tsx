import { getAdminDashboardData } from "@/lib/actions/admin.actions";
import UsersTable from "@/components/AdminUsersTable";

const AdminUsersPage = async () => {
  const data = await getAdminDashboardData();

  return <UsersTable initialData={data} />;
};

export default AdminUsersPage;
