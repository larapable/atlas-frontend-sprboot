import { Button, Card, Modal } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import { getSession, useSession } from "next-auth/react";
import React from "react";

export default function EditProfileUsers() {
  const { data: session, status, update } = useSession();

  let user;
  if (session?.user?.name) user = JSON.parse(session?.user?.name as string);

  const [userImage, setUserImage] = useState("");
  const [firstname, setFirstname] = useState("");
  const [age, setAge] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [lastname, setLastname] = useState("");
  const [role, setRole] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");

  const department_id = user?.department_id;
  const user_id = user?.id;
  console.log("User ID Edit User Profile: ", user_id);
  console.log("Department Edit User Profile: ", department_id);
  console.log("User Parsed Edit User Profile: ", user);
  const username = user?.username;
  const email = user?.email;

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
          setLastname(data.lastname);
          setRole(data.role);
          setAge(data.age);
          setBirthdate(data.birthdate);
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

          const { image: userImageData, imageFormat: userImageFormat } = data;
          console.log(
            "Received image data:",
            userImageData,
            "Image format:",
            userImageFormat
          );

          // Check that imageData and imageFormat are correct
          if (!userImageData || !userImageFormat) {
            console.error(
              "Invalid image data or format:",
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

  const handleSave = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:8080/user/update/${username}`, {
        // USBA LANG NI PLEASE
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname: firstname,
          lastname: lastname,
          role: role,
          age: age,
          birthdate: birthdate,
          department_id: department_id,
        }),
      });

      if (res.ok) {
        console.log("Edit successful");
        // Route back to /profile
        window.location.href = "/profile";
      } else {
        console.log("User profile failed.");
      }
    } catch (error) {
      console.log("Error during saving user Profile", error);
    }
  };

  const handleConfirmSave = () => {
    setShowModal(true);
  };
  const handleCancelSave = () => {
    setShowModal(false);
  };

  const handleUserImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Extract the image format from the file type
      const imageFormat = file.type.split("/")[1];

      // Check if user_id is defined
      if (!user_id) {
        console.error("user_id is undefined or not set.");
        return;
      }

      const formData = new FormData();
      formData.append("user_id", user_id);
      formData.append("image", file, file.name);
      formData.append("image_format", imageFormat); // Append the image format to the form data

      try {
        // Upload the image to the server
        const response = await fetch(
          "http://localhost:8080/userImage/insertUserImage",
          {
            method: "POST",
            body: formData,
          }
        );

        if (response.ok) {
          // Image uploaded successfully
          const result = await response.json();
          if (result.message === "User image saved successfully.") {
            console.log("Image saved successfully.");
          } else {
            console.error("Failed to save image:", result.message);
          }
        } else {
          // Handle error response
          console.error("Failed to upload image");
        }
      } catch (error) {
        // Handle network error
        console.error("Network error occurred", error);
      }
    }
  };

  const calculateAge = (birthdate: string) => {
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleBirthdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    const calculatedAge = calculateAge(selectedDate);

    if (calculatedAge < 18) {
      alert("You must be at least 18 years old.");
      setBirthdate("");
      setAge("");
    } else {
      setBirthdate(selectedDate);
      setAge(calculatedAge.toString());
    }
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value);
  };

  return (
    <div className="flex flex-col gap-5">
      <Card className="h-[auto] flex flex-col items-center rounded-xl bg-white shadow-xl border border-gray-150 mb-10 mr-6">
        {/* background image */}
        <div className="w-[100%]">
          <img
            src="/coverbg.png"
            alt=""
            className=" h-[12rem] w-[100%] bg-white object-cover"
          />
        </div>
        {/* Conditionally render the image or the profile icon */}
        <div className="mt-[-8rem]">
          {userImage ? (
            <div className="border border-solid border-gray-300 shadow-lg rounded-full w-48 h-48 my-4 flex items-center justify-center overflow-hidden">
              <img
                src={userImage}
                alt="User Image"
                className="w-full h-full object-cover"
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
          <div className="mt-[-0.5rem] bg-white rounded-full h-6 ml-[5rem]">
            <label htmlFor="imageUpload" className="mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-8 h-6 text-red-800"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
            </label>
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              className="hidden"
              onChange={handleUserImageChange}
            />
          </div>
          <div className="mt-5 mb-2 text-center justify-center">
            <div className="text-4xl font-bold text-center mb-3 mt-5">
              {username}
            </div>
            <span className="text-lg font-normal mb-4 text-[rgb(158,157,157)]">
              Username
            </span>
          </div>
        </div>
        <div className="mt-[-7rem] mb-10">
          <button
            className="rounded-[0.6rem] text-[#ffffff] font-semibold text-lg py-2 px-3 w-36 h-[fit-content] mt-28"
            style={{ background: "linear-gradient(to left, #8a252c, #AB3510)" }}
            onClick={handleConfirmSave}
          >
            Save
          </button>
        </div>

        <div className="w-[80rem] h-[100%] border border-gray-200 px-10 py-10 rounded-xl mb-10">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-[rgb(77,76,76)] mb-5">
              Basic Information
            </span>
            <div className="flex flex-col">
              <div className="flex flex-row items-center justify-center w-fit mb-6 gap-20">
                {/* FirstName */}
                <div className="flex flex-col">
                  <span className="text-lg font-medium mb-1 text-[rgb(77,76,76)]">
                    First Name
                  </span>
                  <input
                    type="text"
                    value={firstname}
                    className="text-lg font-regular border border-gray-200 bg-gray-100 w-[35rem] h-10 rounded-md px-3 py-2 text-[rgb(59,59,59)]"
                    onChange={(e) => setFirstname(e.target.value)}
                    placeholder="Your First Name"
                  />
                </div>
                {/* Birthdate */}
                <div className="flex flex-col">
                  <span className="text-lg font-medium mb-1 text-[rgb(77,76,76)]">
                    Birthdate
                  </span>
                  <input
                    type="date"
                    value={birthdate}
                    className="text-lg font-regular border border-gray-200 bg-gray-100 w-[35rem] h-10 rounded-md px-3 py-2 text-[rgb(59,59,59)]"
                    // onChange={(e) => setBirthdate(e.target.value)}
                    onChange={handleBirthdateChange}
                  />
                </div>
              </div>
              <div className="flex flex-row items-center justify-center w-fit mb-6 gap-20">
                {/* Last Name */}
                <div className="flex flex-col">
                  <span className="text-lg font-medium mb-1 text-[rgb(77,76,76)]">
                    Last Name
                  </span>
                  <input
                    type="text"
                    value={lastname}
                    className="text-lg font-regular border border-gray-200 bg-gray-100 w-[35rem] h-10 rounded-md px-3 py-2 text-[rgb(59,59,59)]"
                    onChange={(e) => setLastname(e.target.value)}
                    placeholder="Your Last Name"
                  />
                </div>
                {/* Age */}
                <div className="flex flex-col">
                  <span className="text-lg font-medium mb-1 text-[rgb(77,76,76)]">
                    Age
                  </span>
                  <input
                    type="text"
                    value={age}
                    className="text-lg font-regular border border-gray-200 bg-gray-100 w-[35rem] h-10 rounded-md px-3 py-2 text-[rgb(59,59,59)]"
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Your Age"
                    readOnly
                  />
                </div>
              </div>
              <div className="flex flex-row items-center justify-center w-fit mb-6 gap-20">
                {/* Email address */}
                {/* <div className="flex flex-col">
                  <span className="text-lg font-medium mb-1 text-[rgb(77,76,76)]">Email Address</span>
                  <input
                    type="text"
                    value={emailAddress}
                    className="text-lg font-regular border border-gray-200 bg-gray-100 w-[35rem] h-10 rounded-md px-3 py-2 text-[rgb(59,59,59)]"
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="Your Email Address"
                  />
                </div> */}
                <div className="flex flex-col">
                  <span className="text-lg font-normal mb-1 text-[rgb(77,76,76)]">
                    Email
                  </span>
                  <div className="text-lg font-bold border border-gray-300 bg-gray-200 py-1 px-2 w-[35rem] h-10 rounded-md">
                    {email}
                  </div>
                </div>
                {/* Role */}
                <div className="flex flex-col">
                  <span className="text-lg font-medium mb-1 text-[rgb(77,76,76)]">
                    Role
                  </span>
                  <select
                    value={role}
                    onChange={handleRoleChange}
                    className="text-lg font-regular border border-gray-200 bg-gray-100 w-[35rem] h-10 rounded-md px-3 py-2 text-[rgb(59,59,59)]"
                  >
                    <option value="" disabled>
                      Select Role
                    </option>
                    <option value="Head Officer">HEAD OFFICER</option>
                    <option value="Faculty">FACULTY</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <div className="flex flex-col items-center justify-center h-full">
          <div className="bg-white p-8 rounded-lg shadow-md h-72 w-[40rem] text-center relative">
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
            <p className="text-3xl font-bold mb-4">Save Changes?</p>
            <p className="text-xl mb-4 mt-10">
              {confirmationMessage
                ? confirmationMessage
                : "Looks like you've made changes. Do you want to save these changes?"}
            </p>
            <div className="flex justify-center gap-10 mt-12 mb-10">
              <Button
                onClick={handleCancelSave}
                className="break-words font-semibold text-[1.2rem] text-[#962203] rounded-[0.6rem] pt-[0.5rem] pb-[0.5rem] pr-[2.2rem] pl-[2.2rem] bg-[#ffffff] border border-[#962203] cursor-pointer hover:bg-[#962203] hover:text-[#ffffff]"
              >
                No, Cancel
              </Button>
              <Button
                href="/profile"
                onClick={handleSave}
                className="break-words font-semibold text-[1.2rem] text-[#ffffff] w-[11rem] border-none rounded-[0.6rem] pt-[0.5rem] pb-[0.5rem] pr-[2.2rem] pl-[2.2rem] cursor-pointer"
                style={{
                  background: "linear-gradient(to left, #8a252c, #AB3510)",
                }}
              >
                Yes, Save
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
