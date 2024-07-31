"use client";
import { Button, Card, Modal, Select, MenuItem } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

interface ReportFinancial {
  id: number;
  actions: string;
  semester: string;
  budget: number;
  incharge: string;
  ofi: string;
}
interface FinancialScorecard {
  id: number;
  target_code: string;
  start_date: Date;
  completion_date: Date;
  office_target: string;
  status: string;
  key_performance_indicator: string;
  target_performance: string;
  actual_performance: string;
}

const ReportFinancial = () => {
  const { data: session } = useSession();

  let user;
  if (session?.user?.name) user = JSON.parse(session.user?.name as string);
  const department_id = user?.department_id;
  console.log(department_id);

  const username = user?.username;

  // const [financialID, setFinancialID] = useState(0);
  // const [financialSemester, setFinancialSemester] = useState("");
  // const [financialActions, setFinancialActions] = useState("");
  // const [financialBudget, setFinancialBudget] = useState<number>(0);
  // const [financialIncharge, setFinancialIncharge] = useState("");
  // const [financialOfi, setFinancialOfi] = useState("");

  const [financialReports, setFinancialReports] = useState<ReportFinancial[]>(
    []
  );
  const [financialScorecards, setFinancialScorecards] = useState<
    FinancialScorecard[]
  >([]);
  const [openModal, setOpenModal] = useState(false); // State to control the modal
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  const getAllFinancial = async (department_id: number) => {
    if (!department_id) {
      console.log("Department ID is not available yet.");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:8080/reportFinancial/getAllFinancialReport`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch financial reports");
      }
      const data = await response.json();
      console.log("response data:", data);
      setFinancialReports(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching financial reports:", error);
    }
  };

  useEffect(() => {
    getAllFinancial(department_id);
  }, [department_id, session]);

  const handleSaveFinancialReports = async () => {
    if (
      financialReports.some(
        (report) =>
          !report.semester ||
          !report.actions ||
          report.budget <= 0 ||
          !report.incharge ||
          !report.ofi
      )
    ) {
      toast.error("Please fill out all the fields.");
      return;
    }

    if (!department_id) {
      console.log("Department ID is not available.");
      return;
    }

    try {
      // Prepare the data to send
      const dataToSend = financialReports.map((report) => ({
        // Assuming the backend expects fields like id, actions, semester, budget, etc.
        department: { id: department_id }, // Include department with its ID
        actions: report.actions,
        semester: report.semester,
        budget: report.budget,
        incharge: report.incharge,
        ofi: report.ofi,
      }));

      console.log("Data to send:", dataToSend); // Log data to verify structure
      
      // Send POST request to insert financial reports
      const response = await fetch(
        `http://localhost:8080/reportFinancial/insertFinancialReport/${department_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to save financial reports: ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log("Financial reports saved successfully:", result);

      // Show success message and close the modal
      toast.success("Financial reports saved successfully!");
      setOpenModal(false);

      // Optionally, refresh the financial reports or reset state
      getAllFinancial(department_id);
    } catch (error) {
      console.error("Error saving financial reports:", error);
      toast.error("Error saving financial reports. Please try again.");
    }
  };

  // Fetch the saved financial scorecards from the server
  useEffect(() => {
    const fetchFinancialScorecards = async () => {
      if (!department_id) {
        console.log("Department ID is not available yet.");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8080/bsc/financial/get/${department_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch financial scorecards");
        }
        const data = await response.json();
        setFinancialScorecards(data);
      } catch (error) {
        console.error("Error fetching financial scorecards:", error);
      }
    };
    fetchFinancialScorecards();
  }, [department_id]);

  function truncateString(str: string, num: number): string {
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + "...";
  }

  const handleCancelSave = () => {
    setOpenModal(false);
  };

  const handleInputChange = (
    index: number,
    field: keyof ReportFinancial,
    value: string | number
  ) => {
    setFinancialReports((prevReports) => {
      const newReports = [...prevReports];
      newReports[index] = {
        ...newReports[index],
        [field]: value,
      };
      return newReports;
    });
  };

  return (
    <div>
      <div className="flex flex-row p-1 w-[85rem] h-auto">
        <img
          src="/financial.png"
          alt=""
          className=" h-[5rem] mb-5 mr-5 mt-[-0.6rem]"
        />
        <div className="flex flex-col">
          <span className="font-bold text-[1.3rem] text-[rgb(59,59,59)] ml-[-0.5rem]">
            Financial Scorecard Overview
          </span>
          <span className="font-regular text-[1rem] text-[rgb(59,59,59)] ml-[-0.5rem] break-words w-[97rem]">
            Each objective is categorized by semester,{" "}
            <span className="font-bold">
              select ( <span className="font-bold text-red-500">1st</span> for
              FIRST SEMESTER,{" "}
              <span className="font-bold text-yellow-500">2nd</span> for SECOND
              SEMESTER).{" "}
            </span>
            Additionally, users must input the{" "}
            <span className="font-bold">
              actions taken, budget, person in charge,
            </span>{" "}
            and{" "}
            <span className="font-bold">
              opportunities for improvement (OFI).
            </span>
          </span>
        </div>
      </div>
      <table className="w-full bg-[#fff6d1] text-[rgb(43,43,43)] font-medium">
        <thead>
          <tr>
            <th className="p-2 font-bold w-[7rem]">Semester</th>
            <th className="p-2 font-bold w-[8rem]">Target Code</th>
            <th className="p-2 font-bold w-[20rem]">Office Target</th>
            <th className="p-2 font-bold w-[10rem]">KPI</th>
            <th className="p-2 font-bold w-[15rem]">Actions</th>
            <th className="p-2 font-bold w-[10rem]">Budget</th>
            <th className="p-2 font-bold w-[8rem]">In-charge</th>
            <th className="p-2 font-bold w-[10rem]">
              Performance <br />
              <div className="font-medium ml-[-0.6rem]">
                <span>Actual</span>
                <span className="font-bold">|</span>
                <span>Target</span>
              </div>
            </th>
            <th className="p-2 font-bold">OFI</th>
          </tr>
        </thead>
        <tbody>
          {financialScorecards.map((scorecard, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "bg-[#ffffff]" : "bg-[#fff6d1]"}
            >
              <td className="p-2">
                <div className="flex flex-row ml-3 w-[5rem] h-10">
                  <Select
                    value={financialReports[index]?.semester} // Set the value of the select element
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "semester",
                        e.target.value as string
                      )
                    }
                    displayEmpty
                    className="text-lg font-regular bg-gray-50 w-[5rem] h-10 rounded-md text-[rgb(59,59,59)]"
                    disabled={isDisabled} // Disable the select element
                  >
                    <MenuItem value="" disabled></MenuItem>
                    <MenuItem value="1st">1st</MenuItem>
                    <MenuItem value="2nd">2nd</MenuItem>
                  </Select>
                </div>
              </td>
              <td className="p-2 text-center">{scorecard.target_code}</td>
              <td className="p-2">
                {truncateString(scorecard.office_target, 20)}
              </td>
              <td className="p-2">
                {truncateString(scorecard.key_performance_indicator, 20)}
              </td>
              <td className="p-2">
                <div className="flex flex-row">
                  <input
                    type="text"
                    value={financialReports[index]?.actions}
                    className="text-lg font-regular border border-gray-300 bg-gray-50 w-[13rem] h-10 rounded-md px-3 py-2 text-[rgb(59,59,59)]"
                    onChange={(e) =>
                      handleInputChange(index, "actions", e.target.value)
                    }
                    disabled={isDisabled} // Disable the select element
                  />
                </div>
              </td>
              <td className="p-2">
                <div className="flex flex-row">
                  <input
                    type="text"
                    value={financialReports[index]?.budget || 0}
                    className="text-lg font-regular border border-gray-300 bg-gray-50 w-[8rem] h-10 rounded-md px-3 py-2 text-[rgb(59,59,59)]"
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "budget",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    disabled={isDisabled} // Disable the select element
                  />
                </div>
              </td>
              <td className="p-2">
                <div className="flex flex-row">
                  <input
                    type="text"
                    value={financialReports[index]?.incharge}
                    className="text-lg font-regular border border-gray-300 bg-gray-50 w-[8rem] h-10 rounded-md px-3 py-2 text-[rgb(59,59,59)]"
                    onChange={(e) =>
                      handleInputChange(index, "incharge", e.target.value)
                    }
                    disabled={isDisabled} // Disable the select element
                  />
                </div>
              </td>
              <td className="p-2 text-center">
                <span className="text-start mr-2">
                  {scorecard.actual_performance}%
                </span>
                <span className="text-center">|</span>
                <span className="text-end ml-2">
                  {scorecard.target_performance}%
                </span>
              </td>
              <td className="p-2">
                <div className="flex flex-row">
                  <input
                    type="text"
                    value={financialReports[index]?.ofi}
                    className="text-lg font-regular border border-gray-300 bg-gray-50 w-[13.5rem] h-10 rounded-md px-3 py-2 text-[rgb(59,59,59)]"
                    onChange={(e) =>
                      handleInputChange(index, "ofi", e.target.value)
                    }
                    disabled={isDisabled} // Disable the select element
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="justify-center align-middle items-center text-center mt-10">
        <button
          onClick={() => setOpenModal(true)}
          className="text-white font-medium px-4 py-4 rounded-lg w-[15rem] text-[1.1rem]"
          style={{
            background: "linear-gradient(to left, #8a252c, #AB3510)",
          }}
          disabled={isDisabled} // Disable the select element
        >
          Save Financial Report
        </button>
      </div>

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
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
            <p className="text-3xl font-bold mb-4">Save Financial Report?</p>
            <p className="text-xl mb-4 mt-10">
              {confirmationMessage
                ? confirmationMessage
                : "Are you sure you want to save this report? It cannot be edited once saved."}
            </p>
            <div className="flex justify-center gap-10 mt-12 mb-10">
              <button
                onClick={() => setOpenModal(false)}
                className="break-words font-semibold text-[1.2rem] text-[#962203] rounded-[0.6rem] pt-[0.5rem] pb-[0.5rem] pr-[2.2rem] pl-[2.2rem] bg-[#ffffff] cursor-pointer hover:bg-[#962203] hover:text-[#ffffff]"
              >
                No, Cancel
              </button>
              <button
                onClick={handleSaveFinancialReports}
                className="break-words font-semibold text-[1.2rem] text-[#ffffff] w-[11rem] border-none rounded-[0.6rem] pt-[0.5rem] pb-[0.5rem] pr-[2.2rem] pl-[2.2rem] cursor-pointer"
                style={{
                  background: "linear-gradient(to left, #8a252c, #AB3510)",
                }}
              >
                Yes, Save
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ReportFinancial;
