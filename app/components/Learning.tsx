"use client";
import { useSession } from "next-auth/react";
import Navbar from "../components/Navbar";
import React, { useState, ChangeEvent, KeyboardEvent, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";

interface LearningScorecard {
  id: number;
  target_code: string;
  startDate: Date;
  completionDate: Date;
  office_target: string;
  status: string;
  key_performance_indicator: string;
  target_performance: string;
  actual_performance: string;
}
export default function Learning() {
  const { data: session, status, update } = useSession();
  console.log("useSession Hook session object", session);
  let user;
  if (session?.user?.name) user = JSON.parse(session?.user?.name as string);
  const department_id = user?.department_id;

  // Open modal
  const [learningModalOpen, setLearningModalOpen] = useState(false);

  // Learning state variables
  const [learningTargetCode, setLearningTargetCode] = useState("");
  const [learningStartDate, setLearningStartDate] = useState<Date | null>(null);
  const [learningTargetCompletionDate, setLearningTargetCompletionDate] =
    useState<Date | null>(null);
  const [learningOfficeTarget, setLearningOfficeTarget] = useState("");
  const [learningTargetPerformance, setLearningTargetPerformance] =
    useState("");
  const [learningStatus, setLearningStatus] = useState("");
  const [learningKPI, setLearningKPI] = useState("");
  const [learningActualPerformance, setLearningActualPerformance] =
    useState("");
  const [learningLevelOfAttainment, setLearningLevelOfAttainment] =
    useState("");
  const [learningSavedScorecards, setLearningSavedScorecards] = useState<
    LearningScorecard[]
  >([]);

  // Track edit mode
  const [learningEditMode, setLearningEditMode] = useState<number | null>(null);

  const handleLearningCloseModal = () => {
    setLearningModalOpen(false);
    setLearningEditMode(null);
  };

  const handleLearningAddMoreScorecard = () => {
    setLearningEditMode(null);
    setLearningModalOpen(true);
    setLearningTargetCode("");
    setLearningStartDate(null);
    setLearningTargetCompletionDate(null);
    setLearningOfficeTarget("");
    setLearningTargetPerformance("");
    setLearningStatus("");
    setLearningKPI("");
    setLearningActualPerformance("");
    setLearningLevelOfAttainment("");
  };

  const calculateLearningLevelOfAttainment = (
    actualLearningPerformance: number,
    targetLearningPerformance: number
  ): string => {
    const levelOfAttainmentLearning =
      (actualLearningPerformance / targetLearningPerformance) * 100;
    return levelOfAttainmentLearning.toFixed(2) + "%";
  };

  const handleLearningActualPerformanceChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    //Allow backspacea to clear the input
    if (value === "") {
      setLearningActualPerformance("");
      setLearningLevelOfAttainment("0%");
    } else {
      const newActualPerformance = parseFloat(value);
      // Check if the value is a number or not NaN
      if (!isNaN(newActualPerformance) && newActualPerformance <= 100) {
        setLearningActualPerformance(newActualPerformance.toString());
        // Assuming stakeholderTargetPerformance is already set from the database
        const targetPerformance = parseFloat(learningTargetPerformance);
        if (targetPerformance > 0) {
          // Make sure not to divide by zero
          const newLevelOfAttainment = calculateLearningLevelOfAttainment(
            newActualPerformance,
            targetPerformance
          );
          setLearningLevelOfAttainment(newLevelOfAttainment);
        }
      }
    }
  };

  const handleLearningSaveScorecard = async () => {
    // Check if all fields are filled
    if (
      !learningTargetCode ||
      !learningStartDate ||
      !learningTargetCompletionDate ||
      !learningOfficeTarget ||
      !learningTargetPerformance ||
      !learningStatus ||
      !learningKPI ||
      !learningActualPerformance ||
      parseFloat(learningTargetPerformance) > 100 ||
      parseFloat(learningActualPerformance) > 100
    ) {
      toast.error(
        "Please fill in all fields and ensure performance values do not exceed 100."
      );
      return;
    }

    try {
      // Send the POST request to the server
      const response = await fetch(
        "http://localhost:8080/bsc/learningBsc/insert",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            department: { id: department_id },
            target_code: learningTargetCode,
            startDate: learningStartDate,
            completionDate: learningTargetCompletionDate,
            office_target: learningOfficeTarget,
            status: learningStatus,
            key_performance_indicator: learningKPI,
            target_performance: learningTargetPerformance,
            actual_performance: learningActualPerformance,
          }),
        }
      );
      // Parse the JSON response
      const result = await response.json();

      // Handle the response based on the status code
      if (response.ok) {
        console.log("Learning scorecard data submitted successfully:", result);
        // Update the saved scorecards
        const newScorecard = { ...result.data };
        setLearningSavedScorecards((prevScorecards) => [
          ...prevScorecards,
          newScorecard,
        ]);
        // Set the edit mode to the new scorecard's ID
        setLearningEditMode(newScorecard.id);
        // Close the modal after saving
        setLearningModalOpen(false);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error submitting learning scorecard data:", error);
      // Handle network errors here
    }

    // Reset modal state for the next input
    setLearningModalOpen(false);
    setLearningEditMode(null);
    setLearningTargetCode("");
    setLearningStartDate(null);
    setLearningTargetCompletionDate(null);
    setLearningOfficeTarget("");
    setLearningTargetPerformance("");
    setLearningStatus("");
    setLearningKPI("");
    setLearningActualPerformance("");
    setLearningLevelOfAttainment("");
  };

  const handleLearningUpdateScorecard = async () => {
    if (!learningEditMode) return; // Exit if not in edit mode

    try {
      const response = await fetch(
        `http://localhost:8080/bsc/learning/update/${learningEditMode}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: learningEditMode,
            target_code: learningTargetCode,
            startDate: learningStartDate,
            completionDate: learningTargetCompletionDate,
            office_target: learningOfficeTarget,
            status: learningStatus,
            key_performance_indicator: learningKPI,
            target_performance: learningTargetPerformance,
            actual_performance: learningActualPerformance,
          }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        const updatedScorecard = result.data;
        setLearningSavedScorecards((prevScorecards) =>
          prevScorecards.map((scorecard) =>
            scorecard.id === learningEditMode ? updatedScorecard : scorecard
          )
        );
        //toast.success("Scorecard updated successfully.");
        window.location.reload();
      } else {
        toast.error(`Failed to update scorecard: ${result.message}`);
      }
    } catch (error) {
      toast.error("Error updating scorecard. Please try again.");
    }

    // Reset modal state after update
    setLearningModalOpen(false);
    setLearningEditMode(null);
    setLearningTargetCode("");
    setLearningStartDate(null);
    setLearningTargetCompletionDate(null);
    setLearningOfficeTarget("");
    setLearningStatus("");
    setLearningKPI("");
    setLearningTargetPerformance("");
    setLearningActualPerformance("");
  };

  // Determine which function to call when the save button is clicked
  const handleSaveButtonClick = () => {
    if (learningEditMode) {
      handleLearningUpdateScorecard();
    } else {
      handleLearningSaveScorecard();
    }
  };

  // Fetch the saved financial scorecards from the server
  useEffect(() => {
    const fetchLearningScorecards = async () => {
      if (!department_id) {
        console.log("Department ID is not available yet.");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8080/bsc/learning/get/${department_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch learning scorecards");
        }
        const data = await response.json();
        setLearningSavedScorecards(data);
      } catch (error) {
        console.error("Error fetching learning scorecards:", error);
      }
    };

    fetchLearningScorecards();
  }, [department_id]);

  const handleStartDateChange = (date: Date | null) => {
    console.log("Selected Start Date", date);
    if (date) {
      // Convert the selected date to UTC before saving it
      const utcDate = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
      );
      setLearningStartDate(utcDate);
    } else {
      setLearningStartDate(null);
    }
  };

  const handleCompletionDateChange = (date: Date | null) => {
    console.log("Selected Start Date", date);
    if (date) {
      // Convert the selected date to UTC before saving it
      const utcDate = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
      );
      setLearningTargetCompletionDate(utcDate);
    } else {
      setLearningTargetCompletionDate(null);
    }
  };

  const handleLearningEditScorecard = (id: number) => {
    const scorecardToEdit = learningSavedScorecards.find(
      (scorecard) => scorecard.id === id
    );
    if (scorecardToEdit) {
      // Convert the start date and completion date to the local timezone before setting them
      const startDate = new Date(scorecardToEdit.startDate);
      startDate.setMinutes(
        startDate.getMinutes() - startDate.getTimezoneOffset()
      );
      setLearningStartDate(startDate);

      const completionDate = new Date(scorecardToEdit.completionDate);
      completionDate.setMinutes(
        completionDate.getMinutes() - completionDate.getTimezoneOffset()
      );
      setLearningTargetCompletionDate(completionDate);

      // Set the other fields
      setLearningTargetCode(scorecardToEdit.target_code);
      setLearningOfficeTarget(scorecardToEdit.office_target);
      setLearningStatus(scorecardToEdit.status);
      setLearningKPI(scorecardToEdit.key_performance_indicator);
      setLearningTargetPerformance(scorecardToEdit.target_performance);
      setLearningActualPerformance(scorecardToEdit.actual_performance);
      setLearningLevelOfAttainment(
        calculateLearningLevelOfAttainment(
          parseFloat(scorecardToEdit.actual_performance),
          parseFloat(scorecardToEdit.target_performance)
        )
      );

      // Open the modal and enter edit mode
      setLearningEditMode(id);
      setLearningModalOpen(true);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="rounded-[0.3rem] bg-[#8A252C] relative flex flex-row justify-between pt-2 pl-3 pb-2 w-[100%]">
        <span className="m-[0_0.8rem_0_0] w-[58.7rem] break-words font-bold text-[1.3rem] text-[#FFFFFF]">
          Learning & Growth Scorecard Overview
        </span>
      </div>
      <div className="flex flex-row self-start box-sizing-border mt-5 mb-5">
        {/* Add More Scorecard Button */}
        <button
          className="flex flex-row break-words font-normal text-[1rem] text-[#686666]"
          onClick={handleLearningAddMoreScorecard}
        >
          <div className="text-[#EFAF21] mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 h-8"
            >
              <path
                fill-rule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div className="mt-1">Add more objectives</div>
        </button>
        {/* Other perspective toggles */}
      </div>
      <div className="bg-[#ffffff] gap-2 w-[100%] h-[100%] flex flex-col pt-4 pr-3 pb-6 box-sizing-border rounded-lg border border-yellow-500 overflow-y-auto overflow-x-hidden">
        {learningSavedScorecards &&
          learningSavedScorecards.length > 0 &&
          learningSavedScorecards.map((item) => {
            if (!item) return null;
            const levelOfAttainment = calculateLearningLevelOfAttainment(
              parseFloat(item.actual_performance),
              parseFloat(item.target_performance)
            );

            // Validate the level of attainment to be between 1 and 100
            const validatedLevelOfAttainment = Math.min(
              Math.max(parseFloat(levelOfAttainment), 1),
              100
            );

            const progressColor =
              parseFloat(levelOfAttainment) >= 100
                ? "bg-green-600" // A darker shade of green to indicate full completion
                : parseFloat(levelOfAttainment) >= 50
                ? "bg-green-500"
                : "bg-red-500";

            const progressBarWidth = `${
              (validatedLevelOfAttainment / 100) * 20
            }rem`; // Adjust the width of the progress bar

            return (
              <div
                key={item.id}
                className="bg-[#ffffff] relative ml-2 flex flex-row pt-4 pb-4 w-[90rem] h-auto box-sizing-border"
              >
                <div className="mr-5 gap-10">
                  <p className="flex flex-row">
                    <div className="w-[45rem] flex flex-row">
                      <span className="font-bold bg-yellow-200 pt-2 pb-2 pr-1 pl-2 text-[#962203] mt-[-0.5rem] mr-3 ml-1">
                        {item.target_code || "N/A"}:
                      </span>
                      <span className="font-regular">
                        {learningOfficeTarget.length > 60
                          ? `${(item.office_target || "N/A").substring(
                              0,
                              60
                            )}...`
                          : item.office_target || "N/A"}{" "}
                      </span>
                    </div>
                    <div className="flex items-center w-[35rem]">
                      <span className="font-regular mr-5 ml-10">
                        {item.completionDate
                          ? new Date(item.completionDate).toLocaleDateString()
                          : "N/A"}
                      </span>
                      <div
                        className={`h-5 ${progressColor}`}
                        style={{ width: progressBarWidth }}
                      ></div>
                    </div>
                    <div className="flex items-center ml-[-3rem]">
                      <span className="font-bold ">
                        {validatedLevelOfAttainment}%{" "}
                      </span>
                      <div className="font-bold border rounded-lg bg-yellow-200 border-yellow-500 pt-1 pr-2 pl-2 ml-5 mt-[-0.5rem]  ">
                        {item.status || "N/A"}{" "}
                      </div>
                    </div>
                  </p>
                </div>
                <button onClick={() => handleLearningEditScorecard(item.id)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                </button>
              </div>
            );
          })}
      </div>
      {learningModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-white p-8 rounded-lg z-10 h-[50rem] w-[96rem]">
            <div className="flex flex-row">
              <h2 className="text-2xl mb-10 font-semibold">
                Learning & Growth
              </h2>
              <button
                onClick={handleLearningCloseModal}
                className="ml-[77rem] mt-[-5rem] text-gray-500 hover:text-gray-700"
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
            </div>
            <div className="flex flex-row gap-32 mb-10">
              <div className="flex flex-col">
                <span className="mr-3 break-words font-regular text-md text-[#000000]">
                  Target Code
                  <span className="text-[#DD1414]">*</span>
                </span>
                <input
                  type="text"
                  value={learningTargetCode}
                  className="border border-gray-300 px-3 py-2 mt-1 rounded-lg w-[25rem]"
                  onChange={(e) => setLearningTargetCode(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <span className="mr-3 break-words font-regular text-md text-[#000000]">
                  Start Date
                </span>
                <DatePicker
                  key={learningStartDate?.toString()}
                  selected={learningStartDate}
                  onChange={handleStartDateChange}
                  minDate={new Date()}
                  placeholderText="MM-DD-YYYY"
                  className="border border-gray-300 px-3 py-2 mt-1 rounded-lg w-[25rem]"
                />
              </div>
              <div className="flex flex-col">
                <span className="mr-3 break-words font-regular text-md text-[#000000]">
                  Target Completion Date
                </span>
                <DatePicker
                  key={learningTargetCompletionDate?.toString()}
                  selected={learningTargetCompletionDate}
                  onChange={handleCompletionDateChange}
                  minDate={new Date()}
                  placeholderText="MM-DD-YYYY"
                  className="border border-gray-300 px-3 py-2 mt-1 rounded-lg w-[25rem]"
                />
              </div>
            </div>
            <span className="mr-3 break-words font-regular text-md text-[#000000] mt-10">
              Office Target
              <span className="text-[#DD1414]">*</span>
            </span>
            <textarea
              value={learningOfficeTarget}
              className="border border-gray-300 px-3 py-2 pl-2 pr-2 mt-1 rounded-lg w-[91rem] h-[10rem]"
              onChange={(e) => setLearningOfficeTarget(e.target.value)}
            />
            <div className=" mt-10 flex flex-row gap-36">
              <div className="flex flex-col">
                <span className="mr-3 break-words font-regular text-md text-[#000000]">
                  Status
                  <span className="text-[#DD1414]">*</span>
                </span>
                <select
                  value={learningStatus}
                  className="border border-gray-300 px-3 py-2 mt-1 rounded-lg w-[41rem]"
                  onChange={(e) => setLearningStatus(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="Uninitiated">Uninitiated</option>
                  <option value="Initiated">Initiated</option>
                  <option value="Achieved">Achieved</option>
                </select>
              </div>
              {/* add KPI here */}
              <div className="flex flex-col">
                <span className="mr-3 break-words font-regular text-md text-[#000000]">
                  Key Performance Indicator
                  <span className="text-[#DD1414]">*</span>
                </span>
                <input
                  type="text"
                  value={learningKPI}
                  className="border border-gray-300 px-3 py-2 mt-1 rounded-lg w-[41rem]"
                  onChange={(e) => setLearningKPI(e.target.value)}
                />
              </div>
            </div>
            <div className=" mt-10 flex flex-row gap-36">
              <div className="flex flex-col">
                <span className="mr-3 break-words font-regular text-md text-[#000000]">
                  Target Performance
                  <span className="text-[#DD1414]">*</span>
                </span>
                <span className="mr-3 break-words font-regular italic text-sm text-[#2c2c2c]">
                  Please enter the target performance as a percentage without
                  including the &apos;%&apos; symbol.
                </span>
                <input
                  type="number"
                  value={learningTargetPerformance}
                  className="border border-gray-300 px-3 py-2 mt-1 rounded-lg w-[41rem]"
                  min="1"
                  max="100"
                  onChange={(e) => setLearningTargetPerformance(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <span className="mr-3 break-words font-regular text-md text-[#000000]">
                  Actual Performance
                  <span className="text-[#DD1414]">*</span>
                </span>
                <span className="mr-3 break-words font-regular italic text-sm text-[#2c2c2c]">
                  Please enter the actual performance as a percentage without
                  including the &apos;%&apos; symbol.
                </span>
                <input
                  type="number"
                  value={learningActualPerformance}
                  className="border border-gray-300 px-3 py-2 mt-1 rounded-lg w-[41rem]"
                  min="1"
                  max="100"
                  onChange={handleLearningActualPerformanceChange}
                />
              </div>
            </div>
            <div className="flex flex-row justify-center mt-10 gap-10">
              <button
                onClick={handleSaveButtonClick}
                className="bg-[#FAD655] text-[#962203] font-semibold hover:bg-white border hover:border-yellow-500 px-4 py-2 mt-4 rounded-lg w-40"
              >
                {learningEditMode ? "Edit" : "Save"}
              </button>
              <button
                onClick={handleLearningCloseModal}
                className="bg-[#FAD655] text-[#962203] font-semibold hover:bg-white border hover:border-yellow-500 px-4 py-2 mt-4 rounded-lg w-40"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
