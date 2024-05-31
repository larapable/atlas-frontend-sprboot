"use client";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { TiLocationArrowOutline } from "react-icons/ti";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Navbar() {
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
      {/* <Link href="/">
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
      </Link> */}
      <Link href="/profile">
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
              d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
          <div className="flex-1 px-3 py-1 ml-1  mr-4 font-medium bg-transparent focus:outline-none text-xl">
            Profile
          </div>
        </div>
      </Link>
      <Link href="/inputgoals">
        <div className="mx-3 border-[0.1rem] border-solid border-transparent rounded-lg w-[16rem] h-14 mb-3 py-4 px-3 flex items-center text-white hover:bg-[#eec160] hover:text-[#8a252c] transition-colors duration-300">
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
              d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
            />
          </svg>

          <div className="flex-1 px-3 py-1 ml-1  mr-4 font-medium bg-transparent focus:outline-none text-xl">
            Goal Settings
          </div>
        </div>
      </Link>
      <Link href="/swot">
        <div className="mx-3 border-[0.1rem] border-solid border-transparent rounded-lg w-[16rem] h-14 mb-3 py-4 px-3 flex items-center text-white hover:bg-[#eec160] hover:text-[#8a252c] transition-colors duration-300">
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
              d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
            />
          </svg>
          <div className="flex-1 px-3 py-1 ml-1  mr-4 font-medium bg-transparent focus:outline-none text-xl">
            SWOT Matrix
          </div>
        </div>
      </Link>
      <Link href="/stratmap">
        <div className="mx-3 border-[0.1rem] border-solid border-transparent rounded-lg w-[16rem] h-14 mb-3 py-4 px-3 flex items-center text-white hover:bg-[#eec160] hover:text-[#8a252c] transition-colors duration-300">
          <TiLocationArrowOutline className="w-8 h-8" />

          <div className="flex-1 px-3 py-1 ml-1  mr-4 font-medium bg-transparent focus:outline-none text-xl">
            Strat Mapping
          </div>
        </div>
      </Link>
      <Link href="/scorecard">
        <div className="mx-3 border-[0.1rem] border-solid border-transparent rounded-lg w-[16rem] h-14 mb-3 py-4 px-3 flex items-center text-white hover:bg-[#eec160] hover:text-[#8a252c] transition-colors duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-8 h-8"
          >
            <path d="M2.273 5.625A4.483 4.483 0 0 1 5.25 4.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0 0 18.75 3H5.25a3 3 0 0 0-2.977 2.625ZM2.273 8.625A4.483 4.483 0 0 1 5.25 7.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0 0 18.75 6H5.25a3 3 0 0 0-2.977 2.625ZM5.25 9a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h13.5a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3H15a.75.75 0 0 0-.75.75 2.25 2.25 0 0 1-4.5 0A.75.75 0 0 0 9 9H5.25Z" />
          </svg>
          <div className="flex-1 px-3 py-1 ml-1  mr-4 font-medium bg-transparent focus:outline-none text-xl">
            B Scorecard
          </div>
        </div>
      </Link>
      <Link href="/report">
        <div className="mx-3 border-[0.1rem] border-solid border-transparent rounded-lg w-[16rem] h-14 mb-3 py-4 px-3 flex items-center text-white hover:bg-[#eec160] hover:text-[#8a252c] transition-colors duration-300">
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
              d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
            />
          </svg>
          <div className="flex-1 px-3 py-1 ml-1  mr-4 font-medium bg-transparent focus:outline-none text-xl">
            Report Analysis
          </div>
        </div>
      </Link>
      <Link href="/evaluation">
        <div className="mx-3 border-[0.1rem] border-solid border-transparent rounded-lg w-[16rem] h-14 mb-3 py-4 px-3 flex items-center text-white hover:bg-[#eec160] hover:text-[#8a252c] transition-colors duration-300">
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
              d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"
            />
          </svg>

          <div className="flex-1 px-3 py-1 ml-1  mr-4 font-medium bg-transparent focus:outline-none text-xl">
            Evaluation
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
