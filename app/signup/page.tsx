"use client";

import { useState, useEffect } from "react";
import { Button, Modal } from "@mui/material";
import { useRouter } from "next/navigation";

type Department = {
  id: number;
  department_name: string;
};
export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(
    null
  );
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successModal, setSuccessModal] = useState(false);

  const handleCancelSave = () => {
    setErrorModalOpen(false);
  };

  const router = useRouter();

  const handleCloseErrorModal = () => {
    setErrorModalOpen(false);
  };

  const handleCloseSuccessModal = () => {
    setSuccessModal(false);
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (
      !username ||
      !email ||
      !password ||
      !confirmPassword ||
      !selectedDepartment
    ) {
      setErrorMessage(
        "You have left a field empty. Please take a moment to complete all the necessary information."
      );
      setErrorModalOpen(true);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Password and Confirm Password do not match.");
      setErrorModalOpen(true);
      return;
    }

    // Check if password meets requirements
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/;
    if (!passwordRegex.test(password)) {
      setErrorMessage(
        "Password must be a minimum of 8 characters, with at least one uppercase letter, one lowercase letter, one number, and one special character (including period)."
      );
      setErrorModalOpen(true);
      return;
    }

    try {
      const resUserExists = await fetch(
        "http://localhost:8080/user/userExists",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, username }),
        }
      );

      const { user, userName } = await resUserExists.json(); // Assuming the server responds with both user and userName

      if (user || userName) {
        setErrorMessage("Username or email already exists.");
        setErrorModalOpen(true);
        return;
      }

      const res = await fetch("http://localhost:8080/user/insert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          department: {
            id: selectedDepartment, // Pass selectedDepartment as a nested object
          },
        }),
      });
      const data = await res.json();
      console.log("data:", data);
      if (res.ok) {
        console.log("Signup successful");
        // Clear input fields after successful signup
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setSelectedDepartment(0);
        setSuccessModal(true);
        router.push("/login");
      } else {
        console.log("User registration failed.");
      }
    } catch (error) {
      console.log("Error during registration", error);
    }
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      const res = await fetch(
        "http://localhost:8080/department/getAllDepartments"
      );
      const data = await res.json();
      setDepartments(data.departments);
    };

    fetchDepartments();
  }, []);

  return (
    <div className="h-screen flex lg:flex-row md:flex-col">
      <div className="flex flex-col items-center lg:ml-60 lg:mt-28 md:mt-8 md:ml-13 ">
        <div className=" font-bold lg:text-[4.1rem] lg:mb-18 md:text-[4rem] md:mb-10 ">
          Sign Up
        </div>
        <div className="border-[0.1rem] border-solid border-black border-opacity-60 rounded-lg w-[38rem] flex items-center mb-6 py-4">
          <select
            value={selectedDepartment || ""}
            onChange={(e) => setSelectedDepartment(parseInt(e.target.value))}
            className="flex-1 font-medium bg-transparent focus:outline-none text-[1rem] px-3 py-1 ml-4 mr-4"
          >
            <option value="">Select a department</option>
            {departments &&
              departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.department_name}
                </option>
              ))}
          </select>
        </div>
        <div className="border-[0.1rem] border-solid border-black border-opacity-60 rounded-lg w-[38rem] mb-6 py-4 flex items-center">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="flex-1 px-3 py-1 ml-4 mr-4 font-medium placeholder-[#807979] bg-transparent focus:outline-none text-[1rem]"
          />
        </div>
        <div className="border-[0.1rem] border-solid border-black border-opacity-60 rounded-lg w-[38rem] mb-6 py-4 flex items-center">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="Username"
            className="flex-1 px-3 py-1 ml-4 mr-4 font-medium placeholder-[#807979] bg-transparent focus:outline-none text-[1rem]"
          />
        </div>
        <div className="flex flex-row space-x-8">
          <div className="border-[0.1rem] border-solid border-black border-opacity-60 rounded-lg w-[18rem] mb-6 py-4 flex">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              className="flex-1 px-3 py-1 ml-4 mr-4 font-medium placeholder-[#807979] bg-transparent focus:outline-none text-[1rem]"
            />
          </div>
          <div className="border-[0.1rem] border-solid border-black border-opacity-60 rounded-lg w-[18rem] mb-6 py-4 flex items-center">
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              placeholder="Confirm Password"
              className="flex-1 px-3 py-1 ml-4 mr-4 font-medium placeholder-[#807979] bg-transparent focus:outline-none text-[1rem]"
            />
          </div>
        </div>
        <button
          style={{ background: "linear-gradient(to left, #8a252c, #AB3510)" }}
          className="rounded-lg text-white font-bold text-xl w-[38rem] px-12 py-5 border[0.1rem] border-white mb-4 hover:bg-[#eec160] hover:text-[#8a252c] "
          onClick={handleSubmit}
        >
          Sign Up
        </button>
        <div className="text-lg mb-2 font-light">
          Already have an account?{" "}
          <a href="/login" className="font-bold text-black hover:underline">
            Log in
          </a>
        </div>
        <div className="flex flex-row items-center">
          <div className="flex-1 bg-[#807979] h-0.5 w-[17.3rem]"></div>
          <div className="mx-4 text-bold">or</div>
          <div className="flex-1 bg-[#807979] h-0.5 w-[17.3rem]"></div>
        </div>
        <a
          href="/"
          className="text-2xl text-[#8a252c] font-bold lg:mt-4 md:mb-16 hover:underline"
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
            <p id="error-modal-title" className="text-3xl font-bold mb-4">
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
      <Modal
        open={successModal}
        onClose={handleCloseSuccessModal}
        aria-labelledby="success-modal-title"
        aria-describedby="success-modal-description"
      >
        <div className="flex flex-col items-center justify-center h-full">
          <div className=" bg-white p-8 rounded-lg shadow-md h-72 w-[40rem] text-center relative">
            <button
              onClick={handleCloseSuccessModal}
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
            <p id="success-modal-title" className="text-3xl font-bold mb-4">
              Success!
            </p>
            <p id="success-modal-description" className=" text-xl mb-4 mt-8">
              Account successfully created.
            </p>
            <button
              className="rounded-xl bg-[#8a252c] text-white text-xl w-40 px-4 py-2 border[0.1rem] border-white hover:bg-[#a8444b] font-medium hover:text-[#fffff] focus:outline-none h-12 mt-5"
              onClick={handleCloseSuccessModal}
            >
              OK
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
