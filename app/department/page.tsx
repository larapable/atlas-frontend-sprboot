"use client";

import { useState } from "react";

export default function Department() {
  // State variables for each input field
  const [departmentName, setDepartmentName] = useState("");
  const [headOfficer, setHeadOfficer] = useState("");
  const [departmentLandline, setDepartmentLandline] = useState("");
  const [location, setLocation] = useState("");
  const [university, setUniversity] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");

  // Event handlers to update state on input change
  const handleDepartmentNameChange = (e: any) =>
    setDepartmentName(e.target.value);
  const handleHeadOfficerChange = (e: any) => setHeadOfficer(e.target.value);
  const handleDepartmentLandlineChange = (e: any) =>
    setDepartmentLandline(e.target.value);
  const handleLocationChange = (e: any) => setLocation(e.target.value);
  const handleUniversityChange = (e: any) => setUniversity(e.target.value);
  const handleDescriptionChange = (e: any) => setDescription(e.target.value);
  const handleEmailChange = (e: any) => setEmail(e.target.value);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Check if any required fields are empty
    if (
      !departmentName ||
      !headOfficer ||
      !departmentLandline ||
      !location ||
      !university ||
      !description ||
      !email
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      // Send a POST request to the API endpoint
      const response = await fetch(
        "http://localhost:8080/department/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            department_name: departmentName,
            head_officer: headOfficer,
            department_landline: departmentLandline,
            location: location,
            university: university,
            description: description,
            email: email,
          }),
        }
      );

      if (!response.ok) {
        // Handle non-successful responses
        const errorMessage = await response.text(); // Get error message from response
        throw new Error(errorMessage || "Failed to register department."); // Throw an error with the error message or a generic message
      }

      // Request was successful, clear the input fields
      setDepartmentName("");
      setHeadOfficer("");
      setDepartmentLandline("");
      setLocation("");
      setUniversity("");
      setDescription("");
      setEmail("");

      alert("Department registered successfully!");
    } catch (error) {
      // Handle network errors and other exceptions
      console.error("Error:", error);
      alert(
        "An error occurred while registering the department. Please try again later."
      );
    }
  };

  return (
    <div className="h-screen flex lg:flex-row md:flex-col ">
      <div className="flex flex-col items-center lg:ml-60 md:ml-13">
        <div className="font-bold lg:text-[3rem] lg:mb-10 md:mt-10 md:text-[4rem] md:mb-5 ">
          Register Department
        </div>
        <div className="flex flex-col mt-[-1rem]">
          <span className="mr-3 mb-2 break-words font-regular text-md text-[#000000]">
            Department Name
            <span className="text-[#DD1414]">*</span>
          </span>
          <input
            type="text"
            id="departmentName"
            value={departmentName}
            onChange={handleDepartmentNameChange}
            className="border-[0.1rem] border-solid border-black border-opacity-60 rounded-lg w-[38rem] flex items-center mb-6 py-2"
          />
        </div>
        <div className="flex flex-col">
          <span className="mr-3 mb-2 break-words font-regular text-md text-[#000000]">
            Head Officer
            <span className="text-[#DD1414]">*</span>
          </span>
          <input
            type="text"
            id="headOfficer"
            value={headOfficer}
            onChange={handleHeadOfficerChange}
            className="border-[0.1rem] border-solid border-black border-opacity-60 rounded-lg w-[38rem] flex items-center mb-6 py-2"
          />
        </div>
        <div className="flex flex-row gap-7">
          <div className="flex flex-col">
            <span className="mr-3 mb-2 break-words font-regular text-md text-[#000000]">
              Department Landline
              <span className="text-[#DD1414]">*</span>
            </span>
            <input
              type="text"
              id="departmentLandline"
              value={departmentLandline}
              onChange={handleDepartmentLandlineChange}
              className="border-[0.1rem] border-solid border-black border-opacity-60 rounded-lg w-[18rem] flex items-center mb-6 py-2"
            />
          </div>
          <div className="flex flex-col">
            <span className="mr-3 mb-2 break-words font-regular text-md text-[#000000]">
              Email
              <span className="text-[#DD1414]">*</span>
            </span>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              className="border-[0.1rem] border-solid border-black border-opacity-60 rounded-lg w-[18rem] flex items-center mb-6 py-2"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="mr-3 mb-2 break-words font-regular text-md text-[#000000]">
            Location
            <span className="text-[#DD1414]">*</span>
          </span>
          <input
            type="text"
            id="location"
            value={location}
            onChange={handleLocationChange}
            className="border-[0.1rem] border-solid border-black border-opacity-60 rounded-lg w-[38rem] flex items-center mb-6 py-2"
          />
        </div>
        <div className="flex flex-col">
          <span className="mr-3 mb-2 break-words font-regular text-md text-[#000000]">
            University
            <span className="text-[#DD1414]">*</span>
          </span>
          <input
            type="text"
            id="university"
            value={university}
            onChange={handleUniversityChange}
            className="border-[0.1rem] border-solid border-black border-opacity-60 rounded-lg w-[38rem] flex items-center mb-6 py-2"
          />
        </div>
        <div className="flex flex-col">
          <span className="mr-3 mb-2 break-words font-regular text-md text-[#000000]">
            Description
            <span className="text-[#DD1414]">*</span>
          </span>
          <textarea
            id="description"
            value={description}
            onChange={handleDescriptionChange}
            className="border-[0.1rem] border-solid border-black border-opacity-60 rounded-lg w-[38rem] h-[7rem] flex items-center mb-6 py-2"
          />
        </div>

        <button
          className="rounded-lg text-white font-bold text-xl w-[38rem] px-12 py-5 border[0.1rem] border-white mb-4 hover:bg-[#eec160] hover:text-[#8a252c] "
          style={{
            backgroundImage: `url('bgimagemaroon.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          onClick={handleSubmit}
        >
          Register
        </button>
        <div className="text-lg mb-2 font-light">
          Department already registered?{" "}
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
          href="/admindashboard"
          className="text-2xl text-[#8a252c] font-bold lg:mt-4 md:mt-4 md:mb-56 hover:underline"
        >
          Back Home
        </a>
      </div>

      <div
        className="flex flex-col items-center lg:w-full lg:ml-[12%] md:w-full h-[65rem]"
        style={{
          backgroundImage: `url('bgimagemaroon.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <img
          src="departmentpic.png"
          className="w-[25rem] h-[25rem] mt-10 lg:mr-96 md:mr-[60%] ml-[25rem] mb-4 hover:scale-110 transition-transform"
          alt="Scorecard"
        />

        <div className="flex flex-row ml-16">
          <div className="text-[#fad655]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              className="size-10"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
              />
            </svg>
          </div>
          <p className="text-white ml-5 mr-20 mb-16 font-bold text-2xl">
            Users can easily identify and connect with colleagues within their
            department,{" "}
            <span className="text-[#fad655]">
              facilitating better teamwork and collaboration{" "}
            </span>
            to your business.
          </p>
        </div>
        <div className="flex flex-row ml-16">
          <div className="text-[#fad655]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              className="size-10"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
              />
            </svg>
          </div>
          <p className="text-white ml-5 mr-20 mb-4 md:mb-16 font-bold text-2xl">
            Enhances productivity and ensures users have the{" "}
            <span className="text-[#fad655]">right resourcess</span> at their
            disposal.
          </p>
        </div>
        <div className="flex flex-row ml-16">
          <div className="text-[#fad655]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              className="size-10"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
              />
            </svg>
          </div>
          <p className="text-white ml-5 mr-20 mb-4 md:mb-16 font-bold text-2xl">
            Better strategic planning, resource management, and{" "}
            <span className="text-[#fad655]">
              overall operational efficiency
            </span>{" "}
            within the organization.
          </p>
        </div>
      </div>
    </div>
  );
}
