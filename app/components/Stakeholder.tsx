"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";

interface StakeholderScorecard {
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

export default function Stakeholder() {
  const { data: session, status, update } = useSession();
  console.log("useSession Hook session object", session);
  let user;
  if (session?.user?.name) user = JSON.parse(session?.user?.name as string);
  const department_id = user?.department_id;

  // open modal
  const [stakeholderModalOpen, setStakeholderModalOpen] = useState(false);

  // stakeholder values
  const [stakeholderTargetCode, setStakeholderTargetCode] = useState("");
  const [stakeholderStartDate, setStakeholderStartDate] = useState<Date | null>(
    null
  );
  const [stakeholderTargetCompletionDate, setStakeholderTargetCompletionDate] =
    useState<Date | null>(null);
  const [stakeholderOfficeTarget, setStakeholderOfficeTarget] = useState("");
  const [stakeholderTargetPerformance, setStakeholderTargetPerformance] =
    useState("");
  const [stakeholderStatus, setStakeholderStatus] = useState("");
  const [stakeholderKPI, setStakeholderKPI] = useState("");
  const [stakeholderActualPerformance, setStakeholderActualPerformance] =
    useState("");
  const [stakeholderLevelOfAttainment, setStakeholderLevelOfAttainment] =
    useState("");

  const [stakeholderSavedScorecards, setStakeholderSavedScorecards] = useState<
    StakeholderScorecard[]
  >([]);

  const [stakeholderEditMode, setStakeholderEditMode] = useState<number | null>(
    null
  ); // Track edit mode

  const handleStakeholderCloseModal = () => {
    setStakeholderModalOpen(false);
    setStakeholderEditMode(null); // Reset edit mode
  };

  const handleStakeholderAddMoreScorecard = () => {
    setStakeholderTargetCode("");
    setStakeholderStartDate(null);
    setStakeholderTargetCompletionDate(null);
    setStakeholderOfficeTarget("");
    setStakeholderTargetPerformance("");
    setStakeholderStatus("");
    setStakeholderKPI("");
    setStakeholderActualPerformance("");
    setStakeholderLevelOfAttainment("");
    setStakeholderEditMode(null);
    setStakeholderModalOpen(true);
  };

  const calculateStakeholderLevelOfAttainment = (
    actualStakeholderPerformance: number,
    targetStakeholderPerformance: number
  ): string => {
    const levelOfAttainmentStakeholder =
      (actualStakeholderPerformance / targetStakeholderPerformance) * 100;
    return levelOfAttainmentStakeholder.toFixed(2) + "%";
  };

  // display the updated level of attainment base sa actual performance
  const handleStakeholderActualPerformanceChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    //Allow backspacea to clear the input
    if (value === "") {
      setStakeholderLevelOfAttainment("");
      setStakeholderActualPerformance("0%");
    } else {
      const newActualPerformance = parseFloat(value);
      // Check if the value is a number or not NaN
      if (!isNaN(newActualPerformance) && newActualPerformance <= 100) {
        setStakeholderActualPerformance(newActualPerformance.toString());
        // Assuming stakeholderTargetPerformance is already set from the database
        const targetPerformance = parseFloat(stakeholderTargetPerformance);
        if (targetPerformance > 0) {
          // Make sure not to divide by zero
          const newLevelOfAttainment = calculateStakeholderLevelOfAttainment(
            newActualPerformance,
            targetPerformance
          );
          setStakeholderLevelOfAttainment(newLevelOfAttainment);
        }
      }
    }
  };

  // Save Stakeholder Inputs
  const handleStakeholderSaveScorecard = async () => {
    // Check if all fields are filled
    if (
      !stakeholderTargetCode ||
      !stakeholderStartDate ||
      !stakeholderTargetCompletionDate ||
      !stakeholderOfficeTarget ||
      !stakeholderTargetPerformance ||
      !stakeholderStatus ||
      !stakeholderKPI ||
      !stakeholderActualPerformance ||
      parseFloat(stakeholderTargetPerformance) > 100 ||
      parseFloat(stakeholderActualPerformance) > 100
    ) {
      toast.error(
        "Please fill in all fields and ensure performance values do not exceed 100."
      );
      return;
    }

    try {
      // Send the POST request to the server
      const response = await fetch(
        "http://localhost:8080/bsc/stakeholderBsc/insert",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            department: { id: department_id },
            target_code: stakeholderTargetCode,
            office_target: stakeholderOfficeTarget,
            startDate: stakeholderStartDate,
            completionDate: stakeholderTargetCompletionDate,
            status: stakeholderStatus,
            key_performance_indicator: stakeholderKPI,
            target_performance: stakeholderTargetPerformance,
            actual_performance: stakeholderActualPerformance,
          }),
        }
      );
      // Parse the JSON response
      const result = await response.json();
      console.log("Result", result);

      // Handle the response based on the status code
      if (response.ok) {
        console.log(
          "Stakeholder scorecard data submitted successfully:",
          result
        );
        // Update the saved scorecards
        const newScorecard = { ...result.data };
        setStakeholderSavedScorecards((prevScorecards) => [
          ...prevScorecards,
          newScorecard,
        ]);
        // Set the edit mode to the new scorecard's ID
        setStakeholderEditMode(newScorecard.id);
        // Close the modal after saving
        setStakeholderModalOpen(false);
        window.location.reload();
      } else {
        toast.error(
          "Failed to submit stakeholder scorecard data:",
          result.message
        );
        // Perform any error actions, like alerts or state updates
      }
    } catch (error) {
      console.error("Error submitting stakeholder scorecard data:", error);
      // Handle network errors here
    }
    // Reset modal state for the next input
    setStakeholderModalOpen(false);
    setStakeholderEditMode(null);
    setStakeholderTargetCode("");
    setStakeholderStartDate(null);
    setStakeholderTargetCompletionDate(null);
    setStakeholderOfficeTarget("");
    setStakeholderStatus("");
    setStakeholderKPI("");
    setStakeholderTargetPerformance("");
    setStakeholderActualPerformance("");
  };

  const handleStakeholderUpdateScorecard = async () => {
    if (!stakeholderEditMode) return; // Exit if not in edit mode

    try {
      const response = await fetch(
        `http://localhost:8080/bsc/stakeholder/update/${stakeholderEditMode}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: stakeholderEditMode,
            target_code: stakeholderTargetCode,
            startDate: stakeholderStartDate,
            completionDate: stakeholderTargetCompletionDate,
            office_target: stakeholderOfficeTarget,
            status: stakeholderStatus,
            key_performance_indicator: stakeholderKPI,
            target_performance: stakeholderTargetPerformance,
            actual_performance: stakeholderActualPerformance,
          }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        const updatedScorecard = result.data;
        setStakeholderSavedScorecards((prevScorecards) =>
          prevScorecards.map((scorecard) =>
            scorecard.id === stakeholderEditMode ? updatedScorecard : scorecard
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
    setStakeholderModalOpen(false);
    setStakeholderEditMode(null);
    setStakeholderTargetCode("");
    setStakeholderStartDate(null);
    setStakeholderTargetCompletionDate(null);
    setStakeholderOfficeTarget("");
    setStakeholderStatus("");
    setStakeholderKPI("");
    setStakeholderTargetPerformance("");
    setStakeholderActualPerformance("");
  };

  // Determine which function to call when the save button is clicked
  const handleSaveButtonClick = () => {
    if (stakeholderEditMode) {
      handleStakeholderUpdateScorecard();
    } else {
      handleStakeholderSaveScorecard();
    }
  };

  // Fetch the saved financial scorecards from the server
  useEffect(() => {
    const fetchStakeholderScorecards = async () => {
      if (!department_id) {
        console.log("Department ID is not available yet.");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8080/bsc/stakeholder/get/${department_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch stakeholder scorecards");
        }
        const data = await response.json();
        setStakeholderSavedScorecards(data);
      } catch (error) {
        console.error("Error fetching stakeholder scorecards:", error);
      }
    };

    fetchStakeholderScorecards();
  }, [department_id]);

  const handleStartDateChange = (date: Date | null) => {
    console.log("Selected Start Date", date);
    if (date) {
      // Convert the selected date to UTC before saving it
      const utcDate = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
      );
      setStakeholderStartDate(utcDate);
    } else {
      setStakeholderStartDate(null);
    }
  };

  const handleCompletionDateChange = (date: Date | null) => {
    console.log("Selected Start Date", date);
    if (date) {
      // Convert the selected date to UTC before saving it
      const utcDate = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
      );
      setStakeholderTargetCompletionDate(utcDate);
    } else {
      setStakeholderTargetCompletionDate(null);
    }
  };

  const handleStakeholderEditScorecard = (id: number) => {
    const scorecardToEdit = stakeholderSavedScorecards.find(
      (scorecard) => scorecard.id === id
    );
    if (scorecardToEdit) {
      // Convert the start date and completion date to the local timezone before setting them
      const startDate = new Date(scorecardToEdit.startDate);
      startDate.setMinutes(
        startDate.getMinutes() - startDate.getTimezoneOffset()
      );
      setStakeholderStartDate(startDate);

      const completionDate = new Date(scorecardToEdit.completionDate);
      completionDate.setMinutes(
        completionDate.getMinutes() - completionDate.getTimezoneOffset()
      );
      setStakeholderTargetCompletionDate(completionDate);

      // Set the other fields
      setStakeholderTargetCode(scorecardToEdit.target_code);
      setStakeholderOfficeTarget(scorecardToEdit.office_target);
      setStakeholderStatus(scorecardToEdit.status);
      setStakeholderKPI(scorecardToEdit.key_performance_indicator);
      setStakeholderTargetPerformance(scorecardToEdit.target_performance);
      setStakeholderActualPerformance(scorecardToEdit.actual_performance);
      setStakeholderLevelOfAttainment(
        calculateStakeholderLevelOfAttainment(
          parseFloat(scorecardToEdit.actual_performance),
          parseFloat(scorecardToEdit.target_performance)
        )
      );

      // Open the modal and enter edit mode
      setStakeholderEditMode(id);
      setStakeholderModalOpen(true);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="rounded-[0.3rem] bg-[#8A252C] relative flex flex-row justify-between pt-2 pl-3 pb-2 w-[100%]">
        <span className="m-[0_0.8rem_0_0] w-[58.7rem] break-words font-bold text-[1.3rem] text-[#FFFFFF]">
          Stakeholder Scorecard Overview
        </span>
      </div>
      <div className="flex flex-row self-start box-sizing-border mt-5 mb-5">
        {/* Add More Scorecard Button */}
        <button
          className="flex flex-row break-words font-normal text-[1rem] text-[#686666]"
          onClick={handleStakeholderAddMoreScorecard}
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
        {stakeholderSavedScorecards &&
          stakeholderSavedScorecards.length > 0 &&
          stakeholderSavedScorecards.map((item) => {
            if (!item) return null;
            const levelOfAttainment = calculateStakeholderLevelOfAttainment(
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
                        {stakeholderOfficeTarget.length > 60
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
                <button onClick={() => handleStakeholderEditScorecard(item.id)}>
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

      {stakeholderModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-white p-8 rounded-lg z-10 h-[50rem] w-[96rem]">
            <div className="flex flex-row">
              <h2 className="text-2xl mb-10 font-semibold">Stakeholder</h2>
              <button
                onClick={handleStakeholderCloseModal}
                className="ml-[82rem] mt-[-5rem] text-gray-500 hover:text-gray-700"
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
                  value={stakeholderTargetCode}
                  className="border border-gray-300 px-3 py-2 mt-1 rounded-lg w-[25rem]"
                  onChange={(e) => setStakeholderTargetCode(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <span className="mr-3 break-words font-regular text-md text-[#000000]">
                  Start Date
                </span>
                <DatePicker
                  key={stakeholderStartDate?.toString()}
                  selected={stakeholderStartDate}
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
                  key={stakeholderTargetCompletionDate?.toString()}
                  selected={stakeholderTargetCompletionDate}
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
              value={stakeholderOfficeTarget}
              className="border border-gray-300 px-3 py-2 pl-2 pr-2 mt-1 rounded-lg w-[91rem] h-[10rem]"
              onChange={(e) => setStakeholderOfficeTarget(e.target.value)}
            />
            <div className=" mt-10 flex flex-row gap-36">
              <div className="flex flex-col">
                <span className="mr-3 break-words font-regular text-md text-[#000000]">
                  Status
                  <span className="text-[#DD1414]">*</span>
                </span>
                <select
                  value={stakeholderStatus}
                  className="border border-gray-300 px-3 py-2 mt-1 rounded-lg w-[41rem]"
                  onChange={(e) => setStakeholderStatus(e.target.value)}
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
                  value={stakeholderKPI}
                  className="border border-gray-300 px-3 py-2 mt-1 rounded-lg w-[41rem]"
                  onChange={(e) => setStakeholderKPI(e.target.value)}
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
                  value={stakeholderTargetPerformance}
                  className="border border-gray-300 px-3 py-2 mt-1 rounded-lg w-[41rem]"
                  min="1"
                  max="100"
                  onChange={(e) =>
                    setStakeholderTargetPerformance(e.target.value)
                  }
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
                  value={stakeholderActualPerformance}
                  className="border border-gray-300 px-3 py-2 mt-1 rounded-lg w-[41rem]"
                  min="1"
                  max="100"
                  onChange={handleStakeholderActualPerformanceChange}
                />
              </div>
            </div>
            <div className="flex flex-row justify-center mt-10 gap-10">
              <button
                onClick={handleSaveButtonClick}
                className="bg-[#FAD655] text-[#962203] font-semibold hover:bg-white border hover:border-yellow-500 px-4 py-2 mt-4 rounded-lg w-40"
              >
                {stakeholderEditMode ? "Edit" : "Save"}
              </button>
              <button
                onClick={handleStakeholderCloseModal}
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
