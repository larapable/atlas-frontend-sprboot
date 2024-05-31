"use client";
import Navbar from "../components/Navbar";
import AdminPage from "../components/AdminPage";

export default function page() {
  return (
    <div className="flex flex-row">
      <Navbar />
      <div className="flex-1 flex flex-col mt-8 ml-56">
        <AdminPage />
      </div>
    </div>
  );
}
