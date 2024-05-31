"use client";
import Link from "next/link";
import { TiLocationArrowOutline } from "react-icons/ti";

export default function AdminNavBar() {
  return (
    <div
      className="fixed top-0 left-0 flex flex-col h-screen w-[18rem] py-5 overflow-auto gap-1"
      style={{ background: "linear-gradient(to left, #8a252c, #AB3510)" }}
    >
      <div className="flex items-center justify-center">
        {/* ilisi nig atlasLogo  */}
        <img src="/logo.png" alt="" className=" h-[8rem] mt-3 mb-5 mr-5" />
      </div>
      <div className="w-[18rem] border-t border-white mb-5"></div>
      <Link href="/admindashboard">
        <div className="mx-3 border-[0.1rem] border-solid border-transparent rounded-lg w-[16rem] h-14 mb-3 py-4 px-3 flex items-center text-white hover:bg-[#eec160] hover:text-[#8a252c] transition-colors duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            className="w-8 h-8 "
          >
            <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
            <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
          </svg>
          <div className="flex-1 px-3 py-1 ml-1  mr-4 font-medium bg-transparent focus:outline-none text-xl">
            Dashboard
          </div>
        </div>
      </Link>
      <Link href="/department">
        <div className="mx-3 border-[0.1rem] border-solid border-transparent rounded-lg w-[16rem] h-14 mb-3 py-4 px-3 flex items-center text-white hover:bg-[#eec160] hover:text-[#8a252c] transition-colors duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            className="w-8 h-8 "
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
            />
          </svg>
          <div className="flex-1 px-3 py-1 ml-1  mr-4 font-medium bg-transparent focus:outline-none text-xl">
            Register Department
          </div>
        </div>
      </Link>
      <div className="w-[18rem] border-t border-white mb-5"></div>
      <div className="flex flex-row text-white mx-3 hover:bg-[#eec160] hover:text-[#8a252c] transition-colors duration-300 items-center border-[0.1rem] border-solid border-transparent rounded-lg mb-3 px-3 h-14 ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
          />
        </svg>
        <div className="flex-1 px-3 py-1 ml-1  mr-4 font-medium bg-transparent focus:outline-none text-xl">
          Logout
        </div>
      </div>
    </div>
  );
}
