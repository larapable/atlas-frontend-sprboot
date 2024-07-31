import { Button, Card } from "@mui/material";
import { useState, useEffect } from "react";
import { getSession, useSession } from "next-auth/react";
import EditProfile from "../profile/edit/page";
import Email from "next-auth/providers/email";
import Link from "next/link";

export default function UserProfile() {
  // DEPARTMENT PROFILE
  const { data: session, status, update } = useSession();
  console.log("useSession Hook session object", session);

  let user;
  if (session?.user?.name) user = JSON.parse(session?.user?.name as string);

  const [image, setImage] = useState("");
  const [department, setDepartment] = useState("");
  const [headOfficer, setHeadOfficer] = useState("");
  const [departmentLandline, setDepartmentLandline] = useState("");
  const [location, setLocation] = useState("");
  const [university, setUniversity] = useState("");
  const [departmentDescription, setDepartmentDescription] = useState(" ");

  // State to manage the current view
  const [currentView, setCurrentView] = useState("department");

  const department_id = user?.department_id;
  const user_id = user?.id;
  console.log("User ID: ", user_id);
  console.log("Department: ", department_id);
  console.log("User Parsed: ", user);
  const username = user?.username;
  const email = user?.email;

  useEffect(() => {
    const fetchUserProfileData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/department/${department_id}`
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Received data:", data); // Add this line to log the received data
          setDepartment(data.department_name);
          setHeadOfficer(data.head_officer);
          setDepartmentLandline(data.department_landline);
          setLocation(data.location);
          setUniversity(data.university);
          setDepartmentDescription(data.description);
        } else {
          console.error(
            "Error fetching user profile data:",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching user profile data:", error);
      }
    };
    fetchUserProfileData();
  }, [department_id]);

  useEffect(() => {
    const fetchImageData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/image/getImage/${department_id}`
        );
        if (response.ok) {
          const { imageData, imageFormat } = await response.json();
          console.log(
            "Received image data:",
            imageData,
            "Image format:",
            imageFormat
          );

          // Check that imageData and imageFormat are correct
          if (!imageData || !imageFormat) {
            console.error(
              "Invalid image data or format:",
              imageData,
              imageFormat
            );
            return;
          }

          // Create a data URL for the image
          const image = `data:image/${imageFormat};base64,${imageData}`;

          // Set the image URL
          setImage(image);

          // Log the image URL
          console.log("Image URL:", image);
        } else {
          console.error("Error fetching image data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching image data:", error);
      }
    };
    fetchImageData();
  }, [department_id]);

  // USER PERSONAL PROFILE
  const [userImage, setUserImage] = useState("");
  const [firstname, setFirstname] = useState("");
  const [age, setAge] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [lastname, setLastname] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const fetchUserPersonalProfileData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/user/get/${username}`
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Received data:", data);
          setFirstname(data.firstname);
          setAge(data.age);
          const parsedBirthdate = new Date(data.birthdate);
          const formattedBirthdate = parsedBirthdate
            .toISOString()
            .split("T")[0];
          setBirthdate(formattedBirthdate);
          setLastname(data.lastname);
          setRole(data.role);
        } else {
          console.error(
            "Error fetching user profile data:",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching user profile data:", error);
      }
    };
    fetchUserPersonalProfileData();
  }, [username]);

  useEffect(() => {
    const fetchUserImageData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/userImage/getImage/${user_id}`
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Full response data for user image:", data);

          // Extract image data and format from the response
          const { image: userImageData, imageFormat: userImageFormat } = data;
          console.log(
            "Received user image data:",
            userImageData,
            "User Image format:",
            userImageFormat
          );

          // Check that imageData and imageFormat are correct
          if (!userImageData || !userImageFormat) {
            console.error(
              "Invalid user image data or format:",
              userImageData,
              userImageFormat
            );
            return;
          }

          // Create a data URL for the image
          const userImage = `data:image/${userImageFormat};base64,${userImageData}`;

          // Set the image URL
          setUserImage(userImage);

          // Log the image URL
          console.log("Image URL:", userImage);
        } else {
          console.error("Error fetching image data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching image data:", error);
      }
    };
    fetchUserImageData();
  }, [user_id]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-row">
        <div className="flex flex-col">
          <div className="mb-5 mt-[1.1rem] break-words font-bold text-[3rem] text-[rgb(59,59,59)]">
            PROFILE
          </div>
        </div>

        <div className="flex justify-center ml-[69rem] mt-[1.5rem] border border-gray-200 bg-gray w-[17rem] h-[4rem] rounded-xl gap-2 px-1 py-1 text-md font-medium">
          <button
            onClick={() => setCurrentView("department")}
            className={`rounded-lg ${
              currentView === "department"
                ? "bg-[#A43214] text-white"
                : "border text-[#A43214]"
            } hover:bg-[#A43214] border border-none hover:border-red-500 hover:text-white px-6`}
          >
            DEPARTMENT
          </button>
          <button
            onClick={() => setCurrentView("user")}
            className={`rounded-lg ${
              currentView === "user"
                ? "bg-[#A43214] text-white"
                : "border text-[#A43214]"
            } hover:bg-[#A43214] border border-none hover:border-red-500 hover:text-white px-6`}
          >
            USER
          </button>
        </div>
      </div>
      <span className="break-words font font-normal text-[1.3rem] text-[#504C4C] mt-[-1rem] mb-5">
        The Profile section enables users to access comprehensive information
        about their department as well as their personal data. This centralized
        hub ensures easy retrieval of essential details, enhancing user
        experience and organizational transparency within the Atlas system.
      </span>

      {currentView === "department" ? (
        // =======================================================DEPARTMENT PROFILE=====================================================
        <Card className="h-[auto] flex flex-col items-center rounded-xl bg-white shadow-xl border border-gray-150 mb-10 mr-6">
          <div className="w-[100%]">
            <img
              src="/coverbg.png"
              alt=""
              className=" h-[12rem] w-[100%] bg-white object-cover"
            />
          </div>
          <div className="mt-[-8rem] text-center justify-center items-center bg-center snap-center self-center">
            {image ? (
              <div className="border border-solid border-gray-300 shadow-lg rounded-full w-48 h-48 my-4 flex items-center justify-center overflow-hidden">
                <img
                  src={image}
                  alt="Department Image"
                  className=" w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="border border-solid border-gray-300 shadow-lg rounded-full w-48 h-48 my-4 py-4 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-24 h-24 text-gray-500"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
            <div className="mt-1 mb-2">
              <div className="text-4xl font-bold mb-4">{department}</div>
              <span className="text-lg font-normal mb-4 text-[rgb(158,157,157)]">
                Department Name
              </span>
            </div>
          </div>
          <a
            href="/profile/edit"
            className="text-[#ffffff] font-medium text-lg"
          >
            <div
              className="mb-10 rounded-[0.6rem] py-2 px-3 h-[fit-content] w-[10rem] justify-center text-center"
              style={{
                background: "linear-gradient(to left, #8a252c, #AB3510)",
              }}
            >
              EDIT
            </div>
          </a>
          <div className="w-[80rem] h-[100%] border border-gray-200 px-10 py-10 rounded-xl mb-10">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-[rgb(77,76,76)] mb-5">
                Basic Information
              </span>
              <div className="flex flex-col">
                <div className="flex flex-row items-center justify-center w-fit mb-6 gap-14">
                  <div className="flex flex-col">
                    <span className="text-lg font-normal mb-1 text-[rgb(77,76,76)]">
                      Head Officer
                    </span>
                    <div className="text-lg font-medium py-1 px-2 border border-gray-200 bg-gray-100 w-[35rem] h-10 rounded-md">
                      {headOfficer}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-normal mb-1 text-[rgb(77,76,76)]">
                      University
                    </span>
                    <div className="text-lg font-medium py-1 px-2 border border-gray-200 bg-gray-100 w-[35rem] h-10 rounded-md">
                      {university}
                    </div>
                  </div>
                </div>
                <div className="flex flex-row items-center justify-center w-fit mb-6 gap-14">
                  <div className="flex flex-col">
                    <span className="text-lg font-normal mb-1 text-[rgb(77,76,76)]">
                      Email
                    </span>
                    <div className="text-lg font-medium py-1 px-2 border border-gray-200 bg-gray-100 w-[35rem] h-10 rounded-md">
                      {email}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-normal mb-1 text-[rgb(77,76,76)]">
                      Location
                    </span>
                    <div className="text-lg font-medium py-1 px-2 border border-gray-200 bg-gray-100 w-[35rem] h-10 rounded-md">
                      {location}
                    </div>
                  </div>
                </div>
                <div className="flex flex-row items-center justify-center w-fit mb-6 gap-14">
                  <div className="flex flex-col">
                    <span className="text-lg font-normal mb-1 text-[rgb(77,76,76)]">
                      Landline
                    </span>
                    <div className="text-lg font-medium py-1 px-2 border border-gray-200 bg-gray-100 w-[35rem] h-10 rounded-md">
                      {departmentLandline}
                    </div>
                  </div>
                </div>
              </div>

              <span className="text-2xl font-bold text-[rgb(77,76,76)] mt-10 mb-5">
                About Department
              </span>
              <div className="border border-gray-200 bg-gray-100 w-auto h-36 rounded-md">
                <div className="text-xl h-32 font-medium py-1 px-2 overflow-y-auto break-words">
                  {departmentDescription}
                </div>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        // ================================================PERSONAL PROFILE=====================================================
        <Card className="h-[auto] flex flex-col items-center rounded-xl bg-white shadow-xl border border-gray-150 mb-10 mr-6">
          <div className="w-[100%]">
            <img
              src="/coverbg.png"
              alt=""
              className=" h-[12rem] w-[100%] bg-white object-cover"
            />
          </div>
          <div className="mt-[-8rem]">
            {userImage ? (
              <div className="border border-solid border-gray-300 shadow-lg rounded-full w-48 h-48 my-4 flex items-center justify-center overflow-hidden">
                <img
                  src={userImage}
                  alt="User Image"
                  className=" w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="border border-solid border-gray-300 shadow-lg rounded-full w-48 h-48 my-4 py-4 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-24 h-24 text-gray-500"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
            <div className="mb-2 text-center justify-center">
              <div className="text-4xl font-bold text-center mb-4">
                {username}
              </div>
              <span className="text-lg font-normal mb-4 text-[rgb(158,157,157)]">
                Username
              </span>
            </div>
          </div>
          <a
            href="/userprofile/edit"
            className="text-[#ffffff] font-medium text-lg"
          >
            <div
              className="mb-10 rounded-[0.6rem] py-2 px-3 h-[fit-content] w-[10rem] justify-center text-center"
              style={{
                background: "linear-gradient(to left, #8a252c, #AB3510)",
              }}
            >
              EDIT
            </div>
          </a>
          <div className="w-[80rem] h-[100%] border border-gray-200 px-10 py-10 rounded-xl mb-10">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-[rgb(77,76,76)] mb-5">
                Basic Information
              </span>
              <div className="flex flex-col">
                <div className="flex flex-row items-center justify-center w-fit mb-6 gap-14">
                  <div className="flex flex-col">
                    <span className="text-lg font-normal mb-1 text-[rgb(77,76,76)]">
                      First Name
                    </span>
                    <div className="text-lg font-medium py-1 px-2 border border-gray-200 bg-gray-100 w-[35rem] h-10 rounded-md">
                      {firstname}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-normal mb-1 text-[rgb(77,76,76)]">
                      Birthdate
                    </span>
                    <div className="text-lg font-medium py-1 px-2 border border-gray-200 bg-gray-100 w-[35rem] h-10 rounded-md">
                      {birthdate}
                    </div>
                  </div>
                </div>
                <div className="flex flex-row items-center justify-center w-fit mb-6 gap-14">
                  <div className="flex flex-col">
                    <span className="text-lg font-normal mb-1 text-[rgb(77,76,76)]">
                      Last Name
                    </span>
                    <div className="text-lg font-medium py-1 px-2 border border-gray-200 bg-gray-100 w-[35rem] h-10 rounded-md">
                      {lastname}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-normal mb-1 text-[rgb(77,76,76)]">
                      Age
                    </span>
                    <div className="text-lg font-medium py-1 px-2 border border-gray-200 bg-gray-100 w-[35rem] h-10 rounded-md">
                      {age}
                    </div>
                  </div>
                </div>
                <div className="flex flex-row items-center justify-center w-fit mb-6 gap-14">
                  <div className="flex flex-col">
                    <span className="text-lg font-normal mb-1 text-[rgb(77,76,76)]">
                      Email Address
                    </span>
                    <div className="text-lg font-medium py-1 px-2 border border-gray-200 bg-gray-100 w-[35rem] h-10 rounded-md">
                      {email}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-normal mb-1 text-[rgb(77,76,76)]">
                      Role
                    </span>
                    <div className="text-lg font-medium py-1 px-2 border border-gray-200 bg-gray-100 w-[35rem] h-10 rounded-md">
                      {role}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
