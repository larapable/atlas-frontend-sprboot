"use client";

import { Button, Modal } from "@mui/material";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const handleCancelSave = () => {
    setErrorModalOpen(false);
  };

  const router = useRouter();

  const handleCloseErrorModal = () => {
    setErrorModalOpen(false);
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (!username || !password) {
      setErrorMessage(
        "You have left a field empty. Please take a moment to complete all the necessary information."
      );
      setErrorModalOpen(true);
      return;
    }

    try {
      const res = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (res && res.error) {
        setErrorMessage(
          "We're sorry, but the credentials you entered are incorrect. Please double-check your username and password and try again."
        );
        setErrorModalOpen(true);
        return;
      }

      router.replace("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-screen flex lg:flex-row md:flex-col ">
      <div className="flex flex-col items-center lg:mt-32 lg:ml-60 md:mt-16 md:ml-13">
        <div className=" font-bold lg:text-[4.1rem] lg:mb-18 md:mt-10 md:text-[4rem] md:mb-10 ">
          Login
        </div>
        <div className="border-[0.1rem] border-solid border-black border-opacity-60 rounded-lg w-[38rem] flex items-center mb-6 py-4">
          <img src="/usernamelogo.png" className=" ml-4 w-7 h-7" />
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="Username"
            className="flex-1 font-medium placeholder-[#807979] bg-transparent focus:outline-none text-[1rem] px-3 py-1 mr-4"
          />
        </div>
        <div className="border-[0.1rem] border-solid border-black border-opacity-60 rounded-lg w-[38rem] flex items-center mb-6 py-4">
          <img src="/passwordlogo.png" className=" ml-4 w-7 h-7" />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="flex-1 font-medium placeholder-[#807979] bg-transparent focus:outline-none text-[1rem] px-3 py-1 mr-4"
          />
        </div>
        <button
          style={{ background: "linear-gradient(to left, #8a252c, #AB3510)" }}
          className="rounded-lg text-white font-bold text-xl w-[38rem] px-12 py-5 border[0.1rem] border-white mb-4 hover:bg-[#eec160] hover:text-[#8a252c] "
          onClick={handleSubmit}
        >
          Login
        </button>
        <div className="text-lg mb-2 font-light">
          Dont have an account?{" "}
          <a href="/signup" className="font-bold text-black hover:underline">
            Click here!
          </a>
        </div>
        <div className="flex flex-row items-center">
          <div className="flex-1 bg-[#807979] h-0.5 w-[17.3rem]"></div>
          <div className="mx-4 text-bold">or</div>
          <div className="flex-1 bg-[#807979] h-0.5 w-[17.3rem]"></div>
        </div>
        <a
          href="/"
          className="text-2xl text-[#8a252c] font-bold lg:mt-4 md:mt-4 md:mb-56 hover:underline"
        >
          Back Home
        </a>
      </div>
      <div
        style={{ background: "linear-gradient(to left, #8a252c, #AB3510)" }}
        className="flex flex-col items-center lg:w-full lg:ml-[12%] md:w-full"
      >
        <img
          src="wc-screen-scorecard.png"
          className="w-28 h-28 mt-24 lg:mr-96 md:mr-[60%] mb-4 hover:scale-110 transition-transform"
          alt="Scorecard"
        />
        <p className="text-white ml-40 mr-20 mb-16 font-bold text-2xl">
          <span className="text-[#fad655]">Track key metrics</span>
          <span>
            , analyze trends, and make informed decisions to drive success.
          </span>
        </p>
        <img
          src="wc-screen-swot.png"
          className="w-28 h-28 mt-4 lg:mr-96 md:mr-[60%] mb-4 hover:scale-110 transition-transform"
          alt="SWOT"
        />
        <p className="text-white ml-40 mr-20 mb-16 font-bold text-2xl">
          <span className="text-[#fad655]">
            Identify strength, weaknesses, opportunities, and threats{" "}
          </span>
          <span>to your business.</span>
        </p>
        <img
          src="wc-screen-stratmap.png"
          className="w-28 h-28 mt-4 lg:mr-96 md:mr-[60%] mb-4 hover:scale-110 transition-transform"
          alt="Strategy"
        />
        <p className="text-white ml-40 mr-20 mb-4 md:mb-16 font-bold text-2xl">
          <span className="text-[#fad655]">Define objectives</span>
          <span>, outline initiatives, and map out your path to success.</span>
        </p>
      </div>
      <Modal
        open={errorModalOpen}
        onClose={handleCloseErrorModal}
        aria-labelledby="error-modal-title"
        aria-describedby="error-modal-description"
      >
        <div className="flex flex-col items-center justify-center h-full">
          <div className=" bg-white p-8 rounded-lg shadow-md h-72 w-[40rem] text-center relative">
            <button
              onClick={handleCancelSave}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <p id="error-modal-title" className=" text-3xl font-bold mb-4">
              Attention!
            </p>
            <p id="error-modal-description" className=" text-xl mb-4 mt-8">
              {errorMessage}
            </p>
            <button
              className="rounded-xl bg-[#8a252c] text-white text-xl w-40 px-4 py-2 border[0.1rem] border-white hover:bg-[#a8444b] font-medium hover:text-[#fffff] focus:outline-none h-12 mt-5"
              onClick={handleCloseErrorModal}
            >
              Enter again
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
