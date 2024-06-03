"use client";
import AdminNavbar from "../components/AdminNavBar";
import AdminPage from "../components/AdminPage";

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-row">
      <AdminNavbar />
      <div className="flex-1 flex flex-col mt-8 ml-56">
        <AdminPage />
      </div>
    </div>
  );
}
